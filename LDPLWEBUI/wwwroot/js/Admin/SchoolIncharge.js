var user_table;
$(document).ready(function () {






    ToastWrapper.init({
        positionClass: 'toast-top-right',
        timeOut: 3000,
        progressBar: true

    });




    user_table = $('.datatables-schoolincharge').DataTable({

        ajax: {
            url: '/admin/GetSchoolIncharge',
            dataSrc: ''
        },
        columns: [
            //{ data: 'cityid', title: '' },
            // { data: null, title: 'S. No.' },
            { data: 'STATE', title: 'State' },
            { data: 'CITYNAME', title: 'City' },
            { data: 'INCHARGE', title: 'Incharge' },
            { data: 'LOGDATE', title: 'Assigned Date' },

            //{ data: null, title: 'Actions' },
            //{ data: 'userType', title: 'userType' },
            //{ data: 'userStatus', title: 'userStatus' },
            //{ data: null, title: 'Action' },


        ],

        columnDefs: [
            //{
            //    target: 0,
            //    className: 'text-end',
            //    render: function (data, type, row, meta) {
            //        return meta.row + 1;
            //    }
            //}
            

            {
                target: 0,
                className: 'city',
            },
            //{
            //    target: 5,
            //    className: 'text-end',
            //},
            //{
            //    target: 6,
            //    className: 'text-end',
            //},
            //{
            //    // For Responsive
            //    className: 'control',
            //    searchable: false,
            //    orderable: false,
            //    responsivePriority: 2,
            //    targets: 0,
            //    render: function (data, type, full, meta) {
            //        return '';
            //    }
            //},



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
        ],

        pageLength: 20,
        lengthMenu: [[20, 40, 60, 80], [20, 40, 60, 80]],
        order: [[0, 'asc']], // Sort by User ID
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
            searchPlaceholder: 'Search',
            paginate: {
                next: '<i class="ti ti-chevron-right ti-sm"></i>',
                previous: '<i class="ti ti-chevron-left ti-sm"></i>'
            }
        },


        buttons: [
            {
                text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Assign Incharge</span>',
                className: 'add-new btn btn-sm btn-primary waves-effect waves-light mx-3 add-new-incharge',
                //attr: {
                //    'asp-controller': 'Customer',
                //    'asp-action': 'OrderEntry'
                //},
                action: function (e, dt, node, config) {
                    $('.modal-weigh').trigger('click');
                    // Build the URL

                }
            },

        ],
        initComplete: function (settings, json) {
            console.log(json);
            $('.add-new-incharge').on('click', function () {
                offCanvasElement = document.querySelector('#add-new-record');
                offCanvasEl = new bootstrap.Offcanvas(offCanvasElement);
                // Empty fields on offCanvas open
                //(offCanvasElement.querySelector('.dt-city').value = '');
                const selectElement = offCanvasElement.querySelector('.dt-incharge');
                if (selectElement) {
                    //selectElement.selectedIndex = 0; // Reset to first option
                    // OR use this if using a library like Select2 or choices.js
                    $(selectElement).val('').trigger('change');
                }
                const selectElement2 = offCanvasElement.querySelector('.dt-city');
                if (selectElement2) {
                    //selectElement.selectedIndex = 0; // Reset to first option
                    // OR use this if using a library like Select2 or choices.js
                    $(selectElement2).val('').trigger('change');
                }
                const selectElement3 = offCanvasElement.querySelector('.dt-state');
                if (selectElement3) {
                    //selectElement.selectedIndex = 0; // Reset to first option
                    // OR use this if using a library like Select2 or choices.js
                    $(selectElement3).val('').trigger('change');
                }

                // Open offCanvas with form
                offCanvasEl.show();
            });
            //deleteRecord();
            appendData();

        }

    });








});



