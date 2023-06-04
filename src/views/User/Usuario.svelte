<script>
  import {
    addDoc,
    collection,
    onSnapshot,
    doc,
    deleteDoc,
    updateDoc,
  } from "firebase/firestore";
  import { user, admin } from "../../stores/User";
  import { onMount, onDestroy } from "svelte";
  import { db } from "../../firebase";
  import { Link, navigate } from "svelte-routing";
  let email_user = "";
  let nombre_user = "";
  let password = "";
  let uidUsuario = "";
  let imagenPerfil = "";
  let imagenPerfildefault =
    "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp";
  onMount(() => {
    if (!$user) {
      alert("No tienes permisos para acceder a esta página");
      navigate("/login", { replace: true });
    } else {
      if ($user) {
        email_user = $user.email;
        nombre_user = $user.displayName;
        imagenPerfil = $user.photoURL;
        uidUsuario = $user.uid;
      }
    }
  });
  let recibos = [];

  const unsub = onSnapshot(
    collection(db, "Recibos"),
    (querySnapshot) => {
      recibos = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }; //con esto decimos que por cada recorrido trasformamos los datos en un objeto
      });

      recibos = recibos.filter((recibo) => {
        return recibo.uidUsuario === uidUsuario;
      });

      console.log(recibos);
    },
    (error) => {
      console.log(error);
    }
  );
  //Vamos a dejar de que escuche los cambios
  onDestroy(() => {
    unsub();
  });
</script>

<header>
  <div class="navbar">
    <h1>Promociones</h1>
  </div>
</header>
<body>
  <!-- <div class="container"> -->
  <div class="left-column">
    <div class="card">
      <div class="card-header">
        <div class="image-container">
          <!-- Campo circular para la imagen -->
          <img
            src={imagenPerfildefault}
            alt="Imagen de perfil"
            class="card-image"
          />
        </div>
        <h2 class="card-title">Mi Usuario</h2>
      </div>
      <div class="card-body">
        <!-- Campos de texto -->
        <p>Correo electrónico:</p>
        <br />
        <div class="datos"><p>{email_user}</p></div>

        <br />

        <p>Nombre de usuario:</p>
        <br />
        <div class="datos"><p>{nombre_user}</p></div>
        <!-- <p>Contraseña: ********</p> -->
      </div>
      <div class="card-footer">
        <!-- Botón con bordes redondeados -->
        <div class="boton-container">
          <Link to="/passwordreset" class="btn-1">Cambiar Contraseña</Link>
        </div>
      </div>
    </div>

    <!-- </div> -->

    <div class="right-column">
      <div class="right-card">
        {#each recibos as recibo}
          <div class="user-section-txt">
            <h1 class="neon-tittle">Conciertos comprados</h1>
            <h3>Nombre del Concierto: {recibo.idCOncierto}</h3>
            {#if recibo.boletosOroCompados > 0}
              <h3>Boletos Oro Compardos: {recibo.boletosOroCompados}</h3>
            {/if}
            {#if recibo.boletosPlataComprados > 0}
              <h3>Boletos plata Comprados: {recibo.boletosPlataComprados}</h3>
            {/if}
            {#if recibo.boletosVipComprados > 0}
              <h3>Boletos vip Comprados: {recibo.boletosVipComprados}</h3>
            {/if}
            {#if recibo.boletosGeneralComprados > 0}
              <h3>
                Boletos General Comprados: {recibo.boletosGeneralComprados}
              </h3>
            {/if}
            <h3>Precio: {recibo.precioTotal}$</h3>
            {#if recibo.descuentoAplicado > 0}
              <h3>Descuento Aplicado: {recibo.descuentoAplicado}%</h3>
            {/if}
            <h3>Metodo de Pago: {recibo.metododePago}</h3>
            <hr class="line">
          </div>
        {/each}
      </div>
    </div>
    <!-- SCRIPTS PARA IMPORTAR LIBRERIAS DE EMAILJS -->
  </div>
</body>

<style>
  /* 
Fonts
*/

  @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap");

  /*
Variables
*/

  body {
    margin: 0;
    background-color: #0b363f;
  }
  .card h2 {
    font-size: 24px;
    font-weight: bold;
    line-height: 30px;
    margin-bottom: 10px;
    color: rgb(7, 69, 90);
    text-align: center;
  }

  .card p {
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 0;
    color: #cccccc;
    text-align: center;
  }
  .right-card p {
    font-size: 20px;
    line-height: 24px;
    margin-bottom: 0;
    color: #cccccc;
    text-align: center;
  }
  .datos {
    max-width: 380px;
    width: 100%;
    text-align: center;
    background-color: rgb(7, 69, 90);
    margin-left: 20%;
    color: #cccccc;
    height: 40px;
    border-radius: 55px;
    grid-template-columns: 15% 85%;
    padding: 0 0.4rem;
    position: relative;
  }
  .datos p {
    font-size: 20px;
    line-height: 29px;
    color: #cccccc;
    text-align: center;
  }

  .left-column {
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 80%;
  }

  .card {
    background-color: hsl(216, 50%, 16%);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
    width: 700px;
    height: 100%;
    gap: 10px;
  }
  .right-card {
    color: #fff;
    background-color: hsl(216, 50%, 16%);
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
    width: 95%;
    height: 100%;
    gap: 10px;
    margin-top: 100px;
  }

  .line {
    width: 95%;
    margin-left: 2.5%;
    height: 7px;
    border-radius: 35px;
  }

  .right-card:hover {
    box-shadow: 0 0 20px rgba(252, 116, 30, 0.5);
  }

  .user-section-txt {
    background-color: #032527;
    border-radius: 35px;
    margin-bottom: 20px;
  }

  .user-section-txt:hover {
    box-shadow: 0 0 20px rgba(109, 18, 15, 0.5);
  }

  .user-section-txt h3{
    margin-left: 20%;
  }

  .neon-tittle {
        font-size: 3em;
        font-weight: 200;
        color: #fff;
        text-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4,
            0 0 100px #03e9f4;
        letter-spacing: 5px;
        cursor: pointer;
        text-transform: uppercase;
        transition: 1s;
        margin-left: 30%;
        margin-bottom: 50px;
    }

  .right-column {
    flex: 2;
    height: 100%;
    padding-left: 5%;
  }

  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px; /* Ajusta la altura deseada del contenedor de la imagen */
    width: 300px;
    margin-bottom: 20px;
    margin-left: 25%;
  }

  .card-image {
    height: 100%;
    width: 300px;
    object-fit: contain; /* Ajusta el tamaño de la imagen */
    border-radius: 50%; /* Para hacer la imagen circular */
  }

  .card-title {
    font-size: 18px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card-body {
    margin-bottom: 10px;
    gap: 10px;
  }

  /*ESTILOS PARA EL BOTON*/

  .btn-1 {
    height: 100%;
    width: 11.8rem;
    border-radius: 0.8rem;
    background: rgb(7, 69, 90);
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.2s;
    box-shadow: 0 0.3rem 1rem rgba(0, 0, 0, 0.3);

    border-color: rgb(3, 39, 51);
  }

  .btn-1:hover {
    background: none;
    border: 0.2rem solid rgb(7, 69, 90);
  }

  .boton-container {
    display: flex;
    justify-content: center;
    height: 70px;
    margin-top: 0;
    padding: 10px;
  }
</style>