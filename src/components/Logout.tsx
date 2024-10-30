

interface LogoutProps {
    token: string
    setToken: (token: string) => void;
}



export default function Logout(
    { token, setToken }: LogoutProps
){
    const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
    window.localStorage.removeItem("tokenExpiry")
}
return (<div>
{token && (
    <button onClick={logout} className="bg-blue-500 bg-opacity-80 border-opacity-60 p-2 border-4 border-blue-600 rounded-md">
        Logout
    </button>
)}
</div>)
}