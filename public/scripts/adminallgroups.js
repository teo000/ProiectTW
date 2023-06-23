const searchGroupButton = document.querySelector("#searchGroupButton");
//
// searchGroupButton.addEventListener('click', (event) => {
//     const groupName = document.querySelector("#inviteCodeForSearch").value;
//     console.log('click');
//     console.log(groupName);
//     console.log(JSON.stringify(groupName));
//
//
//     event.preventDefault();
//
//     fetch(`http://localhost:6969/groups/get`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({newGroupName}),
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
//             Swal.fire('Success', 'Group created successfully', 'success').then((result) => {
//                 if (result.isConfirmed) {
//                     location.reload(); // Reload the page
//                 }
//             });
//         } else {
//             response.json().then(data => {
//                 const errorMessage = data.error;
//                 Swal.fire('Error', errorMessage, 'error');
//             });
//         }
//     }).catch(error => console.log(error));
// });
//


