
var user_table2;
var fromDateStr, toDateStr, str1;
$(document).ready(function () {
    fromDateStr = '';
    toDateStr = '';
    str1 = '';
    //alert(str);
    //var str1 = $('#req-str').val();
    //user_table2.destroy();
    
    ToastWrapper.init({
        positionClass: 'toast-top-right',
        timeOut: 3000,
        progressBar: true

    });
    

     user_table2 = $('.datatables-invoice').DataTable({

        ajax: {
             url: '/customer/GetOrderInvoice?cid1=' + str1 + '&cid2=' + fromDateStr + '&cid3=' + toDateStr,

            dataSrc: ''
        },
        columns: [
            { data: 'mkey', title: '' },
            { data: 'billno', title: 'Invoice Number' },
            { data: 'invoice_date', title: 'Invoice Date' },

            { data: 'inv_amt', title: 'Invoice Amount' },
            { data: 'supp_cust_code', title: 'Customer Code' },
            { data: 'auto_key_desp', title: 'Dispatch Number' },
            
            { data: 'grnumber', title: 'GR Number' },
            { data: null, title: 'Actions' }

        ],

         columnDefs: [
             
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
            //{
            //    target: 6,
            //    className: 'text-end',
            //},
            {
                targets: 0,
                visible: false
            },
            {
                targets: -2,
                visible: false
            },

            {
                // Actions
                targets: -1,
                title: 'Actions',
                searchable: false,
                orderable: false,
                render: function (data, type, full, meta) {
                    var isGR = full.grnumber != null ? true : false;
                    //console.log(full);
                    return (
                        '<div class="d-flex align-items-center">' +
                        '<a class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill view-s-invoice"><i class="ti ti-file-invoice text-info ti-md" title="View Invoice"></i></a>' +
                        (isGR ?
                            '<a class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill view-s-gr "><i class="ti ti-receipt-rupee text-info ti-md" title="View GR"></i></a>' : '') +
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
            '<"col-md-1"<"ms-n2"l>>' +
            '<"col-md-6 d-flex align-items-center"<"my-custom-filter">>' +
            '<"col-md-5"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-6 mb-md-0 mt-n6 mt-md-0"fB>>' +
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

        ],
        initComplete: function (settings, json) {
            //$('.modal-weigh').trigger('click');
            var htm = `<div class="my-cstm">
            <div class="col-md-4" style="padding-left:0.25rem!important; padding-right:0.25rem!important">
    <div class="input-group input-group-merge">
      <span class=" input-group-text" id="text-to-speech-addon">
            From
        </span>
        <input type="text" class="date-picker form-control form-control-sm" id="fromD" placeholder="DD/MM/YYYY"  />
        <span class=" input-group-text" id="text-to-speech-addon">
            <i class="ti ti-calendar cursor-pointer speech-to-text"></i>
        </span>
    </div>
    </div>
    <div class="col-md-4" style="padding-left:0.25rem!important; padding-right:0.25rem!important">
    <div class="input-group input-group-merge ">
    <span class=" input-group-text" id="text-to-speech-addon">
            To
        </span>
         <input type="text" class="date-picker form-control form-control-sm" id="toD" placeholder="DD/MM/YYYY" />
       
        <span class=" input-group-text" id="text-to-speech-addon">
            <i class="ti ti-calendar cursor-pointer speech-to-text"></i>
        </span>
    </div>
    </div>
    <div class="col-md-4 col-12" style="padding-left:0.25rem!important; padding-right:0.25rem!important">
        <button class="btn btn-primary btn-sm"  id="btn-submit" type="button">Apply Filter</button>
    </div>
    </div>`;
            $('.my-custom-filter').append(htm);
            datePickerFunc();
            grdataShow();
            InvoiceGen();
        },

    });


})








