const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password_field");
const loginForm = document.querySelector('#loginForm');

togglePassword.addEventListener("click", function () {
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // toggle the icon
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});


loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password_field').value;

    fetch('http://localhost:6969/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password}),
    }).then((response) => {
        if (response.ok) {
            window.location.href = 'http://localhost:8081/homepage';
        } else {
            response.json().then(data => {
                const errorMessage = data.error;
                Swal.fire('Error', errorMessage, 'error');
            })
        }
    }).catch(error => console.log(error))
});