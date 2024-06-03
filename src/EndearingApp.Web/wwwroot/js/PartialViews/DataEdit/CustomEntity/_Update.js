function loadPartial() {
    let currentElem = document.getElementById("customEntityForm");
    let allEntities = util.globalScope.getItem("allEntities");
    let editedEntity = util.globalScope.getItem("editedEntity");

    if (editedEntity.fields && editedEntity.fields.length > 0) {
        editedEntity.fields.forEach(field => addField(field));
    }
    if (editedEntity.relationships && editedEntity.relationships.length > 0) {
        editedEntity.relationships.forEach(relationship => addRelationship(relationship));
    }
    function addField(field = { id: '', name: '', type: '', size: null, isPrimaryKey: false }) {
        const container = document.getElementById('fieldsContainer');
        const index = container.children.length;
        const fieldNode = util.htmlHelpers.getFormTemplate("updateFieldTemplate", field, 'Fields', index);

        container.appendChild(fieldNode);
    }
    function addRelationship(relationship = { id: '', sourceFieldName: '', sourceFieldId: '', referencedCustomEntityId: '', referencedFieldName: '', referencedFieldId: '', constraintName: '' }) {
        const container = document.getElementById('relationshipsContainer');
        const index = container.children.length;
        const relationshipNode = util.htmlHelpers.getFormTemplate("updateRelationshipTemplate", relationship, 'Relationships', index);



        container.insertAdjacentHTML('beforeend', relationshipHTML);
    }
    function updateDropDownOptions(relationshipNode)
    {
        relationshipNode.querySelector('[^name="sourceFieldId"]')
        editedEntity.
    }
    (function addEventListeners()
    {
        var addFieldButton = currentElem.querySelector("#addFieldButton");
        let tempId = util.htmlHelpers.getUUID();

        addFieldButton.addEventListener('click', () => addField({ id: tempId, name: "Field" + tempId.replaceAll("-", "_") }));
    })();
}
loadPartial();