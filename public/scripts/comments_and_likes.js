const toggleHeart = document.querySelectorAll(".toggle-heart");
const toggleComment = document.querySelectorAll(".toggle-comment");
toggleHeart.forEach((item) => {
    item.addEventListener('click', function () {
        //vad cate likeuri sunt deja
        let initialNumber = item.textContent;


        //vad daca tb sa cresc sau sa scad nr de likeuri
        if (!item.classList.contains('fa-solid'))
        {
            item.textContent = ++initialNumber ;
            item.innerHTML = initialNumber;
        }
        else
        {
            item.textContent = --initialNumber ;
            item.innerHTML = initialNumber;
        }

        this.classList.toggle("fa-solid");
        this.classList.toggle("fa-regular");
    });
});

toggleComment.forEach((item)=> {
    item.addEventListener("click", function(){
        this.classList.toggle("fa-solid");
        this.classList.toggle("fa-regular");

        //vedem daca e cazul sa ascundem sau sa extindem commurile
        const parentElement = item.closest(".post-container");
        const commentSection = parentElement.querySelector('.comment-section');
        const comments = commentSection.querySelectorAll(".comment");
        const addComment = commentSection.querySelector(".add-comment");
        const addCommentButton = commentSection.querySelector(".add-button");

        if(item.classList.contains("fa-solid")){
            commentSection.style.display = "flex";
            comments.forEach((comment)=>{
                comment.style.display = "flex";
            });
            addComment.style.display = "flex";
            addCommentButton.style.display = "flex";
        }
        else
        {
            commentSection.style.display = "none";
            comments.forEach((comment)=>{
                comment.style.display = "none";
                addComment.style.display = "none";
                addCommentButton.style.display = "none";
            });
        }


    });
    });
