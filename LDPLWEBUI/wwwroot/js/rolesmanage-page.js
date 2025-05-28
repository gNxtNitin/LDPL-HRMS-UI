$(document).ready(function () {


    const ps = new PerfectScrollbar('.ps-container');

    var url = `${window.origin}/Admin/Admin/GetRolesWithUsers`;

    var roleInfo;
    // Get Request for Getting Roles
    $.get(url, function (data) {

        roleInfo = data;

        // Js for displaying card for each Role
        $.each(data, function (index, item) {

            var statusBadge = item.isActive
                ? `<div class="position-absolute top-0 start-0" style="width: 100px; height: 100px; overflow: hidden; z-index: 10;">
                          <div class="bg-success text-white fw-bold text-center"
                               style="
                                 position: absolute;
                                 width: 140px;
                                 left: -45px;
                                 top: 17px;
                                 transform: rotate(-45deg);
                                 font-size: 0.75rem;
                                 padding: 2px 0;
                                 box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                               ">
                            Active
                          </div>
                     </div>`
                : `<div class="position-absolute top-0 start-0" style="width: 100px; height: 100px; overflow: hidden; z-index: 10;">
                          <div class="bg-secondary text-white fw-bold text-center"
                               style="
                                 position: absolute;
                                 width: 140px;
                                 left: -45px;
                                 top: 15px;
                                 transform: rotate(-45deg);
                                 font-size: 0.75rem;
                                 padding: 2px 0;
                                 box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                               ">
                            InActive
                          </div>
                     </div>`;

            var svgImage = item.isActive
                ? `<svg width="70" height="70" fill="#198754" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`
                : `<svg width="70" height="70" fill="#6c757d" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`;

            var illustrationimg = item.imageUrl && item.imageUrl.trim() !== ""
                ? `<img src="${item.imageUrl}" alt="Role Illustration" class="img-fluid illustration-img" width="83"/>`
                : `<img src="/app-assets/img/illustrations/add-new-roles.png" alt="Default Illustration" class="img-fluid illustration-img" width="83"/>`; // default fallback

            var html = `
    <div class="col-xl-4 col-lg-6 col-md-6">
      <div class="card content-card h-100 bg-white border-0 shadow-sm card h-100 bg-white border-0 shadow-sm hover-shadow waves-effect waves-light role-card" style="cursor: pointer;">
        <div class="row h-100">
          <!-- Illustration -->
          <div class="col-5 d-flex align-items-center justify-content-center">
            ${illustrationimg}
          </div>

          <!-- Role Info -->
          <div class="col-7 d-flex flex-column justify-content-between role-heading">
            <div class="card-body pb-2 pt-3">
              <div class="d-flex justify-content-between align-items-start">
                ${statusBadge}
              </div>
              <h5 class="mb-1 text-dar role-name">${item.roleName}</h5>
              <small class="text-muted role-user-count">${item.totalUsers || 0} Users</small>
            </div>

            <!-- Buttons -->
            <div class="d-flex justify-content-end gap-2 p-3 pt-0">
             <div class="role-action-btn">
                <input type="hidden" class="edit-role-id" value="${item.roleID}" hidden />
                <input type="hidden" class="edit-role-name" value="${item.roleName}" hidden />
                <input type="hidden" class="edit-role-description" value="${item.description}" hidden />

                    <button class="btn btn-sm btn-primary role-edit-modal" data-bs-toggle="modal" data-bs-target="#addRoleModal" title="Edit Role">
                    <i class="fa-solid fa-pen"></i>
                </button>
              <button class="btn btn-sm btn-danger delete-role" title="Delete Role">
                <i class="fa-solid fa-trash"></i>
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
            $('.roles-card').append(html);
        });

        // For Role Edit Modal Modal Assignment
        $('.role-edit-modal').click(function () {
            fv.resetForm(true);

            console.log()
            var text = $(this).closest(".role-action-btn").find(".edit-role-name").val();

            $('#modalRoleName').val(text);
            text = $(this).closest(".role-action-btn").find(".edit-role-description").val();
            $('#modalRoleDescription').val(text);
            text = $(this).closest(".role-action-btn").find(".edit-role-id").val();

            $('#modalRoleId').val(text);

        });


        // For Delete Role
        $(".delete-role").on("click", function () {
            var thiss = $(this);
            Swal.fire({
                text: "Are you sure you would like to delete this menu?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes",
                customClass: {
                    confirmButton: "btn btn-primary me-2 waves-effect waves-light",
                    cancelButton: "btn btn-label-secondary waves-effect waves-light",
                },
                buttonsStyling: false,
            }).then(function (result) {
                if (result.value) {
                    var btn = $(this);

                    var obj = new Object();

                    obj.RoleId = this.closest(".role-action-btn").find(".edit-role-id").val();
                    //alert(obj.RoleId);
                    var data = { rm: obj };
                    $.post({
                        url: '@Url.Action("DeleteRole", "Admin", new { area = "Admin" })',
                        data: data,
                        success: function (resp) {
                            if (resp.code < 0) {
                                ToastWrapper.error(resp.message);
                            } else {
                                location.reload();
                            }
                        },
                        error: function (xhr, status, error) {
                            ToastWrapper.error("Something Went Wrong.");
                        },
                    });
                } else {

                }
            });

        });

        //var previousModal = null;

        const menuModalEl = document.getElementById('assignMenuAccess');
        const featureModalEl = document.getElementById('assignFeatureAccess');
        const menuModal = new bootstrap.Modal(menuModalEl);
        const featureModal = new bootstrap.Modal(featureModalEl);

        // For RoleId Menu Access Modal
        $('.content-card').on('click', function (e) {
            if ($(e.target).closest('.delete-role').length > 0 || $(e.target).closest('.role-edit-modal').length > 0) {
                return;
            }
            else {

                try {
                    const roleName = $(this).find('.role-name').text().trim();
                    const rId = $(this).find('.edit-role-id').val().trim();
                    const baseUrl = window.origin;
                    const data = { roleId: rId };

                    if (!roleName) {
                        alert("Something went wrong....")
                    }

                    $('#role-menu-title').text(`${roleName} Role Menu Permissions`);
                    $('#assignMenuAccess').modal('show');




                    // function showDetails(data) {
                    //   // Save any open modal
                    //   const openModal = document.querySelector('.modal.show');
                    //   if (openModal) {
                    //     previousModal = bootstrap.Modal.getInstance(openModal);
                    //     previousModal.hide();
                    //   }

                    //   // Fill in details as a list
                    //   const list = $('#menuDetailsList');
                    //   list.empty();

                    //   const fields = {
                    //     "Menu Name": data.menuName,
                    //     "URL": data.url || 'N/A',
                    //     "Controller": data.controllerName || 'N/A',
                    //     "Action": data.actionName || 'N/A',
                    //     "Icon Class": data.iconClass || 'N/A',
                    //     "Accessible": data.isAccessible ? 'Yes' : 'No'
                    //   };

                    //   Object.entries(fields).forEach(([label, value]) => {
                    //     list.append(`<li class="list-group-item d-flex justify-content-between">
                    //       <strong>${label}:</strong> <span>${value}</span>
                    //     </li>`);
                    //   });

                    //   const detailModal = new bootstrap.Modal(document.getElementById('menuDetailsModal'));
                    //   detailModal.show();

                    //   // When details modal is hidden, show previous modal back
                    //   $('#menuDetailsModal').off('hidden.bs.modal').on('hidden.bs.modal', function () {
                    //     if (previousModal) {
                    //       setTimeout(() => previousModal.show(), 200); // Small delay avoids flicker
                    //       previousModal = null;
                    //     }
                    //   });
                    // }

                    function renderMenuTable(rawData) {
                        const tbody = $('#menuTable tbody');
                        tbody.empty();

                        const grouped = {};
                        rawData.forEach(item => {
                            if (!item.parentId) {
                                grouped[item.menuId] = { ...item, children: [] };
                            }
                        });

                        rawData.forEach(item => {
                            if (item.parentId && grouped[item.parentId]) {
                                grouped[item.parentId].children.push(item);
                            }
                        });

                        Object.values(grouped).forEach(parent => {
                            const parentRow = `
                                            <tr data-level="parent" data-menu='${JSON.stringify(parent)}'>
                                              <td>
                                                <i class="${parent.iconClass} me-1 text-primary"></i>
                                                <strong>${parent.menuName}</strong>
                                              </td>
                                              <td>
                                                <label class="switch switch-success">
                                                  <input type="checkbox" class="switch-input" ${parent.isAccessible ? 'checked' : ''} />
                                                  <span class="switch-toggle-slider">
                                                    <span class="switch-on"><i class="ti ti-check"></i></span>
                                                    <span class="switch-off"><i class="ti ti-x"></i></span>
                                                  </span>
                                                </label>
                                              </td>
                                              <td>
                                                    <button type="button" class="btn p-0 border-0 bg-transparent" data-menu-id="${parent.menuId}">
                                                    <i class="ti ti-settings fs-4"></i>
                                                    </button>
                                                </td>
                                             
                                            </tr>`;
                            tbody.append(parentRow);

                            parent.children.forEach(child => {
                                const childRow = `
                                              <tr data-level="child" data-menu='child'>
                                                <td class="ps-6">
                                                  <i class="${child.iconClass} me-1 text-secondary"></i>
                                                  ${child.menuName}
                                                </td>
                                                <td>
                                                  <label class="switch switch-success">
                                                    <input type="checkbox" class="switch-input" ${child.isAccessible ? 'checked' : ''} />
                                                    <span class="switch-toggle-slider">
                                                      <span class="switch-on"><i class="ti ti-check"></i></span>
                                                      <span class="switch-off"><i class="ti ti-x"></i></span>
                                                    </span>
                                                  </label>
                                                </td>
                                                <td>
                                                    <button type="button" class="btn p-0 border-0 bg-transparent" data-menu-id="${child.menuId}">
                                                     <i class="ti ti-settings fs-4"></i>
                                                    </button>
                                                </td>
                                              </tr>`;
                                tbody.append(childRow);


                            });
                        });

                        // for testing only -- dummy data
                        const features = [
                            { id: 1, name: "View Reports", description: 'Can View reportes', enabled: true },
                            { id: 2, name: "Edit Users", description: 'Can edit user details', enabled: false },
                            { id: 3, name: "Access Billing", description: 'Can access billing details', enabled: true },
                            { id: 4, name: "Delete Records", description: 'Can delete records', enabled: false }
                        ];

                        function renderFeaturesInModal(features) {
                            let html = `
                            <div class="table-responsive rounded shadow-sm">
                                <table class="table table-hover table-striped mb-0 align-middle">
                                    <thead class="table-secondary">
                                        <tr>
                                            <th style="width: 40%;">Feature Name</th>
                                            <th style="width: 40%;">Description</th>
                                            <th style="width: 20%;" class="text-center">Enable</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;

                            features.forEach((feature, index) => {
                                const isChecked = feature.enabled ? 'checked' : '';

                                html += `
                                <tr">
                                    <td>${feature.name}</td>
                                    <td>${feature.description || '-'}</td>
                                    <td class="text-center">
                                        <label class="switch switch-success">
                                            <input type="checkbox" class="switch-input" ${isChecked} />
                                            <span class="switch-toggle-slider">
                                                <span class="switch-on"><i class="ti ti-check"></i></span>
                                                <span class="switch-off"><i class="ti ti-x"></i></span>
                                            </span>
                                        </label>
                                    </td>
                                </tr>`;
                            });

                            html += `
                                    </tbody>
                                </table>
                            </div>`;

                            $('#assignFeatureAccessModalBody').html(html);
                        }



                        $('button[data-menu-id]').on('click', function () {

                            let currentMenuId = $(this).data('menu-id');
                            bootstrap.Modal.getInstance(menuModalEl).hide();
                            $('#assignFeatureAccessModalBody').html('<div class="h-100 w-100 d-flex justify-content-center align-items-center">Loading...</div>');
                            featureModal.show();
                           
                            $.get(`https://jsonplaceholder.typicode.com/todos/${currentMenuId}`)
                                .done(function (resp) {
                                    renderFeaturesInModal(features);
                                })
                                .fail(function (xhr, status, error) {
                                    $('#assignFeatureAccessModalBody').html(`<div class="text-danger">Failed to load feature data.</div>`);
                                });
                        });

                        $(featureModalEl).on('hidden.bs.modal', function (e) {
                            // Automatically re-show the previous modal when closed (via backdrop or ESC)
                            if (!$(menuModalEl).hasClass('show')) {
                                menuModal.show();
                            }
                        });

                        $('#saveBtn2').on('click', function () {
                            // UI: show spinner and disable button
                            $('#saveSpinner2').removeClass('d-none');
                            $('#saveBtnText2').text('Saving...');
                            $('#saveBtn2').prop('disabled', true);

                            try {
                                $.ajax({
                                    url: '/api/save-feature-access', 
                                    type: 'POST',
                                    contentType: 'application/json',
                                    data: JSON.stringify({
                                        menuId: selectedMenuId,       
                                        features: selectedFeatures   
                                    }),
                                    success: function (response) {
                                        $('#saveSpinner2').addClass('d-none');
                                        $('#saveBtnText2').text('Save Changes');
                                        $('#saveBtn2').prop('disabled', false);

                                        // Optionally check response content if needed
                                        if (response.success) {
                                            ToastWrapper.success("Saved successfully!");
                                            featureModal.hide();
                                            menuModal.show();
                                        } else {
                                            alert("Save failed. Server responded without success.");
                                        }
                                    },
                                    error: function (xhr, status, error) {
                                        console.error("Save error:", error);
                                        alert("Something went wrong while saving. Please try again.");

                                        $('#saveSpinner2').addClass('d-none');
                                        $('#saveBtnText2').text('Save Changes');
                                        $('#saveBtn2').prop('disabled', false);
                                    }
                                });
                            } catch (ex) {
                                console.error("Unexpected error:", ex);
                                alert("Unexpected error occurred. Please try again.");

                                $('#saveSpinner2').addClass('d-none');
                                $('#saveBtnText2').text('Save Changes');
                                $('#saveBtn2').prop('disabled', false);
                            }
                        });

                        // Cancel button
                        $('#cancelBtn2').on('click', function () {
                            featureModal.hide();           // Hide feature modal
                            menuModal.show();             // Re-show previous modal
                        });


                    }
                    // show memu details column button
                    // <td>
                    //   <button class="btn btn-sm btn-outline-info view-details">View</button>
                    // </td>

                    //extra info columns
                    //    <td>
                    //   ${parent.actionName || "- -"}
                    // </td>
                    // <td>
                    //   ${parent.controllerName || "- -"}
                    // </td>
                    // <td>
                    //   ${parent.areas || "- -"}
                    // </td>

                    // $('#menuTable').on('click', '.view-details', function () {
                    //     const data = $(this).closest('tr').data('menu');
                    //     showDetails(data);
                    // });



                    $.get(`/Admin/Admin/GetRoleMenuAccess`, data, (resp) => {
                        const rawData = typeof resp === 'string' ? JSON.parse(resp) : resp;

                        renderMenuTable(rawData);

                        // $(".select2").select2({
                        //     dropdownParent: $('#menuTable'),
                        //     width: '100%'
                        // });
                        //fetch menu features and populate:
                        bootstrap.Modal.getOrCreateInstance(document.getElementById('assignMenuAccess')).show();
                    });

                } catch (error) {
                    console.error("Error while opening role menu modal:", error.message);
                    // Optional: Show an alert or toast if needed
                    // alert("Something went wrong. Please try again.");
                }


            }
        });

    });



    // For New Modal Modal Assignment
    $('.add-new-role').click(function () {
        fv.resetForm(true);
        $('#modalRoleName').val('');
        $('#modalRoleDescription').val('');
        $('#modalRoleId').val('');
    });

});



