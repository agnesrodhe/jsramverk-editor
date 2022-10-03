const baseURL = "http://localhost:8976";

const auth = {
    register: async function register(user) {
        const response = await fetch(`${baseURL}/auth/register`, {
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
        const response = await fetch(`${baseURL}/auth/login`, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                'content-type': 'application/json'
            },
        });
        const result = await response.json();

        return result;

    }
};

export default auth;