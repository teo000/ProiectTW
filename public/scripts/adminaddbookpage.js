const addBookForm = document.querySelector('#addBookForm');
addBookForm.addEventListener('submit', function(event) {
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const description = document.querySelector('#description').value;
    const edition = document.querySelector('#edition').value;
    const publisher = document.querySelector('#publisher').value;
    const year = document.querySelector('#year').value;
    const genresString = document.querySelector('#genres').value;
    const coverImg = document.querySelector('#coverimg').value;

    console.log(title);
    console.log(author);
    console.log(description);
    console.log(edition);
    console.log(publisher);
    console.log(year);
    console.log(genresString);
    const genres = genresString.split(",").map(item => item.trim());
    console.log(genres);

    event.preventDefault();

    fetch(`http://localhost:6969/books`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({title, author, description, edition, publisher, year, genres, coverImg}),
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
            response.json().then(data => {
                Swal.fire('Success', 'Book added successfully', 'success').then((result) => {
                    if (result.isConfirmed) {
                        location.href = `http://localhost:8081/admin/books/getBook/${data.book.id}` ; //o sa fac sa te duca la carte da nu am facut admin book page inca
                    }
                });
            });


        } else { //+check for 404
            response.json().then(data => {
                const errorMessage = data.error;
                Swal.fire('Error', errorMessage, 'error');
            });
        }
    }).catch(error => console.log(error));
});