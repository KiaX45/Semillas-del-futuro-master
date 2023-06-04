<script>
import * as emailjs from "emailjs-com";
import { onMount, onDestroy } from "svelte";
import {
    addDoc,
    collection,
    onSnapshot,
    doc,
    deleteDoc,
    updateDoc,
  } from "firebase/firestore";

  import { db } from "../../firebase";

let email = "luisalejandromedinab@gmail.com"; // Variable con el correo por defecto
let mensaje = ""; // Variable con el mensaje por defecto
let name = "Takiy Official"; // Variable con el nombre por defecto

onMount(() => {
  // Actualizar el valor de email si se proporciona en la URL o cualquier otra lógica de tu aplicación
});

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

const sendNotification = async () => {
  if(mensaje.trim() === ""){
    alert("El mensaje no puede estar vacío");
    return;
  }
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("FUNCION");
  //console.log("OBJETO", usuarios);
  for (let index = 0; index < usuarios.length; index++) {
    let element = usuarios[index];
   const e = {
    email: element.correo,
    mensaje: mensaje,
    name: name
  }
  console.log("OBJETO", e);
  sendEmail(e);
  
    
  }
  alert("Notificación enviada");
  mensaje = "";
  
};

function sendEmail(e) {
  console.log("FUNCION");
  console.log("OBJETO", e);
  emailjs
  .send("service_hnzcfrk", "template_j0h6dgo", e, "RzOpvisA1hUyxBvaE")
    .then(
      (result) => {
        console.log("SUCCESS!", result.text);
      },
      (error) => {
        console.log("FAILED...", error.text);
      }
    );
}




</script>

<body>
  <img
    class="bg"
    src="https://firebasestorage.googleapis.com/v0/b/takiy-5800d.appspot.com/o/Im%C3%A1genes%20proyecto%2Fart.jpg?alt=media&token=bc967db6-3580-4702-9310-1e3a7d6b1aa8"
    alt=""
  />
  <div>
    <h2 class="neon-tittle">Notificaciones a enviar</h2>
  </div>

  <form class="form">
    <input type="text" required bind:value={mensaje}/>
    <label class="lbl-nombre">
      <span class="text-nomb">Notificación</span>
    </label>
  </form>
  <div class="btn-section">
    <button class="btn-neon" on:click={sendNotification}>
      <span id="span1" />
      <span id="span2" />
      <span id="span3" />
      <span id="span4" />
      Enviar notificación a todos
    </button>
  </div>
</body>

<style>
  @import url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap");
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Open Sans", sans-serif;
  }
  body {
    width: 100%;
    height: 100vh;
    display: inline-block;
    justify-content: center;
    align-items: center;
    background: #0b1721;
  }

  .bg {
    position: absolute;
    width: 100%;
    height: 861px;
    margin-top: -100px;
    z-index: 0;
    opacity: 0.2;
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
    margin-top: 200px;
    margin-bottom: 50px;
  }

  .neon-tittle:hover {
    color: #fff;
    text-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4,
      0 0 100px #03e9f4;
  }

  .form {
    width: 100%;
    height: 55px;
    max-width: 400px;
    position: relative;
    overflow: hidden;
    margin-left: 40%;
    margin-bottom: 50px;
  }
  .form input {
    width: 100%;
    height: 100%;
    background: none;
    color: #fff;
    padding-top: 20px;
    border: none;
    outline: 0px;
  }
  .form .lbl-nombre {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-bottom: 1px solid #c7c7c7;
  }
  .form .lbl-nombre:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 100%;
    border-bottom: 3px solid #2ecece;
    transform: translateX(-100%);
    transition: all 0.3s ease;
  }
  .text-nomb {
    position: absolute;
    bottom: 5px;
    left: 0;
    transition: all 0.3s ease;
    color: #fff;
  }
  .form input:focus + .lbl-nombre .text-nomb,
  .form input:valid + .lbl-nombre .text-nomb {
    transform: translateY(-150%);
    font-size: 14px;
    color: #2ecece;
  }
  .form input:focus + .lbl-nombre:after,
  .form input:valid + .lbl-nombre:after {
    transform: translateX(0%);
  }
  @media only screen and (min-width: 320px) and (max-width: 768px) {
    .form {
      width: 85%;
    }
  }

  .btn-section {
    margin-left: 40%;
  }

    .btn-neon {
        position: relative;
        display: inline-block;
        padding: 15px 30px;
        color: #fff;
        letter-spacing: 4px;
        text-decoration: none;
        font-size: 20px;
        overflow: hidden;
        transition: 0.2s;
        background-color: #2d6469;
        opacity: 60%;
        border-radius: 5px;
    }
    .btn-neon:hover {
        background: #184d51;
        box-shadow: 0 0 10px #184d51, 0 0 40px #184d51, 0 0 80px #184d51;
        transition-delay: 1s;
        opacity: 100%;
    }
    .btn-neon span {
        position: absolute;
        display: block;
    }
    #span1 {
        top: 0;
        left: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, transparent, #184d51);
    }
    .btn-neon:hover #span1 {
        left: 100%;
        transition: 1s;
    }
    #span3 {
        bottom: 0;
        right: -100%;
        width: 100%;
        height: 2px;
        background: linear-gradient(270deg, transparent, #184d51);
    }
    .btn-neon:hover #span3 {
        right: 100%;
        transition: 1s;
        transition-delay: 0.5s;
    }
    #span2 {
        top: -100%;
        right: 0;
        width: 2px;
        height: 100%;
        background: linear-gradient(180deg, transparent, #184d51);
    }
    .btn-neon:hover #span2 {
        top: 100%;
        transition: 1s;
        transition-delay: 0.25s;
    }
    #span4 {
        bottom: -100%;
        left: 0;
        width: 2px;
        height: 100%;
        background: linear-gradient(360deg, transparent, #184d51);
    }
    .btn-neon:hover #span4 {
        bottom: 100%;
        transition: 1s;
        transition-delay: 0.75s;
    }
</style>