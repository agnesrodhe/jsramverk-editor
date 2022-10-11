function LoggedIn({ logOut, user }) {
    return (
        <div className="user">
            <p>Inloggad som <strong>{user.email}</strong></p>
            <button className="submit" onClick={logOut}>Logga ut</button>
        </div>
    )
}
export default LoggedIn;
