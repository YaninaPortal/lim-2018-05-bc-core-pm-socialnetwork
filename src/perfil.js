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
            
            //console.log(user.uid);

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
               var fire=firebase.database().ref().child('user-posts');
                fire.on ('value',function(data){

                    let dataUserPosts=data;
                    let objkeypostBody=Object.keys(dataUserPosts.val()[user.uid]);
                    //console.log(objkeypostBody);
                    let allPostKeys=Object.keys(dataUserPosts);
                    objkeypostBody.forEach(keyPost=>{
                        //console.log(keyPost)
                        let body=dataUserPosts.val()[user.uid][keyPost].body;
                        //console.log(body);
                        showPublications(body,user.uid,keyPost);
                    });
                    
                    
                
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
               
               var fire=firebase.database().ref().child('user-posts');
                fire.on ('value',function(data){

                    let dataUserPosts=data;
                    let objkeypostBody=Object.keys(dataUserPosts.val()[user.uid]);
                    //console.log(objkeypostBody);
                    let allPostKeys=Object.keys(dataUserPosts);
                    objkeypostBody.forEach(keyPost=>{
                        //console.log(keyPost)
                        let body=dataUserPosts.val()[user.uid][keyPost].body;
                        //console.log(body);
                        showPublications(body,user.uid,keyPost);
                    });
                    
                    
                
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
    reload_page();
})


function showPublications(postContent,userId,keyPost){
    let publications = document.createElement('div');

    let sectionPost = document.createElement('textarea');
    sectionPost.setAttribute('id', keyPost);
    sectionPost.textContent = postContent;

    let sectionLike = document.createElement('div');
    let pLike=document.createElement('span');

    let btnLike= document.createElement('input');
    btnLike.setAttribute('id', `like${keyPost}`);
    btnLike.setAttribute('class', 'like-button');
    btnLike.setAttribute('value','Me gusta');
    btnLike.setAttribute('type','button');

    let sectionButtons = document.createElement('div');

    let btnEdit = document.createElement('input');
    btnEdit.setAttribute('id', `edit${keyPost}`);
    btnEdit.setAttribute('value','Editar');
    btnEdit.setAttribute('type','button');
    
    let btnDelete = document.createElement('input');
    btnDelete.setAttribute('id', `delete${keyPost}`);
    btnDelete.setAttribute('value','Eliminar');
    btnDelete.setAttribute('type','button');
    
    sectionLike.appendChild(btnLike);
    sectionLike.appendChild(pLike);

    sectionButtons.appendChild(btnDelete);
    sectionButtons.appendChild(btnEdit);
    
    posted.appendChild(publications);
    publications.appendChild(sectionPost);
    publications.appendChild(sectionLike);
    publications.appendChild(sectionButtons);
    
    let likes = document.getElementById(`like${keyPost}`);
    let edit = document.getElementById(`edit${keyPost}`);
    let delet = document.getElementById(`delete${keyPost}`);
    


    likes.addEventListener('click', () => {
        let userId = firebase.auth().currentUser.uid;
        //const currentPost = document.getElementById(`like${keyPost}`);
        const likeButton = likes.querySelector('.like-button');
        firebase.database().ref('posts/' + keyPost) 
        .once('value', (postRef) =>{
          const postLike = postRef.val();
          
          const objRefLike = postLike.postWithLikes || [];
          
          if (objRefLike.indexOf(userId) === -1) {
            objRefLike.push(userId);
            postLike.likeCount = objRefLike.length;
          } else if (objRefLike.indexOf(userId) === 0) {
            likeButton.disabled = false;
          }
          postLike.postWithLikes = objRefLike;
      
          let updates = {};
          updates['/posts/' + keyPost] = postLike;
          updates['/user-posts/' + userId + '/' + keyPost] = postLike;
          return firebase.database().ref().update(updates);
          
        })
      
    });
    
    delet.addEventListener('click', () => {
        firebase.database().ref().child('/user-posts/' + userId + '/' + keyPost).remove();
        firebase.database().ref().child('posts/' + keyPost).remove();
   
        while(posted.firstChild) posted.removeChild(posted.firstChild);
        reload_page()
    });
    edit.addEventListener('click', () => {
        const editPost = document.getElementById(keyPost);
      const nuevoPost = {
          body: editPost.value,
        };

       var updatesUser = {};
       var updatesPost = {};

      updatesUser['/user-posts/' + userId + '/' + keyPost] = nuevoPost;
      updatesPost['/posts/' + keyPost ] = nuevoPost;

      firebase.database().ref().update(updatesUser);
      firebase.database().ref().update(updatesPost);
    });
        
    
}
    
function reload_page() {
    window.location.reload();
}; 