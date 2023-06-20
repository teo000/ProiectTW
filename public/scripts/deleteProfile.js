function deleteProfile(){
    const confirmation = confirm("Are you sure you want to delete your profile?");
    if(confirmation){
        deleteUser();
    }
}

function deleteUser(){
    fetch('http://localhost:6969/users', {
        method: 'DELETE',
        credentials: 'include'
    }).then((response) => {
        if (response.ok) {
            Swal.fire('Account deleted successfully', '', 'success');
            logout();
        } else {
            response.json().then(data => {
                const errorMessage = data.error;
                Swal.fire('Error', errorMessage, 'error');
            });
        }
    }).catch(error => console.log(error));
}