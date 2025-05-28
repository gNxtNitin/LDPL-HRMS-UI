// ToastWrapper - jQuery-based wrapper for Toastr
var ToastWrapper = (function () {

    // Initialize default toastr options
    function init(options) {
        toastr.options = $.extend({

            title: 'toast title',
            message: 'toast message',
            positionClass: 'toast-top-right',      // Position of the toast (e.g., 'toast-top-right', 'toast-bottom-left')
            closeButton: true,                     // Display a close button on the toast
            progressBar: true,                     // Show a progress bar to indicate the timeout
            timeOut: 5000,                         // Duration (in milliseconds) before the toast disappears (0 = sticky)
            extendedTimeOut: 1000,                 // Extra time before hiding when the user hovers over the toast
            newestOnTop: true,                     // Show new toasts above older ones
            preventDuplicates: true,              // Prevent showing duplicate toasts with the same content
            showMethod: 'fadeIn',                  // Animation method for showing the toast (e.g., 'fadeIn', 'slideDown')
            hideMethod: 'fadeOut',                 // Animation method for hiding the toast (e.g., 'fadeOut', 'slideUp')
            showEasing: 'swing',
            hideEasing: 'linear'

        }, options);
    }

    // Generic toast function
    function show(type, message, title, customOptions) {
        var options = $.extend({}, toastr.options, customOptions);
        toastr.options = options;

        if (toastr[type]) {
            toastr[type](message, title);
        } else {
            console.error('Invalid toast type:', type);
        }
    }

    // Convenience methods for different toast types
    function success(message, title = '', options = {}) {
        show('success', message, title, options);
    }

    function info(message, title = '', options = {}) {
        show('info', message, title, options);
    }

    function warning(message, title = '', options = {}) {
        show('warning', message, title, options);
    }

    function error(message, title = '', options = {}) {
        show('error', message, title, options);
    }

    // Clear all toasts
    function clear() {
        toastr.clear();
    }

    // Public API
    return {
        init: init,
        success: success,
        info: info,
        warning: warning,
        error: error,
        clear: clear
    };
})();
