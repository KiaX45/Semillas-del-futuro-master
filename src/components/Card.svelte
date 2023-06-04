<script>
export let titulo= "titulo por defecto";
export let text = "texto por defecto"
export let imagePath = "";
</script>


<div class="card shadow cardP" style="width: 20rem;">

  <div class="contenedor">
     <a href="/">
      <figure>
        <img src={imagePath} class="card-img-top" alt="Mision empresa">
        <div class="capa">
                    <h2>{titulo}</h2>
                </div>
      </figure>
    </a>
  </div>
  
  <div class="card-body">
    <h5 class="card-title title">{titulo}</h5>
    <p class="card-text cardtextP">{text}</p>
    <a href="/" class="btn btn-warning">Saber mas</a>
  </div>
</div>


<style>
  .cardP {
    background-color: #E67E22;
  }
  .cardtextP{
    text-align: justify;
  }
 .title{
    border-radius: 25px;
    text-align: center;
    width: auto;
    padding: 3px;
    background-color: #1B4F72 ;
    color: white;
 }

 /* *{margin: 0;padding: 0;
    box-sizing: border-box;
    font-family: sans-serif;} */
    
    .contenedor{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: auto;
    }
    .contenedor figure{
       position:relative;
        height: 250px;
        cursor: pointer;
        width: 350px;
        overflow: hidden;
        border-radius: 6px;
        box-shadow: 0px 15px 25px rgba(0,0,0,0.50);
    }
    .contenedor figure img{
        width: 100%;
        height: 100%;
        transition: all 400ms ease-out;
        will-change: transform;
    }
    .contenedor figure .capa{
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,103,123,0.7);
        transition: all 400ms ease-out;
        opacity: 0;
        visibility: hidden;
       text-align: center;
    }
    .contenedor figure:hover > .capa {
        opacity: 1;
        visibility: visible;
    }
    .contenedor figure:hover > .capa h2{
        margin-top: 70px;
        margin-bottom: 0px;
    }
    .contenedor figure:hover > img{
        transform: scale(1.3);
    }
    .contenedor figure .capa h2{
        color: #fff;
        font-weight: 400;
        margin-bottom: 0px;
        transition: all 400ms ease-out;
         margin-top: 30px;
    }
    /* .contenedor figure .capa p{
        color: #fff;
        font-size: 15px;
        line-height: 1.5;
        width: 100%;
        max-width: 220px;
        margin: 0;
    } */

</style>