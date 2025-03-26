

class CustomButtonGroup extends Formio.Components.components.component {
  /**
   * Define the default schema for the custom button group.
   * The default configuration includes two buttons:
   * one for SaveEntity and one for DeleteEntity.
   */
  static schema(...extend) {
    return Formio.Components.components.component.schema({
      type: 'custombuttongroup',
      label: 'Custom Button Group',
      key: 'customButtonGroup',
      // Default buttons configuration. This array can be modified to add or remove buttons.
      buttons: [
        { label: 'Save', event: 'EntitySave', style: 'btn-primary' },
        { label: 'Delete', event: 'EntityDelete', style: 'btn-danger' }
      ]
    }, ...extend);
  }

  /**
   * Provide builder information so the component appears in the Formio Builder.
   */
  static builderInfo = {
    title: 'Actions Button Group',
    group: 'basic',
    icon: 'fa fa-hand-pointer-o', // choose an appropriate icon
    weight: 50,
    schema: CustomButtonGroup.schema()
  };

  /**
   * Render the component.
   * This method builds the HTML for the button group.
   */
  render() {
    return super.render(`
      <div class="custom-button-group">
        ${this.renderButtons()}
      </div>
    `);
  }

  /**
   * Renders each button based on the configuration provided in this.component.buttons.
   */
  renderButtons() {
    if (!this.component.buttons || !Array.isArray(this.component.buttons)) {
      return '';
    }
    return this.component.buttons.map((btn, index) => {
      // Each button is given a data attribute with its event name.
      return `<button type="button" class="btn ${btn.style || ''}" data-event="${btn.event}" data-index="${index}">
                ${btn.label}
              </button>`;
    }).join(' ');
  }

  /**
   * Attach event listeners to the buttons after the component is rendered.
   */
  attach(element) {
    // Find all button elements in the component.
    const buttons = element.querySelectorAll('button');
    buttons.forEach(button => {
      button.addEventListener('click', (event) => {
        const eventName = event.currentTarget.getAttribute('data-event');
        // Trigger the custom event associated with the button.
        this.triggerEvent(eventName);
      });
    });

    // Call the parent attach to ensure any additional behavior is preserved.
    return super.attach(element);
  }

  /**
   * Custom method to trigger an event.
   * Here, a CustomEvent is dispatched on the component's root element.
   * You can customize this method to integrate with your application’s event system.
   */
  triggerEvent(eventName) {
    const customEvent = new CustomEvent(eventName, {
      detail: {
        component: this.component,
        // You can add more event details as needed.
      },
      bubbles: true,
      cancelable: true
    });
    this.emit(eventName);
    // Optionally, log the event for debugging.
    console.log(`Triggered event: ${eventName}`);
  }
}

// Register the custom component with Formio.
Formio.Components.addComponent('custombuttongroup', CustomButtonGroup);

export default CustomButtonGroup;
