const deleteBook = document.querySelector('#deleteBook');

const bookIdElement = document.getElementById('bookId');
const bookIdText = bookIdElement.textContent;
const bookid = bookIdText.replace('BookId :', '').trim();


deleteBook.addEventListener('click', function(event) {

    console.log(`stergem ${bookid}`);

    event.preventDefault();

    fetch(`http://localhost:6969/books/book/${bookid}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then((response) => {
        if (response.ok) {
            const cookieHeader = response.headers.get('Set-Cookie');
            if (cookieHeader) {
                const cookies = cookieHeader.split(';');
                cookies.forEach(cookie => {
                    document.cookie = cookie.trim();
                });
            }

            Swal.fire('Success', 'Book deleted successfully', 'success').then((result) => {
                if (result.isConfirmed) {
                    location.href='http://localhost:8081/admin/homepage';
                }
            });

        } else { //+check for 404
            response.json().then(data => {
                const errorMessage = data.error;
                Swal.fire('Error', errorMessage, 'error');
            });
        }
    }).catch(error => console.log(error));
});

const displayUpdateCover = document.querySelector('#displayUpdateCover');
const updateCoverButton = document.getElementById('updateCoverButton');
const newCover = document.getElementById('new-cover');

displayUpdateCover.addEventListener('click', () => {
    console.log(newCover.style.display);
    console.log(newCover.style.display !== 'none');
    if (newCover.style.display !== 'flex') {
        newCover.style.display = 'flex';
    } else {
        newCover.style.display = 'none';
    }
});
updateCoverButton.addEventListener('click', function(event) {
    const newCoverLink = document.getElementById('updateCoverInput').value;

    console.log(`update ${bookid} ${newCoverLink}`);

    event.preventDefault();

    fetch(`http://localhost:6969/books/coverimg`, {
        method: 'PUT',
        body: JSON.stringify({bookid, coverImg: newCoverLink}),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    }).then((response) => {
        if (response.ok) {
            const cookieHeader = response.headers.get('Set-Cookie');
            if (cookieHeader) {
                const cookies = cookieHeader.split(';');
                cookies.forEach(cookie => {
                    document.cookie = cookie.trim();
                });
            }

            Swal.fire('Success', 'Book cover updated successfully', 'success').then((result) => {
                if (result.isConfirmed) {
                    location.reload()
                }
            });

        } else { //+check for 404
            response.json().then(data => {
                const errorMessage = data.error;
                Swal.fire('Error', errorMessage, 'error');
            });
        }
    }).catch(error => console.log(error));
});

const authorParagraph = document.getElementById('author');
const editAuthorButton = document.getElementById('editAuthorButton');
const oldAuthor = document.querySelector('#author').textContent.trim();


editAuthorButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.id='authorInput'
    input.value = oldAuthor;

    authorParagraph.replaceWith(input);

    // Change the button text to "Submit"
    editAuthorButton.textContent = 'Submit';
    editAuthorButton.style.marginTop= '0';

    editAuthorButton.addEventListener('click', submitAuthorButtonClick);
});

function submitAuthorButtonClick() {
    const input = document.querySelector('#authorInput');
    const newText = input.value;
    console.log(newText);
    console.log(bookid);
    console.log(oldAuthor);


    fetch(`http://localhost:6969/books?bookid=${bookid}&author=${newText}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'

    }).then((response) => {
        if (response.ok) {
            const cookieHeader = response.headers.get('Set-Cookie');
            if (cookieHeader) {
                const cookies = cookieHeader.split(';');
                cookies.forEach(cookie => {
                    document.cookie = cookie.trim();
                });
            }

            Swal.fire('Success', 'Book author updated successfully', 'success').then((result) => {
                if (result.isConfirmed) {
                    location.reload()
                }
            });

        } else { //+check for 404
            response.json().then(data => {
                const errorMessage = data.error;
                Swal.fire('Error', errorMessage, 'error');
            });
        }
    }).catch(error => console.log(error));

}



const descriptionParagraph = document.getElementById('description');
const editDescriptionButton = document.getElementById('editDescriptionButton');
const oldDescription = document.querySelector('#description').textContent.trim();


editDescriptionButton.addEventListener('click', () => {
    console.log('click');
    const input = document.createElement('textarea');
    input.id='descriptionInput'
    input.value = oldDescription;

    descriptionParagraph.replaceWith(input);

    // Change the button text to "Submit"
    editDescriptionButton.textContent = 'Submit';
    editDescriptionButton.style.marginTop= '0';

    editDescriptionButton.addEventListener('click', submitDescriptionButtonClick);
});

function submitDescriptionButtonClick() {
    const input = document.querySelector('#descriptionInput');
    const newText = input.value;
    console.log(newText);
    console.log(bookid);
    console.log(oldAuthor);


    fetch(`http://localhost:6969/books/description`, {
        method: 'PUT',
        body: JSON.stringify({bookid, description: newText}),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'

    }).then((response) => {
        if (response.ok) {
            const cookieHeader = response.headers.get('Set-Cookie');
            if (cookieHeader) {
                const cookies = cookieHeader.split(';');
                cookies.forEach(cookie => {
                    document.cookie = cookie.trim();
                });
            }

            Swal.fire('Success', 'Book description updated successfully', 'success').then((result) => {
                if (result.isConfirmed) {
                    location.reload()
                }
            });

        } else { //+check for 404
            response.json().then(data => {
                const errorMessage = data.error;
                Swal.fire('Error', errorMessage, 'error');
            });
        }
    }).catch(error => console.log(error));

}

