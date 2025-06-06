document.addEventListener('DOMContentLoaded', function () {
    const formElement = document.getElementById('userpasswordUpdate');
    FormValidation.formValidation(
        document.getElementById('userpasswordUpdate'),
        {
            fields: {
                Password: {
                    validators: {
                        notEmpty: {
                            message: 'Password is required'
                        },
                        regexp: {
                            regexp: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
                            message: 'Password must include a letter, number, special character, and be at least 8 characters'
                        }
                    }
                },
                confirmPassword: {
                    validators: {
                        notEmpty: {
                            message: 'Confirm password is required'
                        },
                        identical: {
                            compare: function () {
                                return document.getElementById('newPassword').value;
                            },
                            message: 'Passwords do not match'
                        }
                    }
                }
            },
            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap5: new FormValidation.plugins.Bootstrap5({
                    rowSelector: '.row',
                    eleInvalidClass: 'is-invalid',
                    eleValidClass: 'is-valid'
                }),
                submitButton: new FormValidation.plugins.SubmitButton(),
                autoFocus: new FormValidation.plugins.AutoFocus()
            },
            init: instance => {
                instance.on('plugins.message.placed', function (e) {
                    if (e.element.parentElement.classList.contains('input-group')) {
                        e.element.parentElement.insertAdjacentElement('afterend', e.messageElement);
                    }
                });
                instance.on('core.form.valid', function () {
                    formElement.submit();
                });
            }
        }
    );
});