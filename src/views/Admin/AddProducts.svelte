<script lang="ts">
  import { bind } from "svelte/internal";
  import { onMount, onDestroy } from "svelte";
  import { Link, navigate } from "svelte-routing";
  import { user, admin } from "../../stores/User";
  import {
    addDoc,
    collection,
    onSnapshot,
    doc,
    deleteDoc,
    updateDoc,
  } from "firebase/firestore";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { storage } from "../../firebase";
  import { db } from "../../firebase";
  import type { concert } from "../../lib/Logic/concerts";
  import { v4 } from "uuid";

  //Se crea un objeto que guarda los datos del concierto
  let concierto: concert = {
    nombreConcierto: "",
    nombreArtista: "",
    canciondestacada: "",
    descripcion: "",
    imagen:
      "https://firebasestorage.googleapis.com/v0/b/takiy-5800d.appspot.com/o/Im%C3%A1genes%20proyecto%2Fnot-found-icon-4.jpg?alt=media&token=22cdf610-8502-4098-ab27-24b7adb99f8b",
    direccion: "",
    especificaciondireccion: "",
    precioVip: 0,
    precioPlata: 0,
    precioGeneral: 0,
    precioOro: 0,
    boletosDisponibles: 0,
    diaConcierto: "",
    diaInicio: "",
    diaFinalizacion: "",
    horaInicio: "",
    horaFinalizacion: "",
    boletosvipParaVender: 0,
    boletosPlataParaVender: 0,
    boletosGeneralParaVender: 0,
    boletosOroParaVender: 0,
    enPromocion: "No",
    descuento: 0,
    isSelected: false,
  };

  let selectedImage: File | undefined;
  let editStatus: boolean = false;
  let currentid: string = "";

  //Funciones para controlar el combobox
  const handleChange = (event) => {
    concierto.enPromocion = event.target.value; // Actualiza la opción seleccionada
    if (concierto.enPromocion !== "si") {
      concierto.descuento = 0; // Reinicia el valor del porcentaje si la opción no es "Sí"
    }
  };

  //Funciones para controlar el envio de imagenes
  function handleImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      selectedImage = input.files[0];
      console.log(selectedImage);
    }
  }

  let resultImage: string | undefined;

  async function uploadFile(file) {
    const storageRef = ref(storage, `Conciertos/${v4()}`);
    await uploadBytes(storageRef, file);
    resultImage = await getDownloadURL(storageRef);
    console.log(resultImage);
    handleSubmit();
  }

  //Fin de funciones que controlan el envio de imagenes

  const submitForm = () => {
    if (!concierto.nombreConcierto.trim()) {
      alert("El campo nombre concierto esta vacio");
      return;
    }
    if (!concierto.nombreArtista.trim()) {
      alert("El campo nombre artista esta vacio");
      return;
    }
    if (!concierto.canciondestacada.trim()) {
      alert("El campo cancion destacada esta vacio");
      return;
    }
    if (!concierto.descripcion.trim()) {
      alert("El campo descripcion esta vacio");
      return;
    }
    if (!concierto.direccion.trim()) {
      alert("El campo dirección esta vacio");
      return;
    }
    if (!concierto.diaConcierto.trim()) {
      alert("El campo fecha del concierto esta vacio");
      return;
    }
    if (isNaN(concierto.precioGeneral)) {
      alert("El campo precio general no es un número");
      return;
    } else if (concierto.precioGeneral < 0 || concierto.precioGeneral < 30000) {
      alert("Los valores de boleta no pueden ser negativos o menores a $30000");
      return;
    }
    if (isNaN(concierto.precioPlata)) {
      alert("El campo precio plata no es un número");
      return;
    } else if (concierto.precioPlata < 0 || concierto.precioPlata < 30000) {
      alert("Los valores de boleta no pueden ser negativos o menores a $30000");
      return;
    }
    if (isNaN(concierto.precioOro)) {
      alert("El campo precio oro no es un número");
      return;
    } else if (concierto.precioOro < 0 || concierto.precioOro < 30000) {
      alert("Los valores de boleta no pueden ser negativos o menores a $30000");
      return;
    }
    if (isNaN(concierto.precioVip)) {
      alert("El campo precio VIP no es un número");
      return;
    } else if (concierto.precioOro < 0 || concierto.precioOro < 30000) {
      alert("Los valores de boleta no pueden ser negativos o menores a $30000");
      return;
    }
    if (isNaN(concierto.boletosDisponibles)) {
      alert("El campo precio general no es un número");
      return;
    } else if (concierto.boletosDisponibles < 0) {
      alert(
        "El numero de boletas para vender no pueden ser negativos o menores a 0"
      );
      concierto.boletosDisponibles = 0;
      return;
    }
    if (!concierto.horaInicio.trim()) {
      alert("El campo hora de inicio esta vacio");
      return;
    }
    if (!concierto.horaFinalizacion.trim()) {
      alert("El campo hora de finalizacion esta vacio");
      return;
    }

    if (
      concierto.boletosGeneralParaVender < 0 ||
      concierto.boletosOroParaVender < 0 ||
      concierto.boletosPlataParaVender < 0 ||
      concierto.boletosvipParaVender < 0
    ) {
      alert(
        "El numero de boletas para vender no pueden ser negativos o menores a 0"
      );
      return;
    }

    if (concierto.descuento <= 0 && concierto.enPromocion === "si") {
      alert("El descuento no puede ser menor o igual a 0");
      return;
    }
    // if(!concierto.isSelected){
    //   alert("Se debe aceptar terminos y condiciones antes de coontinuar");
    //   return;
    // }
    if (selectedImage) {
      uploadFile(selectedImage);
    } else {
      handleSubmit();
    }
  };

  const createConcert = async () => {
    try {
      await addDoc(collection(db, "Conciertos"), concierto);
      console.log(concierto);
    } catch (error) {
      console.log(error);
    }
  };

  const updateConcert = async () => {
    try {
      console.log("Editando concierto");
      console.log(concierto.imagen);
      await updateDoc(doc(db, "Conciertos", currentid), concierto);
      editStatus = false;
      currentid = "";
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    // Aquí iría el código para guardar los datos del objeto trae en la base de datos
    try {
      if (resultImage !== undefined) {
        concierto.imagen = resultImage;
      }
      concierto.boletosDisponibles = calculateNumberOfTickets();
      if (!editStatus) {
        await createConcert();
      } else {
        await updateConcert();
      }
    } catch (error) {
      console.log(error);
    }

    resetForm();
  };

  const calculateNumberOfTickets = () => {
    let totalTickets =
      concierto.boletosGeneralParaVender +
      concierto.boletosOroParaVender +
      concierto.boletosPlataParaVender +
      concierto.boletosvipParaVender;
    return totalTickets;
  };

  onMount(() => {
    if (!$admin) {
      alert("No tienes permisos para acceder a esta página");
      navigate("/login", { replace: true });
    }
  });

  //vamos a traer la base de Datos

  let conciertos = [];

  const unsub = onSnapshot(
    collection(db, "Conciertos"),
    (querySnapshot) => {
      conciertos = querySnapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id }; //con esto decimos que por cada recorrido trasformamos los datos en un objeto
      });

      conciertos = conciertos.filter((concierto) => {
        return concierto.isSelected === false;
      });
      console.log(conciertos);
    },
    (error) => {
      console.log(error);
    }
  );
  //Vamos a dejar de que escuche los cambios
  onDestroy(() => {
    unsub();
  });

  //vamos a crear una funcion para eliminar un concierto
  const deleteConcert = async (conciertolleno) => {
    try {
      currentid = conciertolleno.id;
      //await deleteDoc(doc(db, "Conciertos", id));
      conciertolleno.isSelected = true;
      await updateDoc(doc(db, "Conciertos", currentid), conciertolleno);
      console.log("Concierto eliminado");

      currentid = "";
    } catch (error) {
      console.log(error);
    }
  };

  //vamos a crear una funcion que permita editar un concierto
  const editTask = (task) => {
    concierto.boletosDisponibles = task.boletosDisponibles;
    concierto.descripcion = task.descripcion;
    concierto.diaConcierto = task.diaConcierto;
    concierto.diaFinalizacion = task.diaFinalizacion;
    concierto.diaInicio = task.diaInicio;
    concierto.direccion = task.direccion;
    concierto.enPromocion = task.enPromocion;
    concierto.especificaciondireccion = task.especificaciondireccion;
    concierto.horaFinalizacion = task.horaFinalizacion;
    concierto.horaInicio = task.horaInicio;
    concierto.imagen = task.imagen;
    concierto.nombreArtista = task.nombreArtista;
    concierto.nombreConcierto = task.nombreConcierto;
    concierto.precioGeneral = task.precioGeneral;
    concierto.precioOro = task.precioOro;
    concierto.precioPlata = task.precioPlata;
    concierto.precioVip = task.precioVip;
    concierto.boletosGeneralParaVender = task.boletosGeneralParaVender;
    concierto.boletosOroParaVender = task.boletosOroParaVender;
    concierto.boletosPlataParaVender = task.boletosPlataParaVender;
    concierto.boletosvipParaVender = task.boletosvipParaVender;
    concierto.canciondestacada = task.canciondestacada;
    concierto.descuento = task.descuento;
    editStatus = true;
    currentid = task.id;
  };

  const resetForm = () => {
    concierto = {
      nombreConcierto: "",
      nombreArtista: "",
      canciondestacada: "",
      descripcion: "",
      imagen:
        "https://firebasestorage.googleapis.com/v0/b/takiy-5800d.appspot.com/o/Im%C3%A1genes%20proyecto%2Fnot-found-icon-4.jpg?alt=media&token=22cdf610-8502-4098-ab27-24b7adb99f8b",
      direccion: "",
      especificaciondireccion: "",
      precioVip: 0,
      precioPlata: 0,
      precioGeneral: 0,
      precioOro: 0,
      boletosDisponibles: 0,
      diaConcierto: "",
      diaInicio: "",
      diaFinalizacion: "",
      horaInicio: "",
      horaFinalizacion: "",
      boletosvipParaVender: 0,
      boletosPlataParaVender: 0,
      boletosGeneralParaVender: 0,
      boletosOroParaVender: 0,
      enPromocion: "No",
      descuento: 0,
      isSelected: false,
    };
    //resultImage = "";
    //selectedImage = null;
  };
