// Registration Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // Get form data
        const formData = {
            id: Date.now().toString(),
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            company: document.getElementById('company').value.trim(),
            service: document.getElementById('service').value,
            message: document.getElementById('message').value.trim(),
            registeredAt: new Date().toISOString(),
            registeredDate: new Date().toLocaleDateString(),
            registeredTime: new Date().toLocaleTimeString()
        };

        // Validate required fields
        if (!formData.fullName || !formData.email || !formData.phone) {
            showError('Please fill in all required fields.');
            return;
        }

        // Validate email format
        if (!isValidEmail(formData.email)) {
            showError('Please enter a valid email address.');
            return;
        }

        // Validate phone format (basic validation)
        if (!isValidPhone(formData.phone)) {
            showError('Please enter a valid phone number.');
            return;
        }

        try {
            // Get existing clients from localStorage
            let clients = JSON.parse(localStorage.getItem('clients')) || [];

            // Check for duplicate email
            const existingClient = clients.find(client => client.email === formData.email);
            if (existingClient) {
                showError('This email is already registered.');
                return;
            }

            // Add new client
            clients.push(formData);

            // Save to localStorage
            localStorage.setItem('clients', JSON.stringify(clients));

            // Show success message
            successMessage.style.display = 'block';

            // Reset form
            form.reset();

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);

        } catch (error) {
            showError('An error occurred during registration. Please try again.');
            console.error('Registration error:', error);
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Hide error message after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        // Basic phone validation - at least 10 digits
        const phoneRegex = /[\d\s\-\+\(\)]{10,}/;
        return phoneRegex.test(phone);
    }
});
// Registration Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';

        // Get form data
        const formData = {
            id: Date.now().toString(),
            fullName: document.getElementById('fullName').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            company: document.getElementById('company').value.trim(),
            service: document.getElementById('service').value,
            message: document.getElementById('message').value.trim(),
            registeredAt: new Date().toISOString(),
            registeredDate: new Date().toLocaleDateString(),
            registeredTime: new Date().toLocaleTimeString()
        };

        // Validate required fields
        if (!formData.fullName || !formData.email || !formData.phone) {
            showError('Please fill in all required fields.');
            return;
        }

        // Validate email format
        if (!isValidEmail(formData.email)) {
            showError('Please enter a valid email address.');
            return;
        }

        // Validate phone format (basic validation)
        if (!isValidPhone(formData.phone)) {
            showError('Please enter a valid phone number.');
            return;
        }

        try {
            // Get existing clients from localStorage
            let clients = JSON.parse(localStorage.getItem('clients')) || [];

            // Check for duplicate email
            const existingClient = clients.find(client => client.email === formData.email);
            if (existingClient) {
                showError('This email is already registered.');
                return;
            }

            // Add new client
            clients.push(formData);

            // Save to localStorage
            localStorage.setItem('clients', JSON.stringify(clients));

            // Show success message
            successMessage.style.display = 'block';

            // Reset form
            form.reset();

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);

        } catch (error) {
            showError('An error occurred during registration. Please try again.');
            console.error('Registration error:', error);
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Hide error message after 5 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 5000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        // Basic phone validation - at least 10 digits
        const phoneRegex = /[\d\s\-\+\(\)]{10,}/;
        return phoneRegex.test(phone);
    }
});
