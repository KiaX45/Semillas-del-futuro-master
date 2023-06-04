<script>
  import Card from "../components/Card.svelte";
  //import TextMachine from "../components/TextMachine.svelte";
  let textMision =
    "A través de la reforestación se pretende restaurar y proteger los bosques del mundo para garantizar un futuro sostenible para las personas y conservar la biodiversidad de su entiorno.";
  let imgPathMsion =
    "https://rockcontent.com/es/wp-content/uploads/sites/3/2019/01/grandes-lideres-empresariales-1024x538.png.webp";
  let textVision =
    "Ser líderes en la restauración y conservación de los bosques a nivel mundial, para contribuir de manera significativa al desarrollo sostenible y a la mitigación del cambio climático.";
  let pathVision =
    "https://i0.wp.com/get.witei.com/wp-content/uploads/2021/11/mision-empresarial-1-1-1.jpg?fit=1199%2C622&ssl=1";
  let textObjetivos =
    "Implementar mecanismos viables de reforestación para devolver la vida y la belleza a los bosques degradados y deforestados, para poder ofrecer un futuro más sostenible y próspero tanto a las personas como a los ecocistemas.";
  let pathObjetivos =
    "https://get.witei.com/wp-content/uploads/2022/01/diferencia-entre-objetivos-generales-y-especificos-1-1-1.jpg";
</script>

