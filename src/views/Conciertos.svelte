<script>
  import { bind } from "svelte/internal";
  import { onMount, onDestroy } from "svelte";
  import { Link, navigate } from "svelte-routing";
  import { buyingConcert } from "../stores/stores";
  import { user, admin } from "../stores/User";
  import { collection, onSnapshot, doc } from "firebase/firestore";
  import { db } from "../firebase";

  //vamos a traer la base de Datos
  let conciertos = [];
  let conciertosFiltrados = [];

  const unsub = onSnapshot(
    collection(db, "Conciertos"),
    (querySnapshot) => {
      conciertos = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }; //con esto decimos que por cada recorrido trasformamos los datos en un objeto
      });
      console.log(conciertos);
      conciertos = conciertos.filter((concierto) => {
        return concierto.isSelected === false;
      });
      conciertos = ordenarConciertosPorFecha(conciertos);
      conciertosFiltrados = conciertos;
    },
    (error) => {
      console.log(error);
    }
  );
  //Vamos a dejar de que escuche los cambios
  onDestroy(() => {
    unsub();
  });

  //Vamos a crear una función para ordenar los conciertos en base a la fecha
  function ordenarConciertosPorFecha(conciertos) {
    return conciertos.sort((a, b) => {
      const fechaA = new Date(a.diaConcierto);
      const fechaB = new Date(b.diaConcierto);
      return fechaA - fechaB;
    });
  }

  //vamos a crear un filtro por nombre para los conciertos
  let nombreConcierto = "";
  let nombreArtista = "";
  conciertosFiltrados = conciertos;

  $: {
    if (nombreConcierto !== "") {
      conciertos = conciertosFiltrados.filter((concierto) =>
        concierto.nombreConcierto
          .toLowerCase()
          .includes(nombreConcierto.toLowerCase())
      );
      if (conciertos.length == 0) {
        conciertos = conciertosFiltrados.filter((concierto) =>
          concierto.nombreArtista
            .toLowerCase()
            .includes(nombreConcierto.toLowerCase())
        );
      }
    } else {
      conciertos = ordenarConciertosPorFecha(conciertosFiltrados);
    }
  }

  //Funciones para el redireccionamiento a la compra de entradas
  const redireccionamiento = (concierto) => {
    if ($user || $admin) {
      console.log(concierto);
      buyingConcert.set(concierto);
      navigate(`/previsualizacion`);
    } else {
      navigate("/login");
    }
  };
</script>

<h1 class="labelConciertos">Conciertos</h1>

<span id="countdown" />

<div class="inputBuscarConciertos">
  <input
    type="text"
    placeholder="¿Buscas un concierto?"
    bind:value={nombreConcierto}
  />
</div>

