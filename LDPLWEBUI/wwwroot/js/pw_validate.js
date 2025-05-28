
function generateTooltipContent(policy) {
    const rules = [];

    // Basic length and character class rules
    if (policy.minLength) rules.push(`At least ${policy.minLength} characters`);
    if (policy.maxLength) rules.push(`At most ${policy.maxLength} characters`);
    if (policy.minUppercase) rules.push(`At least ${policy.minUppercase} uppercase letter(s)`);
    if (policy.maxUppercase) rules.push(`At most ${policy.maxUppercase} uppercase letter(s)`);
    if (policy.minLowercase) rules.push(`At least ${policy.minLowercase} lowercase letter(s)`);
    if (policy.maxLowercase) rules.push(`At most ${policy.maxLowercase} lowercase letter(s)`);
    if (policy.minNumeric) rules.push(`At least ${policy.minNumeric} number(s)`);
    if (policy.maxNumeric) rules.push(`At most ${policy.maxNumeric} number(s)`);
    if (policy.minPunctuation) rules.push(`At least ${policy.minPunctuation} special character(s)`);
    if (policy.maxPunctuation) rules.push(`At most ${policy.maxPunctuation} special character(s)`);

    // Repeat/Duplicate/Sequential rules
    if (policy.DisallowRepeatCharacters === "Yes") {
        rules.push("Repeated characters are not allowed");
    } else if (policy.disallowRepeatCharacters === "Yes-CI") {
        rules.push("Repeated characters (case-insensitive) are not allowed");
    }

    if (policy.DisallowDuplicateCharacters === "Yes") {
        rules.push("Duplicate characters are not allowed");
    } else if (policy.disallowDuplicateCharacters === "Yes-CI") {
        rules.push("Duplicate characters (case-insensitive) are not allowed");
    }

    if (policy.DisallowSequentialCharacters === "Yes") {
        rules.push("Sequential characters are not allowed");
    } else if (policy.disallowSequentialCharacters === "Yes-CI") {
        rules.push("Sequential characters (case-insensitive) are not allowed");
    }

    // Position rules
    if (policy.beginWithUppercase) rules.push("Must begin with an uppercase letter");
    if (policy.endWithUppercase) rules.push("Must end with an uppercase letter");
    if (policy.beginWithAlpha) rules.push("Must begin with a letter");
    if (policy.endWithAlpha) rules.push("Must end with a letter");
    if (policy.beginWithNumber) rules.push("Must begin with a number");
    if (policy.endWithNumber) rules.push("Must end with a number");
    if (policy.beginWithSymbol) rules.push("Must begin with a symbol");
    if (policy.endWithSymbol) rules.push("Must end with a symbol");

    // Prohibited characters
    if (policy.prohibitedCharacters && policy.prohibitedCharacters.trim() !== "") {
        rules.push(`Cannot contain: ${policy.prohibitedCharacters}`);
    }

    return `<div class="text-start text-light">
                <strong class="d-block mb-1" >Password Requirements:</strong >
                <ul class="list-unstyled mb-0 ps-3">
                    ${rules.map(rule => `<li class="mb-1">• ${rule}</li>`).join('')}
                </ul>
            </div >`;
}


document.addEventListener('DOMContentLoaded', () => {

    
    const baseUrl = window.origin;
    const passwordPolicyUrl = `${baseUrl}/Auth/PwdRuleValData`;
    console.log(passwordPolicyUrl);
    fetch(passwordPolicyUrl)
        .then((response) => response.json())
        .then((policy) => {
            console.log("Password policy:", policy);

            const tooltipContent = generateTooltipContent(policy);

            const icon = document.getElementById("password-policy-icon");
            icon.setAttribute("data-bs-toggle", "tooltip");
            icon.setAttribute("data-bs-html", "true");
            icon.setAttribute("title", tooltipContent);
            new bootstrap.Tooltip(icon);
 
        })
        .catch((error) => {
            console.error("password tooltip not initialized");
        });
});

