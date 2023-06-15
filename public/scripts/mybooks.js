const checkboxes = document.querySelectorAll('input[name="bookshelf"]');
checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);

        if (checkedCheckboxes.length === 0) {
            window.location.href = `http://localhost:8081/books/mybooks/all`;
            return;
        }
        if (checkbox.checked) {
            // Uncheck other checkboxes
            checkboxes.forEach(otherCheckbox => {
                if (otherCheckbox !== checkbox) {
                    otherCheckbox.checked = false;
                }
            });

            const selectedShelf = checkbox.value;
            if (selectedShelf) {
                const encodedShelf = encodeURIComponent(selectedShelf.toLowerCase());
                window.location.href = `http://localhost:8081/books/mybooks/${encodedShelf}`
            } else {
                window.location.href = `http://localhost:8081/books/mybooks/all`;
            }
        }
    });
});