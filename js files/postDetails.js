// Show user name and photo when login
let token = localStorage.getItem("token");
let infoContainer = document.querySelector("nav .info ");
infoContainer.style.display = "flex";
if (token != null) {
  let name = JSON.parse(localStorage.getItem("user")).name;
  let image = JSON.parse(localStorage.getItem("user")).profile_image;
  if (Object.keys(image).length == 0) {
    image = "../images/person.png";
  }
  infoContainer.innerHTML = ` <img src="${image}" alt="profile image" />
          <span>${name}</span>`;
} else {
  infoContainer.innerHTML = "<P>not logged in</P>";
}
//********************************************************************** */
let postContainer = document.querySelector(".post-details .post");
let commentsContainer = document.querySelector(".post-details .comments");
function getSelectedPost(id) {
  axios
    .get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then((response) => {
      var post = response.data.data;
      // check title
      let postTitle = "";
      if (post.title != null) {
        postTitle = post.title;
      }
      // **********************
      // check profile image
      profileImage = "../images/person.png";
      if (typeof post.author.profile_image != "object") {
        profileImage = post.author.profile_image;
      }
      // **********************
      let content = `
    <div class="post-header">
   <div class="one">
     <img src=${profileImage} alt="profile image" />
      <div class="info">
        <h2>${post.author.name}</h2>
        <h4>${post.author.username}</h4>
        </div>
   </div>
      <h4>${post.created_at}</h4>
    </div>
    <!-- End post header -->
    <div class="post-body">
      <div class="image">
        <img src=${post.image} alt="profile image" />
      </div>
      <h2>${postTitle}</h2>
      <p>
      ${post.body}
      </p>
      <hr />
    </div>
    <div class="post-footer">
      <span>(${post.comments_count}) comments</span>
    </div>
    `;
      postContainer.innerHTML += content;
      // *************************************
      let comments = post.comments;
      if (comments.length != 0) {
        for (const comment of comments) {
          // check title
          let postTitle = "";
          if (post.title != null) {
            postTitle = comment.title;
          }
          // **********************
          // check profile image
          profileImage = "../images/person.png";
          if (typeof post.author.profile_image != "object") {
            profileImage = comment.author.profile_image;
          }
          // **********************
          commentsContainer.innerHTML += `
           <div class="comment">
            <div class="info">
              <img src=${profileImage} alt="person image" />
              <span>${comment.author.name}</span>
            </div>
            <div class="comment-body">${comment.body}</div>
          </div>
          `;
        }
      } else {
        commentsContainer.innerHTML += `
        <p>There is no comments here.</p>
        <p>Be the first to comment.</p>`;
      }
      // if username of the post author =  username of the logged in user => show update post menu
      if (localStorage.getItem("token") != null) {
        if (
          post.author.username ==
          JSON.parse(localStorage.getItem("user")).username
        ) {
          document.querySelector(".update-post").style.display = "block";
        }
      }
      // ******************
      // if username of the post author =  username of the logged in user => show delete post
      if (localStorage.getItem("token") != null) {
        if (
          post.author.username ==
          JSON.parse(localStorage.getItem("user")).username
        ) {
          document.querySelector(".delete-post").style.display = "block";
        }
      }
    })
    .catch((error) => {
      alert(error.message);
    });
}
getSelectedPost(localStorage.getItem("postDetails"));
//********************************************************************** */
// check if the user has logged in or not
if (localStorage.getItem("token") == null) {
  document.querySelector(".add-comment").style.display = "none";
}
//********************************************************************** */
let comment = document.getElementById("comment-input");
let sendComment = document.getElementById("send-comment");
sendComment.addEventListener("click", () => {
  let bodyParams = {
    body: comment.value,
  };
  let token = localStorage.getItem("token");
  let postID = localStorage.getItem("postDetails");
  axios
    .post(
      `https://tarmeezacademy.com/api/v1/posts/${postID}/comments`,
      bodyParams,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      window.location.reload();
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
});
//********************************************************************** */
// Update the post
let newTitle = document.getElementById("new-title");
let newBody = document.getElementById("new-body");
let newImage = document.getElementById("new-image");
let newImageButton = document.getElementById("upload-new-image");
let updatePost = document.getElementById("update-post");
updatePost.addEventListener("click", () => {
  let formData = new FormData();
  // put request is the same post request but we add the following statement
  formData.append("body", newBody.value);
  formData.append("title", newTitle.value);
  formData.append("image", newImage.files[0]);
  formData.append("_method", "put");
  let postID = localStorage.getItem("postDetails");
  // ********************
  axios
    .post(`https://tarmeezacademy.com/api/v1/posts/${postID}`, formData, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      alert("Your post has been updated successfuly");
      location.reload();
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
});
// upload image Button (update post section)
newImageButton.addEventListener("click", () => {
  newImage.click();
});
//********************************************************************** */
// Delete the post
let deletePostButton = document.getElementById("delete-post-btn");
deletePostButton.addEventListener("click", () => {
  let confirm = window.confirm("Are you sure you want to delete your post?");
  if (confirm == true) {
    let postID = localStorage.getItem("postDetails");
    // delete request
    axios
      .delete(`https://tarmeezacademy.com/api/v1/posts/${postID}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        alert("Your post has been deleted successfuly");
        location.href = "home.html";
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  }
});
//********************************************************************** */
