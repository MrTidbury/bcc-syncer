$(document).ready(function() {
    var currentStep = 1;
    var totalSteps = $(".form-step").length;

    const formInputs = {
        fullname: 'text',
        phoneNumber: 'tel',
        mobileNumber: 'tel',
        email: 'email',
        membershipNumber: 'text',
        centerName: 'text',
        emergencyContactName: 'text',
        emergencyContactNumber: 'tel',
        vehicleReg: 'text',
        outfitType: 'select',
        outfitLength: 'text',
        partyAdults: 'number',
        partyTeenagers: 'number',
        partyChildren: 'number',
        socialFoodAdults: 'number',
        socialFoodTeenagers: 'number',
        socialFoodChildren: 'number',
        socialNoFoodAdults: 'number',
        socialNoFoodTeenagers: 'number',
        socialNoFoodChildren: 'number',
        dietaryNeeds: 'textarea',
        rallyPlaque: 'select',
        firstEvent: 'select',
        anniversaryEvent: 'select',
        twelfthEvent: 'select',
        isDisabled: 'select',
        additionalNotes: 'textarea',
        arrivalDate: 'date',
        arrivalTime: 'time',
        lengthOfStay: 'select'
    };

    // Store form data to cookies
    function getFormData(store) {
        const formData = {};
        for (const input in formInputs) {
            const fieldType = formInputs[input];
            for (const input in formInputs) {
                const fieldType = formInputs[input];
                const value = $(`[name=${input}]`).val();
                if (value) formData[input] = value;
            }
        }
        if (store) {
            document.cookie = "bccFormData=" + JSON.stringify(formData) + ";path=/;max-age=31536000";
        }
        return formData;
    }

    // Load form data from cookies
    function loadFormData() {
        const cookies = document.cookie.split('; ');
        const formDataCookie = cookies.find(cookie => cookie.startsWith('bccFormData='));
        if (formDataCookie) {
            const formData = JSON.parse(formDataCookie.split('=')[1]);
            for (const input in formData) {
                // Skip the inputs you don't want to load
                if (input === 'arrivalDate' || input === 'arrivalTime' || input === 'lengthOfStay') {
                    continue;  // Skip these fields
                }
    
                const value = formData[input];
                $(`[name=${input}]`).val(value);  // Set the value of the form field
            }
        }
    }

    function updateProgressBar(step) {
        var percent = (step / totalSteps) * 100;
        $("#progressBar").css("width", percent + "%").attr("aria-valuenow", percent);
    }

    function showStep(step) {
        $(".form-step").removeClass("active").hide();  // <--- HIDE all steps first
        var $targetStep = $('.form-step[data-step="' + step + '"]');
        $targetStep.fadeIn(400).addClass("active");
        updateProgressBar(step);
    }

    function validateStep(step) {
        var isValid = true;
        $('.form-step[data-step="' + step + '"] .required').each(function() {
            if (!$(this).val()) {
                $(this).addClass('is-invalid');
                isValid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        return isValid;
    }

    $(".next-step").click(function() {
        if (validateStep(currentStep)) {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep);
            }
        }
    });

    $(".prev-step").click(function() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    });

    $("#bookingForm").submit(function(e) {
        e.preventDefault();
        if ($('#cookieConsent').is(':checked')) {
            var formData = getFormData(true);
        } else {
            var formData = getFormData(false)
        }
        showStep('6');
    });

    $(".back-button").click(function() {
        window.history.back()
    });

    // Custom fadeIn fix for jQuery
    $.fn.fadeIn = function(speed, callback) {
        this.css('opacity', 0).show().animate({opacity: 1}, speed, callback);
        return this;
    }
    loadFormData();
});