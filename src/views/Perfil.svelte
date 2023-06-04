<!--Solo las personas autenticadas pueden viajar a este perfil-->
<script>
  import { user } from "../stores/User";
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";



  //console.log($user)
  
    onMount(() =>{
        if(!$user){
            navigate('/login', {replace:true})
        }
    })
    
</script>

<!--Vamos a preguntar si el usuario existe para mostrar este -->
<div>

</div>

<style>

</style>
