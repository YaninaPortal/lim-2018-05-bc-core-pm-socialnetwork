//llamando elementos seccion nav
const perfil=document.getElementById('perfil');
const wall=document.getElementById('wall');
const  btnLogout = document.getElementById('btnLogout');
//llamando elementos de la seccion perfil
const sectionPerfil=document.getElementById('sectionPerfil');
let contenido=document.getElementById('contenido');
const post=document.getElementById('post');
const btnSave=document.getElementById('btnSave');
const posted=document.getElementById('posted');
//llamando elementos de la seccion muro
const sectionWall=document.getElementById('sectionWall');
const publicaciones= document.getElementById('publicaciones');

var database = firebase.database();

perfil.addEventListener('click',()=>{
    sectionWall.classList.add('hiden');
    sectionPerfil.classList.remove('hiden');
   
});

wall.addEventListener('click',()=>{
    sectionPerfil.classList.add('hiden');
    sectionWall.classList.remove('hiden');

    
  firebase.database().ref().child('posts').once ('value',function(data){
       let userIdLog=firebase.auth().currentUser.uid;
       let dataUserPosts=data;
       let arrkeypost=Object.keys(dataUserPosts.val());
    
      arrkeypost.forEach(keyPost=>{
           let body=dataUserPosts.val()[keyPost].body;
           let uid=dataUserPosts.val()[keyPost].uid;
           let nameUser=dataUserPosts.val()[keyPost].username;
           let img=dataUserPosts.val()[keyPost].image;
           //creando elementos para el muro
           let namePhoto = document.createElement('div');
           namePhoto.setAttribute('class', 'divNamImg');
           let image=document.createElement('img');
           image.setAttribute('src', img);
           image.setAttribute('width', '30'); 
           image.setAttribute('height', '30');  
           let namePost=document.createElement('span');
           namePost.textContent=nameUser;

           let publications = document.createElement('div');
           publications.setAttribute('class', 'divPost');
           let sectionPost=document.createElement('textarea');
           sectionPost.setAttribute('id', keyPost);
           sectionPost.textContent = body;
           let sectionLik = document.createElement('div');
      
  
           let pLik=document.createElement('span'); 
           pLik.setAttribute('id', `likeco${keyPost}`);
           let btnLik= document.createElement('input'); 
           btnLik.setAttribute('id', `lik${keyPost}`);  
           btnLik.setAttribute('value','Me gusta'); 
           btnLik.setAttribute('type','button'); 
           publicaciones.appendChild(namePhoto);
           publicaciones.appendChild(publications);
  
           namePhoto.appendChild(image);
           namePhoto.appendChild(namePost);
  
           publications.appendChild(sectionPost);
           publications.appendChild(sectionLik); 
  
           sectionLik.appendChild(btnLik); 
           sectionLik.appendChild(pLik);
      
  
           let likePo = document.querySelector(`#likeco${keyPost}`); 
      
  
           let lik = document.querySelector(`#lik${keyPost}`); 
      
           firebase.database().ref('posts/' + keyPost) 
           .once('value', (postRef) =>{ 
              const postLike = postRef.val();
              const objRefLike = postLike.postWithLikes || [];  
              if(objRefLike.length===0){
                 // likePoints.innerHTML=objRefLike.length; 
                 likePo.innerHTML='';
                 lik.classList.remove('mg');
              }else if(objRefLike.length>0){
                  likePo.innerHTML=objRefLike.length;
                  lik.classList.add('mg');
                }
        
             lik.addEventListener('click', () => { 
                 if (objRefLike.indexOf(userIdLog) === -1) { 
                      objRefLike.push(userIdLog); 
                      likePo.innerHTML=objRefLike.length;
                      lik.classList.add('mg');
                      likeFirebase(objRefLike,keyPost,uid)
                    } 
                  else if(objRefLike.indexOf(userIdLog)>-1){
                      objRefLike.splice(objRefLike.indexOf(userIdLog), 1);
                      likePo.innerHTML=objRefLike.length;
                      lik.classList.remove('mg');
                      likeFirebase(objRefLike,keyPost,uid)
                    }
                })
            })
        })   
    });
});

