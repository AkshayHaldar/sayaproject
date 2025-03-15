const form = document.querySelector('form');
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const subject = document.getElementById("subject");
const mess = document.getElementById("message");
// require('dotenv').config();
emailjs.init("PG2nBRl-rHrW0rwRj");

function showError(element, message) {
    element.classList.add('error');
    element.parentElement.classList.add('error');
    const errorTxt = element.parentElement.querySelector('.error-txt');
    if (errorTxt) errorTxt.textContent = message;
}

function clearError(element) {
    element.classList.remove('error');
    element.parentElement.classList.remove('error');
    const errorTxt = element.parentElement.querySelector('.error-txt');
    if (errorTxt) errorTxt.textContent = '';
}

function checkEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === "") {
        showError(email, "Email can't be blank");
        return false;
    } else if (!emailRegex.test(email.value)) {
        showError(email, "Invalid email address");
        return false;
    } else {
        clearError(email);
        return true;
    }
}

function checkPhone() {
    const trimmedValue = phone.value.trim();
    if (trimmedValue === '') {
        return true;
    }

    const phoneNumber = trimmedValue.replace(/\D/g, '');
    if (phoneNumber.length > 10) {
        showError(phone, "Phone number cannot exceed 10 digits");
        return false;
    } else {
        clearError(phone);
        return true;
    }
}

function validateForm() {
    let isValid = true;

    [fullName, phone, subject, mess].forEach(input => {
        if (input.value.trim() === '') {
            showError(input, "This field is required");
            isValid = false;
        }
    });

    return isValid && checkEmail() && checkPhone();
}

function initEventListeners() {
    [fullName, email, phone, subject, mess].forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') clearError(input);
            if (input === email) checkEmail();
        });
    });

    phone.addEventListener('input', function (e) {
        this.value = this.value.replace(/[^0-9-\s]/g, '');
        checkPhone();
    });
}
initEventListeners();

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    sendEmail();
    console.log("Form submitted");
});

