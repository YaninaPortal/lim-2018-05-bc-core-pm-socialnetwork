let name = document.getElementById('username');
let  email = document.getElementById('email');
let  password = document.getElementById('password');
let  confirmPassword = document.getElementById('confirmPassword');
const  btnregister = document.getElementById('btnregister');
const  register = document.getElementById('register');
const error = document.querySelector('.error');
const err = document.querySelector('.err');

email.addEventListener('keyup',()=>{
  let exReg =/^[a-zA-Z0-9.#$%&*+_~-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-]*$/;
  let test = email.value.length === 0 || exReg.test(email.value);
 if (test) {
   email.classList.add("valid");
   error.innerHTML = " ";
   email.classList.remove("invalid");
   error.classList.remove("error");
   error.classList.remove("erroractive");
   
   
 } else {
   email.classList.remove("valid");
   error.classList.add("error");
   email.classList.add("invalid");
   error.innerHTML = "email incorrecto";
   error.classList.add("erroractive");
 }
});

confirmPassword.addEventListener('keyup',()=>{
   
  if (password.value===confirmPassword.value) {
   confirmPassword.classList.add("valid");
   confirmPassword.classList.remove("invalid");
   err.innerHTML = "";
   err.classList.remove("error");
   err.classList.remove("erroractive");
    
    
  } else {
   confirmPassword.classList.remove("valid");
   confirmPassword.classList.add("invalid");
   err.innerHTML = "verifica de nuevo";
   err.classList.add("error");
   err.classList.add("erroractive");
  }
});




btnregister.addEventListener('click',()=>{
  
  firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
  .then(function(result){
      if (password.value===confirmPassword.value) {
        let user=result.user
        window.location.href='perfil.html';
        let photoURL='http://droidlessons.com/wp-content/uploads/2017/05/person-1824144_960_720-e1494184045144.png';
        writeUserData(user.uid, name.value,user.email, photoURL);
        

        
        console.log('Se creo el usuario')
      }
  })
  
  .catch(function(error) {
    console.log(error.code,error.message);
    //perfil.classList.add('hiden');oculta
    window.location.href='register.html';
  })



 
});