/**
 * Account Settings - Security
 */

'use strict';

const password_validation = {
    notEmpty: {
        message: 'Password is required'
    },
    stringLength: {
        min: 8,
        message: 'Password must be at least 8 characters'
    },
    callback: {
        message: 'Invalid password',
        callback: function (input) {
            const password = input.value;
            let errors = [];

            if (!/[a-z]/.test(password)) {
                errors.push('Password must contain at least one lowercase letter.');
            }
            if (!/[A-Z]/.test(password)) {
                errors.push('Password must contain at least one uppercase letter.');
            }
            if (!/[!@#$%^&*()-_+=<>?]/.test(password)) {
                errors.push('Password must contain at least one special character (!@#$%^&*()-_+=<>?).');
            }
            if (!/\d/.test(password)) {
                errors.push('Password must contain at least one number.');
            }

            // Return true if no errors, otherwise return all error messages
            return errors.length === 0 ? true : { valid: false, message: errors.join('<br>') };
        }
    }
}



document.addEventListener('DOMContentLoaded', function (e) {
    (function () {
        const formChangePass = document.querySelector('#userpasswordUpdate'),
            formApiKey = document.querySelector('#formAccountSettingsApiKey');

        ToastWrapper.init({
            positionClass: 'toast-top-right',
            timeOut: 3000,
            progressBar: false

        });

        // Form validation for Change password
        if (formChangePass) {
            const fv = FormValidation.formValidation(formChangePass, {
                fields: {
                    currentPassword: {
                        validators: password_validation
                    },
                    newPassword: {
                        validators: password_validation
                    },
                    confirmPassword: {
                        validators: {
                            notEmpty: {
                                message: 'Please confirm new password'
                            },
                            identical: {
                                compare: function () {
                                    return formChangePass.querySelector('[name="newPassword"]').value;
                                },
                                message: 'The password and its confirm are not the same'
                            },
                            stringLength: {
                                min: 8,
                                message: 'Password must be more than 8 characters'
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
                    // Submit the form when all fields are valid
                    //defaultSubmit: new FormValidation.plugins.defaultSubmit(),
                    autoFocus: new FormValidation.plugins.AutoFocus()
                },
                init: instance => {
                    instance.on('plugins.message.placed', function (e) {
                        if (e.element.parentElement.classList.contains('input-group')) {
                            e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
                        }
                    });
                }
            }).on('core.form.valid', function () {
                const uid = $("#userId").val();
                const pw = $("#newPassword").val();
                const data = { userId: uid, password: pw };

                $("#formAccountSettings").block({
                    message: '<div class="spinner-border text-primary" role="status"></div>',

                    css: {
                        border: 'none',
                        backgroundColor: 'transparent'
                    },

                    overlayCSS: {
                        backgroundColor: '#fff',
                        opacity: 0.8

                    }
                });

                $.ajax({
                    url: $('#formAccountSettings').attr('action'),
                    type: $('#formAccountSettings').attr('method') || 'POST',
                    data: data,
                    success: function (response) {
                        $("#formAccountSettings").unblock();
                        ToastWrapper.success("Password updated Successfully!");
                        $("#formAccountSettings")[0].reset();
                    },

                    error: function (error) {
                        $("#formAccountSettings").unblock();
                        ToastWrapper.error("Password update failed!");
                    }
                });

                $("#formAccountSettings").unblock();
            });
        }

        // Form validation for API key
        if (formApiKey) {
            const fvApi = FormValidation.formValidation(formApiKey, {
                fields: {
                    apiKey: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter API key name'
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
    })();
});

// Select2 (jquery)
$(function () {
    var select2 = $('.select2');

    // Select2 API Key
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
