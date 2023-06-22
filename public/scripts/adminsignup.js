

const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");
const signupForm = document.querySelector('#signupForm');

togglePassword.addEventListener("click", function () {
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // toggle the icon
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});

const toggleConfirmPassword = document.querySelector("#toggleConfirmPassword");
const confirmPassword = document.querySelector("#confirmPassword");

toggleConfirmPassword.addEventListener("click", function () {
    // toggle the type attribute
    const type = confirmPassword.getAttribute("type") === "password" ? "text" : "password";
    confirmPassword.setAttribute("type", type);

    // toggle the icon
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});

const toggleAdminCode = document.querySelector("#toggleAdminCode");
const adminCode = document.querySelector('#adminCode');

toggleAdminCode.addEventListener("click", function () {
    // toggle the type attribute
    const type = adminCode.getAttribute("type") === "password" ? "text" : "password";
    adminCode.setAttribute("type", type);

    // toggle the icon
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});
signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;
    const adminCode = document.querySelector('#adminCode').value;


    fetch('http://localhost:6969/adminsignup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password , confirmPassword, adminCode}),
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
            Swal.fire('Success', 'Account created successfully', 'success').then((result) => {
                if (result.isConfirmed) {
                    window.location.href= 'http://localhost:8081/adminlogin';
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
