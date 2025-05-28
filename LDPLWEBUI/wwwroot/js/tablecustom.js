/**
 * DataTables Basic
 */

'use strict';



// datatable (jquery)
function dataTableFunc() {
    var dt_basic_table = $('.datatables-basic'),

        dt_basic;

    // DataTable with buttons
    // --------------------------------------------------------------------

    if (dt_basic_table.length) {
        dt_basic = dt_basic_table.DataTable({
            //ajax: assetsPath + 'json/table-datatable.json',
            ordering: false,
            paging: false,
            columnDefs: [
                //{
                //    // For Responsive
                //    className: 'control',
                //    orderable: false,
                //    searchable: false,
                //    responsivePriority: 2,
                //    targets: 0,
                //    render: function (data, type, full, meta) {
                //        return '';
                //    }
                //},
                {
                    responsivePriority: 1,
                    targets: 0
                },
                {
                    responsivePriority: 1,
                    targets: 1
                },
                {
                    responsivePriority: 1,
                    targets: 2
                },
                {
                    responsivePriority: 1,
                    targets: 3
                },
                {
                    responsivePriority: 1,
                    targets: 4
                },
                {
                    responsivePriority: 1,
                    targets: 5
                },
                {
                    responsivePriority: 1,
                    targets: 6
                }
            ],
            //order: [[6, 'desc']],
            //dom: '<"card-header flex-column flex-md-row"<"head-label text-center"><"dt-action-buttons text-end pt-6 pt-md-0"B>><"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end mt-n6 mt-md-0"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
            //displayLength: 7,
            //lengthMenu: [7, 10, 25, 50, 75, 100],
            //language: {
            //    paginate: {
            //        next: '<i class="ti ti-chevron-right ti-sm"></i>',
            //        previous: '<i class="ti ti-chevron-left ti-sm"></i>'
            //    }
            //},
            buttons: [

            ],
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.modal({
                        header: function (row) {
                            var data = row.data();
                            return 'Details of ' + data['full_name'];
                        }
                    }),
                    type: 'column',
                    renderer: function (api, rowIdx, columns) {


                        return false;
                    }
                }
            },

            initComplete: function (settings, json) {
                //$('.card-header').after('<hr class="my-0">');

                $(".parent-row").on("click", function () {
                    toggleChildren(this);

                });

            }
        });

    }




    // Filter form control to default size
    // ? setTimeout used for multilingual table initialization
    setTimeout(() => {
        $('.dataTables_filter .form-control').removeClass('form-control-sm');
        $('.dataTables_length .form-select').removeClass('form-select-sm');
    }, 300);
}
