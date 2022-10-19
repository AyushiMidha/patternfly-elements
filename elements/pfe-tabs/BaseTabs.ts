import { LitElement, html } from 'lit';
import { state, property, query, queryAssignedElements } from 'lit/decorators.js';

import { Logger } from '@patternfly/pfe-core/controllers/logger.js';
import { isElementInView } from '@patternfly/pfe-core/functions/isElementInView.js';

import { BaseTab, TabExpandEvent } from './BaseTab.js';
import { BaseTabPanel } from './BaseTabPanel.js';

import style from './BaseTab.scss';

export abstract class BaseTabs extends LitElement {
  static readonly styles = [style];

  static readonly delay = 100;

  static isTab(element: BaseTab): element is BaseTab {
    return element instanceof BaseTab;
  }

  static isPanel(element: BaseTabPanel): element is BaseTabPanel {
    return element instanceof BaseTabPanel;
  }

  @queryAssignedElements({ slot: 'tab' }) protected _tabs!: BaseTab[];

  @queryAssignedElements() protected _panels!: BaseTabPanel[];

  @query('[part="tabs"]') _tabList!: HTMLElement;

  @state() protected _showScrollButtons = false;

  @state() protected _overflowOnLeft = false;

  @state() protected _overflowOnRight = false;

  #logger = new Logger(this);

  #allTabs: BaseTab[] = [];

  #allPanels: BaseTabPanel[] = [];

  #focusableTabs: BaseTab[] = [];

  #focusTab?: BaseTab;

  #scrollTimeout: ReturnType<typeof setTimeout> = setTimeout(() => '', 100);

  #activeIndex = 0;

  @property({ attribute: false })
  get activeIndex() {
    return this.#activeIndex;
  }

  set activeIndex(index: number) {
    const oldIndex = this.activeIndex;
    const tab = this.allTabs[index];
    if (tab) {
      if (tab.disabled) {
        this.#logger.warn(`Disabled tabs can not be active, setting first focusable tab to active`);
        this.#activate(this.#firstFocusable());
        index = this.allTabs.findIndex(t => t === this.#firstFocusable());
      } else if (!tab.active) {
        // if the activeIndex was set through the CLI e.g.`$0.activeIndex = 2`
        tab.active = true;
      }
    }
    if (index === -1) {
      this.#logger.warn(`No active tab found, setting first focusable tab to active`);
      this.#activate(this.#firstFocusable());
      index = this.allTabs.findIndex(t => t === this.#firstFocusable());
    }
    this.#activeIndex = index;
    this.requestUpdate('activeIndex', oldIndex);
  }

  private get activeTab() {
    const [tab] = this.#allTabs.filter(tab => tab.active);
    return tab;
  }

  private get allTabs() {
    return this.#allTabs;
  }

  private set allTabs(tabs: BaseTab[]) {
    tabs = tabs.filter(tab => BaseTabs.isTab(tab));
    this.#allTabs = tabs;
    this.#focusableTabs = tabs.filter(tab => !tab.disabled);
  }

  private get allPanels() {
    return this.#allPanels;
  }

  private set allPanels(panels: BaseTabPanel[]) {
    panels = panels.filter(panel => BaseTabs.isPanel(panel));
    this.#allPanels = panels;
  }

  private get focusableTabs() {
    return this.#focusableTabs;
  }

  private get focusTab(): BaseTab | undefined {
    return this.#focusTab;
  }

  private set focusTab(tab: BaseTab | undefined) {
    this.#focusTab = tab;
    this.#focusTab?.focusButton();
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('tab-expand', this.#onTabExpand);
    this.addEventListener('keydown', this.#onKeydown);
    // on resize check for overflows
    window.addEventListener('resize', this.#onScroll, false);
  }

  override render() {
    return html`
      <div part="container">
        <div part="tabs-container">
          ${this._showScrollButtons ? html`
            <button id="previousTab" aria-label="Scroll left" ?disabled="${!this._overflowOnLeft}" @click="${this.#scrollLeft}">
              <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 256 512" aria-hidden="true" role="img" style="vertical-align: -0.125em;"><path d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path></svg>
            </button>`
          : html``}
          <div part="tabs" role="tablist">
            <slot name="tab" @slotchange="${this.onSlotchange}"></slot>
          </div>
          ${this._showScrollButtons ? html`
            <button id="nextTab" aria-label="Scroll right" ?disabled="${!this._overflowOnRight}" @click="${this.#scrollRight}">
              <svg fill="currentColor" height="1em" width="1em" viewBox="0 0 256 512" aria-hidden="true" role="img" style="vertical-align: -0.125em;"><path d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg>
            </button>`
          : html``}
        </div>
        <div part="panels">
          <slot @slotchange="${this.onSlotchange}"></slot>
        </div>
      </div>
    `;
  }

  async firstUpdated() {
    await this.updateComplete;
    this.#onScroll();
    this._tabList.addEventListener('scroll', this.#onScroll);
  }

  protected onSlotchange(event: { currentTarget: { name: string; }; }) {
    if (event.currentTarget.name === 'tab') {
      this.allTabs = this._tabs;
    } else {
      this.allPanels = this._panels;
    }
    if (this.allTabs.length === this.allPanels.length &&
      (this.allTabs.length !== 0 || this.allPanels.length !== 0)) {
      this.#updateAccessibility();
      this.activeIndex = this.allTabs.findIndex(tab => tab.active);
      this.#firstLastClasses();
    }
  }

  #updateAccessibility(): void {
    this.allTabs.forEach((tab, index) => {
      const panel = this.allPanels[index];
      panel.setAriaLabelledBy(tab.id);
      tab.setAriaControls(panel.id);
    });
  }

  #onTabExpand = (event: Event): void => {
    if (this.allTabs.length === 0 || this.allPanels.length === 0) {
      return;
    }

    const target = event as TabExpandEvent;
    if (target.active) {
      this.activeIndex = this.allTabs.findIndex(tab => tab === target.tab);
      this.allPanels[this.activeIndex].hidden = false;
      // close all tabs that are not the activeIndex
      this.#deactivateExcept(this.activeIndex);
    }
  };

  #deactivateExcept(index: number) {
    const notActiveTabs = this.allTabs.filter((tab, i) => i !== index);
    notActiveTabs.forEach(tab => {
      tab.active = false;
    });
    const notActivePanels = this.allPanels.filter((panel, i) => i !== index);
    notActivePanels.forEach(panel => {
      panel.hidden = true;
    });
  }

  #firstFocusable(): BaseTab {
    const [firstTab] = this.focusableTabs;
    return firstTab;
  }

  #lastFocusable(): BaseTab {
    return this.focusableTabs[this.focusableTabs.length - 1];
  }

  #firstTab(): BaseTab {
    const [tab] = this.allTabs;
    return tab;
  }

