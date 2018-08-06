const perfil=document.getElementById('perfil');
const wall=document.getElementById('wall');
const sectionPerfil=document.getElementById('sectionPerfil');
const sectionWall=document.getElementById('sectionWall');

const  btnLogout = document.getElementById('btnLogout');
const  logout = document.getElementById('logout');
const post=document.getElementById('post');
const btnSave=document.getElementById('btnSave');
const posted=document.getElementById('posted');
const bd=document.getElementById('bd');

let contenido=document.getElementById('contenido');
var database = firebase.database();


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

firebase.database().ref().child('posts')
.once ('value',function(data){
    let dataUserPosts=data;
    
    let arrkeypost=Object.keys(dataUserPosts.val());
    
    arrkeypost.forEach(keyPost=>{
      
      let body=dataUserPosts.val()[keyPost].body;
      let uid=dataUserPosts.val()[keyPost].uid;
      let nameUser=dataUserPosts.val()[keyPost].username;
      let img=dataUserPosts.val()[keyPost].image;
      
      
      showWall(body,uid,keyPost,nameUser,img)
            
        
    });
});
    
function showWall(body,uid,keyPost,nameUser,img){
    let namePhoto = document.createElement('div');
    let publications = document.createElement('div');

    publications.setAttribute('class', 'divPost');
    namePhoto.setAttribute('class', 'divNamImg');

    let namePost=document.createElement('span');
    let image=document.createElement('img');
 
    let sectionPost=document.createElement('textarea');
    
    sectionPost.setAttribute('id', keyPost);
    image.setAttribute('src', img);
    image.setAttribute('width', '30'); 
    image.setAttribute('height', '30');  
    
    sectionPost.textContent = body;
    namePost.textContent=nameUser;

    let sectionLike = document.createElement('div');
    

    let pLike=document.createElement('span'); 
    pLike.setAttribute('id', `likecount${keyPost}`);
    

    let btnLike= document.createElement('input'); 
    btnLike.setAttribute('id', `like${keyPost}`); 
    //btnLike.setAttribute('class','falta clase'); 
    btnLike.setAttribute('value','Me gusta'); 
    btnLike.setAttribute('type','button'); 

    

    sectionLike.appendChild(btnLike); 
    sectionLike.appendChild(pLike); 
    
    namePhoto.appendChild(image);
    namePhoto.appendChild(namePost)
    publicaciones.appendChild(namePhoto);
    publicaciones.appendChild(publications);
    publications.appendChild(sectionPost);
    publications.appendChild(sectionLike); 
    

    let likePoints = document.querySelector(`#likecount${keyPost}`); 
    

    let likes = document.querySelector(`#like${keyPost}`); 
    
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
            if (objRefLike.indexOf(uid) === -1) { 
                objRefLike.push(uid); 
                postLike.likeCount = objRefLike.length; 
                likePoints.innerHTML=objRefLike.length;
                
                likes.classList.add('mg');

                postLike.postWithLikes = objRefLike; 
                let updates = {}; 
                updates['/posts/' + keyPost] = postLike; 
                updates['/user-posts/' + uid + '/' + keyPost] = postLike; 
                return firebase.database().ref().update(updates); 
            } //else if (objRefLike.indexOf(userId) === 0) { 
              //likeButton.disabled = false; 
              //}
            else if(objRefLike.indexOf(uid)>-1){
                objRefLike.splice(objRefLike.indexOf(uid), 1);
                postLike.likeCount = objRefLike.length;
                //likePoints.innerHTML=objRefLike.length;
                likePoints.innerHTML='';
                likes.classList.remove('mg');
                postLike.postWithLikes = objRefLike; 
                let updates = {}; 
                updates['/posts/' + keyPost] = postLike; 
                updates['/user-posts/' + uid + '/' + keyPost] = postLike; 
                return firebase.database().ref().update(updates); 
            }
               
        })
    }) 
    

        
    

}

window.onload = ( ) =>{
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            wall.addEventListener('click',()=>{
             sectionPerfil.classList.add('hiden');
             sectionWall.classList.remove('hiden');
            })

            perfil.addEventListener('click',()=>{
              sectionPerfil.classList.remove('hiden');
              sectionWall.classList.add('hiden');
            });
            console.log('Inicio Logueado');
            
            //console.log(user.uid);

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



btnLogout.addEventListener('click',()=>{
    firebase.auth().signOut()
    .then(function(){
        console.log('cerro sesion');
        window.location.href='login.html';
        
       
    }).catch(function(error){
        console.log('error al cerrar sesion');
    });
});


function showPublications(postContent,userId,keyPost){ 
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

    
    

    
     
    posted.appendChild(publications);
    posted.appendChild(pLike);
    posted.appendChild(allBtns); 

    publications.appendChild(sectionPost); 
    allBtns.appendChild(btnLike);
    allBtns.appendChild(btnDelete);
    allBtns.appendChild(btnEdit);

    let likePoints = document.querySelector(`#likecount${keyPost}`); 
    

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