<script lang="ts">
  import {
    addDoc,
    collection,
    onSnapshot,
    doc,
    deleteDoc,
    updateDoc,
  } from "firebase/firestore";
  import { bind } from "svelte/internal";
  import { onMount, onDestroy } from "svelte";
  import { Link, navigate } from "svelte-routing";
  import { user, admin } from "../../stores/User";
  import { db } from "../../firebase";
  import type { money } from "../../lib/Logic/Buying";
  import { buyingConcert } from "../../stores/stores";
  import type { concert } from "../../lib/Logic/concerts";
  import { parse } from "date-fns";
  import * as emailjs from "emailjs-com";

  //lets create an object to store the concert data
  let receipt: money = {
    uidUsuario: "",
    idCOncierto: "",
    boletosOroCompados: 0,
    boletosPlataComprados: 0,
    boletosVipComprados: 0,
    boletosGeneralComprados: 0,
    precioTotal: 0,
    descuentoAplicado: 0,
    metododePago: "",
  };

  //bring the concer to be buy

  let actualConcert: concert;
  let nombreConcierto: string = "";
  let numeroBoletas: number = 0;
  let nombreArtista: string = "";
  let precioGeneral: number;
  let precioPlata: number;
  let precioOro: number;
  let precioVip: number;
  let imagenConcierto: string = "";

  //Variables compra boletos
  let maxOro: number = 0;
  let maxPlata: number = 0;
  let maxVip: number = 0;
  let maxGeneral: number = 0;
  let descuentoAplicado: number = 0;

  onMount(() => {
    if (!$admin && !$user) {
      //alert("No tienes permisos para acceder a esta página");
      navigate("/login", { replace: true });
    } else {
      buyingConcert.subscribe((value) => {
        actualConcert = value;
        console.log("mostramos el concierto Traido");
        console.log(actualConcert);
        //Poner los atributos a mostra

        if (actualConcert !== null) {
          numeroBoletas = actualConcert.boletosDisponibles;
          nombreArtista = actualConcert.nombreArtista;
          nombreConcierto = actualConcert.nombreConcierto;
          descuentoAplicado = actualConcert.descuento;
          maxGeneral = actualConcert.boletosGeneralParaVender;
          maxOro = actualConcert.boletosOroParaVender;
          maxPlata = actualConcert.boletosPlataParaVender;
          maxVip = actualConcert.boletosvipParaVender;
          precioGeneral = actualConcert.precioGeneral;
          precioPlata = actualConcert.precioPlata;
          precioOro = actualConcert.precioOro;
          precioVip = actualConcert.precioVip;
          imagenConcierto = actualConcert.imagen;
          console.log(nombreConcierto);
          console.log(descuentoAplicado);
        }
      });

      //Compropar si la fecha del concierto es la actual
      if (actualConcert !== null) {
        if (esDiaActual(actualConcert.diaConcierto)) {
          if (!isavailable()) {
            alert("El concierto no esta disponible para comprar boletos");
            navigate("/conciertos", { replace: true });
          }
        } else {
          if (!beforeOrAfter(actualConcert.diaConcierto)) {
            alert("El concierto no esta disponible para comprar boletos");
            navigate("/conciertos", { replace: true });
          }
        }
      }
    }
  });

  const reload = () => {
    buyingConcert.subscribe((value) => {
      actualConcert = value;
      console.log("mostramos el concierto Traido");
      console.log(actualConcert);
      //Poner los atributos a mostra

      if (actualConcert !== null) {
        numeroBoletas = actualConcert.boletosDisponibles;
        nombreArtista = actualConcert.nombreArtista;
        nombreConcierto = actualConcert.nombreConcierto;
        descuentoAplicado = actualConcert.descuento;
        maxGeneral = actualConcert.boletosGeneralParaVender;
        maxOro = actualConcert.boletosOroParaVender;
        maxPlata = actualConcert.boletosPlataParaVender;
        maxVip = actualConcert.boletosvipParaVender;
        console.log(nombreConcierto);
        console.log(descuentoAplicado);
      }
    });
    resetValues();
    //window.location.reload();
  };

  const resetValues = () => {
    checkbox1Checked = false;
    checkbox2Checked = false;
    checkbox3Checked = false;
    check1abialable = true;
    check2abialable = true;
    check3abialable = true;

    boletosOro = 0;
    checkOro = false;
    boletosPlata = 0;
    checkPlata = false;
    boletosVip = 0;
    checkVip = false;
    boletosGeneral = 0;
    checkGeneral = false;
    precioTotal = 0;

    metodoFinalPago = "";
    nequi = false;
    nequiAbailable = true;
    pse = false;
    pseAbailable = true;
    tarjeta = false;
    tarjetaAbailable = true;

    fullname = "";
    emailform = "";
    phone = "";
    affair = "";
    message = "";
    isVerifying = false;
  };

  //comprobar si el dia dehoy es antes o despues del dia del concierto
  const beforeOrAfter = (fechaString: string): boolean => {
    const fechaUsuario = parse(fechaString, "yyyy-MM-dd", new Date());
    const fechaActual = new Date();

    return fechaUsuario > fechaActual;
  };

  function esDiaActual(fechaString: string): boolean {
    const fechaUsuario = parse(fechaString, "yyyy-MM-dd", new Date());
    const fechaActual = new Date();

    return (
      fechaUsuario.getFullYear() === fechaActual.getFullYear() &&
      fechaUsuario.getMonth() === fechaActual.getMonth() &&
      fechaUsuario.getDate() === fechaActual.getDate()
    );
  }

  const isavailable = (): boolean => {
    let horaFinal = getLastHourOportunity(actualConcert.horaInicio);
    const [hora, minutos] = horaFinal.split(":").map(Number);
    let horaUltima = hora;
    let minutosFinal = minutos;

    //obten la hora actual de mi computador
    const fechaActual = new Date();
    const horaActual = fechaActual.getHours();
    const minutosActual = fechaActual.getMinutes();

    if (horaActual < horaUltima) {
      return true;
    }

    if (horaActual > horaUltima) {
      return false;
    }

    if (horaActual === horaUltima) {
      if (minutosActual < minutosFinal) {
        return true;
      } else {
        return false;
      }
    }
  };

  const getLastHourOportunity = (horaActual: string): string => {
    const [hora, minutos] = horaActual.split(":").map(Number);

    let nuevaHora = hora;
    let nuevosMinutos = minutos - 30;

    if (minutos < 0) {
      nuevaHora = hora - 1;
      let nM = 60;
      nuevosMinutos = nM + minutos;
    }

    let horaFinal = `${nuevaHora}:${nuevosMinutos}`;

    return horaFinal;
  };

  onDestroy(() => {
    buyingConcert.set(null);
  });

  //Segunda parte cambio de imagenes
  let checkbox1Checked: boolean = false;
  let checkbox2Checked: boolean = false;
  let checkbox3Checked: boolean = false;
  let checkbox4Checked: boolean = false;
  let check1abialable: boolean = true;
  let check2abialable: boolean = true;
  let check3abialable: boolean = true;
  let check4abailable: boolean = true;
  let img1: string =
    "https://img.freepik.com/fotos-premium/vista-interior-palco-real-teatro-alejandria-filas-detalles-dorados-rojos-filas-candelabros-rendimiento_623493-159.jpg?w=2000";
  let img2: string =
    "https://s.alicdn.com/@sc04/kf/Hd09e43322ed84ca3902ea0cc926f755de.jpg";
  let img3: string =
    "https://uecluster.blob.core.windows.net/images/elfaninfiltrado/1670950106_xxxxxxx.jpg";
  let img4: string =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkv9xHHTw5EXF-c3hwFJvCeKjFMkJT9D-_BPkRvPt95rHnKXhrhllzkMyrQGz5NJr20as&usqp=CAU";
  const showImage = () => {
    console.log("entramos a la funcion");
    console.log(checkbox1Checked);
    console.log(checkbox2Checked);
    console.log(checkbox3Checked);
    if (checkbox1Checked && check1abialable) {
      check1abialable = false;
      check2abialable = true;
      check3abialable = true;
      check4abailable = true;
      checkbox2Checked = false;
      checkbox3Checked = false;
      checkbox4Checked = false;
    } else if (checkbox2Checked && check2abialable) {
      check2abialable = false;
      check1abialable = true;
      check3abialable = true;
      check4abailable = true;
      checkbox1Checked = false;
      checkbox3Checked = false;
      checkbox4Checked = false;
    } else if (checkbox3Checked && check3abialable) {
      check3abialable = false;
      check1abialable = true;
      check2abialable = true;
      check4abailable = true;
      checkbox1Checked = false;
      checkbox2Checked = false;
    } else if (checkbox4Checked && check4abailable) {
      check4abailable = false;
      check1abialable = true;
      check2abialable = true;
      check3abialable = true;
      checkbox1Checked = false;
      checkbox2Checked = false;
      checkbox3Checked = false;
    }
  };

  //Logica de eleccion de tipo de asientos
  let boletosOro: number = 0;
  let checkOro: boolean = false;
  let boletosPlata: number = 0;
  let checkPlata: boolean = false;
  let boletosVip: number = 0;
  let checkVip: boolean = false;
  let boletosGeneral: number = 0;
  let checkGeneral: boolean = false;
  let precioTotal: number = 0;

  const calculatePrice = () => {
    console.log("entramos a la funcion");
    console.log(descuentoAplicado);

    if (checkGeneral == false) {
      boletosGeneral = 0;
    }
    if (checkOro == false) {
      boletosOro = 0;
    }

    if (checkPlata == false) {
      boletosPlata = 0;
    }

    if (checkVip == false) {
      boletosVip = 0;
    }

    precioTotal =
      boletosOro * actualConcert.precioOro +
      boletosPlata * actualConcert.precioPlata +
      boletosVip * actualConcert.precioVip +
      boletosGeneral * actualConcert.precioGeneral;
    precioTotal = precioTotal - (precioTotal * descuentoAplicado) / 100;
    console.log(precioTotal);
  };

  //Logica del metodo de Pago
  let metodoFinalPago: string = "Tarjeta";
  let nequi: boolean = false;
  let nequiAbailable: boolean = true;
  let pse: boolean = false;
  let pseAbailable: boolean = true;
  let tarjeta: boolean = false;
  let tarjetaAbailable: boolean = true;

  const metodoPago = () => {
    if (nequi && nequiAbailable) {
      nequiAbailable = false;
      pseAbailable = true;
      tarjetaAbailable = true;
      pse = false;
      tarjeta = false;
    } else if (pse && pseAbailable) {
      pseAbailable = false;
      nequiAbailable = true;
      tarjetaAbailable = true;
      nequi = false;
      tarjeta = false;
    } else if (tarjeta && tarjetaAbailable) {
      tarjetaAbailable = false;
      nequiAbailable = true;
      pseAbailable = true;
      nequi = false;
      pse = false;
    }
    console.log("metodo de pago");
    console.log(nequi);
    console.log(pse);
    console.log(tarjeta);
    if (nequi) {
      metodoFinalPago = "Nequi";
    } else if (pse) {
      metodoFinalPago = "PSE";
    } else if (tarjeta) {
      metodoFinalPago = "Tarjeta";
    }
  };

  //Logica Culminar Pago

  const handleSubmit = async () => {
    if (precioTotal === 0) {
      alert("Debe comprarse al menos un boleto");
      return;
    }

    if(precioTotal < 0){
      alert("Error");
      return;
    }

    if(boletosGeneral > maxGeneral){
      alert("Error");
      return;
    }

    if(boletosOro > maxOro){
      alert("Error");
      return;
    }
    if(boletosPlata > maxPlata){
      alert("Error");
      return;
    }
    if(boletosVip > maxVip){
      alert("Error");
      return;
    }





    let bien = true;
    if (tarjeta) {
      bien = validationFormTarjeta();
    } else if (nequi) {
      bien = validationFormNequi();
    } else if (pse) {
      bien = validationFormPSE();
    } else {
      console.log("Este")
      console.log(bien)
      bien = validationFormTarjeta();
      console.log(bien)

    }

    if (!bien) {
      
      return;
    }

    //Creación del recibo
    receipt.boletosGeneralComprados = boletosGeneral;
    receipt.boletosOroCompados = boletosOro;
    receipt.boletosPlataComprados = boletosPlata;
    receipt.boletosVipComprados = boletosVip;
    receipt.precioTotal = precioTotal;
    receipt.metododePago = metodoFinalPago;
    receipt.descuentoAplicado = descuentoAplicado;
    receipt.idCOncierto = actualConcert.nombreConcierto;
    if ($admin) {
      receipt.uidUsuario = $admin.uid;
    } else {
      receipt.uidUsuario = $user.uid;
    }
    console.log(receipt);
    await createReseipt();
    await updateInfoConcierto();
    reload();
    createEmail();
  };

  //Logica de envio de un correo
  let email = "luisalejandromedinab@gmail.com"; // Variable con el correo por defecto
  let mensaje = ""; // Variable con el mensaje por defecto
  let name = "Takiy Official"; // Variable con el nombre por defecto
  let nameUser = "";

  const createEmail = () => {
    if ($user) {
      email = $user.email;
      nameUser = $user.displayName;
    } else if ($admin) {
      email = $admin.email;
      nameUser = $admin.displayName;
    }
    mensaje =
      "Hola, " +
      nameUser +
      " te informamos que tu compra de boletos para el concierto " +
      actualConcert.nombreConcierto +
      " ha sido exitosa. \n" +
      "A continuación te dejamos los datos de tu compra: \n" +
      "Boletos General: " +
      receipt.boletosGeneralComprados +
      "\n" +
      "Boletos Oro: " +
      receipt.boletosOroCompados +
      "\n" +
      "Boletos Plata: " +
      receipt.boletosPlataComprados +
      "\n" +
      "Boletos Vip: " +
      receipt.boletosVipComprados +
      "\n" +
      "Precio Total: " +
      receipt.precioTotal +
      "\n" +
      "Metodo de Pago: " +
      receipt.metododePago +
      "\n" +
      "Descuento Aplicado: " +
      receipt.descuentoAplicado +
      "\n" +
      "Id Concierto: " +
      actualConcert.nombreConcierto +
      "\n" +
      "Gracias por confiar en nosotros, esperamos que disfrutes del concierto. \n" +
      "Takiy Official";

    const e = {
      email: email,
      mensaje: mensaje,
      name: name,
    };
    console.log(e.mensaje);

    sendEmail(e);
    alert("Se enviaron los datos de la compra al correo: " + email);
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

  const createReseipt = async () => {
    try {
      await addDoc(collection(db, "Recibos"), receipt);
      console.log(receipt);
    } catch (error) {
      console.log(error);
    }
  };

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

      conciertos = conciertos.filter((concierto) => {
        return concierto.nombreConcierto === nombreConcierto;
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

  const updateInfoConcierto = async () => {
    console.log(conciertos[0].id);
    actualConcert.boletosGeneralParaVender =
      actualConcert.boletosGeneralParaVender - boletosGeneral;
    actualConcert.boletosOroParaVender =
      actualConcert.boletosOroParaVender - boletosOro;
    actualConcert.boletosPlataParaVender =
      actualConcert.boletosPlataParaVender - boletosPlata;
    actualConcert.boletosvipParaVender =
      actualConcert.boletosvipParaVender - boletosVip;
    actualConcert.boletosDisponibles =
      actualConcert.boletosDisponibles -
      (boletosGeneral + boletosOro + boletosPlata + boletosVip);

    try {
      console.log("Editando concierto");
      await updateDoc(doc(db, "Conciertos", conciertos[0].id), actualConcert);
    } catch (error) {
      console.log(error);
    }
  };

  //Funciones de validacion card

  let isSelected = false;
  let isSelected1 = false;
  let isSelected2 = false;
  let isSelected3 = false;

  function toggleSelection(event) {
    if (event.target.closest("input") || event.target.closest("button")) {
      return; // No ejecutar la función si se hizo clic en el input o en el botón
    }
    isSelected = !isSelected;
    if (!isSelected) {
      precioTotal = 0;
    }
    checkGeneral = !checkGeneral;
  }

  function toggleSelection1(event) {
    if (event.target.closest("input") || event.target.closest("button")) {
      return; // No ejecutar la función si se hizo clic en el input o en el botón
    }
    isSelected1 = !isSelected1;
    if (!isSelected) {
      precioTotal = 0;
    }
    checkOro = !checkOro;
  }

  function toggleSelection2(event) {
    if (event.target.closest("input") || event.target.closest("button")) {
      return; // No ejecutar la función si se hizo clic en el input o en el botón
    }
    isSelected2 = !isSelected2;
    if (!isSelected) {
      precioTotal = 0;
    }
    checkPlata = !checkPlata;
  }

  function toggleSelection3(event) {
    if (event.target.closest("input") || event.target.closest("button")) {
      return; // No ejecutar la función si se hizo clic en el input o en el botón
    }
    isSelected3 = !isSelected3;
    if (!isSelected) {
      precioTotal = 0;
    }
    checkVip = !checkVip;
  }

  //Validando formularios tarjeta
  let fullname = "";
  let emailform = "";
  let phone = "";
  let affair = "";
  let message = "";
  let isVerifying = false;

  function validationFormTarjeta(): boolean {
    // Realizar la validación antes de enviar el formulario
    if (fullname === "") {
      alert("Por favor, ingresa tu nombre completo.");
      return false;
    }

    if (emailform === "") {
      alert("Por favor, ingresa tu dirección de correo electrónico.");
      return false;
    }

    if (phone === "") {
      alert("Por favor, ingresa tu número de celular.");
      return false;
    }

    if (affair === "") {
      alert("Por favor, ingresa tu número de cuenta.");
      return false;
    }

     if(esSoloNumeros(affair) == false){
      alert("Por favor, ingresa un número de cuenta válido.");
      return false;
    }

    if(esSoloNumeros(phone) == false){
      alert("Por favor, ingresa un número de celular válido.");
      return false;
    }

    // Validación exitosa, puedes enviar el formulario o realizar otras acciones
    isVerifying = true;

    // Simular una verificación con una espera de 2 segundos
    setTimeout(() => {
      isVerifying = false;
      alert("Se ha realizado el pago de forma exitosa");
      // Aquí puedes enviar el formulario o realizar otras acciones
    }, 2000);
    /*setTimeout(() => {
      location.reload();
    }, 3500);*/
    return true;
  }

  //Nequi
  function validationFormNequi(): boolean {
    // Realizar la validación del formulario
    if (fullname === "") {
      alert("Por favor, ingresa tu nombre completo.");
      return false;
    }

    if (emailform === "") {
      alert("Por favor, ingresa tu dirección de correo electrónico.");
      return false;
    }

    if (phone === "") {
      alert("Por favor, ingresa tu número de celular.");
      return false;
    }

    if (affair === "") {
      alert("Por favor, ingresa tu número de cuenta.");
      return false;
    }

     if(esSoloNumeros(affair) == false){
      alert("Por favor, ingresa un número de cuenta válido.");
      return false;
    }

    if(esSoloNumeros(phone) == false){
      alert("Por favor, ingresa un número de celular válido.");
      return false;
    }
    // Validación exitosa, puedes realizar otras acciones
    isVerifying = true;

    // Simular una verificación con una espera de 2 segundos
    setTimeout(() => {
      isVerifying = false;
      alert("Se ha realizado el pago de forma exitosa");
      // Aquí puedes realizar otras acciones
    }, 2000);
    /*setTimeout(() => {
      location.reload();
    }, 3500);*/

    return true;
  }

  //PSE
  function validationFormPSE(): boolean {
    // Realizar la validación del formulario
    if (fullname === "") {
      alert("Por favor, ingresa tu nombre completo.");
      return false;
    }

    if (emailform === "") {
      alert("Por favor, ingresa tu dirección de correo electrónico.");
      return false;
    }

    if (phone === "") {
      alert("Por favor, ingresa tu número de celular.");
      return false;
    }

    if (affair === "") {
      alert("Por favor, ingresa tu número de cuenta.");
      return false;
    }

    if(esSoloNumeros(affair) == false){
      alert("Por favor, ingresa un número de cuenta válido.");
      return false;
    }

    if(esSoloNumeros(phone) == false){
      alert("Por favor, ingresa un número de celular válido.");
      return false;
    }

    // Validación exitosa, puedes realizar otras acciones
    isVerifying = true;

    // Simular una verificación con una espera de 2 segundos
    setTimeout(() => {
      isVerifying = false;
      alert("Se ha realizado el pago de forma exitosa");
      // Aquí puedes realizar otras acciones
    }, 2000);
    /*setTimeout(() => {
      location.reload();
    }, 3500);*/

    return true;
  }

  function esSoloNumeros(valor: string): boolean {
  return /^\d+$/.test(valor);
}
</script>

<!--Previsualización de los asientos-->

<header>
  <div class="navbar">
    <h1>Promociones</h1>
  </div>
</header>
<!-- <div style="height: 300px;"></div> -->
<main>
  <div class="infoConciertos-section">
    <div class="infoConciertos-txt">
      <h2><b>{nombreConcierto}</b></h2>
      <h2>{nombreArtista}</h2>
      <p>Boletas restantes: {numeroBoletas}</p>
      <p>General: {maxGeneral}</p>
      <p>Oro: {maxOro}</p>
      <p>Plata: {maxPlata}</p>
      <p>Vip: {maxVip}</p>
    </div>
    <div class="infoConciertos-Imagen">
      <img
        src={imagenConcierto}
        alt="Descripción de la imagen"
        class="imagen-info"
      />
    </div>
  </div>
</main>

<section>
  <div class="section-infoConciertos">
    <div class="infoConciertos-section">
      <h2 style="color:#fc741e; margin-top:150px"><b>ASIENTOS</b></h2>
      <img
        style="width:300px; height:300px"
        src="https://firebasestorage.googleapis.com/v0/b/takiy-5800d.appspot.com/o/Im%C3%A1genes%20proyecto%2Fconcierto%20sillas.jpg?alt=media&token=b2635e70-ba14-4d44-abf6-9d0b5e46dee0"
        alt=""
      />
      <div class="infoConciertos-txt">
        <label class="btn-1">
          <input
            type="checkbox"
            bind:checked={checkbox1Checked}
            on:change={showImage}
          />
          VIP(A)
        </label>
        <label class="btn-1">
          <input
            type="checkbox"
            bind:checked={checkbox2Checked}
            on:change={showImage}
          />
          ORO(B)
        </label>
        <label class="btn-1">
          <input
            type="checkbox"
            bind:checked={checkbox3Checked}
            on:change={showImage}
          />
          PLATA(C)
        </label>
        <label class="btn-1">
          <input
            type="checkbox"
            bind:checked={checkbox4Checked}
            on:change={showImage}
          />
          GENERAL(D)
        </label>

        {#if checkbox1Checked}
          <img class="img-asientos" src={img1} alt="1" />
        {:else if checkbox2Checked}
          <img class="img-asientos" src={img2} alt="2" />
        {:else if checkbox3Checked}
          <img class="img-asientos" src={img3} alt="3" />
        {:else if checkbox4Checked}
          <img class="img-asientos" src={img4} alt="4" />
        {/if}
      </div>
    </div>
  </div>
</section>

<section>
  <div class="section-infoCompra">
    <div class="infoCompra-section">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class={isSelected ? "card selected" : "card"}
        id="card1"
        on:click={toggleSelection}
      >
        <div class="checkbox">
          <input type="checkbox" id="checkbox1" bind:checked={isSelected} />
          <label for="checkbox1" />
        </div>
        <div class="content">
          <div class="title">
            General
            <h2>Precio general:</h2>
            <h3><b>{precioGeneral}</b></h3>
          </div>

          <!--<div class="price">$39.99</div>-->
          <div class="description" />
          <label>
            <input
              type="checkbox"
              style="display: none;"
              bind:checked={checkGeneral}
              on:change={calculatePrice}
            />
          </label>
          {#if checkGeneral}
            <input
              type="number"
              bind:value={boletosGeneral}
              min="0"
              max={maxGeneral}
              on:input={calculatePrice}
            />
          {/if}
        </div>
      </div>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class={isSelected1 ? "card selected1" : "card"}
        on:click={toggleSelection1}
      >
        <div class="checkbox1">
          <input type="checkbox" id="checkbox1" bind:checked={isSelected1} />
          <label for="checkbox1" />
        </div>
        <div class="content">
          <div class="title">
            Oro
            <h2>Precio Oro:</h2>
            <h3><b>{precioOro}</b></h3>
          </div>
          <!--<div class="price">$39.99</div>-->
          <div class="description" />
          <label>
            <input
              type="checkbox"
              style="display: none;"
              bind:checked={checkOro}
              on:change={calculatePrice}
            />
          </label>
          {#if checkOro}
            <input
              type="number"
              bind:value={boletosOro}
              min="0"
              max={maxOro}
              on:input={calculatePrice}
            />
          {/if}
        </div>
      </div>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class={isSelected2 ? "card selected2" : "card"}
        on:click={toggleSelection2}
      >
        <div class="checkbox2">
          <input type="checkbox" id="checkbox1" bind:checked={isSelected2} />
          <label for="checkbox1" />
        </div>
        <div class="content">
          <div class="title">
            Plata
            <h2>Precio Plata:</h2>
            <h3><b>{precioPlata}</b></h3>
          </div>
          <!--<div class="price">$39.99</div>-->
          <div class="description" />
          <label>
            <input
              type="checkbox"
              style="display: none;"
              bind:checked={checkPlata}
              on:change={calculatePrice}
            />
          </label>
          {#if checkPlata}
            <input
              type="number"
              bind:value={boletosPlata}
              min="0"
              max={maxPlata}
              on:input={calculatePrice}
            />
          {/if}
        </div>
      </div>

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class={isSelected3 ? "card selected3" : "card"}
        on:click={toggleSelection3}
      >
        <div class="checkbox3">
          <input type="checkbox" id="checkbox1" bind:checked={isSelected3} />
          <label for="checkbox1" />
        </div>
        <div class="content">
          <div class="title">
            VIP
            <h2>Precio VIP:</h2>
            <h3><b>{precioVip}</b></h3>
          </div>
          <!--<div class="price">$39.99</div>-->

          <label>
            <input
              type="checkbox"
              style="display: none;"
              bind:checked={checkVip}
              on:change={calculatePrice}
            />
          </label>
          {#if checkVip}
            <input
              type="number"
              bind:value={boletosVip}
              min="0"
              max={maxVip}
              on:input={calculatePrice}
            />
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>

<section style="color: white; align-items: center; text-align: center;">
  {#if isSelected1 || isSelected ||isSelected2 || isSelected3}
    <h1>Precio total: {precioTotal}</h1>
    {#if descuentoAplicado > 0}
      <h1>Descuento aplicado: {descuentoAplicado}%</h1>
    {/if}
  {/if}

  
</section>

<!--Parte grafica del metodo de Pago-->
<section>
  <div class="section-nequi">
    <div class="nequi-section">
      <h2 style="color:#CCCCCC">Metodos de pago</h2>
      <label class="btn-1">
        <input type="checkbox" bind:checked={nequi} on:change={metodoPago} />
        Nequi
      </label>

      <label class="btn-1">
        <input type="checkbox" bind:checked={pse} on:change={metodoPago} />
        PSE
      </label>

      <label class="btn-1">
        <input type="checkbox" bind:checked={tarjeta} on:change={metodoPago} />
        Tarjeta
      </label>

      {#if nequi}
        <div class="container">
          <h1 class="logo" style="color:#00cfdb">Tarjeta <span>Nequi</span></h1>

          <div class="contact-wrapper animated bounceInUp">
            <div class="contact-form">
              <h3 style="color:#CCCCCC">Nequi</h3>
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <form on:submit|preventDefault={validationFormNequi}>
                <p>
                  <label style="color:#fff">Nombre Completo</label>
                  <input type="text" bind:value={fullname} />
                </p>
                <p>
                  <label style="color:#fff"
                    >Dirección de correo electrónico</label
                  >
                  <input type="email" bind:value={emailform} />
                </p>
                <p>
                  <label style="color:#fff">Número de celular</label>
                  <input type="tel" bind:value={phone} />
                </p>
                <p>
                  <label style="color:#fff">Número de tarjeta o celular</label>
                  <input type="text" bind:value={affair} />
                </p>
                <p class="block">
                  <label style="color:#fff">Mensaje adicional</label>
                  <textarea bind:value={message} rows="3" />
                </p>
                <p class="block" id="verificado">
                  <a href="#verificado"
                    >{isVerifying ? "Verificando..." : "Enviar"}</a
                  >
                </p>
              </form>
            </div>
            <div class="contact-info">
              <h4>Más información</h4>
              <ul>
                <li><i class="fas fa-map-marker-alt" /> Takey</li>
                <li><i class="fas fa-phone" /> 3146858992</li>
                <li>
                  <i class="fas fa-envelope-open-text" /> takiyofficial@gmail.com
                </li>
              </ul>
              <p>
                En caso de reclamos, dudas o sugerencias favor contactarse con
                nosotros.
              </p>
              <p>takiy.com</p>
            </div>
          </div>
        </div>
      {:else if pse}
        <div class="container">
          <h1 class="logo" style="color:#12375b">Cuenta <span>PSE</span></h1>

          <div class="contact-wrapper animated bounceInUp">
            <div class="contact-form-pse">
              <h3 style="color:#CCCCCC">PSE</h3>
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <form on:submit|preventDefault={validationFormPSE}>
                <p>
                  <label style="color:#fff">Nombre Completo</label>
                  <input type="text" bind:value={fullname} />
                </p>
                <p>
                  <label style="color:#fff"
                    >Dirección de correo electrónico</label
                  >
                  <input type="email" bind:value={emailform} />
                </p>
                <p>
                  <label style="color:#fff">Número de celular</label>
                  <input type="tel" bind:value={phone} />
                </p>
                <p>
                  <label style="color:#fff">Número de cuenta</label>
                  <input type="text" bind:value={affair} />
                </p>
                <p class="block">
                  <label style="color:#fff">Mensaje adicional</label>
                  <textarea bind:value={message} rows="3" />
                </p>
                <p class="block" id="verificado">
                  <a href="#verificado"
                    >{isVerifying ? "Verificando..." : "Enviar"}</a
                  >
                </p>
              </form>
            </div>
            <div class="contact-info">
              <h4>Más información</h4>
              <ul>
                <li><i class="fas fa-map-marker-alt" /> Takey</li>
                <li><i class="fas fa-phone" /> 3146858992</li>
                <li>
                  <i class="fas fa-envelope-open-text" /> takiyofficial@gmail.com
                </li>
              </ul>
              <p>
                En caso de reclamos, dudas o sugerencias favor contactarse con
                nosotros.
              </p>
              <p>takiy.com</p>
            </div>
          </div>
        </div>
      {:else}
        <div class="container">
          <h1 class="logo" style="color:#CCCCCC">
            Tarjeta <span style="color:#d63031">Credito/Debito</span>
          </h1>

          <div class="contact-wrapper animated bounceInUp">
            <div class="contact-form-tarjeta">
              <h3 style="color:#CCCCCC">Visa MasterCard</h3>
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <form on:submit|preventDefault={validationFormTarjeta}>
                <p>
                  <label style="color:#fff">Nombre Completo</label>
                  <input type="text" bind:value={fullname} />
                </p>
                <p>
                  <label style="color:#fff"
                    >Dirección de correo electrónico</label
                  >
                  <input type="email" bind:value={emailform} />
                </p>
                <p>
                  <label style="color:#fff">Número de celular</label>
                  <input type="tel" bind:value={phone} />
                </p>
                <p>
                  <label style="color:#fff">Número de cuenta</label>
                  <input type="text" bind:value={affair} />
                </p>
                <p class="block">
                  <label style="color:#fff">Mensaje adicional</label>
                  <textarea bind:value={message} rows="3" />
                </p>
                <p class="block" id="verificado">
                  <a href="#verificado"
                    >{isVerifying ? "Verificando..." : "Enviar"}</a
                  >
                </p>
              </form>
            </div>
            <div class="contact-info">
              <h4>Más información</h4>
              <ul>
                <li><i class="fas fa-map-marker-alt" /> Takey</li>
                <li><i class="fas fa-phone" /> 3146858992</li>
                <li>
                  <i class="fas fa-envelope-open-text" /> takiyofficial@gmail.com
                </li>
              </ul>
              <p>
                En caso de reclamos, dudas o sugerencias favor contactarse con
                nosotros.
              </p>
              <p>takiy.com</p>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>

<div class="section-btn">
  <button class="btn-2" on:click={handleSubmit}>Culminar Pago</button>
</div>

<div style="height: 150px;" />

<style>
  .section-infoConciertos {
    margin: 1rem 0;
  }

  .infoConciertos-section {
    margin: 0 auto;
    background-color: #151c24;
    display: flex;
    justify-content: space-between;
    padding: 25px 30px;
    width: 100%;
    margin-bottom: 35px auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }

  .infoConciertos-txt {
    width: 50%;
  }

  .infoConciertos-Imagen {
    margin-left: 10%;
    margin-right: 10%;
    width: 50%;
  }

  .infoConciertos-section img {
    margin-top: 10px;
    width: 500px;
    border-radius: 30px;
    box-shadow: 0 0 30px rgba(252, 116, 30, 0.5);
  }

  .infoConciertos-txt h2 {
    font-size: 24px;
    font-weight: bold;
    line-height: 30px;
    margin-bottom: 10px;
    color: #fc741e;
  }

  .infoConciertos-txt p {
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 0;
    color: #cccccc;
  }

  .btn-1 {
    font-family: "Poppins", sans-serif;
    height: 25px;
    width: 8.8rem;
    border-radius: 0.8rem;
    background: #0b363f;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.2s;
    box-shadow: 0 0.3rem 1rem rgba(0, 0, 0, 0.3);

    border-color: #0b363f;
  }

  .btn-1:hover {
    background: none;
    border: 0.2rem solid #0b363f;
  }

  .btn-2 {
    font-family: "Poppins", sans-serif;
    height: 35px;
    width: 9.2rem;
    border-radius: 0.8rem;
    background: #fc741e;
    color: #fff;
    font-size: 1.2rem;
    cursor: pointer;
    transition: 0.2s;
    box-shadow: 0 0.3rem 1rem rgba(0, 0, 0, 0.3);
    align-items: center;
    border-color: #fc741e;
  }

  .btn-2:hover {
    background: none;
    border: 0.2rem solid #fc741e;
  }
  .section-btn {
    display: block;
    align-items: end;
    align-content: end;
    margin-top: 5px;
    margin-bottom: 25px;
  }

  .img-asientos {
    width: 300px;
    height: 300px;
  }

  .imagen-info {
    padding-left: 0;
    width: 80%;
    height: 80%;
  }

  .section-nequi {
    margin: 1rem 0;
  }

  .nequi-section {
    margin: 0 auto;
    background-color: #151c24;
    padding: 25px 30px;
    width: 100%;
    margin-bottom: 35px auto;
    border-radius: 25px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    align-items: center;
    text-align: center;
  }
  .container {
    max-width: 1200px;
    margin-top: 50px;
    margin-left: auto;
    margin-right: auto;
    padding: 1.5em;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  .logo {
    text-align: center;
    font-size: 3em;
  }

  .logo span {
    color: #ff2978;
  }

  .contact-wrapper {
    box-shadow: 0 0 20px 0 rgba(255, 255, 255, 0.3);
  }

  .contact-wrapper > * {
    padding: 1em;
  }

  .contact-form {
    background: #222222;
  }

  .contact-form form {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .contact-form form label {
    display: block;
  }

  .contact-form form p {
    margin: 0;
    padding: 1em;
  }

  .contact-form form .block {
    grid-column: 1 / 3;
  }

  .contact-form form button,
  .contact-form form a,
  .contact-form form input,
  .contact-form form textarea {
    width: 100%;
    padding: 0.7em;
    border: none;
    background: none;
    outline: 0;
    color: #fff;
    border-bottom: 1px solid #ff2978;
  }

  .contact-form form button,
  .contact-form form a {
    background: #ff2978;
    border: 0;
    text-transform: uppercase;
    padding: 1em;
  }

  .contact-form form a:hover,
  .contact-form form a:focus {
    background: #48bf3b;
    color: #fff;
    transition: 1s ease-out;
    outline: 0;
  }

  .contact-form-pse form a,
  .contact-form-pse form input,
  .contact-form-pse form textarea {
    width: 100%;
    padding: 0.7em;
    border: none;
    background: none;
    outline: 0;
    color: #fff;
    border-bottom: 1px solid #12375b;
  }

  .contact-form-pse form a {
    background: #12375b;
    border: 0;
    text-transform: uppercase;
    padding: 1em;
  }

  .contact-form-pse form a:hover,
  .contact-form-pse form a:focus {
    background: #48bf3b;
    color: #fff;
    transition: background-color 1s ease-out;
    outline: 0;
  }

  .contact-form-tarjeta form a,
  .contact-form-tarjeta form input,
  .contact-form-tarjeta form textarea {
    width: 100%;
    padding: 0.7em;
    border: none;
    background: none;
    outline: 0;
    color: #fff;
    border-bottom: 1px solid #d63031;
  }

  .contact-form-tarjeta form a {
    background: #d63031;
    border: 0;
    text-transform: uppercase;
    padding: 1em;
  }

  .contact-form-tarjeta form a:hover,
  .contact-form-tarjeta form a:focus {
    background: #48bf3b;
    color: #fff;
    transition: 1s ease-out;
    outline: 0;
  }

  /* CONTACT INFO */
  .contact-info {
    background: #000;
    color: #fff;
  }

  .contact-info h4,
  .contact-info ul,
  .contact-info p {
    text-align: center;
    margin: 0 0 1rem 0;
  }

  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    width: 260px;
    padding: 20px 1px;
    margin: 10px 0;
    text-align: center;
    position: relative;
    cursor: pointer;
    box-shadow: 0 10px 15px -3px rgba(33, 150, 243, 0.4),
      0 4px 6px -4px rgba(33, 150, 243, 0.4);
    border-radius: 10px;
    background-color: #6b6ecc;
    background: linear-gradient(45deg, #04051dea 0%, #2b566e 100%);
  }

  .content {
    padding: 20px;
  }

  .content .price {
    color: white;
    font-weight: 800;
    font-size: 50px;
    text-shadow: 0px 0px 10px rgba(0, 0, 0, 0.42);
  }

  .content .description {
    color: rgba(255, 255, 255, 0.6);
    margin-top: 10px;
    font-size: 14px;
  }

  .content .title {
    font-weight: 800;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.64);
    margin-top: 10px;
    font-size: 25px;
    letter-spacing: 1px;
  }

  .selected {
    background-color: #f0f0f0;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.825);
    border: 2px solid green;
  }

  .selected1 {
    background-color: #f0f0f0;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.825);
    border: 2px solid green;
  }

  .selected2 {
    background-color: #f0f0f0;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.825);
    border: 2px solid green;
  }

  .selected3 {
    background-color: #f0f0f0;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.825);
    border: 2px solid green;
  }

  .checkbox {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .checkbox input {
    display: none;
  }

  /*.checkbox label {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
  }*/

  /* .checkbox input:checked + label::after {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    width: 12px;
    height: 12px;
    background-color: #0adf71;
    border-radius: 2px;
  }
  .checkbox1 input:checked + label::after {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    width: 12px;
    height: 12px;
    background-color: #0adf71;
    border-radius: 2px;
  }
  .checkbox2 input:checked + label::after {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    width: 12px;
    height: 12px;
    background-color: #0adf71;
    border-radius: 2px;
  }

  .checkbox3 input:checked + label::after {
    content: "";
    position: absolute;
    top: 4px;
    left: 4px;
    width: 12px;
    height: 12px;
    background-color: #0adf71;
    border-radius: 2px;
  }*/

  /*.checkbox1 label {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
  }*/

  .checkbox1 {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .checkbox1 input {
    display: none;
  }

  /*.checkbox2 label {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
  }*/

  .checkbox2 {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .checkbox2 input {
    display: none;
  }

  /*.checkbox3 label {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
  }*/

  .checkbox3 {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  .checkbox3 input {
    display: none;
  }

  .section-infoCompra {
    margin: 1rem 0;
  }

  .infoCompra-section {
    margin: 0 auto;
    background-color: #151c24;
    display: flex;
    justify-content: space-between;
    padding: 25px 30px;
    width: 100%;
    margin-bottom: 35px auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }
</style>
