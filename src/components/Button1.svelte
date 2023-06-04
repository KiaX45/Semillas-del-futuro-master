<script>
 export let texto;
 export let cerrarSesion;

</script>

<button type="button" class="btn btn-custom rounded " on:click={cerrarSesion}>{texto}</button>


<style>
  .btn-custom {
    background-color: #2E4053; /* Color azul oscuro */
    margin-left: 6px;
    color: #F4D03F;
  }

.btn-custom:hover{
  background-color: #F4D03F;
  color: black;
}

.btn-custom:active{
  background-color: #F4D03F;
  color: black;
}


</style>