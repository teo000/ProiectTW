const deleteGroup = document.querySelector('#deleteGroup');
deleteGroup.addEventListener('click', function(event) {
    const groupId = document.querySelector('#groupId').textContent;

    console.log('stergem');

    event.preventDefault();

    fetch(`http://localhost:6969/groups/group/${groupId}`, {
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

            Swal.fire('Success', 'Group deleted successfully', 'success').then((result) => {
                if (result.isConfirmed) {
                    location.href='http://localhost:8081/admin/groups/allgroups';
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