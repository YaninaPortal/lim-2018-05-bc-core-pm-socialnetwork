const  btnLogout = document.getElementById('btnLogout');
const perfil=document.getElementById('perfil');
const  logout = document.getElementById('logout');
const post=document.getElementById('post');
const btnSave=document.getElementById('btnSave');
const posted=document.getElementById('posted');
const bd=document.getElementById('bd');


let contenido=document.getElementById('contenido');
var database = firebase.database();
window.onload = ( ) =>{
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            
            console.log('Inicio Logueado');
            
            console.log(user.uid);

            if(user.displayName!=null){
                var fire=firebase.database().ref().child('users');
                fire.on ('value',function(data){
                
                contenido.innerHTML=
                `<div>
                <img src="${data.val()[user.uid].profile_picture}" alt="perfil" width="70" height="70">
                <h2>Hola  ${data.val()[user.uid].username}</h2>
                <p>${data.val()[user.uid].email}</p>
                </div>`;
               })

            }else {
                
                var fire=firebase.database().ref().child('users');
                fire.on ('value',function(data){
                
                contenido.innerHTML=
                `<div>
                <img src="${data.val()[user.uid].profile_picture}" alt="perfil" width="70" height="70">
                <h2>Hola  ${data.val()[user.uid].username}</h2>
                <p>${data.val()[user.uid].email}</p>
                </div>`;
               })
            }
            
        } else {
            console.log('No esta logueado');
            
            
            
        }
    });
}
btnLogout.addEventListener('click',()=>{
    firebase.auth().signOut()
    .then(function(){
        console.log('cerro sesion');
        window.location.href='login.html';
        
       
    }).catch(function(error){
        console.log('error al cerrar sesion');
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
    
    textPosted.innerHTML=post.value;
    
  btnDelete.addEventListener('click', () => {

    firebase.database().ref().child('/user-posts/' + userId + '/' + newPost).remove();
    firebase.database().ref().child('posts/' + newPost).remove();

    while(posted.firstChild) posted.removeChild(posted.firstChild);

    
    reload_page();

  });

  btnEdit.addEventListener('click', () => {
    const newUpdate = document.getElementById(newPost);
    const nuevoPost = {
      body: newUpdate.value,
    };

    var updatesUser = {};
    var updatesPost = {};

    updatesUser['/user-posts/' + userId + '/' + newPost] = nuevoPost;
    updatesPost['/posts/' + newPost ] = nuevoPost;

    firebase.database().ref().update(updatesUser);
    firebase.database().ref().update(updatesPost);
    
  });
  contentPosted.appendChild(textPosted);
  contentPosted.appendChild(btnEdit);
  contentPosted.appendChild(btnDelete);
  posted.appendChild(contentPosted);
})



function reload_page (){
    window.location.reload();
}