$(document).ready(function () {


    // Initialise Validation logic on form input
    validateMe();

    // Initialise toastr Message
    ToastWrapper.init({
        positionClass: 'toast-top-right',
        timeOut: 3000,
        progressBar: true

    });

    // For Modal Submit Button Functionality for Update or Create New Role
    $("#role-submit").on("click", function () {
        fv.validate().then(function (status) {
            if (status === 'Valid') {
                var btn = $(this);

                var obj = new Object();

                obj.RoleId = $("#modalRoleId").val() == "" || $("#modalRoleId").val() == null || $("#modalRoleId").val() == undefined ? null : $("#modalRoleId").val();
                obj.RoleName = $("#modalRoleName").val();
                obj.Description = $("#modalRoleDescription").val();

                var data = { "rm": obj };
                $.post({
                    url: '@Url.Action("CreateOrUpdateRole", "Admin", new { area = "Admin" })',
                    data: data,
                    success: function (resp) {
                        if (resp.code < 0) {
                            ToastWrapper.error(resp.message);
                        }
                        else {
                            location.reload();
                        }

                    },
                    error: function (xhr, status, error) {
                        ToastWrapper.error("Something Went Wrong.");
                    }
                });
            } else {
                return;
            }



        });

    });

});


var fv;
function validateMe() {
    var formAddNewRecord1 = document.getElementById('addRoleForm');



    // Form validation for Add new record
    fv = FormValidation.formValidation(formAddNewRecord1, {
        fields: {
            modalRoleName: {
                validators: {
                    notEmpty: {
                        message: 'Please enter Role name.'
                    }
                }
            },



            modalRoleDescription: {
                validators: {
                    notEmpty: {
                        message: 'Please enter Role Description.'
                    }

                }
            }

        },
        plugins: {
            trigger: new FormValidation.plugins.Trigger(),
            bootstrap5: new FormValidation.plugins.Bootstrap5({
                // Use this for enabling/changing valid/invalid class
                // eleInvalidClass: '',
                eleValidClass: '',
                rowSelector: '.col-12'
            }),
            submitButton: new FormValidation.plugins.SubmitButton(),
            //defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
            autoFocus: new FormValidation.plugins.AutoFocus()
        }
        // init: instance => {
        //   instance.on('plugins.message.placed', function (e) {
        //     if (e.element.parentElement.classList.contains('input-group')) {
        //       e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
        //     }
        //   });
        // }
    });

}