const likeFirebase=(objRefLike,keyPost,uid)=>{
    postLike.likeCount = objRefLike.length;
    postLike.postWithLikes = objRefLike; 
    let updates = {}; 
    updates['/posts/' + keyPost] = postLike; 
    updates['/user-posts/' + uid + '/' + keyPost] = postLike; 
    return firebase.database().ref().update(updates); 
}

window.onload = ( ) =>{
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('Inicio Logueado');
            let fireb=firebase.database().ref().child('users');
            fireb.on ('value',function(data){
                
              contenido.innerHTML=
                `<div>
                <img src="${data.val()[user.uid].profile_picture}" alt="perfil" width="70" height="70">
                <h2>Hola  ${data.val()[user.uid].username}</h2>
                <p>${data.val()[user.uid].email}</p>
                </div>`;
            })

            let fire=firebase.database().ref().child('user-posts');
            fire.once ('value',function(data){

                let dataUserPosts=data;
                let arrkeypost=Object.keys(dataUserPosts.val()[user.uid]);
                //console.log(arrkeypost);
                    
                arrkeypost.forEach(keyPost=>{
                    //console.log(keyPost)
                    let body=dataUserPosts.val()[user.uid][keyPost].body;
                    //console.log(body);
                    showPublications(body,user.uid,keyPost);
                });
            })    
        } else {
            console.log('No esta logueado');
        }
   });
}

btnSave.addEventListener('click',()=>{
    let userId=firebase.auth().currentUser.uid;
    let displayName=firebase.auth().currentUser.displayName;
    if(displayName!=null){
        let imageUrl=firebase.auth().currentUser.photoURL;
        const newPost=writeNewPost(userId,post.value,displayName,imageUrl);
        reload_page();
    }else{
        let images='http://droidlessons.com/wp-content/uploads/2017/05/person-1824144_960_720-e1494184045144.png';
        const nePost=writeNewPost(userId,post.value,displayName,images);
        reload_page();
    }
})

btnLogout.addEventListener('click',()=>{
    firebase.auth().signOut()
    .then(function(){
        console.log('cerro sesion');
        window.location.href='login.html';
    }).catch(function(error){
        console.log('error al cerrar sesion');
    });
});