const genreTagsContainer = document.querySelector('#genre-tags');
const genreElements = genreTagsContainer.getElementsByTagName('a');
const genreTexts = [];
for (let i = 0; i < genreElements.length; i++) {
    const anchorText = genreElements[i].textContent.trim();
    genreTexts.push(anchorText);
}
const joinedText = genreTexts.join(', ');
console.log(joinedText);


const editGenresButton = document.getElementById('editGenresButton');
const deleteGenreButtons = document.querySelectorAll('#genre-tags button');

editGenresButton.addEventListener('click', () => {
    console.log('click');
    genreTagsContainer.style.display = 'flex';
    genreTagsContainer.style.flexDirection = 'column';
    editGenresButton.style.display = 'none';
    console.log(deleteGenreButtons.length);
    deleteGenreButtons.forEach((button)=>{
        button.style.display = 'block';
    })
});

deleteGenreButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const genre=this.parentElement.querySelector('a').textContent.trim();
        console.log(genre);

        fetch(`http://localhost:6969/books/genres`, {
            method: 'DELETE',
            body: JSON.stringify({bookid, genre}),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'

        }).then((response) => {
            if (response.ok) {
                const cookieHeader = response.headers.get('Set-Cookie');
                if (cookieHeader) {
                    const cookies = cookieHeader.split(';');
                    cookies.forEach(cookie => {
                        document.cookie = cookie.trim();
                    });
                }

                Swal.fire('Success', 'Genre deleted successfully', 'success').then((result) => {
                    if (result.isConfirmed) {
                        location.reload()
                    }
                });

            } else { //+check for 404
                response.json().then(data => {
                    const errorMessage = data.error;
                    Swal.fire('Error', errorMessage, 'error');
                });
            }
        }).catch(error => console.log(error));
    });
});
//
// const addGenreButton = document.getElementById('addGenreButton');
// addGenreButton.addEventListener('click', function(event) {
//     const genreToAdd = document.getElementById('addGenreInput').value;
//
//     event.preventDefault();
//
//     fetch(`http://localhost:6969/books/genres`, {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         credentials: 'include'
//     }).then((response) => {
//         if (response.ok) {
//             const cookieHeader = response.headers.get('Set-Cookie');
//             if (cookieHeader) {
//                 const cookies = cookieHeader.split(';');
//                 cookies.forEach(cookie => {
//                     document.cookie = cookie.trim();
//                 });
//             }
//
//             Swal.fire('Success', 'Group deleted successfully', 'success').then((result) => {
//                 if (result.isConfirmed) {
//                     location.href='http://localhost:8081/admin/groups/allgroups';
//                 }
//             });
//
//         } else { //+check for 404
//             response.json().then(data => {
//                 const errorMessage = data.error;
//                 Swal.fire('Error', errorMessage, 'error');
//             });
//         }
//     }).catch(error => console.log(error));
// });
//

// function submitDescriptionButtonClick() {
//     const input = document.querySelector('#descriptionInput');
//     const newText = input.value;
//     console.log(newText);
//     console.log(bookid);
//     console.log(oldAuthor);
//
//
//     fetch(`http://localhost:6969/books/description`, {
//         method: 'PUT',
//         body: JSON.stringify({bookid, description: newText}),
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         credentials: 'include'
//
//     }).then((response) => {
//         if (response.ok) {
//             const cookieHeader = response.headers.get('Set-Cookie');
//             if (cookieHeader) {
//                 const cookies = cookieHeader.split(';');
//                 cookies.forEach(cookie => {
//                     document.cookie = cookie.trim();
//                 });
//             }
//
//             Swal.fire('Success', 'Book description updated successfully', 'success').then((result) => {
//                 if (result.isConfirmed) {
//                     location.reload()
//                 }
//             });
//
//         } else { //+check for 404
//             response.json().then(data => {
//                 const errorMessage = data.error;
//                 Swal.fire('Error', errorMessage, 'error');
//             });
//         }
//     }).catch(error => console.log(error));
//
// }
