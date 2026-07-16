import { createSignal } from "solid-js"

export default function LoginPage() {


  const [email, setEmail] = createSignal("")
  const [password, setPassword] = createSignal("")



  const loginUser = async (email: string, password: string,) => {

    const result = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
    if (!result.ok) {
      const json = await result.json()
      console.log(json.title + json.detail)
      return
    }

    console.log("User is authenticated")
  }

  return (
    <div>


      <label for="email">Email</label>
      <input value={email()} id="email" type="text" onChange={(e) => setEmail(e.target.value)}></input>

      <label for="password">password</label>
      <input value={password()} onChange={(e) => setPassword(e.target.value)} type="text"></input>

      <button onClick={() => loginUser(email(), password())}>Submit</button>




    </div>
  )

}
