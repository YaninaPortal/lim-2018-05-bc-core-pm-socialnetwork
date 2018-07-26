const  btnLogout = document.getElementById('btnLogout');
const  btnsignin = document.getElementById('btnsignin');
const  btnregister = document.getElementById('btnregister');
const name=document.getElementById('username');
const  mail = document.getElementById('mail');
const  pass = document.getElementById('pass');
const  email = document.getElementById('email');
const  password = document.getElementById('password');
const  confirmPassword = document.getElementById('confirmPassword');
const  logout = document.getElementById('logout');
const spinner=document.getElementById('spinner');
const login =document.getElementById('login');
const facebook =document.getElementById('facebook');
const google =document.getElementById('google');
let contenido=document.getElementById('contenido');
const registrate=document.getElementById('registrate');
const showRegister=document.getElementById('showRegister');
const post=document.getElementById('post');
const btnSave=document.getElementById('btnSave');
const posted=document.getElementById('posted');
const bd=document.getElementById('bd');
const error = document.querySelector('.error');
const err = document.querySelector('.err');






window.onload = ( ) =>{
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            login.classList.remove('hiden');
            logout.classList.add('hiden');
            bd.classList.remove('hiden');
            posted.classList.remove('hiden');
            
            console.log('Inicio Logueado');
           contenido.innerHTML= 
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
            registrate.classList.add('hiden');
            bd.classList.add('hiden');
            posted.classList.add('hiden');
        }
    });
}

showRegister.addEventListener('click',()=>{
    registrate.classList.remove('hiden');
    logout.classList.add('hiden');
    login.classList.add('hiden');
});

  


email.addEventListener('keyup',()=>{
   let exReg =/^[a-zA-Z0-9.#$%&*+_~-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-]*$/;
   let test = email.value.length === 0 || exReg.test(email.value);
  if (test) {
    email.classList.add("valid");
    error.innerHTML = " ";
    email.classList.remove("invalid");
    error.classList.remove("error");
    error.classList.remove("error active");
    
    
  } else {
    email.classList.remove("valid");
    error.classList.add("error");
    email.classList.add("invalid");
    error.innerHTML = "email incorrecto";
    error.classList.add("error active");
  }
});

confirmPassword.addEventListener('keyup',()=>{
    
   if (password.value===confirmPassword.value) {
    confirmPassword.classList.add("valid");
    confirmPassword.classList.remove("invalid");
    err.innerHTML = "";
    err.classList.remove("error");
    err.classList.remove("error active");
     
     
   } else {
    confirmPassword.classList.remove("valid");
    confirmPassword.classList.add("invalid");
    err.innerHTML = "verifica de nuevo";
    err.classList.add("error");
    err.classList.add("error active");
   }
 });

btnregister.addEventListener('click',()=>{
   
 
  if (password.value===confirmPassword.value) {
    registrate.classList.add('hiden');
    bd.classList.remove('hiden');
    posted.classList.remove('hiden');


    firebase.auth().createUserWithEmailAndPassword(email.value, password.value)
    .then(function(result){
         user.displayName=name.value;
         user.email=email.value;
         user.uid=password.value;
        writeUserData(user.uid,name.value,user.email.value);
        
       
        console.log('Se creo el usuario')
    })
    .catch(function(error) {
        console.log(error.code,error.message);
    });

  } else {
    bd.classList.add('hiden');
    posted.classList.add('hiden');
  }
   
})

btnsignin.addEventListener('click',()=> {
    registrate.classList.add('hiden');
    firebase.auth().signInWithEmailAndPassword(mail.value, pass.value)
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
    registrate.classList.add('hiden');
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
google.addEventListener('click',() => {
    registrate.classList.add('hiden');
    var provider = new firebase.auth.GoogleAuthProvider();
   

    firebase.auth().signInWithPopup(provider)
      .then(function(result) {
          var user=result.user;
          writeUserData(user.uid,user.displayName,user.email); 
          console.log('Login Google') })
      .catch(function(error) {
        console.log(error.code);
        console.log(error.message);
        console.log(error.email);
        console.log(error.credential);
    });
  
});

btnSave.addEventListener('click',()=>{
    let userId=firebase.auth().currentUser.uid;
    const newPost=writeNewPost(userId,post.value);

    let btnEdit =document.createElement('input');
    btnEdit.setAttribute('value','Editar');
    btnEdit.setAttribute('type','button');
    let btnDelete=document.createElement('input');
    btnDelete.setAttribute('value','Eliminar');
    btnDelete.setAttribute('type','button');
    let contentPosted=document.createElement('div');
    let textPosted=document.createElement('textarea');
    textPosted.setAttribute('id',newPost);
    posted.appendChild(textPosted);
    posted.appendChild(btnEdit);
    posted.appendChild(btnDelete);
    textPosted.innerHTML=post.value;

})

    
  

function writeUserData(userId, name, email) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    
  });
}

function writeNewPost(uid, body) {
    // A post entry.
    var postData = {
      uid: uid,
      body: body,
    };
  
    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('posts').push().key;
  
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/posts/' + newPostKey] = postData;
    updates['/user-posts/' + uid + '/' + newPostKey] = postData;
  
    firebase.database().ref().update(updates);
    return newPostKey;
}
