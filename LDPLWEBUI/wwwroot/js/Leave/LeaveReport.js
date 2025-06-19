var zone_table;
$(document).ready(function () {




    $('.date-picker').flatpickr({
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




    zone_table = $('.datatables-orders').DataTable({

        ajax: {
            url: '/leave/GetAllLeave',
            dataSrc: ''
        },
        columns: [
            { data: 'AUTO_KEY_REF', title: 'ID' },
            { data: 'REF_DATE', title: 'Date' },
            { data: 'REASON', title: 'Reason' },
            { data: 'FROM_DATE', title: 'From Date' },
            { data: 'TO_DATE', title: 'To Date' },
            { data: 'LDAYS', title: 'Total Days' },
            { data: 'HALF_DAY', title: 'IsHalfDay' },
            { data: 'APP_STATUS', title: 'App Status' },
            { data: 'HR_STATUS', title: 'HR Status' }


        ],

        columnDefs: [
            {
                target: 6,
                render: function (data, type, full, meta) {
                    //console.log(data);
                    let badgeClass = data == 1 ? "Yes": "No";

                    
                    return badgeClass;
                },
            },
            {
                target: 7,
                render: function (data, type, full, meta) {
                    let badgeClass = "";

                    switch (data) {
                        case "O":
                            badgeClass = "bg-warning";
                            break;
                        case "A":
                            badgeClass = "bg-info";
                            break;
                        case "C":
                            badgeClass = "bg-success";
                            break;
                        default:
                            badgeClass = "bg-secondary"; // fallback/default
                    }
                    return (
                        `<span class="badge rounded-pill ${badgeClass} me-1">${data == "O" ? "Pending": "Approved"}</span>`
                    );
                },
            },
            {
                target: 8,
                render: function (data, type, full, meta) {
                    let badgeClass = "";

                    switch (data) {
                        case "O":
                            badgeClass = "bg-warning";
                            break;
                        case "A":
                            badgeClass = "bg-info";
                            break;
                        case "C":
                            badgeClass = "bg-success";
                            break;
                        default:
                            badgeClass = "bg-secondary"; // fallback/default
                    }
                    return (
                        `<span class="badge rounded-pill ${badgeClass} me-1">${data == "O" ? "Pending" : "Approved"}</span>`
                    );
                },
            }
            


            //{
            //    // Actions
            //    targets: -1,
            //    title: 'Actions',
            //    searchable: false,
            //    orderable: false,
            //    render: function (data, type, full, meta) {
            //        //var hasInvoices = parseInt(full.invoices) > 0;
            //        return (
            //            '<div class="d-flex align-items-center">' +
            //            '<a class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill delete-record"><i class="ti ti-trash text-danger"></i></a>' +
            //            '</div>' +
            //            '</div>'
            //        );
            //    }
            //}
        ],


        order: [[1, 'asc']], // Sort by User ID
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
                text: '<i class="ti ti-plus me-sm-1"></i> <span class="d-none d-sm-inline-block">Add New Request</span>',
                className: 'create-new btn btn-sm btn-primary mx-3 waves-effect waves-light'
            }
            //{
            //    text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Add New Zone</span>',
            //    className: 'add-new btn btn-primary waves-effect waves-light mx-3 add-new-zone',
            //    //attr: {
            //    //    'asp-controller': 'Customer',
            //    //    'asp-action': 'OrderEntry'
            //    //},
            //    action: function (e, dt, node, config) {
            //        $('.modal-weigh').trigger('click');
            //        // Build the URL

            //    }
            //},

        ],
        initComplete: function (settings, json) {
            $('.create-new').on('click', function () {
                $('#form-add-new-record')[0].reset();
                offCanvasElement = document.querySelector('#add-new-record');
                offCanvasEl = new bootstrap.Offcanvas(offCanvasElement);
                // Empty fields on offCanvas open
                //(offCanvasElement.querySelector('.dt-zname').value = '');
                // Open offCanvas with form
                offCanvasEl.show();
            });
            //deleteRecord();
            
        }

    });








});



