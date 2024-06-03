// @ts-nocheck
export async function GetSettingByName(name) 
{
    const response = await fetch(`/api/Setting/${name}`);
    const settingObject = await response.json();
    const setting = JSON.parse(settingObject.jsonSetting);
    return setting;
}
export async function GetDbTypesSetting() {
    if (window.crmSysSetting?.DataBaseTypesDescription) {
        return window.crmSysSetting.DataBaseTypesDescription;
    }

    const setting = await GetSettingByName("DataBaseTypesDescription");
    if (!window.crmSysSetting) {
        window.crmSysSetting = {};
    }
    window.crmSysSetting.DataBaseTypesDescription = setting;
    return setting;
}