function sendEmail() {
    emailjs.send('service_q71cp0h', 'template_ut93dpp', {
        from_name: fullName.value,
        from_email: email.value,
        phone: phone.value,
        subject: subject.value,
        message: mess.value
    })
        .then(() => {
            Swal.fire({
                title: "Success!",
                text: "Message sent successfully!",
                icon: "success"
            });
            form.reset();
        }, (error) => {
            Swal.fire({
                title: "Error!",
                text: "Failed to send message. Please try again.",
                icon: "error"
            });
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('phonePopup');
    const closeButton = document.querySelector('.close');
    const popupContactForm = document.getElementById('popupContactForm');

    function showPhonePopup() {
        popup.classList.add('active');
    }

    function hidePhonePopup() {
        popup.classList.remove('active');
    }

    function initPopup() {
        // Show popup initially
        showPhonePopup();

        // Show popup every 30 seconds
        setInterval(showPhonePopup, 30000);

        // Close popup when clicking the close button
        closeButton.addEventListener('click', hidePhonePopup);
        
        // Close popup when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === popup) {
                hidePhonePopup();
            }
        });
        
        // Handle popup form submission
        if (popupContactForm) {
            // Add error message elements to form fields
            const popupNameField = document.getElementById('popupName');
            const popupEmailField = document.getElementById('popupEmail');
            const popupPhoneField = document.getElementById('popupPhone');
            const popupMessageField = document.getElementById('popupMessage');
            
            // Create error elements if they don't exist
            if (!document.getElementById('popupNameError')) {
                const fields = [
                    { id: 'popupName', errorId: 'popupNameError' },
                    { id: 'popupEmail', errorId: 'popupEmailError' },
                    { id: 'popupPhone', errorId: 'popupPhoneError' },
                    { id: 'popupMessage', errorId: 'popupMessageError' }
                ];
                
                fields.forEach(field => {
                    const errorElement = document.createElement('div');
                    errorElement.id = field.errorId;
                    errorElement.className = 'popup-error-message';
                    errorElement.style.display = 'none';
                    document.getElementById(field.id).parentNode.appendChild(errorElement);
                });
            }
            
            // Function to show error for a specific field
            function showPopupFieldError(fieldId, errorMessage) {
                const errorElement = document.getElementById(fieldId + 'Error');
                if (errorElement) {
                    errorElement.textContent = errorMessage;
                    errorElement.style.display = 'block';
                    document.getElementById(fieldId).classList.add('error-input');
                }
            }
            
            // Function to clear error for a specific field
            function clearPopupFieldError(fieldId) {
                const errorElement = document.getElementById(fieldId + 'Error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                    document.getElementById(fieldId).classList.remove('error-input');
                }
            }
            
            // Clear errors on input change
            ['popupName', 'popupEmail', 'popupPhone', 'popupMessage'].forEach(fieldId => {
                document.getElementById(fieldId).addEventListener('input', function() {
                    clearPopupFieldError(fieldId);
                });
            });
            
            popupContactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Clear all previous errors
                ['popupName', 'popupEmail', 'popupPhone', 'popupMessage'].forEach(fieldId => {
                    clearPopupFieldError(fieldId);
                });
                
                let hasErrors = false;
                
                const name = document.getElementById('popupName').value.trim();
                const email = document.getElementById('popupEmail').value.trim();
                const phone = document.getElementById('popupPhone').value.trim();
                const message = document.getElementById('popupMessage').value.trim();
                
                // Validate required fields
                if (!name) {
                    showPopupFieldError('popupName', 'Please enter your name');
                    hasErrors = true;
                }
                
                if (!email) {
                    showPopupFieldError('popupEmail', 'Please enter your email');
                    hasErrors = true;
                } else {
                    // Email validation
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                        showPopupFieldError('popupEmail', 'Please enter a valid email address');
                        hasErrors = true;
                    }
                }
                
                if (!phone) {
                    showPopupFieldError('popupPhone', 'Please enter your phone number');
                    hasErrors = true;
                } else {
                    // Phone validation - only numbers and exactly 10 digits
                    const phoneDigits = phone.replace(/[^0-9]/g, '');
                    if (phoneDigits.length !== 10) {
                        showPopupFieldError('popupPhone', 'Please enter a valid 10-digit phone number');
                        hasErrors = true;
                    }
                }
                
                if (!message) {
                    showPopupFieldError('popupMessage', 'Please enter your message');
                    hasErrors = true;
                }
                
                // If there are errors, show error notification and reset form
                if (hasErrors) {
                    // Add shake animation to the popup content
                    const popupContent = document.querySelector('.popup-content');
                    popupContent.classList.add('form-validation-error');
                    
                    // Remove the animation class after animation completes
                    setTimeout(() => {
                        popupContent.classList.remove('form-validation-error');
                    }, 600);
                    
                    // Show a summary error message at the top but keep popup visible
                    Swal.fire({
                        icon: 'error',
                        title: 'Form Validation Error',
                        text: 'Please correct the errors in the form.',
                        confirmButtonColor: '#e74c3c',
                        confirmButtonText: 'OK',
                        didClose: () => {
                            // Make sure popup is still visible when error message closes
                            showPhonePopup();
                        }
                    });
                    
                    // Reset the form but keep error messages visible
                    popupContactForm.reset();
                    return;
                }
                
                // Store form data before closing the popup
                const formData = {
                    name: name,
                    email: email,
                    phone: phone,
                    message: message
                };
                
                // Close the popup first
                hidePhonePopup();
                
                // Wait a bit for the popup to hide, then send email
                setTimeout(() => {
                    // If validation passed, prepare email parameters
                    const emailParams = {
                        from_name: formData.name,
                        from_email: formData.email,
                        phone: formData.phone,
                        subject: 'Popup Contact Form Inquiry',
                        message: formData.message
                    };
                    
                    // Send email
                    emailjs.send('service_q71cp0h', 'template_ut93dpp', emailParams)
                        .then(() => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Message Sent Successfully!',
                                html: '<div class="confirmation-message">' +
                                      '<p>Thank you for contacting us, <strong>' + formData.name + '</strong>!</p>' +
                                      '<p>Your message has been sent to the property owner.</p>' +
                                      '<p>We will get back to you shortly at <strong>' + formData.email + '</strong> or <strong>' + formData.phone + '</strong>.</p>' +
                                      '</div>',
                                confirmButtonText: 'Great!',
                                confirmButtonColor: '#25d366',
                                showClass: {
                                    popup: 'animate__animated animate__fadeIn'
                                },
                                allowOutsideClick: false,
                                willClose: (popup) => {
                                    console.log('Success message closed');
                                }
                            });
                            popupContactForm.reset();
                        })
                        .catch((error) => {
                            console.error('Email send error:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'Message Not Sent',
                                text: 'Something went wrong! Please try again later.',
                                confirmButtonColor: '#e74c3c',
                                confirmButtonText: 'OK',
                                allowOutsideClick: false,
                                willClose: (popup) => {
                                    console.log('Error message closed');
                                }
                            });
                        });
                }, 300); // Wait 300ms for popup to close
            });
        }
    }

    if (popup && closeButton) {
        initPopup();
    } else {
        console.error('Popup elements not found');
    }
});