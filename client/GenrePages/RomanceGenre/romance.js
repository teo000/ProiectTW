let numberOfCharacters = 400;
let contents = document.querySelectorAll(".book-description");
contents.forEach(content => {
    //daca lungimea textului nu depaseste cea a nr de caractere, hide read more button
    if(content.textContent.length < numberOfCharacters){
        content.nextElementSibling.style.display = "none";
    }
    else
    {
        let displayText = content.textContent.slice
        (0, numberOfCharacters);
        let moreText = content.textContent.slice(numberOfCharacters);
        content.innerHTML = `${displayText} <span class = "dots" > ... </span>
  <span class = "hide more">${moreText}</span>`;

    }
});

function readMore(btn){
    let post = btn.parentElement;
    post.querySelector(".dots").classList.toggle("hide");
    post.querySelector(".more").classList.toggle("hide");
    btn.textContent === "Read More" ? btn.textContent = "Read Less" : btn.textContent = "Read More";
}