<script>
  import {
    addDoc,
    collection,
    onSnapshot,
    doc,
    deleteDoc,
    updateDoc,
  } from "firebase/firestore";

  import { db } from "../../firebase";

  let sign_up_mode = false;

  function changeSignupMode() {
    console.log("add");
    sign_up_mode = true;
    //container.classList.add("sign-up-mode");
  }

  function changeSigninMode() {
    console.log("remove");
    sign_up_mode = false;
    //container.classList.remove("sign-up-mode");
  }
  //Arreglo con las UID de los administradores
  const adminUid = [
    "H0QDpxoMMWPD3WRSMvV9fGr1pEQ2",
    "5BllpcGlUpZXaU7y7Ag8imB9Rz63",
  ];

  //Configuración del Registro de Usuario

  import { user, isLoggedIn, admin } from "../../stores/User";
  import { navigate, Link } from "svelte-routing";
  import { onMount, onDestroy } from "svelte";
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
  let correoyaRegistrado = false;
  let correosExistentes = [];

  onMount(() => {
    if (!$user) {
      navigate("/login", { replace: true });
    }
  });

  //Vamos a crear una nueva colección con los usuarios que ingresan por google

  //creemos un usuario objeto con nombre correo y uid del usuario
  let usuario = {
    nombre: "",
    correo: "",
    uid: "",
  };

  const accederConGoogle = async () => {
    console.log("SI");
    try {
      const provider = new GoogleAuthProvider();
      const resp = await signInWithPopup(auth, provider);
      console.log(resp.user);
      usuario.nombre = resp.user.displayName;
      usuario.correo = resp.user.email;
      usuario.uid = resp.user.uid;
      console.log(usuario);
      if (adminUid.includes(resp.user.uid)) {
        console.log("admin");
        admin.setAdmin(resp.user);
        console.log($admin);
      } else {
        user.setUser(resp.user);
        console.log($user);
      }

      if (verifyEmail(usuario.correo)) {
        createConcert(usuario);
      }

      navigate("/", { replace: true });
    } catch (error) {
      console.log(error.message);
    }
  };

  const createConcert = async (usuario) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await addDoc(collection(db, "Usuarios"), usuario);
      console.log("Usuario agregado");
    } catch (error) {
      console.log(error);
    }
  };

  let usuarios = [];

  const unsub = onSnapshot(
    collection(db, "Usuarios"),
    (querySnapshot) => {
      usuarios = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }; //con esto decimos que por cada recorrido trasformamos los datos en un objeto
      });

      console.log(usuarios);
    },
    (error) => {
      console.log(error);
    }
  );
  //Vamos a dejar de que escuche los cambios
  onDestroy(() => {
    unsub();
  });

  const verifyEmail = (correo) => {
    correosExistentes = usuarios.map((usuario) => {
      return usuario.correo;
    });
    console.log(correosExistentes);
    console.log(correo);
    if (correosExistentes.includes(correo)) {
      console.log("correo ya registrado");
      return false;
    } else {
      console.log("correo no registrado");
      return true;
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

  //Configuración Inicio de Sesión
  let username2 = "";
  let password2 = "";

  import { signInWithEmailAndPassword } from "firebase/auth";
  const login = async () => {
    try {
      if (!email.trim() || !password.trim()) {
        console.log("Campos vacios");
        return;
      }
      const resp = await signInWithEmailAndPassword(auth, email, password);
      if (adminUid.includes(resp.user.uid)) {
        admin.setAdmin(true);
        console.log($admin);
      } else {
        user.setUser(resp.user);
        console.log($user);
      }
      navigate("/", { replace: true });
    } catch (error) {
      alert("The user or the password is incorrect");
      console.log(error.message);
    }
  };
</script>

<body class="body">
  <div class="container" class:sign-up-mode={sign_up_mode}>
    <div class="forms-container">
      <div class="signin-signup">
        <form action="#" class="sign-in-form">
          <h2 class="title">Iniciar Sesion</h2>
          <div class="input-field">
            <i class="fas fa-user" />
            <input
              type="text"
              placeholder="Ingrese su email"
              bind:value={email}
            />
          </div>
          <div class="input-field">
            <i class="fas fa-lock" />
            <input
              type="password"
              placeholder="Contraseña"
              bind:value={password}
            />
          </div>
          <input
            type="submit"
            value="Ingresar"
            class="btn solid"
            on:click|preventDefault={login}
          />
          <Link to="/passwordreset" class="nav-link active"
            >¿Olvidaste tu contraseña?</Link
          >
          <p class="social-text">O ingresa mediante Google</p>
          <div class="social-media">
            <a class="social-icon" on:click={accederConGoogle}>
              <i class="fab fa-google" />
            </a>
          </div>
        </form>
        <form action="#" class="sign-up-form">
          <h2 class="title">Registrarse</h2>
          <div class="input-field">
            <i class="fas fa-user" />
            <input
              type="text"
              placeholder="Nombre de Usuario"
              bind:value={username}
            />
          </div>
          <div class="input-field">
            <i class="fas fa-envelope" />
            <input
              type="email"
              placeholder="Correo Electronico"
              bind:value={email}
            />
          </div>

          <div class="input-field">
            <i class="fas fa-lock" />
            <input
              type="password"
              placeholder="Contraseña"
              bind:value={password}
            />
          </div>
          <input
            type="submit"
            class="btn"
            value="Registrarse"
            on:click|preventDefault={registrarseConEmailPassword}
          />
          <p class="social-text">O ingresa mediante Google</p>
          <div class="social-media">
            <a on:click={accederConGoogle} class="social-icon">
              <i class="fab fa-google" />
            </a>
          </div>
        </form>
      </div>
    </div>

    <div class="panels-container">
      <div class="panel left-panel">
        <div class="content">
          <h3>Eres un Usuario Nuevo?</h3>
          <p>
            Crea una nueva cuenta en unos pocos pasos para poder acceder a
            TAKIY!
          </p>
          <button
            class="btn transparent"
            id="sign-up-btn"
            on:click|preventDefault={changeSignupMode}
          >
            Registrarse
          </button>
        </div>
        <img src="./src/images/imgLogin/singer.svg" class="image" alt="" />
      </div>
      <div class="panel right-panel">
        <div class="content">
          <h3>Ya tienes un usuario?</h3>
          <p>Pulsa aqui para ingresar con tu usuario registrado en TAKIY!</p>
          <button
            class="btn transparent"
            id="sign-in-btn"
            on:click|preventDefault={changeSigninMode}
          >
            Inicia Sesion
          </button>
        </div>
      </div>
    </div>
  </div></body
>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap");

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body,
  input {
    font-family: "Poppins", sans-serif;
  }

  .container {
    position: fixed;
    width: 100%;
    margin-left: 15%;

    padding: 0;

    background-color: #00424e;
    min-height: 100vh;
    overflow: hidden;
  }

  .forms-container {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .signin-signup {
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    left: 75%;
    width: 50%;
    transition: 1s 0.7s ease-in-out;
    display: grid;
    grid-template-columns: 1fr;
    z-index: 5;
  }

  form {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0rem 5rem;
    transition: all 0.2s 0.7s;
    overflow: hidden;
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  form.sign-up-form {
    opacity: 0;
    z-index: 1;
  }

  form.sign-in-form {
    z-index: 2;
  }

  .title {
    font-size: 2.2rem;
    color: #f8f7f7;
    margin-bottom: 10px;
  }

  .input-field {
    max-width: 380px;
    width: 100%;
    background-color: #f0f0f0;
    margin: 10px 0;
    height: 55px;
    border-radius: 55px;
    display: grid;
    grid-template-columns: 15% 85%;
    padding: 0 0.4rem;
    position: relative;
  }

  .input-field i {
    text-align: center;
    line-height: 55px;
    color: #acacac;
    transition: 0.5s;
    font-size: 1.1rem;
  }

  .input-field input {
    background: none;
    outline: none;
    border: none;
    line-height: 1;
    font-weight: 600;
    font-size: 1.1rem;
    color: #333;
  }

  .input-field input::placeholder {
    color: #aaa;
    font-weight: 500;
  }

  .social-text {
    padding: 0.7rem 0;
    font-size: 1rem;
    color: #007d83;
  }

  .social-media {
    display: flex;
    justify-content: center;
  }

  .social-icon {
    height: 46px;
    width: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 0.45rem;
    color: #007d83;
    border-radius: 50%;
    border: 1px solid #007d83;
    text-decoration: none;
    font-size: 1.1rem;
    transition: 0.3s;
  }

  .social-icon:hover {
    color: #4481eb;
    border-color: #4481eb;
  }

  .btn {
    width: 150px;
    background-color: #273f4b;
    border: none;
    outline: none;
    height: 49px;
    border-radius: 49px;
    color: #fff;
    text-transform: uppercase;
    font-weight: 600;
    margin: 10px 0;
    cursor: pointer;
    transition: 0.5s;
  }

  .btn:hover {
    background-color: #174ba5;
  }
  .panels-container {
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .container:before {
    content: "";
    position: absolute;
    height: 2000px;
    width: 2000px;
    top: -10%;
    right: 45%;
    transform: translateY(-45%);
    background-image: linear-gradient(-45deg, #002837 0%, #002837 100%);
    transition: 1.8s ease-in-out;
    border-radius: 50%;
    z-index: 6;
  }

  .image {
    width: 100%;
    transition: transform 1.1s ease-in-out;
    transition-delay: 0.4s;
  }

  .panel {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-around;
    text-align: center;
    z-index: 6;
  }

  .left-panel {
    pointer-events: all;
    padding: 3rem 17% 2rem 12%;
  }

  .right-panel {
    pointer-events: none;
    padding: 3rem 12% 2rem 17%;
  }

  .panel .content {
    color: #fff;
    transition: transform 0.9s ease-in-out;
    transition-delay: 0.6s;
  }

  .panel h3 {
    font-weight: 600;
    line-height: 1;
    font-size: 1.5rem;
  }

  .panel p {
    font-size: 0.95rem;
    padding: 0.7rem 0;
  }

  .btn.transparent {
    margin: 0;
    background: none;
    border: 2px solid #fff;
    width: 130px;
    height: 41px;
    font-weight: 600;
    font-size: 0.8rem;
  }

  .right-panel .image,
  .right-panel .content {
    transform: translateX(600px);
  }

  /* ANIMATION */

  .container.sign-up-mode:before {
    transform: translate(100%, -50%);
    right: 52%;
  }

  .container.sign-up-mode .left-panel .image,
  .container.sign-up-mode .left-panel .content {
    transform: translateX(-800px);
  }

  .container.sign-up-mode .signin-signup {
    left: 25%;
  }

  .container.sign-up-mode form.sign-up-form {
    opacity: 1;
    z-index: 2;
  }

  .container.sign-up-mode form.sign-in-form {
    opacity: 0;
    z-index: 1;
  }

  .container.sign-up-mode .right-panel .image,
  .container.sign-up-mode .right-panel .content {
    transform: translateX(0%);
  }

  .container.sign-up-mode .left-panel {
    pointer-events: none;
  }

  .container.sign-up-mode .right-panel {
    pointer-events: all;
  }

  @media (max-width: 870px) {
    .container {
      min-height: 800px;
      height: 100vh;
    }
    .signin-signup {
      width: 100%;
      top: 95%;
      transform: translate(-50%, -100%);
      transition: 1s 0.8s ease-in-out;
    }

    .signin-signup,
    .container.sign-up-mode .signin-signup {
      left: 50%;
    }

    .panels-container {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 2fr 1fr;
    }

    .panel {
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      padding: 2.5rem 8%;
      grid-column: 1 / 2;
    }

    .right-panel {
      grid-row: 3 / 4;
    }

    .left-panel {
      grid-row: 1 / 2;
    }

    .image {
      width: 200px;
      transition: transform 0.9s ease-in-out;
      transition-delay: 0.6s;
    }

    .panel .content {
      padding-right: 15%;
      transition: transform 0.9s ease-in-out;
      transition-delay: 0.8s;
    }

    .panel h3 {
      font-size: 1.2rem;
    }

    .panel p {
      font-size: 0.7rem;
      padding: 0.5rem 0;
    }

    .btn.transparent {
      width: 110px;
      height: 35px;
      font-size: 0.7rem;
    }

    .container:before {
      width: 1500px;
      height: 1500px;
      transform: translateX(-50%);
      left: 30%;
      bottom: 68%;
      right: initial;
      top: initial;
      transition: 2s ease-in-out;
    }

    .container.sign-up-mode:before {
      transform: translate(-50%, 100%);
      bottom: 32%;
      right: initial;
    }

    .container.sign-up-mode .left-panel .image,
    .container.sign-up-mode .left-panel .content {
      transform: translateY(-300px);
    }

    .container.sign-up-mode .right-panel .image,
    .container.sign-up-mode .right-panel .content {
      transform: translateY(0px);
    }

    .right-panel .image,
    .right-panel .content {
      transform: translateY(300px);
    }

    .container.sign-up-mode .signin-signup {
      top: 5%;
      transform: translate(-50%, 0);
    }
  }

  @media (max-width: 570px) {
    form {
      padding: 0 1.5rem;
    }

    .image {
      display: none;
    }
    .panel .content {
      padding: 0.5rem 1rem;
    }
    .container {
      padding: 1.5rem;
    }

    .container:before {
      bottom: 72%;
      left: 50%;
    }

    .container.sign-up-mode:before {
      bottom: 28%;
      left: 50%;
    }
  }
</style>
