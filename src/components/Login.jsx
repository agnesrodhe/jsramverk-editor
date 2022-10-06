import authModel from "../models/auth";

export default function Login({setToken, setUser, user}) {

    function handleChange(event) {
        const tmpObject = {};

        tmpObject[event.target.name] = event.target.value;

        setUser({...user, ...tmpObject})
    }
    
    async function register() {
        await authModel.register(user);
    }

    async function login() {
        const loginResult = await authModel.login(user);
        if (loginResult.data.token) {
            setToken(loginResult.data.token);
        }
    }

    return (
        <div className="form">
            <h2>Logga in eller registrera dig</h2>
            <label>
                <span>E-mail</span>
                <input type="email" name="email" onChange={handleChange} />
            </label>

            
            <label>
                <span>Lösenord</span>
                <input type="password" name="password" onChange={handleChange} />
            </label>

            <button className="register" onClick={register}>Registrera</button>
            <button className="submit" onClick={login} >Logga in</button>

        </div>



        );
}