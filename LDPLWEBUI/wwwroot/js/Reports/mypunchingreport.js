var epunchReport_table;


$(document).ready(() => {


    ToastWrapper.init({
        positionClass: 'toast-top-right',
        timeOut: 1400,
        progressBar: true

    });

    const baseUrl = window.origin;

    const epunchReport_table = $('.datatables-epunchreport').DataTable({
        ajax: {
            url: `${baseUrl}/report/GetMyEpunchReportData`,
            data: {
                EmpId: '',
                DTRangeFrom: '',
                DTRangeTo: '',
                IsTeamData: false
            },

            dataSrc: function (resp) {
                if (resp.status === 200) {
                    console.log(resp);
                    return resp.data;
                } else {
                    ToastWrapper.error('Something went wrong fetching the report!');
                    return [];
                }
            }
        },
        columns: [
            { data: 'empId', title: 'EMP ID' },
            { data: 'eName', title: 'EMP NAME' },
            { data: 'zone', title: 'Zone' },
            { data: 'gloc', title: 'GeoLoc' },
            {
                data: 'punchDateTime',
                title: 'Punch DateTime',
                render: function (data) {
                    if (!data) return '';
                    const date = new Date(data);
                    return date.toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            },
            { data: 'km', title: 'KM' },
            { data: 'address', title: 'Address' },
            { data: 'location', title: 'Location' },
            {
                data: 'ePhoto',
                title: 'EPhoto',
                orderable: false,
                searchable: false,
                render: function (data, type, full) {
                    const fileName = full.ePhoto;
                    const safeUrl = `${baseUrl}/report/GetFile?fileId=${encodeURIComponent(fileName)}&flag=EP`;
                    const uid = `thumb-${Math.random().toString(36).substr(2, 9)}`; // Unique ID for placeholder

                    // Placeholder div with a loading spinner or blank space initially
                    return `
                        <div id="${uid}" class="image-thumbnail-placeholder" style="width: 40px; height: 40px;">
                            <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                        </div>
                        <script>
                            (function() {
                                const img = new Image();
                                img.src = "${safeUrl}";
                                img.onload = function() {
                                    const imgHtml = \`
                                        <img src="${safeUrl}" alt="Photo"
                                             class="img-thumbnail employee-photo-thumb"
                                             style="width: 40px; height: 40px; cursor: pointer;"
                                             data-bs-toggle="modal"
                                             data-bs-target="#imageViewerModal"
                                             data-photo-src="${safeUrl}" />
                                    \`;
                                    document.getElementById("${uid}").outerHTML = imgHtml;
                                };
                                img.onerror = function() {
                                    const fallbackHtml = \`
                                        <div class="d-flex justify-content-center align-items-center text-muted border rounded"
                                             style="width: 40px; height: 40px; font-size: 1.2rem;" title="Image not available">
                                            <i class="ti ti-photo-off"></i>
                                        </div>
                                    \`;
                                    document.getElementById("${uid}").outerHTML = fallbackHtml;
                                };
                            })();
                        </script>
                    `;
                }
            }
        ],

        order: [[4, 'desc']], // Default sort by PunchDateTime
        responsive: true,
        dom:
            '<"row"' +
            '<"col-12 d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3"' +
            '<"d-flex align-items-center flex-wrap gap-2"' +
            'l' +
            '<"date-filter d-flex align-items-center flex-wrap gap-2">' +
            '>' +
            '<"d-flex align-items-center flex-wrap gap-2"fB>' +
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
        initComplete: function () {
            const dateFilterHTML = `
          <div class="d-block d-sm-none w-100">From:</div>
          <div class="d-flex flex-column flex-sm-row align-items-sm-center gap-2">
            <span class="d-none d-sm-inline">From:</span>
            <input type="date" id="minDate" class="form-control form-control-sm" style="max-width: 130px; min-width: 120px;">
            <div class="d-block d-sm-none w-100 mt-2">To:</div>
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





    function renderSingleImageViewer(imageUrl) {
        const $image = $('#Ephoto');
        const $downloadLink = $('#downloadLink');

        try {
            if (!imageUrl || typeof imageUrl !== 'string') {
                console.error('Invalid image URL:', imageUrl);
                showError('Invalid image source.');
                return;
            }

          
            $image.off('load error');
            if ($image.data('panzoomInstance')) {
                try {
                    $image.data('panzoomInstance').destroy?.();
                } catch (destroyErr) {
                    console.warn('Error destroying previous Panzoom instance:', destroyErr);
                }
                $image.removeData('panzoomInstance');
            }

          
            $image.attr('src', imageUrl);
            $downloadLink.attr('href', imageUrl);

          
            $image.on('load', function () {
                try {
                    const panzoomInstance = panzoom(this, {
                        minScale: 1,
                        maxScale: 5,
                        startScale: 1,
                        contain: 'inside',
                        bounds: true,
                        boundsPadding: 0.1
                    });
                    $image.data('panzoomInstance', panzoomInstance);
                } catch (panzoomErr) {
        
                }
            });

        
            $image.on('error', function () {
                $image.attr('src', '');
                $downloadLink.attr('href', '#');
            });

        } catch (err) {
           
        }
    }

    $('.datatables-epunchreport tbody').on('click', '.employee-photo-thumb', function () {
        const photoSrc = $(this).data('photo-src');
        if (photoSrc) {
            renderSingleImageViewer(photoSrc);
            $('#imageViewerModal').modal('show');
        } else {
            ToastWrapper.error("Nothing to display!");
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

        const newUrl = `${baseUrl}/report/GetMyEpunchReportData?EmpId=${empId}&DTRangeFrom=${encodeURIComponent(fromDate)}&DTRangeTo=${encodeURIComponent(toDate)}&IsTeamData=${encodeURIComponent(isTeamData)}`;

        epunchReport_table.ajax.url(newUrl).load();

    });


    function formatDateToISO(dateStr) {

        const [day, month, year] = dateStr.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

});