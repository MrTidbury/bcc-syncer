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
            
            $.ajax({
                url: 'https://bcc-syncer.nw.r.appspot.com/xhr/set_cookies',
                method: 'POST',
                xhrFields: {
                  withCredentials: true // Important to allow cookies
                },
                contentType: 'application/json',
                data: JSON.stringify(formData),
                success: function(response) {
                  console.log('Cookie set response:', response);
                },
                error: function(err) {
                  console.error('Error setting cookie:', err);
                }
              });
            console.log("Form data stored in cookies:", formData);
        }
        return formData;
    }

    // Load form data from cookies
    function loadFormData() {
        $.ajax({
            url: 'https://bcc-syncer.nw.r.appspot.com/xhr/get_cookies',
            method: 'GET',
            xhrFields: {
              withCredentials: true
            },
            success: function(response) {
                console.log('Fetched cookie data:', response.bccFormData);
                for (const input in response.bccFormData) {
                    // Skip the inputs you don't want to load
                    if (input === 'arrivalDate' || input === 'arrivalTime' || input === 'lengthOfStay') {
                        continue;  // Skip these fields
                    }

                    const value = response.bccFormData[input];
                    $(`[name=${input}]`).val(value);  // Set the value of the form field
                }
            },
            error: function(err) {
              console.error('Error fetching cookie:', err);
            }
          });

        // const cookies = document.cookie.split('; ');
        // console.log(cookies)
        // const formDataCookie = cookies.find(cookie => cookie.startsWith('bccFormData='));
        // if (formDataCookie) {
        //     const formData = JSON.parse(formDataCookie.split('=')[1]);
        //     for (const input in formData) {
        //         // Skip the inputs you don't want to load
                
        //     }
        // }
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