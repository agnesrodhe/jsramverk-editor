const docsModel = {
    baseUrl: window.location.href.includes("localhost") ?
    "http://localhost:8976" :
    "https://jsramverk-editor-agro21.azurewebsites.net",

    getAllDocs: async function getAllDocs(token) {
        console.log(token);
        const response = await fetch(`${docsModel.baseUrl}/documents`, {
            headers: {
                "x-access-token": token,
            }
        });

        const documents = await response.json();
        return documents.data;
    },


    createDoc: async function createDoc(newDoc) {
        const response = await fetch(`${docsModel.baseUrl}/documents`, {
            body: JSON.stringify(newDoc),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });
        const result = await response.json();
        console.log(result);
    },

    updateDoc: async function updateDoc(docToUpdate) {
        const response = await fetch(`${docsModel.baseUrl}/documents/update`, {
            body: JSON.stringify(docToUpdate),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });
        const result = await response.json();
    }
};

export default docsModel;
