// @ts-nocheck
export const LoadCustomeEntitites = async () => {
    const response = await fetch('/api/CustomEntity');
    const json = await response.json()
    return json;
};

export const SaveCustomEntity = async (customEntity, isNew) => {
    console.log(customEntity);
    const response = await fetch('/api/CustomEntity', {
        method: isNew ? "POST": "PUT",
        body: JSON.stringify(customEntity),
        headers: {
            "Content-Type": "application/json",
        }
    });
    const json = await response.json()
    return json;

}
export const DeleteCustomEntity = async (name) => {
    const response = await fetch('/api/CustomEntity/' + name, {
        method: "DELETE"
    });
    const json = await response.json()
    return json;
}