</script>

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <link
    rel="stylesheet"
    href="https://necolas.github.io/normalize.css/8.0.1/normalize.css"
  />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
    rel="stylesheet"
  />
</head>
<body>
  <!-- <main> -->
  <div class="left-column">
    <form action="" class="formulario" id="formulario">
      <!-- Grupo: Nombre Concierto -->
      <div class="formulario__grupo">
        <label class="formulario__label">Nombre del Concierto</label>
        <div class="formulario__grupo-input">
          <input
            type="text"
            class="formulario__input"
            placeholder="Nombre del Concierto"
            bind:value={concierto.nombreConcierto}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>
      <!-- Grupo: Nombre Artista -->
      <div class="formulario__grupo">
        <label class="formulario__label">Nombre del Artista</label>
        <div class="formulario__grupo-input">
          <input
            type="text"
            class="formulario__input"
            placeholder="Nombre del Artista"
            bind:value={concierto.nombreArtista}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>
      <!-- Grupo: Cancion Destacada -->
      <div class="formulario__grupo">
        <label class="formulario__label">Canción Destacada</label>
        <div class="formulario__grupo-input">
          <input
            type="text"
            class="formulario__input"
            placeholder="Cancion Destacada"
            bind:value={concierto.canciondestacada}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>
      <!-- Grupo: Descripcion -->
      <div class="formulario__grupo">
        <label class="formulario__label">Descripcion</label>
        <div class="formulario__grupo-input">
          <input
            type="text"
            class="formulario__input"
            placeholder="Descripcion del Concierto"
            bind:value={concierto.descripcion}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>
      <!-- Grupo: Direccion -->
      <div class="formulario__grupo">
        <label class="formulario__label">Direccion/Localizacion</label>
        <div class="formulario__grupo-input">
          <input
            type="text"
            class="formulario__input"
            placeholder="Direccion / Localizacion"
            bind:value={concierto.direccion}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>

      <!-- Grupo: Fecha -->
      <div class="formulario__grupo">
        <label class="formulario__label">Fecha del Concierto</label>
        <div class="formulario__grupo-input">
          <input
            type="date"
            class="formulario__input"
            placeholder="Fecha del Concierto"
            bind:value={concierto.diaConcierto}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>
      <!-- Grupo: Precio General-->
      <div class="formulario__grupo">
        <label class="formulario__label">Precio General</label>
        <div class="formulario__grupo-input">
          <input
            type="number"
            class="formulario__input"
            placeholder="Precio General"
            bind:value={concierto.precioGeneral}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>

      <div class="formulario__grupo">
        <label class="formulario__label"> Numero de Boletos General</label>
        <div class="formulario__grupo-input">
          <input
            type="number"
            class="formulario__input"
            placeholder="Precio General"
            bind:value={concierto.boletosGeneralParaVender}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>

      <!-- Grupo: Precio Plata-->
      <div class="formulario__grupo">
        <label class="formulario__label">Precio Plata</label>
        <div class="formulario__grupo-input">
          <input
            type="number"
            class="formulario__input"
            placeholder="Precio Plata"
            bind:value={concierto.precioPlata}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>

      <div class="formulario__grupo">
        <label class="formulario__label"> Numero de Boletos Plata</label>
        <div class="formulario__grupo-input">
          <input
            type="number"
            class="formulario__input"
            placeholder="Precio General"
            bind:value={concierto.boletosPlataParaVender}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>

      <!-- Grupo: Precio Oro-->
      <div class="formulario__grupo">
        <label class="formulario__label">Precio Oro</label>
        <div class="formulario__grupo-input">
          <input
            type="number"
            class="formulario__input"
            placeholder="Precio Oro"
            bind:value={concierto.precioOro}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>

      <div class="formulario__grupo">
        <label class="formulario__label"> Numero de Boletos Oro</label>
        <div class="formulario__grupo-input">
          <input
            type="number"
            class="formulario__input"
            placeholder="Precio General"
            bind:value={concierto.boletosOroParaVender}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>

      <!-- Grupo: Precio VIP-->
      <div class="formulario__grupo">
        <label class="formulario__label">Precio VIP</label>
        <div class="formulario__grupo-input">
          <input
            type="number"
            class="formulario__input"
            placeholder="Precio VIP"
            bind:value={concierto.precioVip}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>

      <div class="formulario__grupo">
        <label class="formulario__label"> Numero de Boletos VIP</label>
        <div class="formulario__grupo-input">
          <input
            type="number"
            class="formulario__input"
            placeholder="Precio General"
            bind:value={concierto.boletosvipParaVender}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>

      <!-- Grupo: Hora de Inicio-->
      <div class="formulario__grupo">
        <label class="formulario__label">Hora de Inicio</label>
        <div class="formulario__grupo-input">
          <input
            type="time"
            class="formulario__input"
            placeholder="Hora de Inicio"
            bind:value={concierto.horaInicio}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>

      <!-- Grupo: Hora de Finalizacion-->
      <div class="formulario__grupo">
        <label class="formulario__label">Hora de Finalizacion(Aproximada)</label
        >
        <div class="formulario__grupo-input">
          <input
            type="time"
            class="formulario__input"
            placeholder="Hora de Finalizacion(Aproximada)"
            bind:value={concierto.horaFinalizacion}
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>

      <!-- Grupo: Hora de Finalizacion-->
      <div class="formulario__grupo">
        <label class="formulario__label">Imagen Representativa</label>
        <div class="formulario__grupo-input">
          <input
            type="file"
            on:change|preventDefault={handleImageSelect}
            accept="image/*"
          />
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>

      <!-- Grupo: Promociones-->
      <div class="formulario__grupo">
        <label class="formulario__label">Esta en promoción?</label>
        <div class="formulario__grupo-input">
          <select bind:value={concierto.enPromocion} on:change={handleChange}>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
          <i class="formulario__validacion-estado fas fa-times-circle" />
        </div>
      </div>

      {#if concierto.enPromocion == "si"}
        <div class="formulario__grupo">
          <label class="formulario__label">Descuento(en porcentaje)</label>
          <div class="formulario__grupo-input">
            <input
              type="number"
              class="formulario__input"
              placeholder="Descuento Aproximado"
              bind:value={concierto.descuento}
            />
            <i class="formulario__validacion-estado fas fa-times-circle" />
          </div>
        </div>
      {/if}

      <div class="formulario__mensaje" id="formulario__mensaje">
        <p>
          <i class="fas fa-exclamation-triangle" /> <b>Error:</b> Por favor rellena
          el formulario correctamente.
        </p>
      </div>

      <div class="formulario__grupo formulario__grupo-btn-enviar">
        <button
          type="submit"
          class="formulario__btn"
          on:click|preventDefault={submitForm}>Continuar</button
        >
      </div>
    </form>
  </div>

  <!-- </main> -->
  <div class="right-column">
    {#each conciertos as concierto}
      <div class="section-concierto">
        <div class="concierto-section">
          <div class="concierto-txt">
            <h5>{concierto.nombreConcierto}</h5>
            <p style="color:#fc741e">{concierto.nombreArtista}</p>
            <p>{concierto.descripcion}</p>
            <p>Boletos disponibles: {concierto.boletosDisponibles}</p>
            <p>Fecha: {concierto.diaConcierto}</p>

            <button class="btn-1" on:click={() => deleteConcert(concierto)}>
              <b>ELIMINAR</b>
            </button>
            <button class="btn-1" on:click={() => editTask(concierto)}>
              <b>EDITAR</b>
            </button>
          </div>
          <img
            class="services-img"
            src={concierto.imagen}
            alt="ImagenConcierto"
          />
        </div>
      </div>
    {/each}
  </div>
</body>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;1,200;1,300;1,400&display=swap");

  * {
    box-sizing: border-box;
  }

  body {
    font-family: "Roboto", sans-serif;
    background: #2d6469;
    height: 100%;
    padding-top: 50px;
    padding-bottom: 300px;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .left-column {
    padding: 30px;
  }

  .right-column {
    padding: 30px;
  }

  main {
    max-width: 100%;
    width: 100%;
    height: 100%;
    margin: 0;
    margin-top: 0;
    padding: 160px;
  }

  .formulario {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    height: 100%;
    margin-top: 0;
  }

  .formulario__label {
    display: block;
    font-weight: 700;
    padding: 10px;
    cursor: pointer;
  }

  .formulario__grupo-input {
    position: relative;
  }

  .formulario__input {
    width: 100%;
    background: #fff;
    border: 3px solid transparent;
    border-radius: 3px;
    height: 45px;
    line-height: 45px;
    padding: 0 40px 0 10px;
    transition: 0.3s ease all;
  }

  .formulario__input:focus {
    border: 3px solid #0075ff;
    outline: none;
    box-shadow: 3px 0px 30px rgba(163, 163, 163, 0.4);
  }

  .formulario__validacion-estado {
    position: absolute;
    right: 10px;
    bottom: 15px;
    z-index: 100;
    font-size: 16px;
    opacity: 0;
  }

  .formulario__checkbox {
    margin-right: 10px;
  }

  .formulario__mensaje,
  .formulario__grupo-btn-enviar {
    grid-column: span 2;
  }

  .formulario__mensaje {
    height: 45px;
    line-height: 45px;
    background: #f66060;
    padding: 0 15px;
    border-radius: 3px;
    display: none;
  }

  .formulario__mensaje p {
    margin: 0;
  }

  .formulario__grupo-btn-enviar {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .formulario__btn {
    height: 45px;
    line-height: 45px;
    width: 30%;
    background: #000;
    color: #fff;
    font-weight: bold;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    transition: 0.1s ease all;
  }

  .formulario__btn:hover {
    box-shadow: 3px 0px 30px rgba(163, 163, 163, 1);
  }

  .section-concierto {
    text-align: center;
    margin: 1rem 0;
  }

  .concierto-section {
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

  .concierto-txt {
    width: 50%;
  }

  .concierto-section img {
    width: 300px;
    border-radius: 30px;
  }

  .concierto-txt h5 {
    color: #2d6469;
  }
  .concierto-artista-txt {
    color: #184d51;
  }
  .concierto-txt p {
    color: #8d8d8d;
  }

  .btn-1 {
    height: 1.8rem;
    width: 7.2rem;
    border-radius: 1rem;
    background: #fc741e;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.2s;
    box-shadow: 0 0.3rem 1rem rgba(0, 0, 0, 0.3);
    margin: 1rem 0;
    border-color: #fc741e;
  }

  .btn-1:hover {
    background: none;
    border: 0.2rem solid #fc741e;
  }

  /* ----- -----  Mediaqueries ----- ----- */
  @media screen and (max-width: 800px) {
    .formulario {
      grid-template-columns: 1fr;
    }

    .formulario__mensaje,
    .formulario__grupo-btn-enviar {
      grid-column: 1;
    }

    .formulario__btn {
      width: 100%;
    }
  }
</style>
