const readButton = document.querySelectorAll("#rread-button");
const writeReviewSection = document.querySelector('.write-review');


readButton.forEach((button) =>{
    button.addEventListener('click', function(){
        writeReviewSection.style.display = "flex";
    })
})