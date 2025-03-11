let currentSchema = null;
let currentComponents = null;
const onInit = () => {
  setupColors();
  setupBuilder();
  listenMessages();
}
const listenMessages = () => {
  window.addEventListener('message', (event) => {
    const data = event.data;  // The object the parent sent
    console.log('Received message from parent:', data);
    setupBuilder(data.currentSchema, data.components);
  });
}
const setupBuilder = (newSchema, newComponents) => {
  if (
    JSON.stringify(newSchema) === JSON.stringify(currentSchema) &&
    JSON.stringify(newComponents) === JSON.stringify(currentComponents)
  ) {
    return;
  }
  currentSchema = newSchema;
  currentComponents = newComponents;
  Formio.builder(document.getElementById('builder'),
    newSchema ?? {},
    {
      display: "form",
      editForm: {}, //getEditForm(),
      noNewEdit: true,
      builder: {
        resource: false,
        advanced: false,
        premium: false,
        custom: newComponents ?? {}
      }
    }).then(function (instance) {
      var onBuild = function (build) {
        currentSchema = instance.schema;
        let schema = instance.schema;
        window.parent.postMessage({ type: 'formSchemaChanged', content: schema }, '*');
      };
      instance.on('change', onBuild);
    });
};
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



onInit();
