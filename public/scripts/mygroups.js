const createGroupButton = document.querySelector("#createGroupButton");


// createGroupButton.addEventListener('click', (event) => {
//     event.preventDefault();
//
//
//     fetch('http://localhost:6969/signup', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ username, password , confirmPassword}),
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
//             window.location.href = 'http://localhost:8081/login';
//         } else {
//             response.json().then(data => {
//                 const errorMessage = data.error;
//                 Swal.fire('Error', errorMessage, 'error');
//             });
//         }
//     }).catch(error => console.log(error));
// });


