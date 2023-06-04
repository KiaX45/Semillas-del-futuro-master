<script lang="ts">
  import { readable } from "svelte/store";
  import { bind } from "svelte/internal";
  import { onMount, onDestroy } from "svelte";
  import { Link, navigate } from "svelte-routing";
  import { buyingConcert } from "../../stores/stores";
  import { user, admin } from "../../stores/User";
  import type { concert } from "../../lib/Logic/concerts";

  let actualConcert: concert;
  let nombreConcierto: string = "";
  let imagen: string = "";
  let artista: string = "";
  let canciondestacada: string = "";
  let fechaconcierto: string = "";
  let horainicio: string = "";
  let horafin: string = "";
  let direccion: string = "";
  let general: number;
  let plata: number;
  let oro: number;
  let vip: number;

  let buying: boolean = false;

  onMount(() => {
    if (!$admin && !$user) {
      alert("No tienes permisos para acceder a esta página");
      navigate("/login", { replace: true });
    } else {
      buyingConcert.subscribe((value) => {
        actualConcert = value;
        console.log("mostramos el concierto Traido");
        console.log(actualConcert);
        //Poner los atributos a mostra

        if (actualConcert !== null) {
          nombreConcierto = actualConcert.nombreConcierto;
          console.log(nombreConcierto);
          imagen = actualConcert.imagen;
          artista = actualConcert.nombreArtista;
          canciondestacada = actualConcert.canciondestacada;
          fechaconcierto = actualConcert.diaConcierto;
          horainicio = actualConcert.horaInicio;
          horafin = actualConcert.horaFinalizacion;
          direccion = actualConcert.direccion;
          general = actualConcert.precioGeneral;
          plata = actualConcert.precioPlata;
          oro = actualConcert.precioOro;
          vip = actualConcert.precioVip;
        }
      });
    }
  });

  onDestroy(() => {
    if (!buying) {
      buyingConcert.set(null);
    }
  });

  const redireccionamiento = () => {
    if ($user || $admin) {
      buying = true;
      navigate(`/compraboletos`);
    } else {
      navigate("/login");
    }
  };
</script>

<div class="container-superior">
  <h1>{nombreConcierto}</h1>
</div>

<div class="container-principal">
  <div class="columna-izquierda">
    <img
      src={imagen}
      alt="Descripción de la imagen"
      class="imagen-columna-izquierda"
    />
  </div>
  <div class="columna-derecha">
    <!-- CARD DE ARTISTA -->
    <div class="card">
      <h2>ARTISTA</h2>
      <div class="linea" />
      <p>Nombre: {artista}</p>
      <p>Cancion destacada: {canciondestacada}</p>
    </div>
    <!-- CARD DE Horario -->
    <div class="card">
      <h2>HORARIO</h2>
      <div class="linea" />
      <p>Fecha: {fechaconcierto}</p>
      <p>Hora Inicio: {horainicio}</p>
      <p>Hora fin: {horafin}</p>
    </div>
    <!-- CARD DE Direccion -->
    <div class="card">
      <h2>DIRECCION</h2>
      <div class="linea" />
      <p>{direccion}</p>
    </div>
    <!-- CARD DE PRECIOS -->
    <div class="card">
      <h2>PRECIOS POR BOLETA</h2>
      <div class="linea" />
      <p>General: {general} | Plata: {plata}</p>
      <p>Oro: {oro} | VIP: {vip}</p>
    </div>
    <div class="boton-container">
      <button class="btn-1" on:click={redireccionamiento}> Comprar</button>
    </div>

    <div style="height: 200px;" />
  </div>
</div>

<style>
  .container-superior {
    background-color: #151c24;
    padding: 20px;
    text-align: center;
    color: #fc741e;
  }

  .container-principal {
    display: flex;
    flex-wrap: wrap;
  }

  .columna-izquierda {
    width: 70%;
    padding: 20px;
    color: #f0f0f0;
  }
  .imagen-columna-izquierda {
    padding-left: 100px;
    width: 80%;
    height: 80%;
  }
  .columna-derecha {
    width: 30%;
    padding-right: 200px;
    padding-top: 20px;
    padding-left: 0;
    color: #f0f0f0;
  }

  /*ESTILOS PARA LAS CARD DE INFORMACION*/
  .card {
    background-color: #151c24;
    border-radius: 10px;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
    margin-bottom: 20px;
    padding: 20px;
    width: 100%;
  }

  .card h2 {
    font-size: 24px;
    font-weight: bold;
    line-height: 30px;
    margin-bottom: 10px;
    color: #fc741e;
    text-align: center;
  }

  .card p {
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 0;
    color: #CCCCCC;
    text-align: center;
  }

  .linea {
    border-bottom: 1px solid #cccccc;
    margin-bottom: 10px;
  }

  /*ESTILOS PARA EL BOTON*/

.btn-1 {
  height: 140%;
    width: 8.8rem;
    border-radius: 0.8rem;
    background: #fc741e;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.2s;
    box-shadow: 0 0.3rem 1rem rgba(0, 0, 0, 0.3);

    border-color: #fc741e;
  }

.btn-1:hover {
  background: none;
    border: .2rem solid #fc741e;
    
}

  .boton-container {
    display: flex;
    justify-content: center;
    height: 50px;

    padding: 10px;
  }
</style>
