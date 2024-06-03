window.util = {
    toJS: function (json) {
        return JSON.parse(JSON.stringify(json));
    }
};
window.util.globalScope = {
    loaders: {},
    data: {},
    getItem: (name) => {
        return window.util.globalScope.data[name];
    },
    setItem: (name, value) => {
        window.util.globalScope.data[name] = value;
    },
    setIfNotPopulated: (name, value) => {
        if (!window.util.globalScope.data[name]) {
            window.util.globalScope.data[name] = value;
        }
    },
    attachDataLoader: (name, func) => {
        window.util.globalScope.loaders[name] = func;
    },
    loadData: (name) => {
        var func = window.util.globalScope.loaders[name];
        if (func) {
            func();
        }
        else {
            console.warn("Data loader for " + name + " not attcahed")
        }
    }
}
window.util.htmlHelpers = {
    getUUID: () => {
        if (crypto.randomUUID) {
            return crypto.randomUUID();
        }
        let uuidv4 = () => {
            return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
                (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
            );
        }
        return uuidv4();
    },
    getFormTemplate: (templateId, values, collectionName, index) => {
        let template = document.getElementById(templateId)?.content.cloneNode(true);
        if (!template) {
            console.error("templateNotFound");
            return;
        }
        if (!collectionName) {
            collectionName = '';
        }
        if (Number.isInteger(index)) {
            index = `[${index}]`;
        } else {
            index = '';
        }
        var inputs = template.querySelectorAll("input");
        for (const i in inputs) {
            let input = inputs[i];
            let value; 
            if (values) {
                value = values[input.name]
            }
            input.name = collectionName + index + '.' + input.name; 
            if (input.type === "checkbox")
            {
                input.checked = value ?? false;
            }
            else
            {
                input.value = value ?? '';
            }
        }
        return template;
    }
}