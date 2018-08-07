const  mail = document.getElementById('mail');
const  pass = document.getElementById('pass');
const  btnsignin = document.getElementById('btnsignin');
const showRegister=document.getElementById('showRegister');
const facebook =document.getElementById('facebook');
const google =document.getElementById('google');
const error = document.querySelector('.error');
window.onload = ( ) =>{
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location.href='perfil.html'
            console.log('Inicio Logueado');
            
            //console.log(user.uid);


         
        } else {
            console.log('No esta logueado');
            
            
            
        }
    });
}
showRegister.addEventListener('click',()=>{
    window.location.href = 'register.html';    
});


mail.addEventListener('keyup',()=>{
    
   let test= validation(mail.value);
   if (test) {
     mail.classList.add("valid");
     error.innerHTML = " ";
     mail.classList.remove("invalid");
     error.classList.remove("error");
     error.classList.remove("erroractive");
     
     
   } else if(mail.value.length === 0){
     mail.classList.remove("valid");
     error.classList.add("error");
     mail.classList.add("invalid");
     error.innerHTML = "ingresa email";
     error.classList.add("erroractive");
   }else{
    mail.classList.remove("valid");
    error.classList.add("error");
    mail.classList.add("invalid");
    error.innerHTML = "email incorrecto";
    error.classList.add("erroractive");
   }
});


btnsignin.addEventListener('click',()=> {
    
    firebase.auth().signInWithEmailAndPassword(mail.value, pass.value)
    .then(function(result){
        
       // console.log(result);
        console.log('Inicia Sesion')
        var user= firebase.auth().currentUser;
        window.location.href = 'perfil.html';
        
        
        console.log('Inicia Sesion')
    })
    .catch(function(error) {
        
        console.log(error.code,error.message);
    });
})


facebook.addEventListener('click', () => {
    
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
       'display' : 'popup'
    });
    firebase.auth().signInWithPopup(provider)
    .then(function(result) {
        
        var user=result.user;
        writeUserData(user.uid,user.displayName,user.email,user.photoURL);
        window.location.href = 'perfil.html';     
        console.log('Logueado con Fb')
    })
    .catch(function(error) {
      console.log(error.code);
      console.log(error.message);
      console.log(error.email);
      console.log(error.credential);
      // ...
      
    });
})
google.addEventListener('click',() => {
    
    var provider = new firebase.auth.GoogleAuthProvider();
   

    firebase.auth().signInWithPopup(provider)
      .then(function(result) {
         
          var user=result.user;
          writeUserData(user.uid,user.displayName,user.email,user.photoURL); 
          window.location.href = 'perfil.html';
          console.log('Login Google') })
      .catch(function(error) {
        console.log(error.code);
        console.log(error.message);
        console.log(error.email);
        console.log(error.credential);
    });
  
});