  #lastTab(): BaseTab {
    const tab = this.allTabs[this.allTabs.length - 1];
    return tab;
  }

  #next(): void {
    // find index of active tab in focusableTabs
    const currentIndex = this.#currentIndex();
    // increment focusable index and return focusable tab
    const nextFocusableIndex = currentIndex + 1;
    let nextTab: BaseTab;
    if (nextFocusableIndex >= this.focusableTabs.length) {
      // get the first focusable tab
      [nextTab] = this.#focusableTabs;
    } else {
      // get index of that focusable tab from all tabs
      nextTab = this.#focusableTabs[nextFocusableIndex];
    }

    this.#select(nextTab);
  }

  #prev(): void {
    const currentIndex = this.#currentIndex();
    // increment focusable index and return focusable tab
    const nextFocusableIndex = currentIndex - 1;
    let prevTab: BaseTab;
    if (nextFocusableIndex < 0) {
      // get the last focusable tab
      prevTab = this.#focusableTabs[this.#focusableTabs.length - 1];
    } else {
      // get index of that focusable tab from all tabs
      prevTab = this.#focusableTabs[nextFocusableIndex];
    }
    this.#select(prevTab);
  }

  #currentIndex(): number {
    let current: BaseTab;
    // get current tab
    if (this.focusTab?.ariaDisabled === 'true') {
      current = this.focusTab;
    } else {
      current = this.activeTab;
    }
    const index = this.focusableTabs.findIndex(tab => tab === current);
    return index;
  }

  #activate(selectedTab: BaseTab): void {
    if (selectedTab.ariaDisabled === null || selectedTab.ariaDisabled === 'false') {
      selectedTab.active = true;
    }
  }

  #select(selectedTab: BaseTab): void {
    this.#activate(selectedTab);
    this.focusTab = selectedTab;
  }

  #onKeydown = (event: KeyboardEvent): void => {
    const foundTab = this.allTabs.find(tab => tab === event.target);
    if (!foundTab) {
      return;
    }
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        this.#prev();
        break;

      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        this.#next();
        break;

      case 'Home':
        event.preventDefault();
        this.#select(this.#firstFocusable());
        break;

      case 'End':
        event.preventDefault();
        this.#select(this.#lastFocusable());
        break;

      default:
        return;
    }
  };

  #onScroll = ():void => {
    clearTimeout(this.#scrollTimeout);
    this.#scrollTimeout = setTimeout(() => {
      this.#isOverflow();
    }, BaseTabs.delay);
  };

  #firstLastClasses() {
    this.#firstTab().classList.add('first');
    this.#lastTab().classList.add('last');
  }

  #isOverflow(): void {
    this._overflowOnLeft = !isElementInView(this._tabList, this.#firstTab() as HTMLElement, false);
    this._overflowOnRight = !isElementInView(this._tabList, this.#lastTab() as HTMLElement, false);
    this._showScrollButtons = (this._overflowOnLeft || this._overflowOnRight);
  }

  #scrollLeft(): void {
    const container = this._tabList;
    const childrenArr = this.allTabs;
    let firstElementInView: BaseTab | undefined;
    let lastElementOutOfView: BaseTab | undefined;
    let i;
    for (i = 0; i < childrenArr.length && !firstElementInView; i++) {
      if (isElementInView(container, childrenArr[i] as HTMLElement, false)) {
        firstElementInView = childrenArr[i];
        lastElementOutOfView = childrenArr[i - 1];
      }
    }
    if (lastElementOutOfView) {
      container.scrollLeft -= lastElementOutOfView.scrollWidth;
    }
  }

  #scrollRight(): void {
    const container = this._tabList;
    const childrenArr = this.allTabs;
    let lastElementInView: BaseTab | undefined;
    let firstElementOutOfView: BaseTab | undefined;
    for (let i = childrenArr.length - 1; i >= 0 && !lastElementInView; i--) {
      if (isElementInView(container, childrenArr[i] as HTMLElement, false)) {
        lastElementInView = childrenArr[i];
        firstElementOutOfView = childrenArr[i + 1];
      }
    }
    if (firstElementOutOfView) {
      container.scrollLeft += firstElementOutOfView.scrollWidth;
    }
  }
}
