<script>
  import { user, isLoggedIn } from "../../stores/User";
  import { navigate, Link } from "svelte-routing";
  import { onMount } from "svelte";
  //importamos lo que necesitamos de firebase
  import { auth } from "../../firebase";
  import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
  } from "firebase/auth";
  let email = "";
  let password = "";
  let username = "";

  const procesarFormulario = () => {
    if (!email.trim() || !password.trim()) {
      console.log("Campos vacios");
      return;
    }
    console.log("funcionando Correctamente");
    //con el metodo de user llenamos los campos
    user.setUser({
      username,
      email,
      password,
    });
    //con el signo peso de esta forma accedemos a los valores en otras palabras llamamos al subscribe y unsubscribe
    console.log($user);

    navigate("/", { replace: true });
  };

  const accederConGoogle = async () => {
    console.log("SI");
    try {
      const provider = new GoogleAuthProvider();
      const resp = await signInWithPopup(auth, provider);
      user.setUser(resp.user);
      console.log($user);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error.message);
    }
  };

  const registrarseConEmailPassword = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        console.log("Campos vacios");
        return;
      }
      auth.username = username;
      const resp2 = await createUserWithEmailAndPassword(auth, email, password);
      user.setUser(resp2.user);
      console.log($user);
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error.message);
    }
  };

  onMount(() => {
    if (!$user) {
      navigate("/login", { replace: true });
    }
  });
</script>

<div>
  <form class="form-register" id="formulario" preventDefault>
    <h4 id="title1">Formulario Registro</h4>

    <input
      bind:value={username}
      class="controls"
      type="text"
      name="nombres"
      id="nombres"
      placeholder="Ingrese su nombre de usuario"
    />

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

    <p>Estoy de acuerdo con <a href="/">Terminos y condiciones</a></p>
    <button
      class="botons"
      type="submit"
      id="boton"
      on:click|preventDefault={registrarseConEmailPassword}
    >
      Registrar</button
    >
    <button
      class="botons"
      type="submit"
      id="botonGoogle"
      on:click|preventDefault={accederConGoogle}
    >
      Acceder con Google</button
    >
    <Link to="/register" class="nav-link active">Ya tengo una cuenta</Link>
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

  .form-register p {
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
  }

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
