const addBookButton = document.querySelector("#addBookButton");
addBookButton.addEventListener('click', (event) => {
    const bookName = document.querySelector("#addBookInput").value;
    const groupId = parseInt(document.getElementById("groupId").textContent, 10);

    console.log('apasat add book')
    console.log(bookName);
    console.log(groupId);

    event.preventDefault();

    fetch(`http://localhost:6969/groups/currentbook/set`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({groupId, bookName}),
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

            Swal.fire('Success', 'Book added to group', 'success').then((result) => {
                if (result.isConfirmed) {
                    location.reload(); // Reload the page
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
