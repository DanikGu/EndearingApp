const onInit = () => {
  setupColors();
  setupBuilder();
  listenMessages();
}
const listenMessages = () => {
  window.addEventListener('message', (event) => {
    const data = event.data;  // The object the parent sent
    console.log('Received message from parent:', data);
    setupBuilder(data);
  });
}
const setupBuilder = (components) => {
  Formio.builder(document.getElementById('builder'), {},
    {
      display: "form",
      editForm: getEditForm(),
      noNewEdit: true,
      builder: {
        resource: false,
        advanced: false,
        premium: false,
        basic: false,
        custom: components ?? getCustomSchemaForBuilder()
      }
    });
}
const setupColors = () => {
  window.addEventListener("storage", () => {
    checkMode();
    updateColorSchma();
  });
  const checkMode = () => {
    let isDarkMode = window.localStorage.getItem("color-theme") === "dark";
    let attrValue = isDarkMode ? "dark" : "light";
    document.body.dataset["bsTheme"] = attrValue;
  }
  checkMode();
  const updateColorSchma = () => {
    var r = document.querySelector(':root');
    const mainBgColor = getComputedStyle(parent.document.body).backgroundColor;
    r.style.setProperty('--bs-body-bg-custom', mainBgColor);
    r.style.setProperty('--bs-body-bg-rgb-custom', mainBgColor);
  }
  document.addEventListener("DOMContentLoaded", function () {
    updateColorSchma();
  });
}
const getEditForm = () => {
  const types = Object.keys(Formio.Components.components);
  const resultObject = {};
  types.forEach(x =>
    resultObject[x] = [{
      key: 'api',
      ignore: true
    }]
  );
  return resultObject;
}

const getCustomSchemaForBuilder = () => {
  return {
    title: 'Person Field',
    weight: 10,
    components: {
      firstName: {
        title: 'First Name',
        key: 'firstName',
        icon: 'terminal',
        schema: {
          label: 'First Name',
          type: 'textfield',
          key: 'firstName',
          input: true
        }
      },
      lastName: {
        title: 'Last Name',
        key: 'lastName',
        icon: 'terminal',
        schema: {
          label: 'Last Name',
          type: 'textfield',
          key: 'lastName',
          input: true
        }
      },
      email: {
        title: 'Email',
        key: 'email',
        icon: 'at',
        schema: {
          label: 'Email',
          type: 'email',
          key: 'email',
          input: true
        }
      },
      phoneNumber: {
        title: 'Mobile Phone',
        key: 'mobilePhone',
        icon: 'phone-square',
        schema: {
          label: 'Mobile Phone',
          type: 'phoneNumber',
          key: 'mobilePhone',
          input: true
        }
      }
    }
  }
}
onInit();
