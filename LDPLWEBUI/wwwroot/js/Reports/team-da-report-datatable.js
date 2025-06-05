var daReport_table;


$(document).ready(() => {
    

    ToastWrapper.init({
        positionClass: 'toast-top-right',
        timeOut: 1500,
        progressBar: true

    });
    const baseUrl = window.origin;

    const dateFilterHTML = `
    <label style="margin-left:10px;">
      From: <input type="date" id="minDate" class="form-control form-control-sm" style="display:inline-block; width:auto;">
    </label>
    <label style="margin-left:10px;">
      To: <input type="date" id="maxDate" class="form-control form-control-sm" style="display:inline-block; width:auto;">
    </label>
  `;
    
    daReport_table = $('.datatables-dareport').DataTable({

        ajax: {
            url: `${baseUrl}/report/GetTeamDAReportData`,
            data: {
                EmpId: '',
                DTRangeFrom: '',
                DTRangeTo: '',
                IsTeamData: ''
            },
            dataSrc: function (resp) {
                if (resp.status === 200) {
                    return resp.data;
                } else {

                    toastr.error('Something went wrong fetching the report.');
                    return [];
                }
            }
        },
        columns: [
            {
                data: null,
                orderable: false,
                className: 'text-center select-cell',
                visible: false,
                render: (data, type, row) => `
                    <input type="checkbox" class="form-check-input row-checkbox" value="${row.daid}_${row.empid}" />
                `
            },
           
            { data: 'adddatetime', title: 'DA DATE' },
            { data: 'empid', title: 'EMP ID' },
            { data: 'ename', title: 'EMP NAME' },
            { data: 'da', title: 'DA' },
            { data: 'hotel', title: 'HOTEL' },
            { data: 'other', title: 'OTHERS' },
            { data: 'km', title: 'KM' },
            { data: 'dastatus', title: 'DA STATUS' },
            {data: 'fromdate', title: 'FROM DATE' },
            { data: 'todate', title: 'TO DATE' },
            { data: null, title: 'APPROVAL' },
            { data: 'bills', title: 'BILLS' }


        ],

        columnDefs: [
            { targets: 0, orderable: false },
            {
                targets: 1,
                render: function (data, type, row) {
                    if (!data) return '';
                    const date = new Date(data);
                    return date.toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                       
                    }).replace(',', '');
                }
            },
            {
                targets: 9,
                render: function (data, type, row) {
                    if (!data) return '';
                    const date = new Date(data);
                    return date.toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                       
                    }).replace(',', '');
                }
            },
            {
                targets: 10,
                render: function (data, type, row) {
                    if (!data) return '';
                    const date = new Date(data);
                    return date.toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'

                    }).replace(',', '');
                }
            },
            {
                targets: -1,
                title: 'BILLS',
                searchable: false,
                orderable: false,
                render: function (data, type, full, meta) {
                    const encodedBills = $('<div>').text(full.bills ?? '').html(); // safely encode

                    return `
                    <div class="d-flex align-items-center">
                        <input type="hidden" class="bill-data" class="hidden-bill-data" value="${encodedBills}" />
                        <a class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill view-bills" href="javascript:void(0);">
                           <i class="ti ti-file-invoice text-primary" title="view bills"></i>
                        </a>
                    </div>`;
                }
            },
            {
                targets: 11,
                orderable: false,
                searchable: false,
                render: function (data, type, full, meta) {
                    const daid = full.daid;
                    const empid = full.empid;
                    return `
                    <div class="d-flex align-items-center">
                     <a class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill approve-da" href="javascript:void(0);" data-uqid="${daid}_${empid}">
                           <i class="ti ti-check text-success" title="approve"></i>
                     </a>
                     <a class="btn btn-icon btn-text-secondary waves-effect waves-light rounded-pill reject-da" href="javascript:void(0);" data-uqid="${daid}_${empid}">
                          <i class="ti ti-x text-danger" title="reject"></i>
                     </a>

                    </div>
                  `;
                }
            }

        ],


        order: [[0, 'asc']],
        responsive: true,
        dom:
            '<"row"' +
            '<"col-12 custom-top-controls">' +
            '>' +
            '<"row"' +
            '<"col-12 d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3"' +
            '<"d-flex align-items-center flex-wrap gap-2"' +
            'l' + // length menu
            '<"date-filter d-flex align-items-center flex-wrap gap-2">' + // our custom filter container
            '>' +
            '<"d-flex align-items-center flex-wrap gap-2"fB>' + // search + buttons
            '>' +
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

        buttons: [],

        initComplete: function (settings, json) {
            const dateFilterHTML = `
              <!-- From Label: small screen -->
              <div class="d-block d-sm-none w-100">From:</div>
              <div class="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
                <!-- From Label: large screen -->
                <span class="d-none d-sm-inline">From:</span>
                <input type="date" id="minDate" class="form-control form-control-sm" style="max-width: 130px; min-width: 120px;">

                <!-- To Label: small screen -->
                <div class="d-block d-sm-none w-100 mt-2">To:</div>
                <!-- To Label: large screen -->
                <span class="d-none d-sm-inline ms-6">To:</span>
                <input type="date" id="maxDate" class="form-control form-control-sm" style="max-width: 130px; min-width: 120px;">

                <button id="applyDateFilter" class="btn btn-sm btn-primary mt-2 mt-sm-0">Apply</button>
              </div>
            `;

            $('.date-filter').html(dateFilterHTML);

            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

            $("#minDate").flatpickr({
                monthSelectorType: 'static',
                disableMobile: true,
                defaultDate: startOfMonth,
                dateFormat: 'd/m/Y'
            });


            $("#maxDate").flatpickr({
                monthSelectorType: 'static',
                disableMobile: true,
                defaultDate: today,
                dateFormat: 'd/m/Y'
            });


            $('.custom-top-controls').html(`
                <div class="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2 flex-wrap m-3 mb-0">
                    <!-- Static buttons -->
                    <div id="staticButtons" class="d-flex flex-wrap gap-2">
                        <button id="exportBtn" class="btn btn-sm btn-secondary">
                            <i class="bi bi-download me-1"></i> Export to Excel
                        </button>
                        <button id="multiApprovalBtn" class="btn btn-sm btn-primary">
                            <i class="bi bi-check2-square me-1"></i> Multi-Approval
                        </button>
                    </div>

                    <!-- Multi-actions (hidden by default) -->
                    <div id="multiActions" class="d-flex flex-wrap gap-2 d-none">
                        <button id="approveSelected" class="btn btn-sm btn-success action-btn btn-approval-action" data-status="Approved">
                            <i class="bi bi-check-circle me-1"></i> Approve
                        </button>
                        <button id="rejectSelected" class="btn btn-sm btn-danger action-btn btn-approval-action" data-status="Rejected">
                            <i class="bi bi-x-circle me-1"></i> Reject
                        </button>
                        <button id="cancelMultiBtn" class="btn btn-sm btn-warning btn-approval-action">
                            <i class="bi bi-x-lg me-1"></i> Cancel
                        </button>
                    </div>
                </div>
            `);

        }
    });


    //approve reject DA (single record)
    $('.datatables-dareport tbody').on('click', '.approve-da, .reject-da', function () {
        const $btn = $(this);
       
        const uId = $btn.data('uqid');

        if (!uId) {
            ToastWrapper.error("Something went wrong!");
            return;
        }


        const [uid1, uid2] = uId.split('_');
        const isApproved = $btn.hasClass('approve-da');

        if (!uid1 || !uid2)
        {
            ToastWrapper.error("Something went wrong!");
            return;
        }

        const payload = {
            DAID: uid1,
            DAEmpId: uid2,
            ARBy: "",
            IsApproved: isApproved
        };

        $.ajax({
            url: `${baseUrl}/report/ApproveRejectDA`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
            success: function (resp) {
                if (resp.status > 0) {
                    ToastWrapper.success(`DA ${isApproved ? 'approved' : 'rejected'} successfully.`);
                    daReport_table.ajax.reload(null, false);
                } else {
                    ToastWrapper.error('Something Went Wrong!');
                }
                
            },
            error: function (xhr) {
                ToastWrapper.error('Something Went Wrong!');
            }
        });
    });

    const carouselId = "billCarousel";

    //function renderImageViewer(files, baseUrl) {
    //    const $indicators = $('#carouselIndicators');
    //    const $items = $('#carouselItems');
    //    $indicators.empty();
    //    $items.empty();

    //    $.each(files, function (index, fileName) {
    //        const safeUrl = `${baseUrl}/report/GetFile?fileId=${encodeURIComponent(fileName)}&flag=DA`;

    //        const indicator = $(`
    //        <button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${index}"
    //            class="${index === 0 ? 'active' : ''}"
    //            aria-current="${index === 0 ? 'true' : 'false'}"
    //            aria-label="Slide ${index + 1}">
    //        </button>
    //    `);
    //        $indicators.append(indicator);

    //        const item = $(`
    //        <div class="carousel-item ${index === 0 ? 'active' : ''}">
    //            <div class="d-flex justify-content-center align-items-center viewer-container">
    //                <div class="panzoom-container">
    //                    <img src="${safeUrl}" class="img-fluid viewer-image" data-index="${index}" alt="Bill ${index + 1}">
    //                </div>
    //            </div>
    //        </div>
    //    `);
    //        $items.append(item);
    //    });

    //    // Apply panzoom
    //    let panzoomInstance;
    //    function initPanzoom(imageElement) {
    //        if (panzoomInstance) {
    //            panzoomInstance.dispose(); // Clean up previous instance
    //        }
    //    }

    //    $('.panzoom-container').each(function () {
    //        const $img = $(this).find('img')[0];
    //        if ($img) {
    //            panzoomInstance = panzoom($img, {
    //                minScale: 1,
    //                maxScale: 5,
    //                startScale: 1,
    //                contain: 'inside',
    //                bounds: true,
    //                boundsPadding: 0.1
    //            });
    //        }

    //    });

    //    // Set initial download link
    //    updateDownloadLink(files[0]);


    //    $(`#${carouselId}`).on('slid.bs.carousel', function (e) {
    //        const newIndex = $(e.relatedTarget).index();
    //        updateDownloadLink(files[newIndex]);

    //        const $newItem = $(e.relatedTarget).find('.viewer-image')[0];
    //        if ($newItem) {
    //            if (panzoomInstance) {
    //                panzoomInstance.destroy?.();
    //            }

    //            requestAnimationFrame(() => {
    //                panzoomInstance = panzoom($newItem, {
    //                    minScale: 1,
    //                    maxScale: 5,
    //                    startScale: 1,
    //                    contain: 'inside',
    //                    bounds: true,
    //                    boundsPadding: 0.1
    //                });
    //            });
    //        }
    //    });

    //    function updateDownloadLink(fileName) {
    //        $('#downloadLink').attr('href', `${baseUrl}/report/GetFile?fileId=${encodeURIComponent(fileName)}&flag=DA`);
    //    }
    //}


    function renderImageViewer(files, baseUrl) {
        const $indicators = $('#carouselIndicators');
        const $items = $('#carouselItems');
        $indicators.empty();
        $items.empty();

        let panzoomInstance;

        function isImage(fileName) {
            return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);
        }

        function isPdf(fileName) {
            return /\.pdf$/i.test(fileName);
        }

        $.each(files, function (index, fileName) {
            const safeUrl = `${baseUrl}/report/GetFile?fileId=${encodeURIComponent(fileName)}&flag=DA`;

            // Indicators
            const indicator = $(`<button type="button" data-bs-target="#${carouselId}" data-bs-slide-to="${index}"
            class="${index === 0 ? 'active' : ''}" aria-current="${index === 0 ? 'true' : 'false'}"
            aria-label="Slide ${index + 1}"></button>`);
            $indicators.append(indicator);

            // Carousel Item Content
            let content;
            if (isImage(fileName)) {
                content = `
                <div class="panzoom-container">
                    <img src="${safeUrl}" class="img-fluid viewer-image" data-index="${index}" alt="Bill ${index + 1}">
                </div>`;
            } else if (isPdf(fileName)) {
                content = `
                <div class="pdf-container w-100 h-100">
                    <iframe src="${safeUrl}" class="w-100 h-100 border-0" title="PDF Viewer" allowfullscreen></iframe>
                </div>`;
            } else {
                content = `<div class="text-center p-4">Unsupported file type: ${fileName}</div>`;
            }

            const item = $(`<div class="carousel-item ${index === 0 ? 'active' : ''}">
            <div class="d-flex justify-content-center align-items-center viewer-container" style="min-height: 70vh;">
                ${content}
            </div>
        </div>`);
            $items.append(item);
        });

        // Initialize panzoom for the first image (if applicable)
        initPanzoomForIndex(0);

        // Handle slide change
        $(`#${carouselId}`).off('slid.bs.carousel').on('slid.bs.carousel', function (e) {
            const newIndex = $(e.relatedTarget).index();
            updateDownloadLink(files[newIndex]);
            initPanzoomForIndex(newIndex);
        });

        function initPanzoomForIndex(index) {
            if (panzoomInstance) panzoomInstance.destroy?.();

            const $img = $items.find(`.carousel-item:eq(${index}) img.viewer-image`)[0];
            if ($img) {
                requestAnimationFrame(() => {
                    panzoomInstance = panzoom($img, {
                        minScale: 1,
                        maxScale: 5,
                        startScale: 1,
                        contain: 'inside',
                        bounds: true,
                        boundsPadding: 0.1
                    });
                });
            }
        }

        function updateDownloadLink(fileName) {
            $('#downloadLink').attr('href', `${baseUrl}/report/GetFile?fileId=${encodeURIComponent(fileName)}&flag=DA`);
        }
    }


    $('.datatables-dareport tbody').on('click', '.view-bills', function () {
        try {
            const $row = $(this).closest('tr');
            const $billInput = $row.find('.bill-data');

            if ($billInput.length === 0) {
                ToastWrapper.error("No bill information found.");
                return;
            }

            const rawBills = $billInput.val()?.trim() ?? '';
            if (rawBills.length === 0) {
                ToastWrapper.error("No bills to display.");
                return;
            }

            const files = rawBills
                .split(',')
                .map(file => file.trim())
                .filter(file => file.length > 0);

            if (files.length === 0) {
                ToastWrapper.error("No bills to display.");
                return;
            }

            renderImageViewer(files, baseUrl);
            const modal = new bootstrap.Modal(document.getElementById('imageViewerModal'));
            modal.show();

        } catch (err) {
            console.error("Unexpected error showing bills:", err);
            ToastWrapper.error("An error occurred while displaying bills.");
        }
    });


    let multiSelectMode = false;

    function handleMultiAction(actionType) {

        const isApproved = actionType === 1;

        const selectedIds = $('.row-checkbox:checked').map(function () {
            const uqid = $(this).val();
            const [uid1, uid2] = (uqid || '').split('_');
        
            if (!uid1 || !uid2) return null;

            return {
                DAID: uid1,
                DAEmpId: uid2,
                ARBy: "",
                IsApproved: isApproved
            };
        }).get().filter(obj => obj !== null); // remove nulls

        if (selectedIds.length === 0) {
            ToastWrapper.warning("No rows selected.");
            return;
        }

        const total = selectedIds.length;

        $.ajax({
            url: `${baseUrl}/report/MultiApproveRejectDA`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(selectedIds),
            success: function (res) {
                if (res.status === 200) {
                    $('.datatables-dareport').unblock();
                    if (res.success === total) {
                        ToastWrapper.success("DA records successfully updated");
                    }
                    else if (res.success === 0) {
                        ToastWrapper.error("Failed to process.");
                    } else {
                        ToastWrapper.error(`Success: ${res.success},  Failed: ${res.failed}`);
                    }

                    daReport_table.ajax.reload();

                } else {
                    ToastWrapper.error("Failed to process.");
                }
            },
            error: function () {
                ToastWrapper.error("An error occurred, failed to process!");
            }
        });
    }

    $(document).on('click', '#multiApprovalBtn', function () {
        daReport_table.column(0).visible(true, false);
        daReport_table.columns.adjust().draw();

        $("#multiApprovalBtn").addClass("d-none");
        $("#multiActions").removeClass("d-none");
        $("#select-all").removeClass("d-none");
        $("#select-all-rows").prop('checked', false);
        

        $("#select-all-rows").on('change', function () {
            const isChecked = $(this).prop('checked');
            $('.row-checkbox').prop('checked', isChecked).trigger('change');
        });
    });

    $(document).on('click', '#cancelMultiBtn', function () {
        $('#multiActions').addClass("d-none");
        $('#multiApprovalBtn').removeClass("d-none");
        $("#select-all-rows").prop('checked', false);
        $("#select-all").addClass("d-none");
        $('.row-checkbox').prop('checked', false);
        daReport_table.column(0).visible(false);
    });

    //approve selected DA records
    $(document).on('click', '#approveSelected', function () {
        const $tbl = $('.datatables-dareport');
        try {

            $tbl.block({
                message: '<div class="spinner-border text-primary" role="status"></div>',
                css: {
                    backgroundColor: 'transparent',
                    border: '0'
                },
                overlayCSS: {
                    backgroundColor: '#fff',
                    opacity: 0.6
                }
            });

            $("#select-all").addClass("d-none");
            handleMultiAction(1);
        }
        catch (ex) {
            $tbl.unblock();
            ToastWrapper.error("Something went wrong!");
        }
        finally {
            $tbl.unblock();
            $('#multiActions').addClass("d-none");
            $('#multiApprovalBtn').removeClass("d-none");
            $('.row-checkbox').prop('checked', false);
            $("#select-all-rows").prop('checked', false);
            $("#select-all").addClass("d-none");
            daReport_table.column(0).visible(false);
        }
      

    });

    $(document).on('click', '#rejectSelected', function () {
        const $tbl = $('.datatables-dareport');
        try {

            $tbl.block({
                message: '<div class="spinner-border text-primary" role="status"></div>',
                css: {
                    backgroundColor: 'transparent',
                    border: '0'
                },
                overlayCSS: {
                backgroundColor: '#fff',
                opacity: 0.6
                }
            });


            $("#select-all").addClass("d-none");
            handleMultiAction(0);
            

        }
        catch (ex) {
            $tbl.unblock();
            ToastWrapper.error("Something went wrong!");
        }
        finally {
            $tbl.unblock();
            $('#multiActions').addClass("d-none");
            $('#multiApprovalBtn').removeClass("d-none");
            $('.row-checkbox').prop('checked', false);
            $("#select-all-rows").prop('checked', false);
            $("#select-all").addClass("d-none");
            daReport_table.column(0).visible(false);
        }
        
    });

   

    $('.card').on('click','#applyDateFilter', function () {
        const fromDateRaw = $('#minDate').val();
        const toDateRaw = $('#maxDate').val();
        
        const fromDate = formatDateToISO(fromDateRaw);
        const toDate = formatDateToISO(toDateRaw);
        const empId = "";
        const isTeamData = "";

        
        const from = new Date(fromDate);
        const to = new Date(toDate);

        if (from > to) {
            ToastWrapper.warning('From Date must be earlier than or equal to To Date.');
            return;
        }
       
        const newUrl = `${baseUrl}/report/GetTeamDAReportData?EmpId=${empId}&DTRangeFrom=${encodeURIComponent(fromDate)}&DTRangeTo=${encodeURIComponent(toDate)}&IsTeamData=${encodeURIComponent(isTeamData)}`;

        daReport_table.ajax.url(newUrl).load();
        
    });


    function formatDateToISO(dateStr) {
        // Expected input: "dd/mm/yyyy"
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
});