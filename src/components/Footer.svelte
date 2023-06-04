<script>
  import { Link, navigate } from "svelte-routing";
  import { user, admin } from "../stores/User";
  import Button from "../components/Button1.svelte";
  import ButtonProfile from "../components/ButtonProfile.svelte";
  import Perfil from "../views/Perfil.svelte";

  import { signOut } from "firebase/auth";
  import { auth } from "../firebase";
  let texto = "Cerrar Seción";

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

<footer class="footer">

  <div class="footer-1 container">

      <ul>
          <li><a href="http://facebook.com">Facebook</a></li>
          <li><a href="http://instagram.com">Instagram</a></li>
          <li><a href="http://tiktok.com">Tik Tok</a></li>
      </ul>

  </div>

  <div class="footer-2">
      <p>Takiy</p>
  </div>


</footer>

</html>


<style>
  /* Fija la posición del footer en la parte de abajo de la página */

  

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
    list-style: none;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
}

.footer {
    padding-top: 20px;

    background-color: #151C24;
}

.footer-1 {
    padding-bottom: 20px;
}

.footer-1 ul {
    display: flex;
    justify-content: space-around;
}

.footer-1 ul li a {
  
    color: #FEFFFB;
}

.footer-1 ul li a:hover {
    color: #fc741e;;
}

.footer-2 {
  font-size: 25px;
    padding: 15px;
    text-align: center;
    color: #fc741e;;
    background-color: #14191f;
}


</style>
