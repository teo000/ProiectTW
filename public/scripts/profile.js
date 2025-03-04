function deleteUserProfile() {
    const confirmation = confirm("Are you sure you want to delete your profile?");
    if (confirmation) {
        deleteUser();
    }
}

function deleteUser() {
    fetch('http://localhost:6969/users', {
        method: 'DELETE',
        credentials: 'include'
    }).then((response) => {
        if (response.ok) {
            Swal.fire('Success', 'Account deleted successfully', 'success').then((result) => {
                if (result.isConfirmed) {
                    logout();
                }
            });
        } else {
            response.json().then(data => {
                const errorMessage = data.error;
                Swal.fire('Error', errorMessage, 'error');
            });
        }
    }).catch(error => console.log(error));
}

async function resetPassword() {
    const resetPasswordCode = await generateResetPasswordCode();
    console.log(resetPasswordCode)
    if (resetPasswordCode !== null)
        window.location.href = `http://localhost:8081/resetpassword?code=${resetPasswordCode}`;
    else
        Swal.fire('Error', 'An error has occurred', 'error');
}

async function generateResetPasswordCode() {
    try {
        const response =await fetch('http://localhost:6969/changeResetPasswordCode', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            const code = data.resetCode;
            console.log("code = " + code);
            return code;
        }
        const data = await response.json();
        const errorMessage = data.error;
        Swal.fire('Error', errorMessage, 'error');
    } catch
        (error) {
        Swal.fire('Error', 'An error has occurred', 'error');
    }
    return null;
}

