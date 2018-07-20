const  btnLogout = document.getElementById("btnLogout");
const  btnsignin = document.getElementById("btnsignin");
const  btnregister = document.getElementById("btnregister");
const  email = document.getElementById("email");
const  password = document.getElementById("password");
const  logout = document.getElementById("logout");
const spinner=document.getElementById("spinner");
const login =document.getElementById('login');
const facebook =document.getElementById('facebook');
const google =document.getElementById('google');
let name =document.getElementById('name');

const state={
    name:null
}
window.onload = ( ) =>{
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            login.classList.remove('hiden');
            logout.classList.add('hiden');
            console.log('Inicio Logueado');
            name.innerHTML= 
            `<div>
              <img src="${user.photoURL}" alt="perfil" width="70" height="70">
              <h2>Hola  ${user.displayName}</h2>
              <p>${user.email}</p>
              
            </div>`;
            console.log(user);
            //name.inner.HTML=state.name;
        } else {
            console.log('No esta logueado');
            login.classList.add('hiden');
            logout.classList.remove('hiden');
        }
    });
}


btnregister.addEventListener('click',()=>{

    firebase.auth().createUserWithEmailAndPassword(email.value, password.value,name.value)
    .then(function(){
        state.name=name.value
        console.log('Se creo el usuario')
    })
    .catch(function(error) {
        console.log(error.code,error.message);
    });
})

btnsignin.addEventListener('click',()=> {
    firebase.auth().signInWithEmailAndPassword(email.value, password.value)
    .then(function(){
        console.log('Inicia Sesion')
    })
    .catch(function(error) {
        console.log(error.code,error.message);
    });
})

btnLogout.addEventListener('click',()=>{
    firebase.auth().signOut()
    .then(function(){
        console.log('cerro sesion');
        login.classList.remove('hiden');
        logout.classList.add('hiden');
       
    }).catch(function(error){
        console.log('error al cerrar sesion');
    });
});


facebook.addEventListener('click', () => {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.setCustomParameters({
       'display' : 'popup'
    });
    firebase.auth().signInWithPopup(provider)
    .then(function(result) {
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
/*spinner.addEventListener('click',()=>{
    let provider = new firebase.auth.FacebookAuthProvider();
  provider.setCustomParameters({
    'display' : 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      console.log(user);
      // ...
      console.log('Logueado con Fb')
  }).catch(function(error) {
    console.log(error.code);
    console.log(error.message);
    console.log(error.email);
    console.log(error.credential);
    // ...
    
  });

});*/

google.addEventListener('click',() => {
    var provider = new firebase.auth.GoogleAuthProvider();
   

    firebase.auth().signInWithPopup(provider)
      .then(function(result) { console.log('Login Google') })
      .catch(function(error) {
        console.log(error.code);
        console.log(error.message);
        console.log(error.email);
        console.log(error.credential);
    });
  
  });
