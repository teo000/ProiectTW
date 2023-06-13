const categoryLinks = document.querySelectorAll(".category-link");
categoryLinks.forEach((link) => {
    link.addEventListener("click", async (event) =>  {
        event.preventDefault();
        const category = link.textContent.trim();
        const ejsResponse = await fetch(`http://localhost:8081/genres`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ category }),
        });
        const ejsTemplate = await ejsResponse.text();

        const dataResponse = await fetch(`http://localhost:6969/books/genre=${category}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ category }),
        });
        const bookData = await dataResponse.json();

        const renderedTemplate = ejs.render(ejsTemplate,bookData)
        const newDocument = document.implementation.createHTMLDocument();
        newDocument.open();
        newDocument.write(renderedTemplate);
        newDocument.close();

        document.documentElement.replaceWith(newDocument.documentElement);

        window.location.href = "../../../views/book.html";
    });
});

function renderTemplate (bookData) {
    let template ="";
}