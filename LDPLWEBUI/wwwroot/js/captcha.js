$(() => {
    $(".captcha-container").each(function () {
        const captchaHtml = `
            <label for="captchaInput" class="form-label">Enter Captcha</label>
            <div class="d-flex align-items-center gap-2">
                <input type="hidden" id="CaptchaKey" name="CaptchaKey" />
                <img id="captchaImg" src="" class="border rounded shadow-sm object-fit-cover" style="width: 150px; height: 40px;" alt="Captcha" />
                <button type="button" class="btn btn-outline-primary p-1" id="refreshCaptcha" title="Refresh Captcha">
                    <i class="ti ti-rotate-clockwise"></i>
                </button>
                <input type="text" class="form-control" id="captchaInput" name="captchaInput" placeholder="Enter Captcha" style="width: 180px;" />
            </div>
            <div class="text-danger mt-2 small d-none" id="captchaError"></div>
        `;
        $(this).html(captchaHtml);

        console.log("loading captcha...");
        loadCaptcha();

        $(this).on("click", "#refreshCaptcha", function () {
            loadCaptcha();
        });
    });
});

function loadCaptcha() {
    const baseUrl = window.origin;
    $("#captchaError").addClass("d-none");
    $.get({
        url: baseUrl + '/SecureCaptcha/loadcaptcha',
        success: (resp) => {
            if (resp.success === true) {
                $("#captchaImg").attr("src", resp.message);
                $("#CaptchaKey").val(resp.uniqueId);
                $("#captchaError").addClass("d-none");
            } else {
                showCaptchaError(resp.message || "Failed to load captcha!");
            }
        },
        error: () => {
            showCaptchaError("Failed to load captcha!");
        }
    });
}

function showCaptchaError(message) {
    $("#captchaImg").attr("src", "");
    $("#CaptchaKey").val("");
    $("#captchaError").text(message).removeClass("d-none");
}

function validatecaptcha() {
    const captchaInput = $("#captchaInput").val().trim();
    const baseUrl = window.origin;
    let response = { success: false, message: 'Invalid captcha!' };

    if ($("#captchaImg").length && captchaInput) {
        $.ajax({
            url: baseUrl + '/SecureCaptcha/ValidateCaptcha',
            method: 'POST',
            async: false,
            data: { userCaptchaInput: captchaInput },
            success: (resp) => {
                response = { success: resp.success, message: resp.message };
            },
            error: () => {
                response.message = 'Captcha validation failed due to server error.';
            }
        });
    }

    return response;
}
