const categoryLinks = document.querySelectorAll(".category-link");
categoryLinks.forEach((c)=> {
    console.log(c);
})

function navigateToGenre(genre) {
    const encodedGenre = encodeURIComponent(genre.toLowerCase());
    window.location.href = `http://localhost:8081/books/genres?genre=${encodedGenre}&pageSize=100&pageNumber=1`;
}
function navigateToGenreAdmin(genre) {
    const encodedGenre = encodeURIComponent(genre.toLowerCase());
    window.location.href = `http://localhost:8081/admin/books/genres?genre=${encodedGenre}&pageSize=100&pageNumber=1`;
}

function navigateToBookAdmin (title){
    const encodedTitle = encodeURIComponent(title);
    console.log(title);
    console.log(encodedTitle)
    window.location.href = `http://localhost:8081/admin/books/getBook/${encodedTitle}`;
}

function navigateToGroup (groupName){
    const encodedGroup = encodeURIComponent(groupName);
    window.location.href = `http://localhost:8081/groups/group/${encodedGroup}`;
}
function navigateToGroupAdmin (groupName){
    const encodedGroup = encodeURIComponent(groupName);
    window.location.href = `http://localhost:8081/admin/groups/group/${encodedGroup}`;
}
function navigateToMyGroups (){
    window.location.href = `http://localhost:8081/groups/mygroups`;
}
function navigateToAllGroups (){
    window.location.href = `http://localhost:8081/admin/groups/allgroups`;
}

function navigateToPage(pageName) {
    const encodedPage = encodeURIComponent(pageName.toLowerCase());
    window.location.href = `http://localhost:8081/${encodedPage}`;
}
function navigateToAdminPage(pageName) {
    const encodedPage = encodeURIComponent(pageName.toLowerCase());
    window.location.href = `http://localhost:8081/admin/${encodedPage}`;
}
function navigateToRss(){
    window.location.href = `http://localhost:8081/rss`;
}
function navigateToUserProfile (){
    window.location.href = `http://localhost:8081/profile`;
}

function navigateToAdminOwnUserProfile (){
    window.location.href = `http://localhost:8081/admin/profile`;
}

function navigateToAdminUserProfile (name){
    const encodedName = encodeURIComponent(name);
    window.location.href = `http://localhost:8081/admin/profile/${encodedName}`;
}

function navigateToMyBooks(){
    window.location.href = `http://localhost:8081/books/mybooks/all`;
}

function navigateToPublisher(publisher){
    const lowerPublisher = publisher.toLowerCase();
    window.location.href = `http://localhost:8081/books/criteria?publisher=${lowerPublisher}&pageSize=100&pageNumber=1`;
}
function navigateToPublisherAdmin(publisher){
    const lowerPublisher = publisher.toLowerCase();
    window.location.href = `http://localhost:8081/admin/books/criteria?publisher=${lowerPublisher}&pageSize=100&pageNumber=1`;
}

function navigateToYear(year){
    window.location.href = `http://localhost:8081/books/criteria?year=${year}&pageSize=100&pageNumber=1`;
}
function navigateToYearAdmin(year){
    window.location.href = `http://localhost:8081/admin/books/criteria?year=${year}&pageSize=100&pageNumber=1`;
}
function navigateToEdition(edition){
    const lowerEdition = edition.toLowerCase();
    window.location.href = `http://localhost:8081/books/criteria?edition=${lowerEdition}&pageSize=100&pageNumber=1`;
}
function navigateToEditionAdmin(edition){
    const lowerEdition = edition.toLowerCase();
    window.location.href = `http://localhost:8081/admin/books/criteria?edition=${lowerEdition}&pageSize=100&pageNumber=1`;
}
function navigateToAuthor(author){
    const lowerAuthor = author.toLowerCase();
console.log(author);
    window.location.href = `http://localhost:8081/books/criteria?author=${lowerAuthor}&pageSize=100&pageNumber=1`;
}
function navigateToAuthorAdmin(author){
    const lowerAuthor = author.toLowerCase();
    console.log(author);
    window.location.href = `http://localhost:8081/admin/books/criteria?author=${lowerAuthor}&pageSize=100&pageNumber=1`;
}

function navigateToStatistics (){
    window.location.href = `http://localhost:8081/statistics`;
}

function navigateToStatisticsAdmin (){
    window.location.href = `http://localhost:8081/admin/statistics`;
}
function navigateToRecommendations(){
    window.location.href =`http://localhost:8081/recommendations`;
}
function logout(){
    console.log("ok")
    //ceva request pt logout
    fetch('http://localhost:6969/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
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

            window.location.href = 'http://localhost:8081/login';
        } else {
            response.json().then(data => {
                const errorMessage = data.error;
                Swal.fire('Error', errorMessage, 'error');
            });
        }
    }).catch(error => console.log(error));
}

function navigateToSearch (){
    const form = document.getElementById('search-bar');
    const input = document.getElementById('search-input');

    input.addEventListener('keypress', function(event){
        if(event.key==='Enter'){
            event.preventDefault();
            const searchString = input.value.toLowerCase();

            //send request
            window.location.href = `http://localhost:8081/books/criteria?searchInput=${searchString}&pageSize=100&pageNumber=1`;

        }
    })
}

function navigateToSearchAdmin (){
    const form = document.getElementById('search-bar');
    const input = document.getElementById('search-input');

    input.addEventListener('keypress', function(event){
        if(event.key==='Enter'){
            event.preventDefault();
            const searchString = input.value.toLowerCase();

            //send request
            window.location.href = `http://localhost:8081/admin/books/criteria?searchInput=${searchString}&pageSize=100&pageNumber=1`;

        }
    })
}

// function navigateToHomepage(){
//     window.location.href = `http://localhost:8081/books/reviews/all`;
// }

const navigateToBookLinks =  document.querySelectorAll('a.navigate-to-book');

navigateToBookLinks.forEach((link) =>{
    link.addEventListener('click', () =>{
        console.log("aici")
        const bookContainer = link.closest('.book');
        const bookId = bookContainer.querySelector('.related-book-id').textContent;
        console.log("aici")
        window.location.href = `http://localhost:8081/books/getBook/${bookId}`;
    })
})

const navigateToBookLinksAdmin =  document.querySelectorAll('a.navigate-to-book-admin');

navigateToBookLinksAdmin.forEach((link) =>{
    link.addEventListener('click', () =>{
        console.log("aici")
        const bookContainer = link.closest('.book');
        const bookId = bookContainer.querySelector('.related-book-id').textContent;
        console.log("aici")
        window.location.href = `http://localhost:8081/admin/books/getBook/${bookId}`;
    })
})

