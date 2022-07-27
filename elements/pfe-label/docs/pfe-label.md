{% renderOverview %}
  <pfe-label>Default</pfe-label>
{% endrenderOverview %}

{% band header="Usage" %}

  ### Default
  <pfe-label>Default</pfe-label>
  ```html
  <pfe-label>Default</pfe-label>
  ```

  ### With a color
  Available colors are: grey (default), blue, green, orange, red, purple, cyan, gold

  <pfe-label color="blue">Blue</pfe-label>
  <pfe-label color="green">Green</pfe-label>
  <pfe-label color="orange">Orange</pfe-label>
  <pfe-label color="red">Red</pfe-label>
  <pfe-label color="purple">Purple</pfe-label>
  <pfe-label color="cyan">Cyan</pfe-label>
  <pfe-label color="gold">Gold</pfe-label>

  ```html
  <pfe-label color="blue">Blue</pfe-label>
  <pfe-label color="green">Green</pfe-label>
  <pfe-label color="orange">Orange</pfe-label>
  <pfe-label color="red">Red</pfe-label>
  <pfe-label color="purple">Purple</pfe-label>
  <pfe-label color="cyan">Cyan</pfe-label>
  <pfe-label color="gold">Gold</pfe-label>
  ```

  > ### Conveying meaning to assistive technologies
  > Using color to add meaning only provides a visual indication, which will not be conveyed to users of assistive technologies – such as screen readers. Ensure that
  > information denoted by the color is either obvious from the content itself (e.g. the visible text), or is included through alternative means, such as additional text 
  > hidden with the a class.

  ```html
  <pfe-label color="red">Red <span class="visually-hidden-class">Warning</span></pfe-label>
  ```


  ### Outline variant
  Swaps the color style for a outline styled variant

  <pfe-label variant="outline" color="blue">Blue</pfe-label>
  <pfe-label variant="outline" color="green">Green</pfe-label>
  <pfe-label variant="outline" color="orange">Orange</pfe-label>
  <pfe-label variant="outline" color="red">Red</pfe-label>
  <pfe-label variant="outline" color="purple">Purple</pfe-label>
  <pfe-label variant="outline" color="cyan">Cyan</pfe-label>
  <pfe-label variant="outline" color="gold">Gold</pfe-label>
  <pfe-label variant="outline">Default</pfe-label>  

  ```html
  <pfe-label variant="outline" color="blue">Blue</pfe-label>
  <pfe-label variant="outline" color="green">Green</pfe-label>
  <pfe-label variant="outline" color="orange">Orange</pfe-label>
  <pfe-label variant="outline" color="red">Red</pfe-label>
  <pfe-label variant="outline" color="purple">Purple</pfe-label>
  <pfe-label variant="outline" color="cyan">Cyan</pfe-label>
  <pfe-label variant="outline" color="gold">Gold</pfe-label>
  <pfe-label variant="outline">Default</pfe-label>    
  ```

  ### With icon as an attribute
  Adds a optional fixed size `pfe-icon` to the label as a prefix

  <pfe-label color="blue" icon="web-icon-globe">Globe</pfe-label>


  ```html
  <pfe-label color="blue" icon="web-icon-globe">Globe</pfe-label>
  ```
  Read more about Icon in the [PatternFly Elements Icon documentation](https://patternflyelements.org/components/icon)

  ### With user defined image using `slot="icon"`
  Adds user defined SVG or `pfe-icon` to the label.

  <pfe-label color="blue">Globe
    <svg slot="icon" fill="currentColor" aria-hidden="true" role="img"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" ><path d="M8.5,1A7.5,7.5,0,1,0,16,8.5,7.508,7.508,0,0,0,8.5,1Zm0,13.731a9.636,9.636,0,0,1-1.941-3.724H10.44A9.647,9.647,0,0,1,8.5,14.731ZM6.352,10.007A9.688,9.688,0,0,1,6.351,7h4.3a9.75,9.75,0,0,1,0,3.007ZM2,8.5A6.45,6.45,0,0,1,2.182,7H5.335a10.741,10.741,0,0,0,0,3.007H2.182A6.515,6.515,0,0,1,2,8.5ZM10.442,6H6.557A9.636,9.636,0,0,1,8.5,2.268,9.625,9.625,0,0,1,10.442,6Zm1.222,1h3.154a6.268,6.268,0,0,1,0,3.007H11.663A10.779,10.779,0,0,0,11.664,7ZM14.5,6H11.474A10.619,10.619,0,0,0,9.653,2.109,6.513,6.513,0,0,1,14.5,6ZM7.341,2.109A10.61,10.61,0,0,0,5.524,6H2.5A6.521,6.521,0,0,1,7.341,2.109ZM2.5,11.007H5.528a10.6,10.6,0,0,0,1.821,3.887A6.5,6.5,0,0,1,2.5,11.007Zm7.153,3.884a10.6,10.6,0,0,0,1.819-3.884H14.5A6.518,6.518,0,0,1,9.653,14.891Z"></path></svg>
  </pfe-label>

  ```html
  <pfe-label color="blue">Globe
    <svg slot="icon" fill="currentColor"aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" ><path d="M8.5,1A7.5,7.5,0,1,0,16,8.5,7.508,7.508,0,0,0,8.5,1Zm0,13.731a9.636,9.636,0,0,1-1.941-3.724H10.44A9.647,9.647,0,0,1,8.5,14.731ZM6.352,10.007A9.688,9.688,0,0,1,6.351,7h4.3a9.75,9.75,0,0,1,0,3.007ZM2,8.5A6.45,6.45,0,0,1,2.182,7H5.335a10.741,10.741,0,0,0,0,3.007H2.182A6.515,6.515,0,0,1,2,8.5ZM10.442,6H6.557A9.636,9.636,0,0,1,8.5,2.268,9.625,9.625,0,0,1,10.442,6Zm1.222,1h3.154a6.268,6.268,0,0,1,0,3.007H11.663A10.779,10.779,0,0,0,11.664,7ZM14.5,6H11.474A10.619,10.619,0,0,0,9.653,2.109,6.513,6.513,0,0,1,14.5,6ZM7.341,2.109A10.61,10.61,0,0,0,5.524,6H2.5A6.521,6.521,0,0,1,7.341,2.109ZM2.5,11.007H5.528a10.6,10.6,0,0,0,1.821,3.887A6.5,6.5,0,0,1,2.5,11.007Zm7.153,3.884a10.6,10.6,0,0,0,1.819-3.884H14.5A6.518,6.518,0,0,1,9.653,14.891Z"></path></svg>
  </pfe-label>
  ```
  <pfe-label color="blue">Globe
    <pfe-icon slot="icon" icon="web-icon-globe" size="sm" color="important"></pfe-icon>
  </pfe-label>

  ```html
  <pfe-label color="blue">Globe
    <pfe-icon slot="icon" icon="web-icon-globe" size="sm"></pfe-icon>
  </pfe-label>
  ```

  ### Compact style
  Creates a compact style label which can be combined with color, variant and icon

  <pfe-label compact color="blue">Globe<svg slot="icon" fill="currentColor" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17"><path d="M8.5,1A7.5,7.5,0,1,0,16,8.5,7.508,7.508,0,0,0,8.5,1Zm0,13.731a9.636,9.636,0,0,1-1.941-3.724H10.44A9.647,9.647,0,0,1,8.5,14.731ZM6.352,10.007A9.688,9.688,0,0,1,6.351,7h4.3a9.75,9.75,0,0,1,0,3.007ZM2,8.5A6.45,6.45,0,0,1,2.182,7H5.335a10.741,10.741,0,0,0,0,3.007H2.182A6.515,6.515,0,0,1,2,8.5ZM10.442,6H6.557A9.636,9.636,0,0,1,8.5,2.268,9.625,9.625,0,0,1,10.442,6Zm1.222,1h3.154a6.268,6.268,0,0,1,0,3.007H11.663A10.779,10.779,0,0,0,11.664,7ZM14.5,6H11.474A10.619,10.619,0,0,0,9.653,2.109,6.513,6.513,0,0,1,14.5,6ZM7.341,2.109A10.61,10.61,0,0,0,5.524,6H2.5A6.521,6.521,0,0,1,7.341,2.109ZM2.5,11.007H5.528a10.6,10.6,0,0,0,1.821,3.887A6.5,6.5,0,0,1,2.5,11.007Zm7.153,3.884a10.6,10.6,0,0,0,1.819-3.884H14.5A6.518,6.518,0,0,1,9.653,14.891Z"></path></svg></pfe-label>
  <pfe-label compact color="green">Green</pfe-label>
  <pfe-label compact variant="outline" color="orange">Orange</pfe-label>
  <pfe-label compact color="red" icon="web-icon-globe">Red</pfe-label>
  <pfe-label compact variant="outline" color="purple">Purple</pfe-label>
  <pfe-label compact color="cyan">Cyan</pfe-label>
  <pfe-label compact variant="outline" color="gold">Gold <pfe-icon slot="icon" icon="web-icon-globe" size="sm" color="important"></pfe-icon></pfe-label>
  <pfe-label compact>Default</pfe-label>  

  ```html
  <pfe-label compact color="blue">Globe
    <svg slot="icon" fill="currentColor" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17"><path d="M8.5,1A7.5,7.5,0,1,0,16,8.5,7.508,7.508,0,0,0,8.5,1Zm0,13.731a9.636,9.636,0,0,1-1.941-3.724H10.44A9.647,9.647,0,0,1,8.5,14.731ZM6.352,10.007A9.688,9.688,0,0,1,6.351,7h4.3a9.75,9.75,0,0,1,0,3.007ZM2,8.5A6.45,6.45,0,0,1,2.182,7H5.335a10.741,10.741,0,0,0,0,3.007H2.182A6.515,6.515,0,0,1,2,8.5ZM10.442,6H6.557A9.636,9.636,0,0,1,8.5,2.268,9.625,9.625,0,0,1,10.442,6Zm1.222,1h3.154a6.268,6.268,0,0,1,0,3.007H11.663A10.779,10.779,0,0,0,11.664,7ZM14.5,6H11.474A10.619,10.619,0,0,0,9.653,2.109,6.513,6.513,0,0,1,14.5,6ZM7.341,2.109A10.61,10.61,0,0,0,5.524,6H2.5A6.521,6.521,0,0,1,7.341,2.109ZM2.5,11.007H5.528a10.6,10.6,0,0,0,1.821,3.887A6.5,6.5,0,0,1,2.5,11.007Zm7.153,3.884a10.6,10.6,0,0,0,1.819-3.884H14.5A6.518,6.518,0,0,1,9.653,14.891Z"></path></svg>
  </pfe-label>
  <pfe-label compact color="green">Green</pfe-label>
  <pfe-label compact variant="outline" color="orange">Orange</pfe-label>
  <pfe-label compact color="red" icon="web-icon-globe">Red</pfe-label>
  <pfe-label compact variant="outline" color="purple">Purple</pfe-label>
  <pfe-label compact color="cyan">Cyan</pfe-label>
  <pfe-label compact variant="outline" color="gold">Gold <pfe-icon slot="icon" icon="web-icon-globe" size="sm" color="important"></pfe-icon></pfe-label>
  <pfe-label compact>Default</pfe-label>  
  ```



{% endband %}

{% renderSlots %}{% endrenderSlots %}

{% renderAttributes %}{% endrenderAttributes %}

{% renderMethods %}{% endrenderMethods %}

{% renderEvents %}{% endrenderEvents %}

{% renderCssCustomProperties %}{% endrenderCssCustomProperties %}

{% renderCssParts %}{% endrenderCssParts %}