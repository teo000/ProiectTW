const buttons = document.querySelectorAll('.serious-button');
buttons.forEach(button => button.addEventListener('click', function(event) {
    const username = this.parentElement.parentElement.querySelector('.username').textContent;

    console.log('stergem');
    console.log(username);

    event.preventDefault();

    fetch(`http://localhost:6969/users/${username}`, {
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

            Swal.fire('Success', 'User deleted successfully', 'success').then((result) => {
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