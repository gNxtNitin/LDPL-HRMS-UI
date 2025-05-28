$(document).ready(() => {
   
    $("#layout-menu").on("click", 'a.menu-link[href="/Auth/Logout"]', (e) => {
        e.preventDefault();
        Swal.fire({

            text: 'Are you sure you want to logout?',

            icon: 'warning',

            showCancelButton: true,

            confirmButtonText: 'Yes',

            customClass: {

                confirmButton: 'btn btn-primary me-2 waves-effect waves-light',

                cancelButton: 'btn btn-label-secondary waves-effect waves-light'

            },

            buttonsStyling: false

        }).then(function (result) {

            if (result.value) {
                window.location = "/Auth/Logout"
            }
        });
    });
});