<body>
  <header class="header">
    <img class="bg" src="https://d3vhc53cl8e8km.cloudfront.net/hello-staging/wp-content/uploads/sites/21/2022/02/01171129/EDCLV2021_1024_042113-7803_AGP_768x440.jpg" alt="">

    <div class="header-content container">
      <div class="header-txt">
        <h1>
          <span>Takiy <br /> </span> Ahora tus conciertos al alcance de tus manos
        </h1>
        <p>
          Nuestra empresa se dedica a ofrecer experiencias únicas y memorables a
          nuestros clientes a través de la organización y producción de eventos
          de alta calidad. Contamos con un equipo altamente calificado que se
          encarga de asesorar y guiar a nuestros clientes en cada etapa del
          proceso, desde la conceptualización hasta la ejecución del evento.
        </p>
        <a href="#services" class="btn-1">Información</a>
      </div>
      <div class="header-img">
        <img
          src="https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_640.jpg"
          alt=""
        />
        <img
          src="https://cdn.pixabay.com/photo/2017/08/02/13/09/confetti-2571539_640.jpg"img
          alt=""
        />
        <img
          src="https://cdn.pixabay.com/photo/2018/01/15/21/50/concert-3084876_640.jpg"
          alt=""
        />
      </div>
    </div>
  </header>

  <main class="services container" id="services">
    <a href="#" class="info"> Tiempo real</a>
    <h2>Nuestros servicios</h2>

    <div class="services-content">
      <div class="services-txt">
        <div class="service-card">
          <img src="https://firebasestorage.googleapis.com/v0/b/takiy-5800d.appspot.com/o/img%20Home%2F1.svg?alt=media&token=57a182dd-24a3-454c-a570-c4dec484326a" alt="" />
          <div class="card-txt">
            <h3>Servicios de venta de boletas</h3>
            <p>
              En TakiY podras visualizar tus eventos favoritos y 
              adquirir tus entradas con tan solo un par de clicks. 
              TakiY siempre a la vanguardia de la venta de boletos.
            </p>
            <a href="#">Información</a>
          </div>
        </div>
        <div class="service-card">
          <img src="https://firebasestorage.googleapis.com/v0/b/takiy-5800d.appspot.com/o/img%20Home%2F2.svg?alt=media&token=106893bf-a2c3-4e83-a0b5-871f32d4fbd9" alt="" />
          <div class="card-txt">
            <h3>Visión</h3>
            <p>
              Nuestra visión es convertirnos en líderes en el mercado de la
              organización y producción de conciertos, ofreciendo una amplia
              gama de servicios que cubran todas las necesidades de nuestros
              clientes.
            </p>
            <a href="#">Información</a>
          </div>
        </div>
        <div class="service-card">
          <img src="https://firebasestorage.googleapis.com/v0/b/takiy-5800d.appspot.com/o/img%20Home%2F3.svg?alt=media&token=88f3791d-9866-4107-bb0f-256438a59b2b" alt="" />
          <div class="card-txt">
            <h3>Misión</h3>
            <p>
              Nuestra empresa se dedica a ofrecer experiencias únicas y
              memorables a nuestros clientes a través de la organización y
              producción de eventos de alta calidad. Contamos con un equipo
              altamente calificado que se encarga de asesorar y guiar a nuestros
              clientes en cada etapa del proceso, desde la conceptualización
              hasta la ejecución del evento.
            </p>
            <a href="#">Información</a>
          </div>
        </div>
      </div>
      <div class="services-img">
        <video autoplay muted loop class="mivideo">
          <source src="https://firebasestorage.googleapis.com/v0/b/takiy-5800d.appspot.com/o/img%20Home%2Fvideoinsta.mp4?alt=media&token=6bbac63b-4f24-4dea-8026-8fd8f86e3505" type="video/mp4">
          Tu navegador no soporta html5
      </video>
      </div>
    </div>
  </main>

  <section class="carrusel container">
    <img
      src="https://cdn.pixabay.com/photo/2016/11/23/15/48/audience-1853662_640.jpg"
      alt=""
    />
    <img
      src="https://cdn.pixabay.com/photo/2017/08/02/13/09/confetti-2571539_640.jpg"
      alt=""
    />
    <img
      src="https://cdn.pixabay.com/photo/2018/01/15/21/50/concert-3084876_640.jpg"
      alt=""
    />
    <img
      src="https://cdn.pixabay.com/photo/2016/11/22/21/36/audience-1850665_640.jpg"
      alt=""
    />
    <img
      src="https://cdn.pixabay.com/photo/2020/01/15/17/35/concert-4768496_640.jpg"
      alt=""
    />
    <img
      src="https://cdn.pixabay.com/photo/2017/07/21/23/57/concert-2527495_1280.jpg"
      alt=""
    />
  </section>

  <section class="usuarios">
    <img class="wave-1" src="https://firebasestorage.googleapis.com/v0/b/takiy-5800d.appspot.com/o/img%20Home%2Fwave1.svg?alt=media&token=bf7e518d-ba3d-4c72-aa87-474267cd4f2e" alt="" />
    <img class="wave-2" src="https://firebasestorage.googleapis.com/v0/b/takiy-5800d.appspot.com/o/img%20Home%2Fwave2.svg?alt=media&token=7ed4b4cf-bbcd-4077-ad91-d4e5c752886a" alt="" />

    <div class="usuario-txt container">
      <a href="#" class="info">Tiempo real</a>
      <h2>Nuestros usuarios</h2>
      <p>
        A través del uso de base de datos mostraremos cuantos usuarios habrán
        registrados en total del proyecto
      </p>
      <h3>100,000</h3>
    </div>
  </section>

 <!--  <section class="app container">
    <div class="app-1">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/takiy-5800d.appspot.com/o/img%20Home%2Fapp.svg?alt=media&token=2ef72620-bd9d-4292-bfb1-27a2688b9e86"
        alt=""
      />
    </div>
    <div class="app-2">
      <a href="#">Tiempo real</a>
      <h2>App para llevar el control</h2>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores,
        consectetur, expedita officia vero accusantium quo dolorem nobis aperiam
        facere atque tempore eos aliquid quaerat quae commodi! Nihil repellendus
        nobis amet.
      </p>
      <a href="#" class="btn-1">Información</a>
    </div>
  </section>

  <section class="prices-sec">
    <div class="prices container">
      <div class="price">
        <h3>Promoción Basic</h3>
        <ul style="color:#2d6469">
          <li>Acceso al concierto</li>
          <li>Acceso</li>
          <li>1 persona</li>
          <li>Zona normal</li>
        </ul>
        <p>$50,00</p>
      </div>

      <div class="price">
        <h3>Promoción Medium</h3>
        <ul style="color:#2d6469">
          <li>Acceso al</li>
          <li>Acceso</li>
          <li>2 personas</li>
          <li>Zona VIP</li>
        </ul>
        <p>$100,00</p>
      </div>
      <div class="price">
        <h3>Promoción Pro</h3>
        <ul style="color:#2d6469">
          <li>Acceso a tiempo real</li>
          <li>Acceso</li>
          <li>4 personas</li>
          <li>Acceso Palco</li>
        </ul>
        <p>$150,00</p>
      </div>
    </div>
  </section> -->
</body>

