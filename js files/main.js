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
// Get posts to add them into the container
let postsContainer = document.getElementById("posts");
let currentPage = 1;
let lastPage = 10;
// ***************
function getPosts(currentPage) {
  if (currentPage <= lastPage) {
    document.querySelector(".loading").style.display = "block";
    axios
      .get(
        `https://tarmeezacademy.com/api/v1/posts?limit=10&page=${currentPage}`
      )
      .then((response) => {
        document.querySelector(".loading").style.display = "none";
        lastPage = response.data.meta.last_page;
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
     <img src=${profileImage} alt="profile image" onclick="imgClick(${post.author.id})" />
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
  }
}
getPosts(currentPage);
// ******************
// Pagination:
window.addEventListener("scroll", () => {
  let endPage =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight;
  if (endPage) {
    getPosts(++currentPage);
  }
});
// ******************************************************************
// Show login popup
let navLoginBtn = document.getElementById("navLogin");
let login = document.querySelector(".login");
navLoginBtn.addEventListener("click", () => {
  Register.classList.remove("show");
  login.classList.toggle("show");
});
// close login popup
let closeLogin = document.querySelector(".login #close");
closeLogin.addEventListener("click", () => {
  login.classList.remove("show");
});
// ******************************************************************
// Login
let userName = document.querySelector(".login #login-user-name");
let password = document.querySelector(".login #login-password");
let loginBtn = document.querySelector(".login #login");
loginBtn.addEventListener("click", () => {
  const userNameValue = userName.value;
  const passwordValue = password.value;
  const loginParams = {
    username: userNameValue,
    password: passwordValue,
  };
  axios
    .post("https://tarmeezacademy.com/api/v1/login", loginParams)
    .then((response) => {
      // store token  into local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // after successful login we should close lgoin popup
      login.classList.remove("show");
      successfulLoginMode();
      alert("Successful login");
      location.reload();
    })
    .catch((error) => {
      alert(error.message);
    });
});
// ******************************************************************
// Change the appearance of the interface when user login
// Token in local storage means that someone has logged in
let token = localStorage.getItem("token");
let navLogin = document.getElementById("navLogin");
let navRegister = document.getElementById("navRegister");
let navLogout = document.getElementById("navLogout");
if (token == null) {
  logoutMode();
} else {
  successfulLoginMode();
}
// ******************************************************************
// Change the appearance of the interface when user logout
navLogout.addEventListener("click", () => {
  // remove token from local storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  logoutMode();
  alert("Successful Logout");
});
// ******************************************************************
// Login and Logout functions
function successfulLoginMode() {
  navLogin.style.display = "none";
  navRegister.style.display = "none";
  navLogout.style.display = "block";
  // Show user name and photo when login
  let infoContainer = document.querySelector("nav .info ");
  infoContainer.style.display = "flex";
  let name = JSON.parse(localStorage.getItem("user")).name;
  let image = JSON.parse(localStorage.getItem("user")).profile_image;
  if (Object.keys(image).length == 0) {
    image = "../images/person.png";
  }
  infoContainer.innerHTML = ` <img src="${image}" alt="profile image" />
          <span>${name}</span>`;
  // show add post icon
  document.querySelector(".add-post-icon").style.display = "block";
  // show profile in nav
  document.querySelector("nav #profile").style.display = "block";
}
// **************
function logoutMode() {
  navLogout.style.display = "none";
  navLogin.style.display = "block";
  navRegister.style.display = "block";
  document.querySelector("nav .info ").style.display = "none";
  document.querySelector(".add-post-icon").style.display = "none";
  document.querySelector("nav #profile").style.display = "none";
  document.querySelector(".new-post-form").classList.remove("show");
}
// ******************************************************************
// Show register popup
let navRegisterBtn = document.getElementById("navRegister");
let Register = document.querySelector(".register");
navRegisterBtn.addEventListener("click", () => {
  login.classList.remove("show");
  Register.classList.toggle("show");
});
// close register popup
let closeRegister = document.querySelector(".register #close");
closeRegister.addEventListener("click", () => {
  Register.classList.remove("show");
});
// ******************************************************************
// register
let registerUserName = document.querySelector(".register #register-user-name");
let registerPassword = document.querySelector(".register #register-password");
let registerName = document.querySelector(".register #name");
let personalImage = document.querySelector(".register #personal-image");
let registerBtn = document.querySelector(".register #register");
registerBtn.addEventListener("click", () => {
  const registerUserNameValue = registerUserName.value;
  const registerPasswordValue = registerPassword.value;
  const registerNameValue = registerName.value;
  const registerPersonalImageValue = personalImage.files[0];
  let formData = new FormData();
  formData.append("username", registerUserNameValue);
  formData.append("password", registerPasswordValue);
  formData.append("name", registerNameValue);
  formData.append("image", registerPersonalImageValue);
  // ********************
  /*
  we should  to select the type of the request (multipart/form-data),
  (into the third request parameter).[optional]
  */
  axios
    .post("https://tarmeezacademy.com/api/v1/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      //  store token  into local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      // after successful login we should close lgoin popup
      Register.classList.remove("show");
      successfulLoginMode();
      alert("Successful Register.");
      location.reload();
    })
    .catch((error) => {
      if (registerPasswordValue.length < 6) {
        alert(error.response.data.errors.password);
      } else {
        alert(error.response.data.errors.username);
      }
    });
});
// ******************************************************************
// Show add post popup
let addPostButton = document.querySelector(".add-post-icon");
let addPostForm = document.querySelector(".new-post-form");
addPostButton.addEventListener("click", () => {
  addPostForm.classList.toggle("show");
});
// close add post popup
let closeAddPostButton = document.querySelector(".new-post-form #close");
closeAddPostButton.addEventListener("click", () => {
  addPostForm.classList.remove("show");
});
// ******************************************************************
// Add Post request
// In the process of adding a post, we are sending an image, so we send the data as a formData,
// not as a json object (raw).
const postTitle = document.querySelector(".new-post-form #title");
const postBody = document.querySelector(".new-post-form #post-body");
const postImage = document.querySelector(".new-post-form #post-image");
const createPostButton = document.querySelector(".new-post-form #create-post");
createPostButton.addEventListener("click", () => {
  let formData = new FormData();
  formData.append("body", postBody.value);
  formData.append("title", postTitle.value);
  formData.append("image", postImage.files[0]);
  // ********************
  // here we have to send the token to insure that the user has logged in.
  // we send the token at the third parameter (into headers)
  // also should  to select the type of the request (multipart/form-data).[optional]
  axios
    .post("https://tarmeezacademy.com/api/v1/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      addPostForm.classList.remove("show");
      alert("Your post has been created successfuly");
      // refresh the window to display your post
      location.reload();
    })
    .catch((error) => {
      alert(error.response.data.message);
    });
});
// ******************************************************************
// Style select image (add post section & register section)
const uploadImageButton1 = document.querySelector(
  ".new-post-form #upload-image"
);
uploadImageButton1.addEventListener("click", () => {
  postImage.click();
});
// ***************
const uploadImageButton2 = document.querySelector(".register #upload-image");
uploadImageButton2.addEventListener("click", () => {
  personalImage.click();
});
// ******************************************************************
// The following function has been executed when the user click on the post to know its details
function postClick(id) {
  localStorage.setItem("postDetails", id);
  window.location = "postDetails.html";
}
// ******************************************************************
// The following function has been executed when the user click on the img to know user details
function imgClick(userID) {
  localStorage.setItem("userID", userID);
  window.location = "userDetails.html";
}
// ******************************************************************
