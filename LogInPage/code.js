
//for some reason nu merge chestia asta
//practic cand apas pe ochiul ala ar tb sa pot sa fac vizibil/nu textul
//ayae
const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    // toggle the icon
    this.classList.toggle("fa-eye-slash");
});