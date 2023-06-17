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

function clicked() {
    const isReadButtonActive = readButton.classList.contains('active');

    if (isReadButtonActive) {
        rating.style.display = 'flex';
        writeReviewSection.style.display = 'flex';
        addButton.style.display = 'flex';
    } else {
        rating.style.display = 'none';
        writeReviewSection.style.display = 'none';
        addButton.style.display = 'none';
    }

    removeClasses(this);
}

function removeClasses(target) {
    if (target !== readButton) {
        rating.style.display = 'none';
        writeReviewSection.style.display = 'none';
        addButton.style.display = 'none';
    } else {
        rating.style.display = 'flex';
        writeReviewSection.style.display = 'flex';
        addButton.style.display = 'flex';
    }

    btns.forEach((btn) => {
        if (btn !== target) {
            btn.classList.remove('active');
        }
        if(btn === target)
            btn.classList.add('active')
    });
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


document.addEventListener('DOMContentLoaded', function() {
    if (readButton.classList.contains('active')) {
        rating.style.display = 'flex';
        writeReviewSection.style.display = 'flex';
        addButton.style.display = 'flex';
    }

    var ratingElement = document.getElementById('user-rating');
    var userRating = parseFloat(ratingElement.textContent);
    const inputs = Array.from(document.querySelectorAll('#adjustable-rating input'));
    const reversedInputs = inputs.reverse();
    reversedInputs.forEach((input,index) =>{
        const starInput = reversedInputs[index];
        if(starInput.value <= userRating){
            const label = document.querySelector(`label[for="${starInput.id}"]`);
            label.classList.add('checked');
        }
        console.log(starInput.value)
    })
});
