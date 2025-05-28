var items_table;
$(document).ready(function () {

    
    ToastWrapper.init({
        positionClass: 'toast-top-right',
        timeOut: 3000,
        progressBar: true

    });

    items_table = $('.datatables-items').DataTable({

        ajax: {
            url: '/customer/GetAllItems',

            dataSrc: ''
        },
        processing: true,
        columns: [
            { data: 'item_code', title: 'Title Code' },
            { data: 'item_short_desc', title: 'Title Name' },
            { data: 'subcategory_desc', title: 'Category' },
            { data: 'subcategory_code', title: 'SubCode' },
            { data: 'prodtype_desc', title: 'Sub Category' },
            { data: 'issue_uom', title: 'UOM' },
            { data: 'rate', title: 'MRP' },
            { data: 'qty', title: 'Quantity' }

            //{ data: 'userType', title: 'userType' },
            //{ data: 'userStatus', title: 'userStatus' },
            //{ data: null, title: 'Action' },


        ],

        columnDefs: [
            {
                target: 3,
                visible: false,
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
            //    targets: 9, // 5th column (Quantity column)
            //    title: 'Status',
            //    searchable: false,
            //    orderable: false,
            //    //width: '80px', // Set the width of the Quantity column
            //    render: function (data, type, full, meta) {
            //        let badgeClass = "";

            //        switch (data) {
            //            case "Pending":
            //                badgeClass = "bg-warning";
            //                break;
            //            case "Approved":
            //                badgeClass = "bg-info";
            //                break;
            //            case "Executed":
            //                badgeClass = "bg-success";
            //                break;
            //            default:
            //                badgeClass = "bg-secondary"; // fallback/default
            //        }
            //        return (
            //            `<span class="badge rounded-pill ${badgeClass} me-1">${data}</span>`
            //        );
            //    }
            //},
            {
                targets: -1, // 5th column (Quantity column)
                title: 'Quantity',
                searchable: false,
                orderable: false,
                //width: '80px', // Set the width of the Quantity column
                render: function (data, type, full, meta) {
                    return (
                        '<div class="">' +
                        '<input type="number" class="quant-input numeric-input" name="quantity" value="' + data + '" placeholder="0" max="99999"  >' +
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

            //{
            //    // Actions
            //    targets: -1,
            //    title: 'Actions',
            //    searchable: false,
            //    orderable: false,
            //    render: function (data, type, full, meta) {
            //        return (
            //            '<div class="d-flex align-items-center">' +
            //            '<a href="#" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill edit-record"><i class="ti ti-edit ti-md"></i></a>' +
            //            '<a href="#" class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill delete-record"><i class="ti ti-edit ti-md"></i></a>' +
            //            '</div>' +
            //            '</div>'
            //        );
            //    }
            //}
        ],


        //order: [[2, 'asc']], // Sort by User ID
            //responsive: true,
        dom: '<"card-header d-none flex-column flex-md-row"<"head-label text-center"><"dt-action-buttons text-end pt-6 pt-md-0"B>><"row"<"col-sm-12 col-md-6 div-margin"l><"col-sm-12 div-margin col-md-6 d-flex justify-content-center justify-content-md-end mt-n6 mt-md-0"<"my-custom-select">f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',

        //dom:
        //    '<"row"' +
        //    '<"col-md-2"<"ms-n2"l>>' +
        //    '<"col-md-10"<"dt-action-buttons text-xl-end text-lg-start text-md-end text-start d-flex align-items-center justify-content-end flex-md-row flex-column mb-6 mb-md-0 mt-n6 mt-md-0"fB>>' +
        //    '>t' +
        //    '<"row"' +
        //    '<"col-sm-12 col-md-6"i>' +
        //    '<"col-sm-12 col-md-6"p>' +
        //    '>',

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
                    extend: 'excelHtml5',
                    text: '<i class="bi bi-download"></i> Export',
                    className: 'd-none',
                    exportOptions: {
                        modifier: {
                            page: 'all' // export all pages
                        }
                    },
                    filename: 'Full_Data_Export',
                    title: null
                },
                
            ],

        //buttons: [
        //    {
        //        text: '<i class="ti ti-plus me-0 me-sm-1 ti-xs"></i><span class="d-none d-sm-inline-block">Place New Order</span>',
        //        className: 'add-new btn btn-primary waves-effect waves-light mx-3 add-new-order',
        //        //attr: {
        //        //    'data-bs-toggle': 'offcanvas',
        //        //    'data-bs-target': '#offcanvasAddUser'
        //        //}
        //    }
        //],
        initComplete: function (settings, json) {
            //console.log(json);
            $('.numeric-input').on('input', function () {
                var el = $(this);
                //console.log(el.val().length);
                
                // Remove non-numeric characters
                var value = $(this).val();
                
                var numericValue = value.replace(/[^0-9]/g, '');
                $(this).val(numericValue);
                if (el.val().length > 5) {
                    //el.value = el.value.slice(0, 5);
                    $(this).val(value.slice(0, 5));
                }
            });
            $('#customExportExcel').on('click', function () {
                items_table.button('.buttons-excel').trigger(); // Trigger the hidden Excel export button
            });
            $('.my-custom-select').append(`
          
              <select id="cat-filter" class="form-select form-select-sm mx-2" style="width: auto;">
                <option value="">Select Category</option>
                
              </select>
            `);
            const seen = new Set();
            const uniqueSet = new Set();

            json.forEach(user => {
                if (!seen.has(user.subcategory_code)) {
                    seen.add(user.subcategory_code);
                    uniqueSet.add({
                        catcode: user.subcategory_code,
                        catname: user.subcategory_desc
                    });
                }
            });
            uniqueSet.forEach(role => {
                //console.log(role.catcode);
                $('#cat-filter').append(`<option value="${role.catcode}">${role.catname}</option>`);
            });
            $('#cat-filter').on('change', function () {
                const role = $(this).val();
                //console.log(orderdetails_table.row());
                items_table.column(3).search(role ? '^' + role + '$' : '', true, false).draw();

            });
           // console.log(uniqueSet);
        },
    


    });




    const expectedHeaders = ["Title Code", "Title Name", "UOM", "MRP", "Quantity"]; // Define expected headers


    $('#excelFile').on('change', function (e) {


        const file = e.target.files[0];
        if (!file) {
            ToastWrapper.error("Please select a valid Excel(.xlsx) file.");
            $('#excelFile').val('');
            return;
        }

        const $orderEntryCard = $("#orderEntryCard")
        $orderEntryCard.block({
            message:
                '<div class="sk-wave mx-auto"><div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div> <div class="sk-rect sk-wave-rect"></div></div>',
            css: {
                backgroundColor: 'transparent',
                color: '#fff',
                border: '0'
            },
            overlayCSS: {
                opacity: 0.5
            }
        });

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                const firstSheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

                const actualHeaders = Object.keys(jsonData[0] || {});
                const isValidStructure = expectedHeaders.every(h =>
                    actualHeaders.some(actual => actual.toLowerCase() === h.toLowerCase())
                );

                if (!isValidStructure) {
                    $orderEntryCard.unblock();
                    ToastWrapper.error(`Invalid Excel structure.\nExpected: ${expectedHeaders.join(', ')}\nFound: ${actualHeaders.join(', ')}`);
                    $('#excelFile').val('');
                    return;
                }

                const sanitizedData = jsonData.map(row => ({
                    itemcode: row["Title Code"]?.toString().trim() || '',
                    title: row["Title Name"] || '',
                    uon: row["UOM"] || '',
                    price: parseFloat(row["MRP"]) || 0,
                    quantity: parseInt(row["Quantity"]) || 0
                }));

                let status = { success: 0, failed: 0, failedItems: [] };
                const currentData = items_table.rows().data();

                sanitizedData.forEach(newItem => {
                    let found = false;
                    for (let key in currentData) {
                        if (currentData.hasOwnProperty(key)) {
                            const existingRow = currentData[key];
                            if (existingRow.item_code.trim() === newItem.itemcode) {
                                existingRow.qty = newItem.quantity;
                                items_table.row(key).data(existingRow).invalidate();
                                status.success++;
                                found = true;
                                break;
                            }
                        }
                    }
                    if (!found) {
                        status.failed++;
                        status.failedItems.push(newItem.itemcode);
                    }
                });

                items_table.draw(); // Refresh

                // ✅ Hide spinner and show toast
                $orderEntryCard.unblock();
                let message = `Import successful: ${status.success}, Failed: ${status.failed}`;
                if (status.failed > 0) {
                    message += `\nFailed ItemCodes: ${status.failedItems.join(", ")}`;
                }
                ToastWrapper.success(message);

            } catch (err) {
                $('#excelFile').val('');
                $orderEntryCard.unblock();// ❗ Ensure spinner is stopped on error
                ToastWrapper.error("Failed to read Excel file. Please ensure it is a valid .xlsx file.");
            }
        };

        reader.onerror = function () {
            $('#excelFile').val('');
            $orderEntryCard.unblock();; // ❗ On file read error
            ToastWrapper.error("Failed to read the file.");
        };

        reader.readAsArrayBuffer(file);
        $('#excelFile').val('');
        
    });


    //global search input length validation
    $('#yourTableId_filter input').attr('maxlength', 20);



});



