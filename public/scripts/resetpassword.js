const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");
const resetPasswordForm = document.querySelector('#reset-password');

const toggleConfirmPassword = document.querySelector("#toggleConfirmPassword");
const confirmPassword = document.querySelector("#confirmPassword");

togglePassword.addEventListener("click", function () {
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // toggle the icon
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});
toggleConfirmPassword.addEventListener("click", function () {
    // toggle the type attribute
    const type = confirmPassword.getAttribute("type") === "password" ? "text" : "password";
    confirmPassword.setAttribute("type", type);

    // toggle the icon
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});




resetPasswordForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;

    console.log("aici")

    fetch('http://localhost:6969/resetPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password , confirmPassword}),
        credentials: 'include'
    }).then((response) => {
        if (response.ok) {
            Swal.fire('Success', 'Password changed successfully', 'success').then((result) => {
                if (result.isConfirmed) {
                    window.location.href= 'http://localhost:8081/login';
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