const readButton = document.querySelector("#read-button");
const currentlyButton = document.querySelector("#currently-button");
const wantButton = document.querySelector("#want-button");
const btns = []; 
btns[1] = readButton;
btns[2] = currentlyButton;
btns[3] = wantButton;
const rating = document.querySelector("#adjustable-rating");
const writeReviewSection = document.querySelector('.write_review_container');
const addButton = document.querySelector('.add-review-button');
const bookIdElement = document.querySelector('.bookId #bookId');
const bookIdText = bookIdElement.textContent;
const bookid = bookIdText.replace('BookId :', '').trim();

rating.style.display = 'none';

readButton.addEventListener("click", function(){
    const isVisible = rating.style.display === 'flex';

    rating.style.display = isVisible ? 'none' : 'flex';
    writeReviewSection.style.display = isVisible ? 'none' : 'flex';
    addButton.style.display = isVisible ? 'none' : 'flex';

    // rating.style.display='flex';
});
function clicked() {
    this.classList.toggle('active');
    removeClasses(this);
}

function removeClasses(target) {
    btns.forEach((btn) => {
      if(btn !== target) { btn.classList.remove("active"); }
    });
    if(readButton !== target){
        rating.style.display = 'none';
        writeReviewSection.style.display = 'none';
        addButton.style.display = 'none';
    }

  }

readButton.addEventListener('click', clicked);
currentlyButton.addEventListener('click', clicked);
wantButton.addEventListener('click', clicked);

const stars = Array.from(document.querySelectorAll('input[name="stars"]'));

stars.forEach(star =>{
    star.addEventListener('click', ()=>{
        const rating = star.value;
        sendRating(rating);
    })
})

function sendRating(rating){
    const shelf = 'Read';
    const requestBody = {
        bookid,
        rating,
        shelf
    };

    fetch('http://localhost:6969/books/shelf',{
        method: 'POST',
        body : JSON.stringify(requestBody),
        headers:{
            'Content-Type' :"application/json",
        },
        credentials: 'include'

    })
        .then(response =>{
            if(response.ok){
                Swal.fire('Book added to shelf successfully!', '', 'success');
            }
            else{
                response.json().then(data => {
                    const errorMessage = data.error;
                    Swal.fire('Error', errorMessage, 'error');
                });
            }
        })
        .catch(error =>{
            console.log(error);
        })
}

function addToShelf(shelfName){
    const rating = undefined;
    const requestBody = {
        bookid,
        rating,
        shelf:shelfName
    };
    fetch('http://localhost:6969/books/shelf',{
        method: 'POST',
        body : JSON.stringify(requestBody),
        headers:{
            'Content-Type' :"application/json",
        },
        credentials: 'include'
    })
        .then(response =>{
            if(response.ok){
                console.log('ok');
                Swal.fire('Book added to shelf successfully!', '', 'success');
            }
            else{
                response.json().then(data => {
                    const errorMessage = data.error;
                    Swal.fire('Error', errorMessage, 'error');
                });
            }
        })
        .catch(error =>{
            console.log(error);
        })
}

let isRead = false;
let isCurrentlyReading = false;
let isWantToRead = false;

readButton.addEventListener('click', () => {
    isRead = !isRead;
    if(!isRead )
        deleteFromShelf();
});

currentlyButton.addEventListener('click', () => {
    isCurrentlyReading = !isCurrentlyReading;
    updateBookshelf('Currently Reading', isCurrentlyReading);
});

wantButton.addEventListener('click', () => {
    isWantToRead = !isWantToRead;
    updateBookshelf('Want to Read', isWantToRead);
});


function updateBookshelf(shelf, isAdded){
    if (isAdded) {
        addToShelf(shelf);
    } else {
        deleteFromShelf(shelf);
    }
}

function deleteFromShelf(shelf){
    const rating = undefined;
    const requestBody = {
        bookid,
        rating,
        shelf
    };
    fetch(`http://localhost:6969/books/shelf?bookid=${bookid}`,{
        method: 'DELETE',
        credentials: 'include'
    })
        .then(response =>{
            if(response.ok){
                Swal.fire('Book removed from shelf!', 'boo', 'success');
            }
            else{
                response.json().then(data => {
                    const errorMessage = data.error;
                    Swal.fire('Error', errorMessage, 'error');
                });
            }
        })
        .catch(error =>{
            console.log(error);
        })
}
