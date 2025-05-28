
var orderdetails_table;

$(document).ready(function () {



    


    ToastWrapper.init({
        positionClass: 'toast-top-right',
        timeOut: 3000,
        progressBar: true

    });
    var str1 = $('#req-str').val();
    


    orderdetails_table = $('.datatables-orderdetails').DataTable({

        ajax: {
            url: '/customer/GetOrderItem?cid=' + str1,
            
            dataSrc: ''
        },
        columns: [

            //{ data: 'auto_key_order', title: 'Order Number' },
            //{ data: 'order_date', title: 'Order Date' },
            { data: 'item_code', title: 'Title Code' },
            { data: 'item_short_desc', title: 'Title Name' },
            
            { data: 'item_uom', title: 'UOM' },
            { data: 'item_qty', title: 'Quantity' },
            { data: 'item_price', title: 'MRP' },
            { data: 'item_disc', title: 'Discount %' },
            { data: 'item_amount', title: 'Amount' },
            { data: 'status', title: 'Status' },
            { data: null, title: 'Actions' },
            { data: 'status', title: '' },
            //{ data: 'userType', title: 'userType' },
            //{ data: 'userStatus', title: 'userStatus' },
            //{ data: null, title: 'Action' },


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
            {
                targets: 7, // 5th column (Quantity column)
                title: 'Status',
                searchable: false,
                orderable: false,
                //width: '80px', // Set the width of the Quantity column
                render: function (data, type, full, meta) {
                    let badgeClass = "";

                    switch (data) {
                        case "Pending":
                            badgeClass = "bg-warning";
                            break;
                        case "Approved":
                            badgeClass = "bg-info";
                            break;
                        case "Executed":
                            badgeClass = "bg-success";
                            break;
                        default:
                            badgeClass = "bg-secondary"; // fallback/default
                    }
                    return (
                        `<span class="badge rounded-pill ${badgeClass} me-1">${data}</span>`
                    );
                },
                createdCell: function (td, cellData, rowData, row, col) {
                    td.style.height = 'calc(2.2505001rem + calc(var(--bs-border-width) * 2))';
                }

            },
            {
                targets: 3, // 5th column (Quantity column)
                className: 'text-end',
                title: 'Quantity',
                searchable: false,
                orderable: false,
                //width: '30px', // Set the width of the Quantity column
                render: function (data, type, full, meta) {
                    return (
                        '<div class="">' +
                        '<input type="number" class="quant-input numeric-input" name="quantity" value="' + data + '" max="99999" disabled />' +
                        '</div>'
                    );
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
                targets: -1, // Targets the last column
                visible: false,
            },
            {
                // Actions
                targets: -2,
                title: 'Actions',
                searchable: false,
                orderable: false,
                render: function (data, type, full, meta) {
                   
                    if (full.status == 'Pending') {
                        return (
                            '<div class="d-flex align-items-center">' +
                            '<a class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill force-hide update-record"><i class="fa-regular fa-floppy-disk" title="Save changes"></i></a>' +
                            '<a class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill force-hide cancel-record"><i class="fa-solid fa-xmark text-danger" title="Cancel"></i></a>' +
                            '<a class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill edit-record"><i class="ti ti-edit ti-md" title="Edit"></i></a>' +
                            '<a class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill delete-record"><i class="ti ti-trash text-danger" title="Delete"></i></a>' +
                            '</div>' +
                            '</div>'
                        );
                    }
                    else {
                        return '';
                    }
                }
            }
        ],


        order: [[2, 'asc']], // Sort by User ID
        responsive: false,
        dom:
            '<"row"' +
            '<"col-md-2"<"ms-n2"l>>' +
            '<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-6 mb-md-0 mt-n6 mt-md-0"f<"my-custom-select">B>>' +
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
      //      {
      //          text: '', // No text needed as we're inserting a custom element
      //          className: 'btn-custom-filter ',
      //          action: null, // Required, but will be left empty since we inject elements manually
      //          init: function (dt, node, config) {
      //              // Clear the default button content
      //              node.empty();

      //              // Create the wrapper
      //              let wrapper = document.createElement('div');
      //              wrapper.className = 'd-flex'; // Column layout

      //              // Label
      //              let label = document.createElement('p');
      //              label.className = 'mx-2';
      //              label.innerText = 'Filter By Role';
      //              wrapper.appendChild(label);

      //              // Filter dropdown
      //              const filter = document.createElement('select');
      //              filter.className = 'form-select form-select-sm';
      //              filter.id = 'roleFilter';
      ////              filter.innerHTML = `
      ////  <option value="">All Roles</option>
      ////  <option value="Admin">Admin</option>
      ////  <option value="Editor">Editor</option>
      ////  <option value="Viewer">Viewer</option>
      ////`;
      //              wrapper.appendChild(filter);

      //              // Append the wrapper to the button node
      //              node.append(wrapper);

                   
      //              // Optional: Add event listener for filtering
      //              //filter.addEventListener('change', function () {
                        
      //              //    //const value = this.value;
      //              //    //dt.column(7).search(value).draw();
      //              //});
      //          }
      //      }
            //{
            //    text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Place New Order</span>',
            //    className: 'add-new btn btn-primary waves-effect waves-light mx-3 add-new-order',
            //    //attr: {
            //    //    'data-bs-toggle': 'offcanvas',
            //    //    'data-bs-target': '#offcanvasAddUser'
            //    //}
            //}
        ],
        initComplete: function (settings, json) {
            $('.my-custom-select').append(`
          
              <select id="st-filter" class="form-select form-select-sm mx-2" style="width: auto;">
                <option value="">All</option>
                
              </select>
            `);
            let pending = 0, approved = 0, executed = 0;

            $.each(json, function (index, item) {
                if (item.status == 'Pending') {
                    pending++;
                } else if (item.status == 'Approved') {
                    approved++;
                } else if (item.status == 'Executed') {
                    executed++;
                }

                //// Assign the latest total status counts to each item (optional)
                //item.pendingCount = pending;
                //item.approvedCount = approved;
                //item.executedCount = executed;
            });
            $('.or-pi').text(pending);
            $('.or-ai').text(approved);
            $('.or-ei').text(executed);
            $('.or-number').text(json[0].auto_key_order);
            
            $('.or-date').text(json[0].order_date);
            // My own code start
            $('.datatables-orderdetails tbody').on('click','.edit-record', function () {
                var td = $(this).closest('td');
                var row = $(this).closest('tr');
                row.find('input').prop('disabled', false);
                row.find('input').addClass('show-quant');
                $(this).toggleClass('force-hide');
                // Find the hidden link inside the same <td> and remove display: none
                td.find('.delete-record').toggleClass('force-hide');
                td.find('.cancel-record').toggleClass('force-hide');
                td.find('.update-record').toggleClass('force-hide');
                row.find('input.quant-input').focus();
            });

            $('.datatables-orderdetails tbody').on('click','.cancel-record', function () {
                var td = $(this).closest('td');
                var row = $(this).closest('tr');
                row.find('input').prop('disabled', true);
                row.find('input').removeClass('show-quant');
                //$(this).addClass('force-hide');
                // Find the hidden link inside the same <td> and remove display: none
                td.find('.delete-record').toggleClass('force-hide');
                td.find('.cancel-record').toggleClass('force-hide');
                td.find('.edit-record').toggleClass('force-hide');
                td.find('.update-record').toggleClass('force-hide');
            });
            
            updateRecord();
            deleteRecord();

            //updating a record
             //$('.update-record').on('click', function() {
             //    var itemList = [];
             //    var row = $(this).closest('tr');


             //    var id = row.find('td:eq(0)').text();
             //    var quantity = row.find('td').eq(5).find('input').val();
             //    itemList.push({
             //         ITEM_CODE: id,
             //         ITEM_QTY: quantity
             //    });
             //    var shippingInfo = {
             //        AutoKeyOrder: $('.or-number').text(),
             //        ShipToParty:'',
             //        ShipToAddress: '',
             //        TransporterName: '',
             //        BookingStation: '',
             //        CustomerPoNo: '',
             //        SchoolName: '',
             //        Items: itemList
             //    };
             //    $.post({
             //        url: '/Customer/UpdateOrder',
             //        data: { sr1 : JSON.stringify(shippingInfo) },
             //        success: function (resp) {
             //            alert(1);


             //        },
             //        error: function (xhr, status, error) {
             //            alert(2);
             //        }
             //    });
             //});
            // My own code end

            $('.numeric-input').on('input', function () {
                var el = $(this);
                // Remove non-numeric characters
                var value = $(this).val();
                var numericValue = value.replace(/[^0-9]/g, '');
                $(this).val(numericValue);
                if (el.val().length > 5) {
                    //el.value = el.value.slice(0, 5);
                    $(this).val(value.slice(0, 5));
                }
            });

            //$overlay.hide();
            const uniqueRoles = new Set(json.map(user => user.status));
            //console.log(json);
            uniqueRoles.forEach(role => {
                $('#st-filter').append(`<option value="${role}">${role}</option>`);
            });
            $('#st-filter').on('change', function () {
                const role = $(this).val();
                //console.log(orderdetails_table.row());
                orderdetails_table.column(9).search(role ? '^' + role + '$' : '', true, false).draw();
               
            });
        },
    //    layout: {
    //        topEnd: ['search', function () {
    //            // Create the wrapper for both the label and the filter dropdown
               
    //            let wrapper = document.createElement('div');
    //            wrapper.className = 'd-flex flex-column align-items-end gap-3';  // Column layout

    //            // Create and append the label for the role filter
    //            let label = document.createElement('p');
    //            label.className = "";
    //            label.innerText = "Filter By Status";  // Corrected typo here
    //            wrapper.appendChild(label);

    //            // Create the custom role filter dropdown
    //            const filter = document.createElement('select');
    //            filter.className = 'form-select form-select-sm';
    //            filter.id = 'roleFilter';
    //            filter.innerHTML = `
    //                <option value="">All Roles</option>
    //`;
    //            //filter.classList.add('same-height');  // Ensure same height as the search box
    //            wrapper.appendChild(filter);

    //            // Create the search box (provided by DataTables)
    //            //const searchBox = $('<div class="dt-search flex-grow-1"/>')[0];
    //            //searchBox.classList.add('same-height');  // Ensure same height as the filter
    //            //wrapper.appendChild(searchBox);
               
    //            return wrapper;
    //        }]
    //    }
        
        
    });

});



