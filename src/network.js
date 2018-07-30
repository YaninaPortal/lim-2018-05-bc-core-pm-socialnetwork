function writeUserData(userId, name, email, imageUrl) {
    
    firebase.database().ref('users/' + userId).set({
      username: name,
      email: email,
      profile_picture : imageUrl,
    });
    
}

function writeNewPost(uid, body) {
    // A post entry.
    var postData = {
      
      uid: uid,
      body: body,
      
      starCount: 0,
      
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
function toggleStar(postRef, uid) {
    postRef.transaction(function(post) {
      if (post) {
        if (post.stars && post.stars[uid]) {
          post.starCount--;
          post.stars[uid] = null;
        } else {
          post.starCount++;
          if (!post.stars) {
            post.stars = {};
          }
          post.stars[uid] = true;
        }
      }
      return post;
    });
}

function newPostForCurrentUser(text) {
    var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        return writeNewPost(firebase.auth().currentUser.uid, username,
            firebase.auth().currentUser.photoURL, text);
    });

}