const showPublications=(postContent,userId,keyPost,nameUs,img)=>{
    let namePhoto = document.createElement('div');
    namePhoto.setAttribute('class','divNameImg'); 
    let namePost=document.createElement('span');
    namePost.textContent=nameUs;
    let image=document.createElement('img');
    image.setAttribute('src', img);
    image.setAttribute('width', '30'); 
    image.setAttribute('height', '30');

    let publications = document.createElement('div');
    publications.setAttribute('class', 'divPost');

    
    

    let sectionPost = document.createElement('textarea');
    sectionPost.setAttribute('id', keyPost);
    sectionPost.textContent = postContent;
    

    let allBtns = document.createElement('div');
    allBtns.setAttribute('class', 'allBtns');
    

    
    let pLike=document.createElement('div'); 
    pLike.setAttribute('id', `likecount${keyPost}`);

    let btnLike= document.createElement('div'); 
    btnLike.setAttribute('id', `like${keyPost}`); 
     
    btnLike.textContent='Me gusta'; 
    btnLike.setAttribute('class','btns'); 

    

    let btnEdit = document.createElement('div'); 
    btnEdit.setAttribute('id', `edit${keyPost}`); 
     
    btnEdit.textContent='Editar'; 
    btnEdit.setAttribute('class','btns'); 

    let btnDelete = document.createElement('div'); 
    btnDelete.setAttribute('id', `delet${keyPost}`); 
     
    btnDelete.textContent='Eliminar'; 
    btnDelete.setAttribute('class','btns'); 

    
    

    
    posted.appendChild(namePhoto); 
    posted.appendChild(publications);
    posted.appendChild(pLike);
    posted.appendChild(allBtns); 

    namePhoto.appendChild(image);
    namePhoto.appendChild(namePost)

    publications.appendChild(sectionPost); 

    allBtns.appendChild(btnLike);
    allBtns.appendChild(btnDelete);
    allBtns.appendChild(btnEdit);

    let likePoints = document.querySelector(`#likecount${keyPost}`);
    likePoints.setAttribute('class','btnLike');  
    

    let likes = document.querySelector(`#like${keyPost}`); 
    
        //let userId = firebase.auth().currentUser.uid; 
        //const currentPost = document.getElementById(`like${keyPost}`); 
        //const likeButton = likes.querySelector('.like-button'); 
    firebase.database().ref('posts/' + keyPost) 
    .once('value', (postRef) =>{ 
        const postLike = postRef.val();
        const objRefLike = postLike.postWithLikes || [];  
        if(objRefLike.length===0){
            // likePoints.innerHTML=objRefLike.length; 
            likePoints.innerHTML='';
            likes.classList.remove('mg');
        }else if(objRefLike.length===1){
            likePoints.innerHTML=objRefLike.length;
            likes.classList.add('mg');
        }
        likes.addEventListener('click', () => { 
            if (objRefLike.indexOf(userId) === -1) { 
                objRefLike.push(userId); 
                postLike.likeCount = objRefLike.length; 
                likePoints.innerHTML=objRefLike.length;
                
                likes.classList.add('mg');

                postLike.postWithLikes = objRefLike; 
                let updates = {}; 
                updates['/posts/' + keyPost] = postLike; 
                updates['/user-posts/' + userId + '/' + keyPost] = postLike; 
                return firebase.database().ref().update(updates); 
            } //else if (objRefLike.indexOf(userId) === 0) { 
              //likeButton.disabled = false; 
              //}
            else if(objRefLike.indexOf(userId)>-1){
                objRefLike.splice(objRefLike.indexOf(userId), 1);
                postLike.likeCount = objRefLike.length;
                //likePoints.innerHTML=objRefLike.length;
                likePoints.innerHTML='';
                likes.classList.remove('mg');
                postLike.postWithLikes = objRefLike; 
                let updates = {}; 
                updates['/posts/' + keyPost] = postLike; 
                updates['/user-posts/' + userId + '/' + keyPost] = postLike; 
                return firebase.database().ref().update(updates); 
            }
              //postLike.postWithLikes = objRefLike; 

               //let updates = {}; 
              //updates['/posts/' + keyPost] = postLike; 
              //updates['/user-posts/' + userId + '/' + keyPost] = postLike; 
               //return firebase.database().ref().update(updates); 
            })
        }) 
    

    let delet = document.querySelector(`#delet${keyPost}`);
    delet.addEventListener('click', () => {
        firebase.database().ref().child('/user-posts/' + userId + '/' + keyPost).remove();
        firebase.database().ref().child('posts/' + keyPost).remove();
   
        while(posted.firstChild) posted.removeChild(posted.firstChild);
        reload_page()
    });

    let edit = document.querySelector(`#edit${keyPost}`);
    edit.addEventListener('click', () => {
      let editPost = document.getElementById(keyPost);
      let nuevoPost = {
            uid: userId,
          body: editPost.value,
          username:nameUs,
          image:imgU,
        };

       var updatesUser = {};
       var updatesPost = {};

      updatesUser['/user-posts/' + userId + '/' + keyPost] = nuevoPost;
      updatesPost['/posts/' + keyPost ] = nuevoPost;

      firebase.database().ref().update(updatesUser);
      firebase.database().ref().update(updatesPost);
      return nuevoPost;
    });
        
    
}
   
const reload_page=()=> {
    window.location.reload();
}; 