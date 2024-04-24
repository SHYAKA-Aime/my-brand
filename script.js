document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.getElementById('loginLink');
  
    // Function to toggle between login link and logout button
    function toggleLoginLogout(isLoggedIn) {
      if (isLoggedIn) {
        // Change to logout button
        loginLink.innerHTML = 'LOGOUT';
        loginLink.setAttribute('href', '#'); // Set href to '#' for logout action
        loginLink.addEventListener('click', function(event) {
          event.preventDefault();
          // Perform logout action (e.g., clear localStorage, redirect to login page)
          localStorage.removeItem('userToken');
          showAlert("You have logged out");
          setTimeout(() => {
            location.reload(); // Refresh the page to reflect changes
          }, 4000); 
        });
      } else {
        // Change back to login link
        loginLink.innerHTML = 'LOGIN';
        loginLink.setAttribute('href', 'login.html'); // Set href back to login page
        loginLink.removeEventListener('click', function() {}); // Remove click event listener
      }
    }
    const userToken = localStorage.getItem('userToken');
    if (userToken) {
      toggleLoginLogout(true); // User is logged in, show logout button
    }
});



document.addEventListener('DOMContentLoaded', async function() {
    const blogsList = document.querySelector('.blogs-list');

    try {
        const response = await fetch('https://mybrandbackend-gi30.onrender.com/api/blogs');
        const data = await response.json();

        if (response.ok) {
            data.forEach(blog => {
                const blogItem = document.createElement('li');
                blogItem.classList.add('card');
                blogItem.innerHTML = `
                    <div class="img"><img src="https://res.cloudinary.com/di67gv9fp/image/upload/${blog.image}" alt="img" draggable="false"></div>
                    <div class="description">
                        <h4>${blog.title}</h4>
                        
                        <div class="rm">
                            <a href="blog.html?id=${blog._id}">Read more</a>
                        </div>
                    </div>
                `;
                blogsList.appendChild(blogItem);
            });
        initializeCarousel();
        } else {
            console.error(data.message || 'An error occurred.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});



function initializeCarousel() {
const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.ceil(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 4500);
}
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);
}



document.addEventListener('DOMContentLoaded', async function() {
    const queryParams = new URLSearchParams(window.location.search);
    const blogId = queryParams.get('id');
    const blogDetailsContainer = document.querySelector('.bcontainer');
    const likeButton=document.getElementById('likeBtn');
  
    try {
      const response = await fetch(`https://mybrandbackend-gi30.onrender.com/api/blogs/${blogId}`);
      const blog = await response.json();
  
      if (response.ok) {
        // Display the blog details in your HTML
        blogDetailsContainer.innerHTML = `
        <div class="top">
              <div class="heading">
                  <h2>${blog.title}</h2>
                 
              </div>
              <div class="bimage">
                  <img src="https://res.cloudinary.com/di67gv9fp/image/upload/${blog.image}">
              </div>
          </div>
          <div class="bottom">
          <div class="btext">
          <p>${blog.description}</p>
              <div class="buttons">
                  <div class="button"><span class="likespan">${blog.likes}</span><button id="likeBtn"><i class="fas fa-heart"></i><br>Likes</button></div>
                  <div class="button"><span class="commentspan"></span><button id="commentBtn"><i class="fas fa-comment"></i> <br>Comments</button><br></div>
              </div>
          </div>
       </div>
        `;
        
        userbuttons();
        loadComments();
      } else {
        console.error(blog.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error:', error);
    }

  });

  


function userbuttons(){


// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("commentBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("closeicon")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};




const likeBtn = document.getElementById('likeBtn');
const likespan = document.querySelector('.likespan');
const queryParams = new URLSearchParams(window.location.search);
const blogId = queryParams.get('id');


    likeBtn.addEventListener('click', async function() {

        
        let count = likespan.textContent.trim() === '' ? 0 : parseInt(likespan.textContent);
        if (likeBtn.classList.contains('liked')) {
            count--;
            likeBtn.classList.remove('liked');
        } else {
            count++;
            likeBtn.classList.add('liked');
        }
        likespan.textContent = count;

        const userToken= localStorage.getItem('userToken');
        try {
            const response = await fetch(`https://mybrandbackend-gi30.onrender.com/api/blogs/${blogId}/like`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
              },
              body: JSON.stringify({}) // You can send data if needed
            });
            const data = await response.json();
            if(response.ok){
            showAlert(data.message);
            }
            console.log(data); // Log the response for debugging
            // Update the UI to reflect the like
          } catch (error) {
            console.error('Error:', error);
          }
    });
    

    const commentForm=document.getElementById('commentform');
    commentForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const comment = document.getElementById('comment').value;
    const queryParams = new URLSearchParams(window.location.search);
    const blogId = queryParams.get('id');
    const userToken= localStorage.getItem('userToken');
    const userInfoResponse = await fetch(`https://mybrandbackend-gi30.onrender.com/api/auth/userinfo`, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        },
    });
    const userInfo = await userInfoResponse.json();
    const name=userInfo.name;
    try {
        const response = await fetch(`https://mybrandbackend-gi30.onrender.com/api/blogs/${blogId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({ name, comment })
        });

        const data = await response.json();
        console.log(data); // Log the response for debugging
        showAlert(data.message);
        commentForm.reset();
        // Optionally, display a message indicating that the comment was added successfully
    } catch (error) {
        console.error('Error:', error);
        // Optionally, display an error message
    }
});

}


async function loadComments() {
    const queryParams = new URLSearchParams(window.location.search);
    const blogId = queryParams.get('id'); 
    const commentsContainer = document.getElementById('added');
    const userToken= localStorage.getItem('userToken');

    async function fetchAndUpdateComments() {
        try {
            const response = await fetch(`https://mybrandbackend-gi30.onrender.com/api/blogs/${blogId}/comments`,{
                headers: {
                    'Authorization': `Bearer ${userToken}`
                },
            });
    
            const data = await response.json();
            if (response.ok) {
                // Clear existing comments before adding new ones
                commentsContainer.innerHTML = '';
                data.forEach(comment => { 
                    const commentElement = document.createElement('div');
                    commentElement.classList.add('cont');
                    commentElement.innerHTML = `
                        <div class="img"><img src="images/avatar.png"></div>
                        <div class="cmnt">
                            <div class="nam">${comment.name}</div>
                            <div class="commented">${comment.comment}</div>
                        </div>
                    `;
                    commentsContainer.prepend(commentElement);
                });
            } else {
                console.error(data.message || 'An error occurred.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    

    // Initial fetch and update for comments
    await fetchAndUpdateComments();

    // Set interval to fetch and update comments every 1 second
    setInterval(fetchAndUpdateComments, 1000);
}

// Call loadComments function to start loading and updating comments



document.getElementById('subscribeForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    try {
        const response = await fetch('https://mybrandbackend-gi30.onrender.com/api/subscribe', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullName: fullNameInput.value, email: emailInput.value })
        });

        const data = await response.json();

        if (response.ok) {
            showAlert(data.message);
            // Reset the form after successful subscription
            this.reset();
        } else {
            showAlert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});



function showAlert(message) {

    const customAlert = document.getElementById('customAlert');
    const alertMessage = document.getElementById('alertMessage');
    const okButton = document.getElementById('okButton');
      alertMessage.textContent = message;
      customAlert.style.display = 'block';
    }
    
    okButton.addEventListener('click', function() {
      customAlert.style.display = 'none';
    });