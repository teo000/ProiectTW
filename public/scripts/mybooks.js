const readShelf = document.querySelector('#read');
const currentlyReadingShelf = document.querySelector('#currently-reading');
const wantToReadShelf = document.querySelector('#want-to-read');

const checkBoxes = document.querySelectorAll('input[name="bookshelf"]');
checkBoxes.forEach((checkbox) =>{
    checkbox.addEventListener('change', ()=>{
        if(checkbox.checked){
            checkBoxes.forEach((otherCheckbox)=>{
                if(otherCheckbox!== checkbox){
                    otherCheckbox.checked = false;
                }
            });

            const selectedShelf = checkbox.value;
            if(selectedShelf){
                const encodedShelf = encodeURIComponent(selectedShelf);
                fetch(`http://localhost:8081/books/mybooks/${encodedShelf}`)
                    .then((response) => response.text())
                    .then((html) => {
                        // Update the table body with the received HTML
                        document.querySelector('#books tbody').innerHTML = html;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } else {
                // Send an AJAX request to the server to get all books
                fetch('http://localhost:8081/books/mybooks/all')
                    .then((response) => response.text())
                    .then((html) => {
                        // Update the table body with the received HTML
                        document.querySelector('#books tbody').innerHTML = html;
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }

        }
    })
})