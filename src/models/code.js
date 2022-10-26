const code = {
    runCode: async function runCode(codeText) {
        const data = {
            code: btoa(codeText)
        };
        const response = await fetch("https://execjs.emilfolino.se/code", {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });
        const result = await response.json();
        const decodedOutput = atob(result.data);
        console.log(decodedOutput);
        return decodedOutput;
    }
};

export default code;