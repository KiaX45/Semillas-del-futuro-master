<script>
  import { user, admin } from "./stores/User";
  import { Router, Link, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import Home from "./views/Home.svelte";
  import About from "./views/About.svelte";
  import Perfil from "./views/Perfil.svelte";
  import Acceso from "./views/login/login.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Footer from "./components/Footer.svelte";
  import Acces from "./views/login/Acces.svelte";
  import PasswordReset from "./views/LoginPro/PasswordReset.svelte";
  import AddProducts from "./views/Admin/AddProducts.svelte";
  import Previsualizacin from "./views/User/Previsualización.svelte";
  import Usuario from "./views/User/Usuario.svelte";
  import Usuarioadmin from "./views/Admin/Usuarioadmin.svelte";
  import CompraBoletos from "./views/User/CompraBoletos.svelte";
  import { auth, db } from "./firebase";
  import { signOut } from "firebase/auth";
  import { onAuthStateChanged } from "firebase/auth";

  //importamos el login de Jesus
  import LoginPro from "./views/LoginPro/LoginPro.svelte";

  //importamos los enlaces del navegador
  import Conciertos from "./views/Conciertos.svelte";
  import Promociones from "./views/Promociones.svelte";

  //importamos la pestaña de estadisticas y de creación de notificaciones
  import Estatistics from "./views/Admin/Statistics.svelte";
  import Notificacions from "./views/Admin/Notifications.svelte";

  //Arreglo con las UID de los administradores
  const adminUid = [
   "H0QDpxoMMWPD3WRSMvV9fGr1pEQ2",
   "5BllpcGlUpZXaU7y7Ag8imB9Rz63"
  ];

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      user.setUser(null);
      navigate("/", { replace: true });
      console.log("se ha cerrado cesión con exito");
    } catch (error) {
      console.log(error.message);
    }
  };

  onAuthStateChanged(auth, (authUser) => {
    if (!authUser) {
      cerrarSesion();
      return;
    }
    if (adminUid.includes(authUser.uid)) {
      admin.setAdmin(authUser);
      console.log($admin);
    } else {
      user.setUser(authUser);
      console.log($user);
    }
  });

  onMount(() => {
    if (!$user) {
      navigate("/", { replace: true });
    }
  });
</script>

<body class="todoBody">
  <div>
    <Router>
      <Navbar />
      <Route path="/">
        <Home />
      </Route>

      <Route path="/about">
        <About />
      </Route>

      <Route path="/conciertos">
        <Conciertos />
      </Route>

      <Route path="/promociones">
        <Promociones />
      </Route>

      <Route path="/perfil">
        <Perfil />
      </Route>

      <Route path="/login">
        <LoginPro />
      </Route>

      <Route path="/passwordreset">
        <PasswordReset />
      </Route>

      <Route path="/Usuarioadmin">
        <Usuarioadmin />
      </Route>

      <Route path="/Usuario">
        <Usuario />
      </Route>

      <Route path="/register">
        <Acces />
      </Route>

      <Route path="/compraboletos">
        <CompraBoletos />
      </Route>

      <Route path="/addproducts">
        <AddProducts />
      </Route>

      <Route path="/estatistics">
        <Estatistics />
      </Route>

      <Route path="/notificacions">
        <Notificacions />
      </Route>

      <Route path="/previsualizacion">
        <Previsualizacin />
      </Route>
    </Router>

    <Footer />
  </div>
</body>

<style>
  .todoBody {
    background-color: #0b363f !important;
  }
</style>
