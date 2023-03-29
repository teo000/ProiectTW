
//for some reason nu merge chestia asta
//practic cand apas pe ochiul ala ar tb sa pot sa fac vizibil/nu textul
//ayae

//acuma merge sa fie vizibila parola da nu se schimba iconita cu ochiu
//ayae
const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

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