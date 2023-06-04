<script lang="ts">
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
  import * as d3 from "d3";
  import { svg_element } from "svelte/internal";
  let email_admin = "";
  let nombre_admin = "";
  let password = "";
  let uidUsuario = "";
  let imagenPerfil = "";
  let imagenPerfildefault =
    "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp";
  onMount(() => {
    if (!$admin) {
      alert("No tienes permisos para acceder a esta página");
      navigate("/login", { replace: true });
    } else {
      if ($admin) {
        email_admin = $admin.email;
        nombre_admin = $admin.displayName;
        imagenPerfil = $admin.photoURL;
        uidUsuario = $admin.uid;
      }
      getDivisas();
    }
  });
  let recibos = [];

  const unsub = onSnapshot(
    collection(db, "Recibos"),
    (querySnapshot) => {
      recibos = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }; //con esto decimos que por cada recorrido trasformamos los datos en un objeto
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

  //Vamos a calcular de todas las personas cuales pagaron con tarjeta nequi o pse

  let tipoDePago = {
    tipo: "",
    cantidad: 0,
  };

  let totalTipoDePago = 0;
  let divisas = [];

  const getDivisas = async () => {
    let totalNequi = 0;
    let totalTarjeta = 0;
    let totalPSE = 0;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    for (let index = 0; index < recibos.length; index++) {
      const element = recibos[index];

      if (element.metododePago === "Tarjeta") {
        totalTarjeta += 1;
      }
      if (element.metododePago === "Nequi") {
        totalNequi += 1;
      }
      if (element.metododePago === "PSE") {
        totalPSE += 1;
      }
    }
    tipoDePago = {
      tipo: "Tarjeta",
      cantidad: totalTarjeta,
    };
    divisas.push(tipoDePago);
    tipoDePago = {
      tipo: "Nequi",
      cantidad: totalNequi,
    };
    divisas.push(tipoDePago);
    tipoDePago = {
      tipo: "PSE",
      cantidad: totalPSE,
    };
    divisas.push(tipoDePago);
    console.log(divisas);
    totalTipoDePago = totalNequi + totalTarjeta + totalPSE;
    console.log(totalTipoDePago);

    createPieChart(divisas, "pie", totalTipoDePago);
  };

  //Vamos a crear un grafico de Pastel

  function createPieChart(data, containerId, ventasTotales) {
    console.log(data);

    const svg = d3.select(`#${containerId}`);
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const radius = Math.min(width, height) / 2;
    console.log(radius);
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie<any>().value((d) => d.cantidad);

    const arc = d3.arc<any>().innerRadius(0).outerRadius(radius);

    const arcs = svg
      .selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => colors(i));

    arcs
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text(
        (d) =>
          `${((d.data.cantidad / ventasTotales) * 100).toFixed(2)}% ${
            d.data.tipo
          }`
      );
  }
</script>

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
/>

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
        <div class="datos"><p>{email_admin}</p></div>

        <br />

        <p>Nombre de usuario:</p>
        <br />
        <div class="datos"><p>{nombre_admin}</p></div>
        <!-- <p>Contraseña: ********</p> -->
      </div>
      <div class="card-footer">
        <!-- Botón con bordes redondeados -->
        <div class="boton-container">
          <Link to="/passwordreset" class="btn-1">Cambiar Contraseña</Link>

          <!-- <button  class="btn-1" href="/passwordreset" > Cambiar Contraseña </button>  -->
        </div>
      </div>
    </div>

    <!-- </div> -->

    <div class="right-column">
      <div class="right-card">
        
        <div class="left-columnstatics">
          
          <svg id="pie" width="400" height="400" />
            <svg id="chart2" width="200" height="200" />
        </div>
        <div class="right-columnstatics" >
          {#await new Promise( (resolve) => setTimeout(resolve, 4000) ) then value}
          <h1 >Metodos de Pago</h1>
          <h1 >Total: {totalTipoDePago}</h1>
          
          <h1 >{divisas[0].tipo}: {divisas[0].cantidad}</h1>
          
          <h1 >{divisas[1].tipo}: {divisas[1].cantidad}</h1>
          
          <h1 >{divisas[2].tipo}: {divisas[2].cantidad}</h1>
          

          <span class="material-symbols-outlined icon"> payments </span>
        {/await}
        </div>
        
        </div>
        
          
        
      
      <!-- SCRIPTS PARA IMPORTAR LIBRERIAS DE EMAILJS -->
    </div>
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
    height: 100vh;
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

  .left-columnstatics {
    grid-column: 1;
    padding-top: 25% ;
    padding-left: 40px;
  }

  .right-columnstatics {
    grid-column: 2;
    background-color: #2d6469;
    padding: 13px 15px;
    width: 100%;
    height: 90%;
    padding-top: 20%;
    border-radius: 25px;
    box-shadow: 0 0 20px rgba(45, 100, 105, 0.5);
    color: white;
    font-size: 14px;
    text-align: center;
  }
  .statics{
   width: 20%;
   
  }
  
  .icon {
    font-size: 300px;
    color: #fc741e;
    margin-left: 10px;
  }

  .icon:hover {
    color: #6d120f;
    cursor: pointer;
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
    background-color: #151c24;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
    width: 700px;
    height: 100%;
    gap: 10px;
  }

  .right-card {
    background-color: #151c24;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
    width: 1000px;
    height: 100%;
    
  
    display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
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
