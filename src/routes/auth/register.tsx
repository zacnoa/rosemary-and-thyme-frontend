import { createSignal } from "solid-js"

export default function RegisterPage() {


  const [username, setUsername] = createSignal("")
  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")



  const registerUser = async (username: string, email: string, password: string,) => {

    const result = await fetch("http://localhost:8080/auth/register", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, email, password })
    })
    if (!result.ok) {
      console.log("something whent wrong when registering")
    }

  }

  return (
    <div>

      <label for="username">username</label>
      <input value={username()} id="username" type="text" onChange={(e) => setUsername(e.target.value)}></input>

      <label for="email">Email</label>
      <input value={email()} id="email" type="text" onChange={(e) => setEmail(e.target.value)}></input>

      <label for="password">password</label>
      <input value={password()} onChange={(e) => setPassword(e.target.value)} type="text"></input>

      <button type="submit" onClick={() => registerUser(username(), email(), password())}>Submit</button>




    </div>
  )

}
