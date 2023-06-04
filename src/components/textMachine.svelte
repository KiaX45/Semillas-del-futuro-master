<script>
    export let text ="Texto por defecto"
</script>

<span>{text}</span>

<style>
 span{
    display: block;
    font-size: 40px;
    font-family: 'Dancing Script', cursive ;
    white-space:  nowrap;
    border-right: 4px solid;
    /*Numero de caracteres mismo para steps*/
    width: 30ch;

    animation: typing 3s steps(30), blink .5s infinite step-end alternate;
    overflow: hidden;
 }

 @keyframes typing {
    from {width: 0}
 }

 @keyframes blink{
    50% {border-color: transparent}
 }
    
</style>