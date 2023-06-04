<script>
  import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
  import { initializeApp } from 'firebase/app';


  const auth = getAuth();

  let email = '';

  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('Password reset email sent!');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`Error sending password reset email: ${errorMessage} (${errorCode})`);
      });
  };
</script>
<body >
<div class="container">
  <div class="forms-container"> 
    <h2 class="title">Recuperar Contraseña</h2>
    <div class="input-field">
      <i class="fas fa-user" />
      <input
        type="text"
        placeholder="Ingrese su email"
        bind:value={email}
      />
      
      <button
            class="btn transparent"
            
            on:click={handleResetPassword}
          >
            Recuperar Contraseña
           
            </button>
    </div>
  </div>
</div>
</body>

<style>

body {
  margin: 0;
  padding: 0;
}
  .forms-container {
    width: 100%;
    height: 70%;
    background-image: linear-gradient(-45deg, #0b363f 0%, #184d51 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 41%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .container {
      position: fixed;
      margin-left: 15%;
      background-color: #fc741e;
      min-height: 100vh;
      
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  }
  
  .title {    
      font-size: 2.2rem;
      color: #ffffff;
      margin-bottom: 10px;
  }
  
  .input-field {
      max-width: 380px;
      width: 100%;
      background-color: #f0f0f0;
      margin: 10px 0;
      height: 55px;
      border-radius: 55px;
      display: grid;
      grid-template-columns: 15% 85%;
      padding: 0 0.4rem;
      position: relative;
  }
  
  .input-field i {
      text-align: center;
      line-height: 55px;
      color: #acacac;
      transition: 0.5s;
      font-size: 1.1rem;
  }
  
  .input-field input {
      background: none;
      outline: none;
      border: none;
      line-height: 1;
      font-weight: 600;
      font-size: 1.1rem;
      color: #333;
  }
  
  .input-field input::placeholder {
      color: #aaa;
      font-weight: 500;
  }
  
  
  .btn {
    width: 380px;
    background-color: #002837;
    border: none;
    outline: none;
    height: 49px;
    border-radius: 49px;
    color: #fff;
    text-transform: uppercase;
    font-weight: 600;
    margin: 10px 0;
    cursor: pointer;
    transition: 0.5s;
  }

  .btn:hover {
    background-color: #174ba5;
  }
  
  </style>
