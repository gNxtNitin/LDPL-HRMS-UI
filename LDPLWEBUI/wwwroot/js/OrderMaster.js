$(document).ready(function () {




   

    ToastWrapper.init({
        positionClass: 'toast-top-right',
        timeOut: 3000,
        progressBar: true

    });


   

    const user_table = $('.datatables-orders').DataTable({

        ajax: {
            url: '/customer/GetOrderMaster',
            dataSrc: ''
        },
        columns: [
           
            { data: 'auto_key_order', title: 'Order Number' },
            { data: 'order_date', title: 'Order Date' },
            { data: 'item_qty', title: 'Total Items' },
            { data: 'pending_items', title: 'Pending Items' },
            { data: 'approved_items', title: 'Approved Items' },
            { data: 'executed_items', title: 'Executed Items' },
            { data: 'item_amount', title: 'Total Amount' },
            { data: null, title: 'Actions' },
            //{ data: 'userType', title: 'userType' },
            //{ data: 'userStatus', title: 'userStatus' },
            //{ data: null, title: 'Action' },


        ],

        columnDefs: [
            {
                target: 0,
                className: 'text-end',
            },
            {
                target: 2,
                className: 'text-end',
            },
            {
                target: 3,
                className: 'text-end',
            },
            {
                target: 4,
                className: 'text-end',
            },
            {
                target: 5,
                className: 'text-end',
            },
            {
                target: 6,
                className: 'text-end',
            },
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

            {
                // Actions
                targets: -1,
                title: 'Actions',
                searchable: false,
                orderable: false,
                render: function (data, type, full, meta) {
                    var hasInvoices = parseInt(full.invoices) > 0;
                    return (
                        '<div class="d-flex align-items-center">' +
                        '<a href="/Customer/OrderDetails?ck=' + full.auto_key_order + '" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill"><i class="ti ti-eye-edit ti-md" title="View order details" ></i></a>' +
                       
                        '</div>' +
                        '</div>'
                    );
                }
            }
        ],


        order: [[0, 'desc'], [1, 'desc']], // Sort by Order ID and Order date
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
                text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Place New Order</span>',
                className: 'add-new btn btn-sm btn-primary waves-effect waves-light mx-3 add-new-order',
                //attr: {
                //    'asp-controller': 'Customer',
                //    'asp-action': 'OrderEntry'
                //},
                action: function (e, dt, node, config) {
                   

                    // Build the URL
                    const url = `/Customer/OrderEntry`;

                    // Redirect to the URL
                    window.location.href = url;
                }
            },

        ],
        initComplete: function (settings, json) {
            invoiceRecord();
        }

        // For responsive popup
        //responsive: {
        //    details: {
        //        display: $.fn.dataTable.Responsive.display.modal({
        //            header: function (row) {
        //                var data = row.data();
        //                return 'Details of ' + data['firstName'] + ' ' + data['lastName'];
        //            }
        //        }),
        //        type: 'column',
        //        renderer: function (api, rowIdx, columns) {
        //            var data = $.map(columns, function (col, i) {
        //                return col.title !== ''
        //                    ? '<tr data-dt-row="' +
        //                    col.rowIndex +
        //                    '" data-dt-column="' +
        //                    col.columnIndex +
        //                    '">' +
        //                    '<td>' +
        //                    col.title +
        //                    ':' +
        //                    '</td> ' +
        //                    '<td>' +
        //                    col.data +
        //                    '</td>' +
        //                    '</tr>'
        //                    : '';
        //            }).join('');

        //            return data ? $('<table class="table"/><tbody />').append(data) : false;
        //        }
        //    }
        //},
    });


    





});



