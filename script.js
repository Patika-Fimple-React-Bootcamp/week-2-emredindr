const postsContainer = document.querySelector(".posts-container");
const comments = document.querySelector(".comments");
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-header-title");
const apiUrl = "https://jsonplaceholder.typicode.com";
const modalCloseBtn = document.querySelector(".modal-close-btn");
const searchInput = document.getElementById("searchInput");

//fetch('https://jsonplaceholder.typicode.com/posts/1', {
//   method: 'DELETE',
// }); metodu çalışmadığı için aşağıdaki gibi değiştirdim.Önce postu getirip daha sonra gelen postslarda fetch ve delete maniplasyonlarını yaptım. 

let posts = [];

// Posts request and display
const fetchAndDisplayPosts = async () => {
  const response = await fetch(`${apiUrl}/posts`);
  posts = await response.json();
  fetchPosts();
};

// Call fetchAndDisplayPosts
fetchAndDisplayPosts();

// Create post and display
function fetchPosts() {
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    // Create post card
    const postCard = createPostCard(post);
    postsContainer.appendChild(postCard);
  });
}

// Create post card
function createPostCard(post) {
  const postCard = document.createElement("div");
  postCard.className = "post-card";
  postCard.innerHTML = `
    <h3 class="post-title">${post.title}</h3>
    <p class="post-body">${post.body}</p>
    <button class="delete-btn" >Delete</button>
  `;
  // Add event listener to open modal
  postCard.addEventListener("click", (e) => {
    e.preventDefault();
    openCommentsModal(post.id);
  });
  // Add event listener to delete post
  const deleteBtn = postCard.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    deletePost(post.id);
  });
  return postCard;
}

// Filter posts
function filterPosts() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const posts = document.getElementsByClassName("post-card");

  // Loop through posts
  Array.from(posts).forEach((post) => {
    const title = post.querySelector(".post-title").innerText.toLowerCase();
    const body = post.querySelector(".post-body").innerText.toLowerCase();

    if (title.includes(searchTerm) || body.includes(searchTerm)) {
      post.style.display = "block";
    } else {
      post.style.display = "none";
    }
  });
}

// Delete post
function deletePost(postId) {
  const confirmDelete = confirm(`Are you sure you want to delete this post?${postId}`);

  if (confirmDelete) {
    posts = posts.filter((post) => post.id !== postId);
  }
  // After deleting post, fetch posts again
  fetchPosts();
}

// Open comments modal and fetch comments
async function openCommentsModal(postId) {
  const response = await fetch(`${apiUrl}/posts/${postId}/comments`);
  const postComments = await response.json();

  comments.innerHTML = "";
  modalTitle.innerHTML = `Comments (${postComments.length})`;
  postComments.forEach((comment) => {
    comments.innerHTML += `
    <div class="comment">
      <h4 class="comment-title">${comment.name}</h4>
      <p class="comment-body">${comment.body}</p>
    </div>
      `;
  });
  modal.style.display = "flex";
}

// Add event listener to close modal button
modalCloseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal();
});

// Filter posts
searchInput.addEventListener("keyup", filterPosts);

// Close modal
const closeModal = () => {
  modal.style.display = "none";
};

// Close modal when clicked outside of modal
window.onclick = function (e) {
  e.preventDefault();
  if (e.target == modal) {
    closeModal();
  }
};
