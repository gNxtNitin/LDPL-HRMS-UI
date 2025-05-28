/**
 * Account Settings - Account
 */

'use strict';

document.addEventListener('DOMContentLoaded', function (e) {
    (function () {
        const formAccSettings = document.querySelector('#profiledata'),
            deactivateAcc = document.querySelector('#formAccountDeactivation'),
            deactivateButton = deactivateAcc.querySelector('.deactivate-account');

        // Form validation for Add new record
        if (formAccSettings) {
            const fv = FormValidation.formValidation(formAccSettings, {
                fields: {
                    firstName: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter first name'
                            }
                        }
                    },
                    lastName: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter last name'
                            }
                        }
                    },
                    email: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter your email'
                            },
                            emailAddress: {
                                message: 'Please enter valid email address'
                            }
                        }
                    },

                    Email: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter your email'
                            },
                            emailAddress: {
                                message: 'Please enter valid email address'
                            }
                        }
                    },

                    FirstName: {
                        validators: {
                            notEmpty: {
                                message: 'First Name is required'
                            },
                            stringLength: {
                                min: 2,
                                message: 'First name must be more than 2 characters'
                            }
                        }
                    },

                    LastName: {
                        validators: {
                            notEmpty: {
                                message: 'Last Name is required'
                            },
                            stringLength: {
                                min: 2,
                                message: 'Last name must be more than 2 characters'
                            }
                        }
                    },

                    'email-username': {
                        validators: {
                            notEmpty: {
                                message: 'Please enter email / username'
                            },
                            stringLength: {
                                min: 6,
                                message: 'Username must be more than 6 characters'
                            }
                        }
                    },
                    emailOrPhone: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter an email or phone number'
                            },
                            regexp: {
                                regexp: /^(?:\d{10}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                                message: 'Enter a valid 10-digit phone number or a valid email address'
                            }
                        }
                    },
                    Mobile: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter phone number'
                            },
                            regexp: {
                                regexp: /^(?:\d{10})$/,
                                message: 'Enter a valid 10-digit phone number'
                            }
                        }
                    },

                    DOB: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter Date of Birth'
                            },
                            regexp: {
                                regexp: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/,
                                message: 'Enter a valid date'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap5: new FormValidation.plugins.Bootstrap5({
                        eleValidClass: '',
                        rowSelector: '.col-md-6'
                    }),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    //Submit the form when all fields are valid
                    defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
                    autoFocus: new FormValidation.plugins.AutoFocus()
                },
                init: instance => {
                    instance.on('plugins.message.placed', function (e) {
                        if (e.element.parentElement.classList.contains('input-group')) {
                            e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
                        }
                    });
                }
            });

            
        }

        if (deactivateAcc) {
            const fv = FormValidation.formValidation(deactivateAcc, {
                fields: {
                    accountActivation: {
                        validators: {
                            notEmpty: {
                                message: 'Please confirm you want to delete account'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap5: new FormValidation.plugins.Bootstrap5({
                        eleValidClass: ''
                    }),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    fieldStatus: new FormValidation.plugins.FieldStatus({
                        onStatusChanged: function (areFieldsValid) {
                            areFieldsValid
                                ? // Enable the submit button
                                // so user has a chance to submit the form again
                                deactivateButton.removeAttribute('disabled')
                                : // Disable the submit button
                                deactivateButton.setAttribute('disabled', 'disabled');
                        }
                    }),
                    // Submit the form when all fields are valid
                    // defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
                    autoFocus: new FormValidation.plugins.AutoFocus()
                },
                init: instance => {
                    instance.on('plugins.message.placed', function (e) {
                        if (e.element.parentElement.classList.contains('input-group')) {
                            e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
                        }
                    });
                }
            });
        }

        // Deactivate account alert
        const accountActivation = document.querySelector('#accountActivation');

        // Alert With Functional Confirm Button
        if (deactivateButton) {
            deactivateButton.onclick = function () {
                if (accountActivation.checked == true) {
                    Swal.fire({
                        text: 'Are you sure you would like to deactivate your account?',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        customClass: {
                            confirmButton: 'btn btn-primary me-2 waves-effect waves-light',
                            cancelButton: 'btn btn-label-secondary waves-effect waves-light'
                        },
                        buttonsStyling: false
                    }).then(function (result) {
                        if (result.value) {

                            //deactivate account here (ajax call)
                            $.ajax({
                                url: '/user/delete',
                                method: 'get',
                                success: (resp) => {
                                   
                                    if (resp.status) {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Deactivated!',
                                            text: 'Your account has been deactivated.',
                                            customClass: {
                                                confirmButton: 'btn btn-success waves-effect waves-light'
                                            }
                                        }).then(() => {
                                            window.location = "/auth/login";
                                        });

                                        

                                    } else {
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Failed!',
                                            text: 'Something went wrong!',
                                            customClass: {
                                                confirmButton: 'btn btn-success waves-effect waves-light'
                                            }
                                        });
                                    }
                                    
                                },

                                error: (resp) => {
                                    console.log(resp);

                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Failed!',
                                        text: 'Something went wrong!',
                                        customClass: {
                                            confirmButton: 'btn btn-success waves-effect waves-light'
                                        }
                                    });
                                }
                            })

                            
                        } else if (result.dismiss === Swal.DismissReason.cancel) {
                            Swal.fire({
                                title: 'Cancelled',
                                text: 'Deactivation Cancelled!!',
                                icon: 'error',
                                customClass: {
                                    confirmButton: 'btn btn-success waves-effect waves-light'
                                }
                            });
                        }
                    });
                }
            };
        }

        // CleaveJS validation

        const phoneNumber = document.querySelector('#phoneNumber'),
            zipCode = document.querySelector('#zipCode');
        // Phone Mask
        if (phoneNumber) {
            new Cleave(phoneNumber, {
                phone: true,
                phoneRegionCode: 'US'
            });
        }

        // Pincode
        if (zipCode) {
            new Cleave(zipCode, {
                delimiter: '',
                numeral: true
            });
        }

        // Update/reset user image of account page
        let accountUserImage = document.getElementById('uploadedAvatar');
        const fileInput = document.querySelector('.account-file-input'),
            resetFileInput = document.querySelector('.account-image-reset');

        if (accountUserImage) {
            const resetImage = accountUserImage.src;
            fileInput.onchange = () => {
                if (fileInput.files[0]) {
                    accountUserImage.src = window.URL.createObjectURL(fileInput.files[0]);
                }
            };
            resetFileInput.onclick = () => {
                fileInput.value = '';
                accountUserImage.src = resetImage;
            };
        }
    })();
});

// Select2 (jquery)
$(function () {
    var select2 = $('.select2');
    // For all Select2
    if (select2.length) {
        select2.each(function () {
            var $this = $(this);
            $this.wrap('<div class="position-relative"></div>');
            $this.select2({
                dropdownParent: $this.parent()
            });
        });
    }
});



