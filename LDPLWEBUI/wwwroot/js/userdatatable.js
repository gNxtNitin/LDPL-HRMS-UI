$(document).ready(function () {


    

    //flatdatepickr
    const date_fields = $("#DOB");

    date_fields.flatpickr({
        monthSelectorType: 'static',
        disableMobile: true,
        //customise format here
        dateFormat: 'd/m/Y'
    });


    ToastWrapper.init({
        positionClass: 'toast-top-right',
        timeOut: 3000,
        progressBar: true

    });


    statusObj = {
        Pending: { code: 'P', title: 'Pending', class: 'bg-warning' },
        Active: { code: 'A', title: 'Active', class: 'bg-success' },
        InActive: { code: 'I', title: 'Inactive', class: 'bg-danger' }
    };

    var select2 = $('.select2');

    if (select2.length) {
        var $this = select2;
        $this.wrap('<div class="position-relative"></div>').select2({
            placeholder: 'Select Role',
            dropdownParent: $this.parent()
        });
    }

    const user_table = $('.datatables-users').DataTable({

        ajax: {
            url: '/admin/admin/GetUserList',
            dataSrc: ''
        },
        columns: [
            { data: 'userId', title: '' },
            { data: 'userId', title: 'User ID' },
            { data: null, title: 'User' },
            { data: 'dob', title: 'DOB' },
            { data: 'email', title: 'Email' },
            { data: 'mobile', title: 'Mobile' },
            //{ data: 'userType', title: 'userType' },
            //{ data: 'userStatus', title: 'userStatus' },
            { data: null, title: 'Action' },


        ],

        columnDefs: [
            {
                // For Responsive
                className: 'control',
                searchable: false,
                orderable: false,
                responsivePriority: 2,
                targets: 0,
                render: function (data, type, full, meta) {
                    return '';
                }
            },
           
            {
                // User full name and email
                targets: 2,
                responsivePriority: 4,
                render: function (data, type, full, meta) {
                    var $name = full['firstName'] + ' ' + full['lastName'],
                        $email = full['email'],
                        $image = full['filePath'].replace("~", "");
                    if ($image) {
                        // For Avatar image
                        var $output =
                            '<img src="' + $image + '" alt="Avatar" class="rounded-circle">';
                    } else {
                        // For Avatar badge
                        var stateNum = Math.floor(Math.random() * 6);
                        var states = ['success', 'danger', 'warning', 'info', 'primary', 'secondary'];
                        var $state = states[stateNum],
                            $name = full['firstName'] + ' ' + full['lastName'],
                            $initials = $name.match(/\b\w/g) || [];
                        $initials = (($initials.shift() || '') + ($initials.pop() || '')).toUpperCase();
                        $output = '<span class="avatar-initial rounded-circle bg-label-' + $state + '">' + $initials + '</span>';
                    }
                    // Creates full output for row
                    var $row_output =
                        '<div class="d-flex justify-content-start align-items-center user-name">' +
                        '<div class="avatar-wrapper">' +
                        '<div class="avatar avatar-sm me-4">' +
                        $output +
                        '</div>' +
                        '</div>' +
                        '<div class="d-flex flex-column">' +
                        '<a href="javascript:void(0);" class="text-heading text-truncate"><span class="fw-medium">' +
                        $name +
                        '</span></a>'+
                        '</div>' +
                        '</div>';
                    return $row_output;
                }
            },

            //{
            //    targets: 3,
            //    responsivePriority: 4,
            //    render: function (data, type, full, meta) {
            //        return ("<div class='bg-success'>" + full['dob'] + "</div>")
            //    }
            //},

            //{
            //    // User Role
            //    targets: 6,
            //    render: function (data, type, full, meta) {
            //        var $role = full['userType'];
            //        var roleBadgeObj = {

            //            Author: '<i class="ti ti-edit ti-md text-warning me-2"></i>',
            //            User: '<i class="ti ti-user ti-md text-success me-2"></i>',
            //            Editor: '<i class="ti ti-chart-pie ti-md text-info me-2"></i>',
            //            Admin: '<i class="ti ti-device-desktop ti-md text-danger me-2"></i>'
            //        };
            //        return (
            //            "<span class='text-truncate d-flex align-items-center text-heading'>" +
            //            roleBadgeObj[$role] +
            //            $role +
            //            '</span>'
            //        );
            //    }
            //},

            //{
            //    // User Status
            //    targets: 7,
            //    render: function (data, type, full, meta) {
            //        var $status = full['userStatus'];

            //        return (
            //            '<span class="badge ' +
            //            statusObj[$status].class +
            //            '" text-capitalized>' +
            //            statusObj[$status].title +
            //            '</span>'
            //        );
            //    }
            //},

            {
                // Actions
                targets: -1,
                title: 'Actions',
                searchable: false,
                orderable: false,
                render: function (data, type, full, meta) {
                    return (
                        '<div class="d-flex align-items-center">' +
                        '<a href="javascript:;" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill edit-record"><i class="ti ti-edit ti-md"></i></a>' +
                        '<a href="javascript:;" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill view-record"><i class="ti ti-eye ti-md"></i></a>' +
                        '<a href="javascript:;" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill delete-record"><i class="ti ti-trash ti-md"></i></a>' +
                        '</div>' +
                        '</div>'
                    );
                }
            }
        ],


        order: [[2, 'asc']], // Sort by User ID
        responsive: true,
        dom:
            '<"row"' +
            '<"col-md-2"<"ms-n2"l>>' +
            '<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-6 mb-md-0 mt-n6 mt-md-0"fB>>' +
            '>t' +
            '<"row"' +
            '<"col-sm-12 col-md-6"i>' +
            '<"col-sm-12 col-md-6"p>' +
            '>',

        language: {
            sLengthMenu: '_MENU_',
            search: '',
            searchPlaceholder: 'Search User',
            paginate: {
                next: '<i class="ti ti-chevron-right ti-sm"></i>',
                previous: '<i class="ti ti-chevron-left ti-sm"></i>'
            }
        },


        buttons: [
            {
                text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Add New User</span>',
                className: 'add-new btn btn-primary waves-effect waves-light mx-3',
                attr: {
                    'data-bs-toggle': 'offcanvas',
                    'data-bs-target': '#offcanvasAddUser'
                }
            }
        ],

        // For responsive popup
        responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal({
                    header: function (row) {
                        var data = row.data();
                        return 'Details of ' + data['firstName'] + ' ' + data['lastName'];
                    }
                }),
                type: 'column',
                renderer: function (api, rowIdx, columns) {
                    var data = $.map(columns, function (col, i) {
                        return col.title !== ''
                            ? '<tr data-dt-row="' +
                            col.rowIndex +
                            '" data-dt-column="' +
                            col.columnIndex +
                            '">' +
                            '<td>' +
                            col.title +
                            ':' +
                            '</td> ' +
                            '<td>' +
                            col.data +
                            '</td>' +
                            '</tr>'
                            : '';
                    }).join('');

                    return data ? $('<table class="table"/><tbody />').append(data) : false;
                }
            }
        },
    });


    const addNewUserForm = document.getElementById('addNewUserForm');

    // Add New User Form Validation
    const fv = FormValidation.formValidation(addNewUserForm, {
        fields: {
            Email: {
                validators: {
                    notEmpty: {
                        message: 'Please enter your email'
                    },
                    emailAddress: {
                        message: 'Please enter valid email address'
                    }
                }
            },

            FirstName: {
                validators: {
                    notEmpty: {
                        message: 'First Name is required'
                    },
                    stringLength: {
                        min: 2,
                        message: 'First name must be more than 2 characters'
                    }
                }
            },

            LastName: {
                validators: {
                    notEmpty: {
                        message: 'Last Name is required'
                    },
                    stringLength: {
                        min: 2,
                        message: 'Last name must be more than 2 characters'
                    }
                }
            },
            Mobile: {
                validators: {
                    notEmpty: {
                        message: 'Please enter phone number'
                    },
                    regexp: {
                        regexp: /^(?:\d{10})$/,
                        message: 'Enter a valid 10-digit phone number'
                    }
                }
            },

            DOB: {
                validators: {
                    notEmpty: {
                        message: 'Please enter Date of Birth'
                    },
                    regexp: {
                        regexp: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
                        message: 'Enter a valid date'
                    }
                }
            }
        },
        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap5: new FormValidation.plugins.Bootstrap5({
                // Use this for enabling/changing valid/invalid class
                eleValidClass: '',
                rowSelector: function (field, ele) {
                    // field is the field name & ele is the field element
                    return '.mb-6';
                }
            }),
            submitButton: new FormValidation.plugins.SubmitButton(),
            // Submit the form when all fields are valid
            // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
            autoFocus: new FormValidation.plugins.AutoFocus()
        }
    }).on('core.form.valid', function () {

        $(".offcanvas-body").block({
            message: '<div class="spinner-border text-primary" role="status"></div>',

            css: {
                border: 'none',
                backgroundColor: 'transparent'
            },

            overlayCSS: {
                backgroundColor: '#fff',
                opacity: 0.8

            }
        });

        const data = $("#addNewUserForm").serialize();

       

        //const parts = data['dob'].split('/');

        //const [day, month, year] = parts;
        //data['dob'] = `${year}-${month}-${day}`;


        $.ajax({
            url: '/admin/admin/AddUpdateUser',
            data: data,
            method: 'POST',
            success: (resp) => {
                if (resp.status === true) {
                    $(".offcanvas-body").unblock();
                    $('#offcanvasAddUser').offcanvas('toggle');
                    ToastWrapper.success(`User ${data.userId === "0" ? 'Added' : 'Updated'} successfully!`);
                    user_table.ajax.reload(null, false);
                } else {
                    $(".offcanvas-body").unblock();

                    ToastWrapper.error(`Something went wrong!`);
                }

            },

            error: (resp) => {
                $(".offcanvas-body").unblock();

                ToastWrapper.error(`Something went wrong!`);
            }
        })
    });



    // Delete Record
    $(document).on('click', '.delete-record, .modal-body .delete-record', function () {
        $('.dtr-bs-modal').modal('hide');
        const rowData = user_table.row($(this).parents('tr')).data();
        const $button = $(this);

        Swal.fire({
            text: 'Are you sure you would like to delete this user?',
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

                let data = {};

                data['UserId'] = rowData.userId;

                data['FirstName'] = rowData.firstName;
                data['LastName'] = rowData.lastName;
                data['Email'] = rowData.email;
                data['Mobile'] = rowData.mobile;
                data['DOB'] = rowData.dob;


                $.ajax({
                    url: '/admin/admin/DeleteUser',
                    method: 'POST',
                    data: data,
                    success: (resp) => {
                        if (resp.status === true) {
                            user_table.row($button.parents('tr')).remove().draw();
                            ToastWrapper.success(`User deleted successfully!`);
                        } else {
                            ToastWrapper.error(`Something went wrong!`);
                        }
                    },

                    error: (resp) => {
                        ToastWrapper.error(`Something went wrong!`);
                    }

                });
            }
        });

    });


    $('.add-new').on('click', function () {
        $(".offcanvas-title").text('Add New User');
        $('#addNewUserForm')[0].reset();
    });


    //Edit Record
    $(document).on('click', '.edit-record, .modal-body .edit-record', function () {

        $('.dtr-bs-modal').modal('hide');
        const rowData = user_table.row($(this).parents('tr')).data();
        $('#UserId').val(rowData.userId);
        $('#FirstName').val(rowData.firstName);
        $('#LastName').val(rowData.lastName);
        $('#Email').val(rowData.email);
        $('#Mobile').val(rowData.mobile);
        $('#DOB').val(rowData.dob);


        $(".offcanvas-title").text("Edit User");
        $('#offcanvasAddUser').offcanvas('toggle');

    });



    let rolesmaster;

    $.get('/admin/admin/GetRolesWithUsers', (data, status) => {
        rolesmaster = data;
    });


    // show user details:
    $(document).on('click', '.view-record', function () {

        $('.dtr-bs-modal').modal('hide');
        const data = user_table.row($(this).parents('tr')).data();
        const userImage = data.filePath ? data.filePath.replace('~', '') : '';

        const rolesOptions = rolesmaster.map(role => {
            const isSelected = data.userType === role.roleName ? 'selected' : '';
            return `<option value="${role.roleId}" ${isSelected}>${role.roleName}</option>`;
        }).join('');
       
    //    const profileHtml = `
    //  <div class="row">
    //    <!-- Left: User Avatar -->
    //    <div class="col-md-4 text-center">
    //      <img src="${userImage}" class="img-fluid rounded-circle mb-3" alt="User Image" style="width:150px; height:150px;">
    //      <h5 class="text-primary">${data.firstName} ${data.lastName}</h5>
    //      <span class="badge bg-success">Active</span>
    //    </div>
    //    <!-- Right: User Details -->
    //    <div class="col-md-8">
    //      <ul class="list-group">
    //        <li class="list-group-item"><strong>Email:</strong> ${data.email}</li>
    //        <li class="list-group-item"><strong>Mobile:</strong> ${data.mobile}</li>
    //        <li class="list-group-item"><strong>Date of Birth:</strong> ${data.dob}</li>
    //        <li class="list-group-item"><strong>Role:</strong>
    //            <select class="form-select" id="role-select" oncha>

    //               ${rolesOptions}
    //            </select>
    //        </li>
    //      </ul>
    //    </div>
    //  </div>
        //`;

        const badgeClass = statusObj[data.userStatus] !== undefined ? statusObj[data.userStatus].class : 'bg-warning';
        console.log(badgeClass);

        const profileHtml = `<div class="row g-4">
                <!-- Left: User Avatar -->
                <div class="col-md-4 text-center">
                    <img src="${userImage}" class="img-fluid rounded-circle border border-3 border-primary mb-3" alt="User Image" style="width:150px; height:150px;">
                    <h5 class="text-primary fw-bold">${data.firstName} ${data.lastName}</h5>
                    <span class="badge ${badgeClass} rounded-pill px-3 py-2">${data.userStatus}</span>
                </div>

                <!-- Right: User Details -->
                <div class="col-md-8">
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Email:</strong>
                            <span>${data.email}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Mobile:</strong>
                            <span>${data.mobile}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Date of Birth:</strong>
                            <span>${data.dob}</span>
                        </li>
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <strong>Role:</strong>
                            <select class="form-select form-select-sm w-auto" id="role-select">
                                ${rolesOptions}
                            </select>
                        </li>
                    </ul>
                </div>
            </div>
        `;

        $('#userProfileContent').html(profileHtml);
      

        $('#role-select').on('change', (e) => {

            Swal.fire({
                text: 'Are you sure you would like to change role for this user?',
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

                    const userIdVal = data.userId;
                    const roleIdVal = e.target.value;
                    const roleName = $("#role-select option:selected").text();


                    $.ajax({
                        url: '/admin/admin/UpdateUserRole',
                        method: 'POST',
                        data: { userId: userIdVal, roleId: roleIdVal },
                        success: (resp) => {
                            if (resp.status === true) {
                                data.userType = roleName;
                                ToastWrapper.success(`Role Updated successfully!`);
                            } else {
                                ToastWrapper.error(`Failed to update role!`);
                            }
                        },

                        error: () => {
                            ToastWrapper.error(`Failed to update role!`);
                        }
                    });
                }
                else {

                    $('#role-select option').filter(function () {
                        return $(this).text().trim().toLowerCase() === data.userType.trim().toLowerCase();
                    }).prop('selected', true);
                }
            });
        });

        $('#userProfileModal').modal('show');

    });

});



