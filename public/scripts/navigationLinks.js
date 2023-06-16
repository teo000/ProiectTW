const categoryLinks = document.querySelectorAll(".category-link");
categoryLinks.forEach((c)=> {
    console.log(c);
})
/*categoryLinks.forEach((link) =>{
    link.addEventListener("click",async(event)=>{
        event.preventDefault();
        const url = link.getAttribute("href");
        await navigateToPage(url);
    })
});

async function navigateToPage(url){
    const category = url.trim().toLowerCase();
    const ejsResponse = await fetch(`http://localhost:8081/books/genres/${category}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if(ejsResponse.ok){
        document.documentElement.innerHTML = await ejsResponse.text();
        const newUrl = `/books/genres/${category}`;
        const newPageTitle = `${category}`;
        history.pushState(null, newPageTitle, newUrl);
        document.title = newPageTitle;
    }
    else{
        console.log("error!")
        document.documentElement.innerHTML = "<h1>Error</h1>";
    }
    //  window.location.href = "../../../views/book.html";
    return false;
}*/

function navigateToGenre(genre) {
    const encodedGenre = encodeURIComponent(genre.toLowerCase());
    window.location.href = `http://localhost:8081/books/genres/${encodedGenre}`;
}

function navigateToBook (title){
    const encodedTitle = encodeURIComponent(title);
    window.location.href = `http://localhost:8081/books/getBook/${encodedTitle}`;
}

function navigateToGroup (groupName){
    const encodedGroup = encodeURIComponent(groupName);
    window.location.href = `http://localhost:8081/groups/group/${encodedGroup}`;
}
function navigateToPage(pageName) {
    const encodedPage = encodeURIComponent(pageName.toLowerCase());
    window.location.href = `http://localhost:8081/${encodedPage}`;
}

function navigateToUserProfile (){
    window.location.href = `http://localhost:8081/profile`;
}

function navigateToMyBooks(){
    window.location.href = `http://localhost:8081/books/mybooks/all`;
}

function logout(){
    //ceva request pt logout
}