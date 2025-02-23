const form = document.querySelector('form');
const fullName = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const subject = document.getElementById("subject");
const mess = document.getElementById("message");
// require('dotenv').config();
emailjs.init("");

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

    phone.addEventListener('input', function(e) {
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
    emailjs.send('', '', {
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