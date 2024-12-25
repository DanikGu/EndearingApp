import { SettingsApi } from "@apiclients";
/** @param {number} typeId
 ** @returns {string} */
const getTypeName = (typeId) => {
  // @ts-ignore
  let typesConfig = window.endearing_app?.typeConfig;
  if (!typesConfig) {
    return "${typeId}";
  }
  return typesConfig[`${typeId}`].Name;
};

const ensureTypeConfig = () => {
  /** @returns {Promise<any>} */
  const retriveTypeConfig = () => {
    return new Promise((res, rej) => {
      let api = new SettingsApi();
      /**
       * @param {string} error
       * @param {{name: string, jsonSetting: string}} data
       */
      let callBack = (error, data) => {
        if (error) {
          rej(error);
          return;
        }
        res(JSON.parse(data.jsonSetting));
      };
      api.apiSettingsNameGet("DataBaseTypesDescription", callBack);
    });
  };
  // @ts-ignore
  let typesConfig = window.endearing_app?.typeConfig;
  if (!typesConfig) {
    // @ts-ignore
    if (!window.endearing_app) {
      // @ts-ignore
      window.endearing_app = {};
    }
    // @ts-ignore
    retriveTypeConfig().then((x) => (window.endearing_app.typeConfig = x));
  }
}

/** @returns {{id: string, name: string, description: string, isSizeApplicable: boolean}[]} */
const getTypesArray = () => {
  // @ts-ignore
  let typesConfig = window.endearing_app?.typeConfig;
  let arr = Object.keys(typesConfig).map(x => ({
    id: x,
    name: typesConfig[x].Name,
    description: typesConfig[x].Description,
    isSizeApplicable: typesConfig[x].IsSizeAplicable
  }));
  return arr;
}
export { getTypeName, ensureTypeConfig, getTypesArray };
export default { getTypeName, ensureTypeConfig, getTypesArray }
