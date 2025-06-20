// Show user name and photo when login
if (localStorage.getItem("token") != null) {
  let infoContainer = document.querySelector("nav .info ");
  infoContainer.style.display = "flex";
  let name = JSON.parse(localStorage.getItem("user")).name;
  let image = JSON.parse(localStorage.getItem("user")).profile_image;
  if (Object.keys(image).length == 0) {
    image = "../images/person.png";
  }
  infoContainer.innerHTML = ` <img src="${image}" alt="profile image" />
            <span>${name}</span>`;
} else {
  let infoContainer = document.querySelector("nav .info ");
  infoContainer.innerHTML = "<p>Not logged in</P>";
}
// ******************************************************************
// Show user information in the body
let userID = localStorage.getItem("userID");
axios
  .get(`https://tarmeezacademy.com/api/v1/users/${userID}`)
  .then((response) => {
    let user = response.data.data;
    let userInformation = document.querySelector(".user-information .content");
    // check profile image
    profileImage = "../images/person.png";
    if (typeof user.profile_image != "object") {
      profileImage = user.profile_image;
    }
    //  ************
    userInformation.innerHTML = `
  <div class="image">
  <img src=${profileImage} alt="" />
  </div>
  <div class="box">
  <span>Name : ${user.name}</span>
  <span>User name : ${user.username} </span>
  </div>
  <div class="box">
  <span> Posts count : ${user.posts_count} </span>
  <span> comments count : ${user.comments_count} </span>
  </div>
  `;
  });
// ******************************************************************
// Show user posts
let postsContainer = document.getElementById("posts");
axios
  .get(`https://tarmeezacademy.com/api/v1/users/${userID}/posts`)
  .then((response) => {
    var posts = response.data.data;
    for (const post of posts) {
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
<div class="post">
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
<div class="post-body" onclick="postClick(${post.id})">
  <div class="image">
    <img src=${post.image} alt="body image" />
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
</div>
`;
      postsContainer.innerHTML += content;
    }
  })
  .catch((error) => {
    alert(error.message);
  });

// ******************************************************************
// The following function has been executed when the user click on the post to know its details
function postClick(id) {
  localStorage.setItem("postDetails", id);
  window.location = "postDetails.html";
}
// ******************************************************************
