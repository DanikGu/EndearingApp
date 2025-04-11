// @ts-nocheck
import { Formio } from "@formio/js";

/** @typedef EntityRef
 *  @prop {string} Id 
 *  @prop {string} Name 
 **/
class LookupComponent extends Formio.Components.components.component {

  static schema(/** @type {any} */ ...extend) {
    return Formio.Components.components.component.schema({
      type: 'lookup',
      label: 'Lookup',
      key: 'lookup',
      entityName: '',
      odataPath: '',
    }, ...extend);
  }

  static get builderInfo() {
    return {
      title: 'Lookup',
      group: 'basic',
      icon: 'search',
      weight: 70,
      documentation: '',
      schema: this.schema()
    };
  }

  static editForm = () => {
    const form = Formio.Components.baseEditForm([
      {
        key: 'display',
        components: [
          {
            type: 'textfield',
            key: 'entityName',
            label: 'Entity Name',
            input: true,
            weight: 0
          },
          {
            type: 'textfield',
            key: 'odataPath',
            label: 'OData Path',
            input: true,
            weight: 1
          }
        ]
      },
    ], {});
    return form;
  };

  constructor(
    /** @type {any} */component,
    /** @type {any} */options,
    /** @type {any} */data) {
    super(component, options, data);
    this.entityName = this.component.entityName || '';
    this.odataPath = this.component.odataPath || '';
    this.inputRef = crypto.randomUUID();
    this.searchResultRef = crypto.randomUUID();
    this.linkContainerRef = crypto.randomUUID();
  }

  render() {
    return super.render(
      this.build()
    );
  }

  build() {
    const label = document.createElement("label");
    label.setAttribute("for", this.inputRef);
    label.classList.add("form-label")
    label.innerText = this.schema.label;

    const inputEl = document.createElement('input');
    inputEl.setAttribute("ref", this.inputRef);
    inputEl.setAttribute("type", "search");
    inputEl.id = this.inputRef;
    inputEl.classList.add("form-control")

    const searchResult = document.createElement('div');
    searchResult.name = "searchresult";
    searchResult.id = this.searchResultRef;
    searchResult.setAttribute("ref", this.searchResultRef);

    const linkContainer = document.createElement('div');
    linkContainer.id = this.linkContainerRef;
    linkContainer.setAttribute("ref", this.linkContainerRef);
    linkContainer.classList.add("mt-2");

    return label.outerHTML + inputEl.outerHTML + searchResult.outerHTML + linkContainer.outerHTML;;
  }

  attach(element) {
    this.loadRefs(element, {
      [this.inputRef]: 'single',
      [this.searchResultRef]: 'single',
      [this.linkContainerRef]: 'single'
    });
    this.addEventListener(this.refs[this.inputRef], 'change', (event) => {
      /** @type { HTMLDivElement } */
      const input = this.refs[this.inputRef];
      input.style.display = "none";
    });
    this.addEventListener(this.refs[this.inputRef], 'focus', (event) => {
      this.showResults(event.srcElement.value);
    });
    this.addEventListener(this.refs[this.inputRef], 'input', (event) => {
      this.showResults(event.srcElement.value);
    });
    return super.attach(element);
  }

  /** @param {string} value */
  async showResults(value) {
    /** @type { HTMLDivElement } */
    const search = this.refs[this.searchResultRef];
    /** @type { HTMLDivElement } */
    const input = this.refs[this.inputRef];
    const etnRefs = await this.searchEtnByQuery(value);
    console.log(etnRefs);
    if (etnRefs && etnRefs.length > 0) {
      const dropdown = document.createElement('div');
      dropdown.classList.add('list-group');
      etnRefs.forEach(item => {
        const option = document.createElement('button');
        option.type = "button";
        option.classList.add('list-group-item', 'list-group-item-action');
        option.textContent = item.Name;
        option.dataset.id = item.Id;
        option.addEventListener('click', () => this.selectResult(item));
        dropdown.appendChild(option);
      });
      search.innerHTML = '';
      search.appendChild(dropdown);
    } else {
      search.innerHTML = '';
    }
  }
  /**
     * Called when a dropdown item is selected.
     * @param {EntityRef} item 
     */
  selectResult(item) {
    this.refs[this.inputRef].value = item.Name;
    this.refs[this.searchResultRef].innerHTML = '';
    this.showLink(item);
    this.data[this.component.key] = item.Id;
    this.updateValue(item.Id);
  }
  /** @param {EntityRef} item */
  showLink(item) {
    const linkContainer = this.refs[this.linkContainerRef];
    const link = document.createElement('a');
    link.href = `/${this.odataPath}/${this.entityName}/${item.Id}`;
    link.textContent = item.Name;
    link.classList.add("btn", "btn-link");
    linkContainer.innerHTML = '';
    linkContainer.appendChild(link);
  }
  /** Fetches an entity by its ID.
    * @param {string} id
    * @returns {Promise<EntityRef>} */
  async getEntityById(id) {
    const resourceUrl = `/${this.odataPath}/${this.entityName}`;
    const url = resourceUrl + `/${id}?select=id,name`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
  }

  /** @param {string} query 
   *  @returns {Promise<EntityRef[]>}*/
  async searchEtnByQuery(query) {
    const resourceUrl = `/${this.schema.odataPath}/${this.schema.entityName}`;
    const fullTextSearch = resourceUrl + `/fullTextSearch/${query}/?select=id,name&top=10`;
    const firstpage = resourceUrl + "/?select=id,name&top=10";
    const response = query && query.length > 0 ?
      await fetch(fullTextSearch) :
      await fetch(firstpage);
    const values = await response.json();
    const etns = values.value;
    return etns;
  }

  async loadExistingValue() {
    const value = this.getValue();
    if (value) {
      const item = await this.getEntityById(value);
      if (item) {
        this.refs[this.inputRef].value = item.Name;
        this.showLink(item);
      }
    }
  }

}

Formio.Components.addComponent('lookup', LookupComponent);
export default LookupComponent;
