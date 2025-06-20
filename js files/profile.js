// button to show the nav bar in the small screens
let nav = document.querySelector("nav");
let navIcon = document.querySelector("nav .icon");
let navUL = document.querySelector("nav ul");
navIcon.addEventListener("click", () => {
  nav.classList.toggle("show");
  navUL.classList.toggle("show");
  navIcon.classList.toggle("show");
});
// ******************************************************************
// Change the appearance of the interface when user logout
navLogout.addEventListener("click", () => {
  // remove token from local storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  location.href = "home.html";
  alert("Successful Logout");
});
// ******************************************************************
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
  window.location.href = "home.html";
}
// ******************************************************************
// Show user information in the body
let userID = JSON.parse(localStorage.getItem("user")).id;
axios
  .get(`https://tarmeezacademy.com/api/v1/users/${userID}`)
  .then((response) => {
    let user = response.data.data;
    let userInformation = document.querySelector(".user-information .content");
    userInformation.innerHTML = `
  <div class="image">
  <img src=${user.profile_image} alt="" />
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
    if (posts.length == 0) {
      document.querySelector("#posts .posts-title").innerHTML = "No Posts";
    }
  })
  .catch((error) => {
    alert(error.message);
    console.log("ali");
  });
// ******************************************************************
// The following function has been executed when the user click on the post to know its details
function postClick(id) {
  localStorage.setItem("postDetails", id);
  window.location = "postDetails.html";
}
// ******************************************************************
