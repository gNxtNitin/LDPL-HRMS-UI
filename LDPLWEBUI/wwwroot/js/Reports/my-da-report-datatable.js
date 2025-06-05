var daReport_table;


$(document).ready(() => {
    

    ToastWrapper.init({
        positionClass: 'toast-top-right',
        timeOut: 1200,
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
            url: `${baseUrl}/report/GetMyDAReportData`,
            data: {
                EmpId: '',
                DTRangeFrom: '',
                DTRangeTo: '',
                IsTeamData: false
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
            { data: 'bills', title: 'BILLS' }


        ],

        columnDefs: [
           
            {
                targets: 0,
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
                targets: 8,
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
            }

        ],


        order: [[0, 'asc']],
        responsive: true,
        dom:
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
        }
    });


  

    const carouselId = "billCarousel";
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

    $('.card').on('click', '#applyDateFilter', function () {
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

        const newUrl = `${baseUrl}/report/GetMyDAReportData?EmpId=${empId}&DTRangeFrom=${encodeURIComponent(fromDate)}&DTRangeTo=${encodeURIComponent(toDate)}&IsTeamData=${encodeURIComponent(isTeamData)}`;

        daReport_table.ajax.url(newUrl).load();

    });


    function formatDateToISO(dateStr) {
        
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

});