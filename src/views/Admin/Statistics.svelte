<script lang="ts">
  import type { concert } from "../../lib/Logic/concerts";
  import type { Statistic } from "../../lib/Logic/statistic";
  import type { money } from "../../lib/Logic/Buying";
  import { addDoc, collection, onSnapshot, doc } from "firebase/firestore";
  import { onMount, onDestroy } from "svelte";
  import { Link, navigate } from "svelte-routing";
  import { db } from "../../firebase";
  import { get } from "svelte/store";
  import es from "date-fns/locale/es";
  import * as d3 from "d3";
  import { svg_element } from "svelte/internal";

  //Primero traeremos todo los conciertos
  let ready: boolean = false;
  let done: boolean = false;
  let conciertos = [];
  const unsub = onSnapshot(
    collection(db, "Conciertos"),
    (querySnapshot) => {
      conciertos = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }; //con esto decimos que por cada recorrido trasformamos los datos en un objeto
      });
      console.log(conciertos);

      createStatistics();
    },
    (error) => {
      console.log(error);
    }
  );

  onMount(() => {});

  onDestroy(() => {
    unsub2();
    unsub();
  });

  //Vamos a crear un arreglo de los objetos estadisticas
  let estadisticas = [];
  let concierto: concert;
  let compradores: money[] = [];
  let metodosDePago: number[] = [];
  let tipoDeBoletas: number[] = [];
  let recibos = [];

  //Vamos a crear una función que nos permita crear las estadisticas
  const createStatistics = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Creando estadisticas");
    //console.log(conciertos.length);
    //console.log(conciertos);
    // console.log(estadisticas);
    //console.log(recibos);
    for (let i = 0; i < conciertos.length; i++) {
      let estadistica: Statistic = {
        concierto: concierto,
        compradores: compradores,
        gananciasTotales: 0,
        numeroDeVentas: 0,
        numeroDeCompradores: 0,
        totalNequi: 0,
        totalPSE: 0,
        totalTargeta: 0,
        totalVipComprados: 0,
        totalPlataComprados: 0,
        totalGeneralComprados: 0,
        totalOroComprados: 0,
        conteinerId: "chart" + i,
      };
      compradores = [];
      // console.log(compradores);
      concierto = conciertos[i];
      //console.log(concierto);
      getbuyers(concierto, compradores, recibos);
      //console.log(compradores);
      estadistica.concierto = concierto;
      //console.log(estadistica.concierto);
      estadistica.compradores = compradores;
      estadistica.numeroDeCompradores = compradores.length;
      estadistica.numeroDeVentas = getNumeroDeVentas(compradores);
      estadistica.gananciasTotales = getTotalearnings(compradores);
      paymentMethods(compradores, estadistica);
      tipoDeBoletas = getBoletosComprados(compradores);
      estadistica.totalVipComprados = tipoDeBoletas[0];
      estadistica.totalPlataComprados = tipoDeBoletas[1];
      estadistica.totalGeneralComprados = tipoDeBoletas[2];
      estadistica.totalOroComprados = tipoDeBoletas[3];
      if (estadistica.numeroDeCompradores > 0) {
        // console.log(getBoletosComprados(compradores));
        // console.log(estadistica.conteinerId);
        //createPieChart(tipoDeBoletas, estadistica.conteinerId, estadistica);
      }
      estadisticas.push(estadistica);
    }
    //console.log(estadisticas);
  };

  //Vamos a traer a todos los compradores de ese concierto

  const unsub2 = onSnapshot(
    collection(db, "Recibos"),
    (querySnapshot) => {
      recibos = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }; //con esto decimos que por cada recorrido trasformamos los datos en un objeto
      });
      console.log(recibos);
      if (recibos.length > 0) {
        ready = true;
      }
      createGraphics();
    },
    (error) => {
      console.log(error);
    }
  );

  const getbuyers = async (
    concierto: concert,
    compradores: money[],
    recibos: any[]
  ) => {
    // console.log("Buscando compradores");
    // console.log(recibos.length);

    for (let index = 0; index < recibos.length; index++) {
      //  console.log(recibos[index].idCOncierto);
      // console.log(concierto.nombreConcierto);
      if (recibos[index].idCOncierto === concierto.nombreConcierto) {
        // console.log("Encontrado");
        compradores.push(recibos[index]);
      }
    }
  };

  //Crearemos una función para calcular el numero total de ventas
  const getNumeroDeVentas = (compradores: money[]): number => {
    // console.log("Calculando numero de ventas");
    //  console.log(compradores);
    let numeroDeVentas: number = 0;
    for (let i = 0; i < compradores.length; i++) {
      numeroDeVentas += compradores[i].boletosOroCompados;
      numeroDeVentas += compradores[i].boletosPlataComprados;
      numeroDeVentas += compradores[i].boletosGeneralComprados;
      numeroDeVentas += compradores[i].boletosVipComprados;
    }
    return numeroDeVentas;
  };

  //Crearemos una función para calcular las ganancias totales
  const getTotalearnings = (compradores: money[]): number => {
    let totalGanado: number = 0;
    let comprador: money;

    for (let index = 0; index < compradores.length; index++) {
      comprador = compradores[index];
      //console.log(comprador.precioTotal); //Da un valor positivo
      //console.log(typeof comprador.precioTotal); //Da number
      totalGanado += comprador.precioTotal;
    }

    //console.log(totalGanado);

    return totalGanado;
  };

  //Creamos una función para identificar los metodos de pago

  const paymentMethods = (compradores: money[], estadistica: Statistic) => {
    let totalNequi: number = 0;
    let totalPSE: number = 0;
    let totalTargeta: number = 0;
    for (let index = 0; index < compradores.length; index++) {
      console.log("Este")
      console.log(compradores[index].metododePago);
      if (compradores[index].metododePago === "Nequi") {
        //console.log("Encontrado");
        totalNequi++;
      }
      if (compradores[index].metododePago === "PSE") {
        //console.log("Encontrado");
        totalPSE++;
      }
      if (compradores[index].metododePago === "Tarjeta") {
        //console.log("Encontrado");
        totalTargeta++;
      }
    }

    console.log(totalTargeta);
    estadistica.totalNequi += totalNequi;
    estadistica.totalPSE += totalPSE;
    estadistica.totalTargeta += totalTargeta;
   
  };

  //Vamos a crear un metodo para calcular el total de bolertos comprados de cada categoria
  const getBoletosComprados = (compradores: money[]): number[] => {
    let boletosComprados: number[] = [];
    let totalVipComprados: number = 0;
    let totalPlataComprados: number = 0;
    let totalGeneralComprados: number = 0;
    let totalOroComprados: number = 0;

    for (let index = 0; index < compradores.length; index++) {
      totalVipComprados += compradores[index].boletosVipComprados;
      totalPlataComprados += compradores[index].boletosPlataComprados;
      totalGeneralComprados += compradores[index].boletosGeneralComprados;
      totalOroComprados += compradores[index].boletosOroCompados;
    }

    boletosComprados.push(totalVipComprados);
    boletosComprados.push(totalPlataComprados);
    boletosComprados.push(totalGeneralComprados);
    boletosComprados.push(totalOroComprados);

    return boletosComprados;
  };

  onMount(async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulando una demora de 3 segundos
  });

  //Parte logica de la creación de los diagramas
  function createPieChart(data, containerId, estadistica) {
    const svg = d3.select(`#${estadistica.conteinerId}`);
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const radius = Math.min(width, height) / 2;
    const colors = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie<number>().value((d) => d);

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
        (d) => `${((d.data / estadistica.numeroDeVentas) * 100).toFixed(2)}%`
      );
  }

  const createGraphics = async () => {
    await new Promise((resolve) => setTimeout(resolve, 8000));
    console.log("Creando graficos");
    for (let index = 0; index < estadisticas.length; index++) {
      let tipoBoletos: number[] = [];
      const element: Statistic = estadisticas[index];
      tipoBoletos.push(element.totalGeneralComprados);
      tipoBoletos.push(element.totalOroComprados);
      tipoBoletos.push(element.totalPlataComprados);
      tipoBoletos.push(element.totalVipComprados);
      createPieChart(tipoBoletos, element.conteinerId, element);
    }
  };
