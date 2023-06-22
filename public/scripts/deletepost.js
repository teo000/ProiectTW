const buttons = document.querySelectorAll('.post-header > button');
buttons.forEach(button => button.addEventListener('click', function(event) {
    const reviewId = this.parentElement.querySelector('.reviewId').textContent;

    console.log('stergem');
    console.log(reviewId);

    event.preventDefault();

    fetch(`http://localhost:6969/books/reviews/${reviewId}`, {
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

            Swal.fire('Success', 'Post deleted successfully', 'success').then((result) => {
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
}));
