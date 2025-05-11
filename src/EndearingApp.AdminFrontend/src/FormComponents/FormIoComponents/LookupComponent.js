// @ts-nocheck
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
    this.removeValueButtonRef = crypto.randomUUID();
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

    const linkContainer = this.setupLinkContainer();

    return label.outerHTML + inputEl.outerHTML + searchResult.outerHTML + linkContainer.outerHTML;;
  }
  /** @return {HTMLDivElement} */
  setupLinkContainer() {
    const linkContainer = document.createElement('div');

    if (this.linkContainerRef) {
      linkContainer.id = this.linkContainerRef;
      linkContainer.setAttribute("ref", this.linkContainerRef);
    }

    linkContainer.classList.add(
      "form-control",
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "mt-0"
    );

    const link = document.createElement("a");
    link.href = "#";
    link.textContent = "";

    const removeButton = document.createElement("button");
    removeButton.setAttribute("ref", this.removeValueButtonRef);
    removeButton.type = "button";
    removeButton.classList.add(
      "btn",
      "btn-sm"
    );
    removeButton.setAttribute("aria-label", "Remove");

    const removeIcon = document.createElement("i");
    removeIcon.classList.add("bi", "bi-trash");
    removeButton.appendChild(removeIcon);

    linkContainer.appendChild(link);
    linkContainer.appendChild(removeButton);

    return linkContainer;
  }

  attach(element) {
    this.loadRefs(element, {
      [this.inputRef]: 'single',
      [this.searchResultRef]: 'single',
      [this.linkContainerRef]: 'single',
      [this.removeValueButtonRef]: 'single'
    });
    this.addEventListener(this.refs[this.inputRef], 'focus', (event) => {
      this.showResults(event.srcElement.value);
    });
    this.addEventListener(this.refs[this.inputRef], 'input', (event) => {
      this.showResults(event.srcElement.value);
    });
    this.addEventListener(this.refs[this.removeValueButtonRef], 'click', (event) => {
      event.stopPropagation();
      this.setValue(null);
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
    this.refs[this.searchResultRef].innerHTML = '';
    this.setValue(item.Id);
    this.triggerChange();
  }
  setValue(value, flags = {}) {
    this.loadExistingValue(value).then(() => super.setValue(value, flags));
  }
  /** Fetches an entity by its ID.
    * @param {string} id
    * @returns {Promise<EntityRef>} */
  async getEntityById(id) {
    try {
      const resourceUrl = `/${this.odataPath}/${this.entityName}`;
      const url = resourceUrl + `(${id})?select=id,name`;
      const response = await fetch(url);
      const result = await response.json();
      return result;
    }
    catch (ex) {
      console.error(ex);
      return null;
    }
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

  async loadExistingValue(value) {
    console.log("loadExistingValue called", value);
    let internalRefValue = null;
    if (value) {
      internalRefValue = await this.getEntityById(value);
    }
    this.changeInternalValue(internalRefValue)
  }
  /** @param {EntityRef || null} item */
  changeInternalValue(item) {
    /** @type {HTMLDivElement} */
    const linkContainer = this.refs[this.linkContainerRef];
    const textInput = this.refs[this.inputRef];
    if (item) {
      linkContainer.classList.remove("d-none");
      textInput.classList.add("d-none");
      const link = linkContainer.querySelector("a");
      link.href = `/${this.odataPath}/${this.entityName}/${item.Id}`;
      link.textContent = item.Name;
    }
    else {
      linkContainer.classList.add("d-none");
      textInput.classList.remove("d-none");
    }
  }
}

Formio.Components.addComponent('lookup', LookupComponent);
export default LookupComponent;