</script>

<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
/>
<body>
  <header />

  {#await new Promise((resolve) => setTimeout(resolve, 4000))}
    <!-- ---------------PANTALLA DE CARGA (ANTES DE MOSTRAR LAS ESTADISTICAS)--------------------------- -->
    <img
      class="bg"
      src="https://firebasestorage.googleapis.com/v0/b/takiy-5800d.appspot.com/o/Im%C3%A1genes%20proyecto%2Fart.jpg?alt=media&token=bc967db6-3580-4702-9310-1e3a7d6b1aa8"
      alt=""
    />
    <div class="container">
      <div class="cubo">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div class="loading">
        <h1>Loading</h1>
        <p>. . .</p>
      </div>
    </div>
  {:then value}
  <div class="tittle-section" style="margin-top:100px">
    <h1 class="neon-tittle">Estadisticas</h1>
  </div>
    
   

    {#each estadisticas as estadistica}
      <div class="card">
        {#if estadistica.numeroDeVentas > 0}
          <div class="content">
            <h1 class="neon-tittle">CONCIERTO: {estadistica.concierto.nombreConcierto}</h1>
            <div class="description">
              <div class="position-txt-icons">
                <div class="txt-icons recuadros-estadisticas">
                  <h3>Ganancias totales: {estadistica.gananciasTotales}</h3>
                  <span class="material-symbols-outlined icon">
                    attach_money
                  </span>
                </div>
                <div class="txt-icons recuadros-estadisticas">
                  <h3>Ventas: {estadistica.numeroDeVentas}</h3>
                  <span class="material-symbols-outlined icon"> payments </span>
                </div>
                <div class="txt-icons recuadros-estadisticas">
                  <h3>Compradores: {estadistica.numeroDeCompradores}</h3>
                  <span class="material-symbols-outlined icon"> sell </span>
                </div>
              </div>
              <div class="position-txt-icons">
                <div class="txt-icons recuadros-estadisticas">
                  <h3>Compras por Nequi: {estadistica.totalNequi}</h3>
                  <span class="material-symbols-outlined icon">
                    currency_bitcoin
                  </span>
                </div>
                <div class="txt-icons recuadros-estadisticas">
                  <h3>Compras por PSE: {estadistica.totalPSE}</h3>
                  <span class="material-symbols-outlined icon">
                    point_of_sale
                  </span>
                </div>
                <div class="txt-icons recuadros-estadisticas">
                  <h3>Compras con tarjeta: {estadistica.totalTargeta}</h3>
                  <span class="material-symbols-outlined icon">
                    credit_card
                  </span>
                </div>
              </div>
              <div class="position-txt-icons">
                <div class="txt-icons recuadros-estadisticas">
                  <h3>General: {estadistica.totalGeneralComprados}</h3>
                  <span class="material-symbols-outlined icon">
                    assignment_ind
                  </span>
                </div>
                <div class="txt-icons recuadros-estadisticas">
                  <h3>Oro: {estadistica.totalOroComprados}</h3>
                  <span class="material-symbols-outlined icon">
                    assignment_ind
                  </span>
                </div>
                <div class="txt-icons recuadros-estadisticas">
                  <h3>Plata: {estadistica.totalPlataComprados}</h3>
                  <span class="material-symbols-outlined icon">
                    assignment_ind
                  </span>
                </div>
                <div class="txt-icons recuadros-estadisticas">
                  <h3>VIP: {estadistica.totalVipComprados}</h3>
                  <span class="material-symbols-outlined icon">
                    assignment_ind
                  </span>
                </div>
              </div>
            </div>
          </div>
          <!--<svg id={estadistica.conteinerId} width="400" height="400" />-->

          <div class="tituloCliente-section">
            <h2>ID del usuario</h2>
            <h2>Metodo de pago</h2>
            <h2>Precio total</h2>
          </div>
          {#each estadistica.compradores as comprador}
            <div class="section-infoCliente">
              <div class="infocliente-section">
                <div>
                  <ul>
                    <li>{comprador.uidUsuario}</li>
                  </ul>
                </div>
                <div>
                  <p>{comprador.metododePago}</p>
                </div>
                <div>
                  <p>  ${comprador.precioTotal}</p>
                </div>
              </div>
            </div>
          {/each}
        {:else}
          <div class="section-infoCliente infocliente-section2">
            <h1 class="neon-tittle">{estadistica.concierto.nombreConcierto}: </h1>
            <div class="infocliente-section">
              <h1>No hay registro de compra para este concierto</h1>
            </div>
          </div>
        {/if}
      </div>
    {/each}

    {#if estadisticas.length === 0}
      <div class="infocliente-section">
        <h1>No hay estadisticas</h1>
      </div>
    {/if}
  {/await}
</body>

<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #0b363f;
    color: white;
    min-height: 100vh;
  }

  .bg {
    position: absolute;
    width: 100%;
    height: 861px;
    margin-top: -380px;
    z-index: 0;
    opacity: 0.2;
  }

  .tittle-section {
    padding: 13px 35px;
    color: #00a1b0;
    border-radius: 5px;
    background: linear-gradient(
      90deg,
      rgba(3, 37, 39, 1) 33%,
      rgba(45, 100, 105, 1) 69%,
      rgba(252, 116, 30, 1) 100%
    );
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    margin-bottom: 25px;
    align-items: center;
    align-content: center;
  }

  .tittle-section:hover {
    color: #ed120f;
    box-shadow: 0 0 30px rgba(237, 18, 15, 0.5);
  }

  .section-infoCliente {
    margin: 1rem 0;
  }

  .infocliente-section {
    background-color: #151c24;
    display: flex;
    justify-content: space-between;
    padding: 25px 30px;
    width: 100%;
    margin-top: -20px;
  }

  .tituloCliente-section {
    background-color: #151c24;
    display: flex;
    justify-content: space-between;
    padding: 25px 30px;
    width: 100%;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
    margin-top: 50px;
  }

  .infocliente-section2 {
    margin: 0 auto;
    background-color: #151c24;
    display: flex;
    justify-content: space-between;
    padding: 25px 30px;
    width: 100%;
    margin-bottom: 35px auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);

  }
  
  .card {
    background-color: #151c24;
    padding: 25px 30px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    margin-bottom: 50px;
  }

  .cubo,
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    width: 20%;
    height: 300px;
  }

  .cubo {
    margin-top: 300px;
    height: 60%;
    transform-style: preserve-3d;
    animation: rotar 8s linear infinite;
  }

  .cubo > span {
    position: absolute;
    width: 4em;
    height: 4em;
    border: 2px solid white;
    box-shadow: inset 0px 0px 15px 5px rgba(67, 195, 255, 0.2),
      0px 0px 40px 1px rgba(67, 195, 255, 0.15);
    border-radius: 4px;
  }

  .cubo > span:nth-child(1) {
    transform: rotateY(90deg) translateZ(2em);
  }

  .cubo > span:nth-child(2) {
    transform: rotateY(90deg) translateZ(-2em);
  }

  .cubo > span:nth-child(3) {
    transform: rotateY(90deg) translateZ(-2em);
  }

  .cubo > span:nth-child(4) {
    transform: rotateY(90deg) translateZ(2em);
  }

  .cubo > span:nth-child(5) {
    transform: translateZ(-2em);
  }

  .cubo > span:nth-child(6) {
    transform: translateZ(2em);
  }

  .loading {
    height: 40%;
  }

  @keyframes rotar {
    0% {
      transform: rotateY(0deg) rotateX(0deg);
    }
    50% {
      transform: rotateY(360deg) rotateX(360deg);
    }
    100% {
      transform: rotateY(0deg) rotateX(0deg);
    }
  }

  .loading h1,
  .loading p {
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 100;
    letter-spacing: 2px;
    font-size: 18px;
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

  .content {
    padding: 20px;
  }

  .content .description {
    color: rgba(255, 255, 255, 0.6);
    margin-top: 10px;
    font-size: 14px;
  }

  .position-txt-icons {
    margin: 10px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    color: #fff;
  }
  .txt-icons {
    display: flex;
    padding: auto;
    margin-top: 50px;
    justify-content: space-between;
  }

  .icon {
    font-size: 3rem;
    color: #fc741e;
    margin-left: 10px;
  }

  .icon:hover {
    color: #6d120f;
    cursor: pointer;
  }

  .material-symbols-outlined icon {
    font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 48;
  }

  .recuadros-estadisticas {
    background-color: #2d6469;
    padding: 13px 15px;
    width: 17%;
    border-radius: 25px;
    box-shadow: 0 0 20px rgba(45, 100, 105, 0.5);
  }

  .recuadros-estadisticas:hover {
    box-shadow: 0 0 20px rgba(252, 116, 30, 0.5);
    cursor: pointer;
  }
</style>
