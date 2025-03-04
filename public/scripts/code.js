
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


const options = {
    hostname: 'localhost',
    port: 6969,
    path: '/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};


loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password_field').value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:6969/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const cookieHeader = xhr.getResponseHeader('Set-Cookie');
                if (cookieHeader) {
                    const cookies = cookieHeader.split(';');
                    cookies.forEach(cookie => {
                        document.cookie = cookie.trim();
                    });
                }
                window.location.href = 'http://localhost:8081/homepage';
            } else {
                const data = JSON.parse(xhr.responseText);
                const errorMessage = data.error;
                Swal.fire('Error', errorMessage, 'error');
            }
        }
    };
    xhr.withCredentials = true;
    const requestData = JSON.stringify({ username, password });
    xhr.send(requestData);
});


