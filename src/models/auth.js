const auth = {
    baseURL: window.location.href.includes("localhost") ?
    "http://localhost:8976" :
    "https://jsramverk-editor-agro21.azurewebsites.net",

    sendEmail: async function sendEmail(email) {
        const response = await fetch(`${auth.baseURL}/auth/send-email`, {
            method: "POST",
            body: JSON.stringify(email),
            headers: {
                'content-type': 'application/json'
            },
        });
        const result = await response.json();

        return result;
    },

    getAllUsers: async function getAllUsers() {
        const response = await fetch(`${auth.baseURL}/auth/users`);
        const users = await response.json();
        return users.data;
    },

    register: async function register(user) {
        const response = await fetch(`${auth.baseURL}/auth/register`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            },
        });
        const result = await response.json();

        return result;
    },

    login: async function login(user) {
        console.log(user);
        const response = await fetch(`${auth.baseURL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            },
        });
        const result = await response.json();
        console.log(result);
        return result;

    }
};

export default auth;