<div class="contenedorColumnas">
  <div class="columna" />

  <br />

  <!--<div class="columnaConciertos">-->
  <!--Primero-->
  {#each conciertos as concierto}
    <div class="card-container">
      <a href="/" class="hero-image-container">
        <img class="hero-image" src={concierto.imagen} alt="ImagenConcierto" />
      </a>
      <main class="main-content">
        <h1><a href="#">{concierto.nombreConcierto}</a></h1>
        <p>Artista: {concierto.nombreArtista}</p>
        <p>{concierto.diaConcierto}</p>
        <p>¡Proximamente!</p>

        <br />

        <div class="flex-row">
          <button class="botonSaberMas" on:click={() => redireccionamiento(concierto)}> Quiero saber mas </button>
          <!--<p>¿Desea editar este concierto?</p>-->
        </div>
      </main>
    </div>
  {/each}
  
</div>
<div style="height: 150px;"/>



<!--</div>-->

<!--{#each conciertos as concierto}
  <div
    style="width: 25% ; background-color: antiquewhite; margin-bottom: 100px; margin-right: 25px; display: inline-block;"
  >
    <div style="border: 3px solid black; margin-bottom: 20px; padding: 20px;">
      <h5>{concierto.nombreConcierto}</h5>
      <p>{concierto.nombreArtista}</p>
      <p>{concierto.diaConcierto}</p>
      <img
        src={concierto.imagen}
        alt="ImagenConcierto"
        style="width: 300px; height: 200px;"
      />
      {#if concierto.enPromocion == true}
        <button on:click={() => redireccionamiento(concierto)}
          >En promoción</button
        >
      {:else}
        <button on:click={() => redireccionamiento(concierto)}>Ver mas</button>
      {/if}
    </div>
  </div>
{/each}-->

<style>
  /* 
Fonts
*/

  @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap");

  /*
Variables
*/

  :root {
    font-size: 15px;

    /* Primary */
    --var-soft-blue: hsl(215, 51%, 70%);
    --var-cyan: hsl(178, 100%, 50%);
    /* Neutral */
    --var-main-darkest: hsl(217, 54%, 11%);
    --var-card-dark: hsl(216, 50%, 16%);
    --var-line-dark: hsl(215, 32%, 27%);
    --var-lightest: white;

    /* Fonts */

    --var-heading: normal normal 600 1.5em/1.6em "Outfit", sans-serif;

    --var-small-heading: normal normal 400 1em/1em "Outfit", sans-serif;

    --var-para: normal normal 300 1em/1.55em "Outfit", sans-serif;
  }

  /* 
Setup
*/

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    margin: 0;
  }

  img {
    width: 100%;
    border-radius: 15px;
    display: block;
  }

  a {
    color: inherit;
  }

  /*

Font Styling

*/

  h1 {
    font: var(--var-heading);
    color: var(--var-lightest);
    padding: 1.2em 0;
  }

  p {
    font: var(--var-para);
    color: var(--var-soft-blue);
  }

  /* 
Classes
*/

  /* LAYOUT */
  .labelConciertos {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .inputBuscarConciertos {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  input[type="text"] {
    background-color: white;
    background-position: 10px 10px;
    background-repeat: no-repeat;
    border-radius: 8px;
    width: 20%;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .botonSaberMas {
    background-color: rgb(105, 167, 220);
    -webkit-transition-duration: 0.4s;
    transition-duration: 0.4s;
    border-radius: 6px;
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .botonSaberMas:hover {
    background-color: rgb(8, 168, 221);
    color: black;
  }

  /*.botonEliminar {
    background-color: rgb(213, 113, 113);
    -webkit-transition-duration: 0.4s;
    transition-duration: 0.4s;
    border-radius: 6px;
    align-items: center;
  }*/

  /*.botonEliminar:hover {
    background-color: rgb(215, 15, 15);
    color: black;
  }*/

  .contenedorColumnas {
    display: flex;
    align-items: left;
  }

  .columna {
    display: flex;
    align-items: center;
    
    /*margin: 0 10px;*/
  }

  .contador {
    background-color: antiquewhite;
  }

  /*
  .columnaConciertos {
    flex: 1;
    margin: 0 10px;
    height: 700px;
    overflow-y: auto;
    align-items: center;
  }*/

  .card-container {
    width: 600px;
    max-width: 50%;
    margin: 5em auto;
    background-color: var(--var-card-dark);
    /*border-radius: 15px;*/
    margin-bottom: 1rem;
    padding: 2rem;
    /*overflow-y: auto;
    flex-direction: column;
    align-items: stretch;*/
  }


  div.flex-row {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  a.hero-image-container {
    position: relative;
    display: block;
  }

  /* Details */

  .hero-image-container::after {
    content: "";
    background-image: url("https://i.postimg.cc/9MtT4GZY/view.png");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 5rem;
    background-color: hsla(178, 100%, 50%, 0.3);
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    z-index: 2;
    opacity: 0;
    transition: opacity 0.3s ease-out;
  }

  .hero-image-container:hover::after {
    opacity: 1;
  }
</style>