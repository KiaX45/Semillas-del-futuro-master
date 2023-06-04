<script>
  import { Link, navigate } from "svelte-routing";
  import { user, isLoggedIn } from "../../stores/User";
  //importamos lo que necesitamos de firebase
  import { auth } from "../../firebase";
  import { signInWithEmailAndPassword } from "firebase/auth";

  let email = "";
  let password = "";

  const login = async() => {
    try {
      if (!email.trim() || !password.trim()) {
        console.log("Campos vacios");
        return;
      }
      const resp = await signInWithEmailAndPassword(auth, email, password);
      user.setUser(resp.user);
      navigate("/", { replace: true });

    } catch (error) {
        alert('The user or the password is incorrect');
      console.log(error.message);
    }
  };
</script>

<div>
  <form class="form-register" id="formulario" preventDefault>
    <h4 id="title1">Iniciar sesión</h4>

    <input
      class="controls"
      type="email"
      name="correo"
      id="correo"
      placeholder="Ingrese su Correo"
      bind:value={email}
    />
    <input
      class="controls"
      type="password"
      name="contraseña"
      id="contraseña"
      placeholder="Ingrese su contraseña"
      bind:value={password}
    />

    <button
      class="botons"
      type="submit"
      id="boton"
      on:click|preventDefault={login}
    >
      Iniciar sesión</button
    >
    <Link to="/login" class="nav-link active">Crer una cuenta</Link>
  </form>
</div>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  /*
body{
    background-image: url(fondo.jpg);
}
*/
  .form-register {
    width: 400px;
    background-color: #24303c;
    padding: 30px;
    margin: auto;
    margin-top: 100px;
    border-radius: 4px;
    font-family: "calibri";
    color: white;
    box-shadow: 7px 13px 37px #000;
  }

  .form-register h4 {
    font-size: 22px;
    margin-bottom: 20px;
  }

  .controls {
    color: white;
    width: 100%;
    background: #24303c;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 16px;
    border: 1px solid #1f53c5;
    font-family: "calibri";
    font-size: 18px;
  }

  /* .form-register p {
    height: 40px;
    text-align: center;
    font-size: 18px;
    line-height: 40px;
  }

  .form-register a {
    color: white;
    text-decoration: none;
  }

  .form-register a:hover {
    color: white;
    text-decoration: underline;
  } */

  .form-register .botons {
    width: 100%;
    background: #1f53c5;
    border: none;
    padding: 12px;
    margin: 16px 0;
    font-size: 16px;
  }

  .form-register .botons:hover {
    text-decoration: underline;
  }

  .form-register .botons:active {
    background-color: #293f6d;
    color: aquamarine;
  }
</style>
