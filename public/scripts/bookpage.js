const readButton = document.querySelector("#read-button");
const currentlyButton = document.querySelector("#currently-button");
const wantButton = document.querySelector("#want-button");
const btns = []; 
btns[1] = readButton;
btns[2] = currentlyButton;
btns[3] = wantButton;
const rating = document.querySelector("#adjustable-rating");
const writeReviewSection = document.querySelector('.write_review_container');
const addButton = document.querySelector('.add-review-button');

rating.style.display = 'none';

readButton.addEventListener("click", function(){
    const isVisible = rating.style.display === 'flex';

    rating.style.display = isVisible ? 'none' : 'flex';
    writeReviewSection.style.display = isVisible ? 'none' : 'flex';
    addButton.style.display = isVisible ? 'none' : 'flex';

    // rating.style.display='flex';
});


function clicked() {
    this.classList.toggle('active');
    removeClasses(this);
}

function removeClasses(target) {
    btns.forEach((btn) => {
      if(btn != target) { btn.classList.remove("active"); }
    });
    if(readButton != target){
        rating.style.display = 'none';
        writeReviewSection.style.display = 'none';
        addButton.style.display = 'none';
    }

  }

readButton.addEventListener('click', clicked);
currentlyButton.addEventListener('click', clicked);
wantButton.addEventListener('click', clicked);

