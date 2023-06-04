<script lang="ts">
  import { bind } from "svelte/internal";
  import { onMount, onDestroy } from "svelte";
  import { Link, navigate } from "svelte-routing";
  import { buyingConcert } from "../stores/stores";
  import { user, admin } from "../stores/User";
  import { collection, onSnapshot, doc } from "firebase/firestore";
  import { db } from "../firebase";

  let isEmpy = false;

  //vamos a traer la base de Datos
  let conciertos = [];

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
      conciertos = promosionConcerts(conciertos);
      console.log(conciertos);
      if (conciertos.length === 0) {
        console.log("No hay conciertos en promoción");
        isEmpy = true;
      }
    },
    (error) => {
      console.log(error);
    }
  );
  //Vamos a dejar de que escuche los cambios
  onDestroy(() => {
    unsub();
  });

  //Vamos a crear Una función que retorne solo los conciertos que estan en promoción
  const promosionConcerts = (conciertos) => {
    return conciertos.filter((concierto) => concierto.enPromocion === "si");
  };

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

<body>
  <header>
    <div class="navbar">
      <h1>Promociones</h1>
    </div>
  </header>
  {#if isEmpy}
    <main>
      <div class="nopromociones-section">
        <h2>No hay conciertos en promoción, vuelve más tarde :D</h2>
      </div>
      <div class="nopromociones-section-txt">
        <p>Puedes ir a la sección de conciertos para ver nuevos conciertos</p>
      </div>
      <div class="nopromociones-section-img"> 
        <Link to="/conciertos"><img src="https://caracoltv.brightspotcdn.com/dims4/default/e0937f1/2147483647/strip/true/crop/1280x720+0+0/resize/1000x563!/quality/90/?url=http%3A%2F%2Fcaracol-brightspot.s3.amazonaws.com%2Fd9%2F62%2F792b923843dd8da3abdf484a4589%2Festereo-picnic.jfif" alt=""></Link> 
      </div>
    </main>
  {:else}
    {#each conciertos as concierto}
      <main>
        <div class="section-promociones">
          <div class="promociones-section">
            <img src={concierto.imagen} alt="ImagenConcierto" />
            <div class="promociones-txt">
              <p>
                <b>{concierto.diaConcierto}</b> a las {concierto.horaInicio}
              </p>
              <div class="promociones-name">
                <h5>{concierto.nombreConcierto}</h5>
                <p>by {concierto.nombreArtista}</p>
              </div>
              <p />
              <p>Tiempo restante:</p>
              <p>Espacio para dejar la hora</p>
              {#if concierto.enPromocion.trim() === "si"}
                <button
                  class="btn-1"
                  on:click={() => redireccionamiento(concierto)}
                  ><b>En promoción</b></button
                >
              {:else}
                <button
                  class="btn-1"
                  on:click={() => redireccionamiento(concierto)}
                  ><b>Ver mas</b></button
                >
              {/if}
            </div>
          </div>
        </div>
      </main>
    {/each}
  {/if}
</body>
<div style="height: 200px;" />

<style>
  body {
    background-color: #0b363f;
  }

  header {
    width: 100%;
    background: #020305;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    z-index: 1000;
    transition: 0.2s;
    margin-top: 0px;
  }

  header .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    list-style: none;
    text-align: center;
  }

  header .navbar h1 {
    color: #6d120f;
    text-align: center;
  }

  .section-promociones {
    margin: 1rem 0;
  }

  .promociones-section {
    margin: 0 auto;
    background-color: #151c24;
    display: flex;
    justify-content: space-between;
    padding: 25px 30px;
    width: 100%;
    margin-bottom: 35px auto;
    border-radius: 25px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }

  .nopromociones-section {
    color: #fc741e;
    background-color: #151c24;
    display: flex;
    justify-content: center;
    padding: 25px 30px;
    width: 100%;
    margin-top: 50px;
    margin-bottom: 35px auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }

  .nopromociones-section-txt{
    color: #fc741e;
    background-color: #151c24;
    display: flex;
    justify-content: center;
    padding: 25px 30px;
    width: 100%;
  }

  .nopromociones-section-img{
    color: #fc741e;
    display: flex;
    justify-content: center;
    padding: 25px 30px;
    width: 100%;
    margin-bottom: 35px auto;
    border-radius: 25px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  
  .nopromociones-section-img img {
    height: 70%;
    width: 70%;
  }

  .promociones-txt {
    width: 50%;
  }

  .promociones-section img {
    width: 500px;
    border-radius: 30px;
    box-shadow: 0 0 30px rgba(252, 116, 30, 0.5);
  }

  .promociones-txt h5 {
    color: #2d6469;
  }
  .promociones-txt p {
    font-size: 115%;
    color: #8d8d8d;
  }

  .promociones-name {
    margin: 0 auto;
    background-color: #6d120f;
    padding: 25px 30px;
    width: 100%;
    margin-bottom: 35px auto;
    border-radius: 25px;
    box-shadow: 0 0 20px rgba(252, 116, 30, 0.5);
  }

  .promociones-name h5 {
    color: #fff;
    font-size: 140%;
  }

  .promociones-name p {
    color: #fff;
    font-size: 130%;
  }

  .btn-1 {
    height: 2.4rem;
    width: 9.4rem;
    border-radius: 0.6rem;
    background: #0b363f;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.2s;
    box-shadow: 0 0.3rem 1rem rgba(0, 0, 0, 0.3);
    margin: 1rem 0;
    border-color: #0b363f;
  }

  .btn-1:hover {
    background: none;
    border: 0.2rem solid #0b363f;
  }
</style>
