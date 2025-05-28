/**
 *  Pages Authentication
 */

'use strict';
const formAuthentication = document.querySelector('#formAuthentication');

// change password validatoin as required
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
        // Form validation for Add new record
        if (formAuthentication) {
            const fv = FormValidation.formValidation(formAuthentication, {
                fields: {
                    username: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter username'
                            },
                            stringLength: {
                                min: 6,
                                message: 'Username must be more than 6 characters'
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
                    },

                    password: {
                        validators: password_validation
                    }
                    ,
                    Password: {
                        validators: password_validation
                    },

                    'confirm-password': {
                        validators: {
                            notEmpty: {
                                message: 'Please confirm password'
                            },
                            identical: {
                                compare: function () {
                                    return formAuthentication.querySelector('[name="password"],[name="Password"]').value;
                                },
                                message: 'The password and its confirm are not the same'
                            }
                        }
                    },
                    terms: {
                        validators: {
                            notEmpty: {
                                message: 'Please agree terms & conditions'
                            }
                        }
                    },

                    captchaInput: {
                        validators: {
                            notEmpty: {
                                message: 'Please enter captcha text'
                            }
                        }
                    }
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap5: new FormValidation.plugins.Bootstrap5({
                        eleValidClass: '',
                        rowSelector: '.mb-6'
                    }),
                    submitButton: new FormValidation.plugins.SubmitButton(),

                    //defaultSubmit: new FormValidation.plugins.DefaultSubmit(),
                    autoFocus: new FormValidation.plugins.AutoFocus()
                },
                init: instance => {
                    instance.on('plugins.message.placed', function (e) {
                        if (e.element.parentElement.classList.contains('input-group')) {
                            e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
                        }
                    });
                }
            }).on('core.form.valid', function (e) {
                const errorMessage = document.getElementById("captchaError");
                errorMessage.style = "display:none;";
                const resp = validatecaptcha();
               
                if (resp.success === true) {
                    formAuthentication.submit();
                } else {
                    errorMessage.innerText = resp.message;
                    errorMessage.style = "display:block;";
                }

            });
        }

        //  Two Steps Verification
        const numeralMask = document.querySelectorAll('.numeral-mask');

        // Verification masking
        if (numeralMask.length) {
            numeralMask.forEach(e => {
                new Cleave(e, {
                    numeral: true
                });
            });
        }
    })();
});