<style>
  .divCentrado {
    width: 200px;
    margin: auto;
  }

  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap");

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    text-decoration: none;
    list-style: none;
  }

  body {
    font-family: "Poppins", sans-serif;
    background-color: #0b363f;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    position: relative;
    min-height: 100vh;
    align-items: center;
  }

  #header-menu {
    position: fixed;
  }

  .menu {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1000;
  }

  .logo {
    color: #fc741e;
    font-size: 25px;
    font-weight: 800;
  }

  .menu .navbar ul li {
    position: relative;
    float: left;
  }

  .menu .navbar ul li a {
    font-size: 18px;
    padding: 20px;
    color: #2d6469;
    display: block;
    font-weight: 600;
  }

  #logins {
    border-radius: 15px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  }

  #logins:hover {
    display: inline-block;
    padding: 20px 35px;
    color: #fefffb;
    border-radius: 15px;
    background: linear-gradient(
      90deg,
      rgba(3, 37, 39, 1) 33%,
      rgba(45, 100, 105, 1) 69%,
      rgba(252, 116, 30, 1) 100%
    );
  }

  .menu .navbar ul li a:hover {
    color: #fc741e;
  }

  #menu {
    display: none;
  }

  .menu-icono {
    width: 25px;
  }

  .menu label {
    cursor: pointer;
    display: none;
  }

  .bg {
    position: absolute;
    width: 1900px;
    height: 861px;
    margin-top: -100px;
    z-index: 0;
    opacity: 0.8;
    
  }

  .header-content {
    display: flex;
    z-index: 3;
  }

  .header-txt {
    width: 50%;
  }

  .header-txt h1 {
    font-size: 55px;
    line-height: 70px;
    color: #fefffb;
    font-weight: 500;
    margin-bottom: 35px;
  }

  .header-txt span {
    font-weight: 800;
  }

  .header-txt p {
    color: #d9d9d9;
    font-size: 16px;
    margin-bottom: 35px;
  }

  .header-img {
    padding-top: 100px;
    padding-left: 100px;

    display: flex;
    width: 600px;
    height: 350px;
  }

  .header-img img {
    width: 0px;
    flex-grow: 1;
    object-fit: cover;
    opacity: 0.8;
    transition: 0.5s ease;
  }

  .header-img img:hover {
    cursor: crosshair;
    width: 200px;
    opacity: 1;
    filter: contrast(120%);
  }

  .btn-1 {
    display: inline-block;
    padding: 13px 35px;
    color: #00a1b0;
    border-radius: 25px;
    background: linear-gradient(
      90deg,
      rgba(3, 37, 39, 1) 33%,
      rgba(45, 100, 105, 1) 69%,
      rgba(252, 116, 30, 1) 100%
    );
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  }

  .btn-1:hover {
    color: #ed120f;
    box-shadow: 0 0 30px rgba(237, 18, 15, 0.5);
  }

  .services {
    padding: 50px 0;
    text-align: center;
  }

  .info {
    display: inline-block;
    font-size: 14px;
    font-weight: 800px;
    padding: 2px 45px;
    border-radius: 25px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #bb4e8a;
    background-color: #40223a;
    margin-bottom: 15px;
  }

  .services h2 {
    font-size: 40px;
    font-weight: 60px;
    color: #fefffb;
    margin-bottom: 45px;
  }

  .services-content {
    display: flex;
    align-items: center;
  }

  .services-txt {
    width: 50%;
  }

  .service-card {
    display: flex;
    align-items: flex-start;
    background-color: #151c24;
    padding: 15px 20px;
    border-radius: 25px;
    width: 500;
    margin-bottom: 35px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  }

  .service-card img {
    width: 25px;
    margin-right: 25px;
  }

  .card-txt {
    text-align: left;
  }

  .card-txt h3 {
    font-size: 18px;
    font-weight: 600;
    color: #fefffb;
    margin-bottom: 10px;
  }

  .card-txt p {
    font-size: 16px;
    color: #8d8d8d;
    margin-bottom: 10px;
  }

  .card-txt a {
    font-size: 18px;
    font-weight: 600;
    color: #fefffb;
  }

  .card-txt a:hover {
    color: #fc741e;
  }

  .services-img {
    width: 50%;
    
  }

  .services-img video {
    width: 877px;
    height: 643px;
    opacity: 0.8;
  }

  .services-img video:hover {
    opacity: 1;
    filter: contrast(120%);
  }

  .carrusel {
    display: flex;
    width: 1200px;
    height: 430px;
  }

  .carrusel img {
    width: 0px;
    flex-grow: 1;
    object-fit: cover;
    opacity: 0.8;
    transition: 0.5s ease;
  }

  .carrusel img:hover {
    cursor: crosshair;
    width: 300px;
    opacity: 1;
    filter: contrast(120%);
  }

  .usuarios {
    margin: 250px 0;
    padding: 20px 0;
    position: relative;
    background-color: #151c24;
  }

  .wave-1 {
    display: inline-block;
    position: absolute;
    width: 100%;
    top: -300px;
    z-index: -1;
  }

  .wave-2 {
    display: inline-block;
    position: absolute;
    width: 100%;
    top: 300px;
    z-index: -1;
  }

  .usuario-txt {
    text-align: center;
  }

  .usuario-txt h2 {
    font-size: 40px;
    font-weight: 600;
    color: #fefffb;
    margin-bottom: 25px;
  }

  .usuario-txt p {
    font-size: 16px;
    color: #8d8d8d;
    margin-bottom: 10px;
  }

  .usuario-txt h3 {
    background: #ccc;
    background: linear-gradient(90deg, blue, red);
    font-size: 120px;
    line-height: 115%;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
  }

  .app {
    display: flex;
    padding: 30px;
  }

  .app-1 {
    width: 50%;
  }

  .app-1 img {
    width: 500px;
  }

  .app-2 {
    width: 50%;
    padding-left: 150px;
  }

  .app-2 h2 {
    font-size: 40px;
    font-weight: 600;
    color: #fefffb;
    margin-bottom: 40px;
  }

  .app-2 p {
    font-size: 16px;
    color: #8d8d8d;
  }

  .prices-sec {
    padding: 80px 0;
  }

  .prices {
    display: flex;
    justify-content: space-between;
  }

  .price {
    background-color: #151c24;
    padding-bottom: 20px;
    margin: 0 20px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    border-radius: 25px;
    text-align: center;
    width: 30%;
    height: 450px;
  }

  .price h3 {
    font-size: 30px;
    font-weight: 600;
    color: #b04a0b;
    margin-bottom: 35px;
    padding: 15px;
    border-radius: 25px 25px 0 0;
    background: linear-gradient(
      90deg,
      rgba(254, 170, 18, 1) 33%,
      rgba(252, 116, 30, 1) 69%,
      rgba(254, 39, 18, 1) 100%
    );
  }

  .price ul {
    margin-top: 55px;
  }

  .price ul li {
    font-size: 16px;
    font-weight: #fefffb;
    margin-bottom: 30px;
  }

  .price p {
    font-size: 18px;
    color: #b04a0b;
  }

  @media (max-width: 991px) {
    .menu {
      padding: 30px;
    }

    .menu label {
      display: initial;
    }

    .menu .navbar {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: #151c24;
      display: none;
    }

    .menu .navbar ul li {
      width: 100%;
    }

    #menu:checked ~ .navbar {
      display: initial;
    }

    .bg {
      width: 300px;
      left: -100px;
      top: -50px;
    }

    .header {
      min-height: 60vh;
    }

    .header-content {
      flex-direction: column;
      padding: 100px 0 30px;
      text-align: center;
    }

    .header-txt {
      width: 100%;
    }

    .header-txt h1 {
      font-size: 45px;
      line-height: 50px;
      margin-bottom: 15px;
    }

    .header-img {
      width: 100%;
    }

    .lap {
      width: 220px;
    }

    .btn-1 {
      margin-bottom: 25px;
    }

    .services {
      padding: 30px;
    }

    .services-txt {
      width: 100%;
    }

    .service-card {
      width: 100%;
    }

    .services-img {
      width: 100%;
    }

    .services-img img {
      width: 220px;
    }

    .carrusel {
      display: none;
    }
    .usuarios {
      margin: 0;
      padding: 50px 30px;
    }

    .wave-1,
    .wave-2 {
      display: none;
    }

    .usuarios-txt h3 {
      font-size: 70px;
    }

    .app {
      flex-direction: column;
      padding: 50px 30px;
      align-items: center;
      text-align: center;
    }

    .app-1 {
      width: 100%;
    }

    .app-1 img {
      width: 220px;
      margin-bottom: 35px;
    }

    .app-2 {
      width: 100%;
      padding-left: 0;
    }

    .price-sec {
      padding: 0;
    }

    .prices {
      flex-direction: column;
      align-items: center;
    }

    .price {
      width: 70%;
      height: 350px;
      margin-bottom: 35px;
    }

    .price h3 {
      font-size: 25;
    }
  }

  /* ----------------------------------------------
    Generated by AnimatiSS
    Licensed under FreeBSD License
    URL: https://xsgames.co/animatiss
    Twitter: @xsgames_
  ---------------------------------------------- */

  #logins:hover {
    animation: shadow-drop-center 0.4s linear both;
  }

  @keyframes shadow-drop-center {
    0% {
      box-shadow: 0 0 0 0 transparent;
    }

    100% {
      box-shadow: 0 0 20px 0 rgba(252, 116, 30, 0.55);
    }
  }
</style>