const createGroupButton = document.querySelector("#createGroupButton");
const joinGroupButton = document.querySelector("#joinGroupButton");
joinGroupButton.addEventListener('click', (event) => {
    const inviteCodeForJoin = document.querySelector("#inviteCodeForJoin").value;
    console.log('apasat join')
    console.log(inviteCodeForJoin);
    console.log(JSON.stringify({inviteCodeForJoin}));

    event.preventDefault();

    fetch(`http://localhost:6969/groups/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({inviteCodeForJoin}),
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

            Swal.fire('Success', 'Group joined successfully', 'success').then((result) => {
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

createGroupButton.addEventListener('click', (event) => {
    const newGroupName = document.querySelector("#createGroupName").value;
    console.log('apasat create');
    console.log(newGroupName);
    console.log(JSON.stringify(newGroupName));


    event.preventDefault();

    fetch(`http://localhost:6969/groups/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newGroupName}),
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

            Swal.fire('Success', 'Group created successfully', 'success').then((result) => {
                if (result.isConfirmed) {
                    location.reload(); // Reload the page
                }
            });
        } else {
            response.json().then(data => {
                const errorMessage = data.error;
                Swal.fire('Error', errorMessage, 'error');
            });
        }
    }).catch(error => console.log(error));
});



