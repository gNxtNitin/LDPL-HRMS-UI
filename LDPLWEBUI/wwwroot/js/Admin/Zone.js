var zone_table;
$(document).ready(function () {






    ToastWrapper.init({
        positionClass: 'toast-top-right',
        timeOut: 3000,
        progressBar: true

    });




    zone_table = $('.datatables-orders').DataTable({

        ajax: {
            url: '/admin/GetAllZone',
            dataSrc: ''
        },
        columns: [
            { data: 'zoneid', title: '' },
           // { data: null, title: 'S. No.' },
            { data: 'name', title: 'Zone' },
            { data: 'logdate', title: 'Created Date' },
            
            { data: null, title: 'Actions' },
            //{ data: 'userType', title: 'userType' },
            //{ data: 'userStatus', title: 'userStatus' },
            //{ data: null, title: 'Action' },


        ],

        columnDefs: [
            //{
            //    target: 1,
            //    className: 'text-end',
            //    render: function (data, type, row, meta) {
            //        return meta.row + 1;
            //    }
            //},
            {
                target: 0,
                visible: false,
            },
           

            {
                // Actions
                targets: -1,
                title: 'Actions',
                searchable: false,
                orderable: false,
                render: function (data, type, full, meta) {
                    //var hasInvoices = parseInt(full.invoices) > 0;
                    return (
                        '<div class="d-flex align-items-center">' +
                        '<a class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill delete-record"><i class="ti ti-trash text-danger"></i></a>' +
                        '</div>' +
                        '</div>'
                    );
                }
            }
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
                text: '<i class="ti ti-plus me-sm-1"></i> <span class="d-none d-sm-inline-block">Add New Zone</span>',
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
                offCanvasElement = document.querySelector('#add-new-record');
                offCanvasEl = new bootstrap.Offcanvas(offCanvasElement);
                // Empty fields on offCanvas open
                (offCanvasElement.querySelector('.dt-zname').value = '')  ;
                // Open offCanvas with form
                offCanvasEl.show();
            });
            deleteRecord();
            //invoiceRecord();
        }

    });








});



