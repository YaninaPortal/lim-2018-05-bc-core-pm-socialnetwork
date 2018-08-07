function writeUserData(userId, name, email, imageUrl) {
    
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl,
  });
  
}

function writeNewPost(uid, body,name,imageUrl) {
  // A post entry.
  
  var postData = {
    
    uid: uid,
    body: body,
    username:name,
    image:imageUrl,
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


window.validation=(mail)=>{
  let exReg =/^[a-zA-Z0-9.#$%&*+_~-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-]*$/;
   // let test = mail.value.length === 0 || exReg.test(mail.value);
  let test = exReg.test(mail);
  return test;

}
