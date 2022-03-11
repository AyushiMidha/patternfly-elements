const sleep = ms => new Promise(r => setTimeout(r, ms));

const NPM_OUTPUT_FILENAME_RE = /^[\s]+?(?:npm )?(?<name>[\w-.]+\.tgz)$/mg;

async function execCommand(exec, command) {
  const [cmd, ...args] = command.split(' ');

  let stdout = '';
  let stderr = '';

  const code = await exec.exec(cmd, args, {
    stdout: data => {
      stdout += data.toString();
    },
    stderr: data => {
      stderr += data.toString();
    },
  });

  if (code !== 0) {
    throw new Error(stderr);
  } else {
    return stdout;
  }
}
/** Wait exponentially longer, by seconds, each time we fail to fetch the release */
async function backoff(fn, retries = 0, max = 10) {
  try {
    return await fn();
  } catch (e) {
    if (retries > max) {
      throw e;
    }

    await sleep(2 ** retries * 1000);

    return backoff(fn, retries + 1);
  }
}

async function getBundle({ core, glob, workspace }) {
  const tar = require('tar');
  const { copyFile } = require('fs').promises;
  const { singleFileBuild } = await import('../tools/pfe-tools/esbuild.js');

  await copyFile(`${workspace}/core/pfe-styles/pfe.min.css`, `${workspace}/pfe.min.css`);

  // Create or fetch artifacts
  await singleFileBuild({ outfile: `${workspace}/pfe.min.js` });

  const globber = await glob.create('pfe.min.*');
  const files = (await globber.glob() ?? []).map(path =>
    path.replace(workspace, '').replace(/^\//, ''));

  const file = 'pfe.min.tgz';

  core.debug(`Creating ${file} with`, files.join('\n'), '\n');

  await tar.c({ gzip: true, file }, files);

  core.debug('Tarball contents:');

  await Promise.resolve(tar.t({ file, onentry: x => core.debug(x.header.path) }));

  return file;
}

module.exports = async function bundle({ core, exec, github, glob, tags = '', workspace }) {
  await execCommand(exec, 'git config advice.detachedHead false');

  const { readFile } = require('fs').promises;

  tags = tags.split(',').map(x => x.trim());

  // https://github.com/patternfly/patternfly-elements
  const owner = 'patternfly';
  const repo = 'patternfly-elements';

  for (const tag of tags) {
    core.info(`Bundling tag ${tag}`);

    core.debug('Fetching release');
    const response = await backoff(() =>
      github.rest.repos.getReleaseByTag({ owner, repo, tag }));

    const release = response.data;

    core.debug(release);

    const params = { owner, release_id: release.id, repo };

    core.info(`Checking out ${tag}`);
    await execCommand(exec, `git checkout ${tag}`);

    core.info('Installing dependencies');
    await execCommand(exec, `npm ci --prefer-offline`);
    core.info('Building tools');
    await execCommand(exec, `npm run build -w @patternfly/pfe-tools -w @patternfly/pfe-styles`);
    core.info('Bundling Packages');
    const bundleFileName = await getBundle({ core, github, glob, workspace });

    // Delete any existing asset with that name
    for (const { id, name } of release.assets ?? []) {
      if (name === bundleFileName) {
        core.info(`${name} exists for ${tag}, deleting`);
        await github.rest.repos.deleteReleaseAsset({ owner, repo, asset_id: id });
      }
    }

    // Upload the all-repo bundle to the release
    const data = await readFile(`${workspace}/${bundleFileName}`);
    core.info(`Uploading ${bundleFileName} to ${tag}`);
    await github.rest.repos.uploadReleaseAsset({ ...params, name: bundleFileName, data });

    // Download the package tarball from NPM
    const stdout = await execCommand(exec, `npm pack ${tag}`);
    const { name } = NPM_OUTPUT_FILENAME_RE.exec(stdout)?.groups ?? {};

    if (name) {
      for (const { id, name: existing } of release.assets ?? []) {
        if (existing === name) {
          core.info(`${name} exists for ${tag}, deleting`);
          await github.rest.repos.deleteReleaseAsset({ owner, repo, asset_id: id });
        }
      }
      // Upload the NPM tarball to the release
      const data = await readFile(`${workspace}/${name}`);
      core.info(`Uploading ${name} to ${tag}`);
      await github.rest.repos.uploadReleaseAsset({ ...params, name, data });
    } else {
      core.error(stdout);
      core.setFailed(`Could not get NPM tarball for ${tag}`);
    }
  }
};

