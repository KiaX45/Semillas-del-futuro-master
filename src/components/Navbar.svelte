<script>
  import { Link, navigate } from "svelte-routing";
  import { user, admin } from "../stores/User";
  import Button from "../components/Button1.svelte";
  import ButtonProfile from "../components/ButtonProfile.svelte";
  import Perfil from "../views/Perfil.svelte";

  import { signOut } from "firebase/auth";
  import { auth } from "../firebase";
  let texto = "Cerrar Sesión";

  const gotoProfile = () => {
    console.log("Si");
    navigate("/perfil", { replace: true });
  };

  const goLogin = () => {
    console.log("Si");
    navigate("/login", { replace: true });
  };

  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      user.setUser(null);
      navigate("/login", { replace: true });
      console.log("se ha cerrado cesión con exito");
    } catch (error) {
      console.log(error.message);
    }
  };

  let home;
</script>

<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- Bootstrap CSS -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
      crossorigin="anonymous"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css"
    />

    <title>NavBar</title>
  </head>

  <body class="bg-secondary">
    <!-- Inicio del menu -->

    <nav class="navbar navbar-expand-md navbar-dark bg-dark" id="header-menu">
      <div class="container-fluid">
        <!-- icono o nombre -->

        <a class="navbar-brand" href="/">
          <i class="bi bi-flower1" />
          <span class="title"><b>TAKIY</b></span>
        </a>

        <!-- boton del menu -->

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon" />
        </button>

        <!-- elementos del menu colapsable -->

        <div class="collapse navbar-collapse" id="menu">
          <!--Inicio el cambio -->
          {#if $user}
            <div class="divCentrado d-flex align-items-center me-auto">
              <ul class="navbar-nav me-auto">
                <li class="nav-item">
                  <Link to="/" class="nav-link active" style="color:#2d6469"
                    >Inicio</Link
                  >
                </li>
                <li class="nav-item">
                  <Link
                    to="/Usuario"
                    class="nav-link active"
                    style="color:#2d6469">Perfil</Link
                  >
                </li>
                <!--
                <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="/"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Trabajadores
                </a>

                <ul
                  class="dropdown-menu bg-secondary"
                  aria-labelledby="navbarDropdown"
                >
                  <li><Button {texto} {cerrarSesion} /></li>
                  <li><ButtonProfile texto={"Trabajos"} {gotoProfile} /></li>
                </ul>
              </li>
              -->
                <li class="nav-item">
                  <Link
                    to="/conciertos"
                    class="nav-link active"
                    style="color:#2d6469">Conciertos</Link
                  >
                </li>
                <li class="nav-item">
                  <Link
                    to="/promociones"
                    class="nav-link active"
                    style="color:#2d6469">Promociones</Link
                  >
                </li>
              </ul>
            </div>
          {:else if $admin}
            <div class="divCentrado d-flex align-items-center me-auto">
              <ul class="navbar-nav me-auto">
                <li class="nav-item">
                  <Link to="/" class="nav-link active" style="color:#2d6469"
                    >Inicio</Link
                  >
                </li>
                <!--
                <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="/"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"addproducts
                >
                  Trabajadores
                </a>

                <ul
                  class="dropdown-menu bg-secondary"
                  aria-labelledby="navbarDropdown"
                >
                  <li><Button {texto} {cerrarSesion} /></li>
                  <li><ButtonProfile texto={"Trabajos"} {gotoProfile} /></li>
                </ul>
              </li>
              -->
                <li class="nav-item">
                  <Link
                    to="/conciertos"
                    class="nav-link active"
                    style="color:#2d6469">Conciertos</Link
                  >
                </li>
                <li class="nav-item">
                  <Link
                    to="/promociones"
                    class="nav-link active"
                    style="color:#2d6469">Promociones</Link
                  >
                </li>
                <li class="nav-item">
                  <Link
                    to="/addproducts"
                    class="nav-link active"
                    style="color:#2d6469">Añadir_Conciertos</Link
                  >
                </li>
                <li class="nav-item">
                  <Link
                    to="/Usuarioadmin"
                    class="nav-link active"
                    style="color:#2d6469">Perfil</Link
                  >
                </li>
                <li class="nav-item">
                  <Link
                    to="/estatistics"
                    class="nav-link active"
                    style="color:#2d6469">Estadisticas</Link
                  >
                </li>

                <li class="nav-item">
                  <Link
                    to="/notificacions"
                    class="nav-link active"
                    style="color:#2d6469">Notificaciones</Link
                  >
                </li>


              </ul>
            </div>
          {:else}
            <div class="divCentrado d-flex align-items-center me-auto">
              <ul class="navbar-nav me-auto">
                <li class="nav-item">
                  <Link to="/" class="nav-link active" style="color:#2d6469"
                    >Inicio</Link
                  >
                </li>
                <li class="nav-item">
                  <Link
                    to="/conciertos"
                    class="nav-link active"
                    style="color:#2d6469">Conciertos</Link
                  >
                </li>
                <li class="nav-item">
                  <Link
                    to="/promociones"
                    class="nav-link active"
                    style="color:#2d6469">Promociones</Link
                  >
                </li>
              </ul>
            </div>
          {/if}

          <!--Termino el cambio-->
          <hr class="d-md-none text-white-50" />

          <!-- enlaces redes sociales -->

          <ul class="navbar-nav flex-row flex-wrap text-light">
            <li class="nav-item col-6 col-md-auto p-3">
              <i class="bi bi-twitter" />
              <small class="d-md-none ms-2">Twitter</small>
            </li>

            <li class="nav-item col-6 col-md-auto p-3">
              <i class="bi bi-github" />
              <small class="d-md-none ms-2">GitHub</small>
            </li>

            <li class="nav-item col-6 col-md-auto p-3">
              <i class="bi bi-whatsapp" />
              <small class="d-md-none ms-2">WhatsApp</small>
            </li>

            <li class="nav-item col-6 col-md-auto p-3">
              <i class="bi bi-facebook" />
              <small class="d-md-none ms-2">Facebook</small>
            </li>
          </ul>

          <!--boton Informacion -->
          <form class="d-flex">
            {#if $user || $admin}
              <button
                class="btn btn-outline-warning d-none d-md-inline-block"
                type="submit"
                on:click={cerrarSesion}>Cerrar Sesion</button
              >
            {:else}
              <button
                class="btn btn-outline-warning d-none d-md-inline-block"
                type="submit"
                on:click|preventDefault={goLogin}>Log in</button
              >
            {/if}
          </form>
        </div>
      </div>
    </nav>

    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
      integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
      crossorigin="anonymous"
    ></script>
  </body>
</html>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap");

  .title {
    font-family: "Poppins", sans-serif;
    font-size: 1.5rem;
    color: #fc741e;
  }

  .divCentrado {
    width: 200px;
    margin: auto;
  }

  .navbar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1000;
  }

  .nav-item {
    color: #2d6469;
  }

  .nav-item:hover {
    color: #6d120f !important;
  }

  #header-menu {
    position: fixed;
  }
</style>
