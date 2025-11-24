// Rating Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const ratingForm = document.getElementById('ratingForm');
    const ratingInputs = document.querySelectorAll('input[name="rating"]');
    const ratingText = document.getElementById('ratingText');
    const ratingMessage = document.getElementById('ratingMessage');

    const ratingLabels = {
        5: '⭐⭐⭐⭐⭐ Excellent! Very satisfied',
        4: '⭐⭐⭐⭐ Good! Satisfied',
        3: '⭐⭐⭐ Okay, average experience',
        2: '⭐⭐ Not satisfied',
        1: '⭐ Very poor experience'
    };

    // Update rating text when star is selected
    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            ratingText.textContent = ratingLabels[this.value];
        });
    });

    // Handle form submission
    ratingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            id: Date.now().toString(),
            name: document.getElementById('raterName').value.trim(),
            email: document.getElementById('raterEmail').value.trim(),
            rating: document.querySelector('input[name="rating"]:checked').value,
            review: document.getElementById('reviewText').value.trim(),
            submittedAt: new Date().toISOString(),
            submittedDate: new Date().toLocaleDateString(),
            submittedTime: new Date().toLocaleTimeString()
        };

        try {
            // Validate email
            if (!isValidEmail(formData.email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Get existing ratings
            let ratings = JSON.parse(localStorage.getItem('ratings')) || [];

            // Add new rating
            ratings.push(formData);

            // Save to localStorage
            localStorage.setItem('ratings', JSON.stringify(ratings));

            // Update statistics
            updateRatingStats(ratings);

            // Show success message
            ratingMessage.style.display = 'block';

            // Reset form
            ratingForm.reset();
            ratingText.textContent = 'Please select a rating';

            // Hide success message after 5 seconds
            setTimeout(() => {
                ratingMessage.style.display = 'none';
            }, 5000);

            // Scroll to message
            window.scrollTo({ top: ratingMessage.offsetTop - 100, behavior: 'smooth' });

        } catch (error) {
            alert('An error occurred while submitting your rating. Please try again.');
            console.error('Rating submission error:', error);
        }
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function updateRatingStats(ratings) {
        if (ratings.length === 0) return;

        // Calculate average rating
        const sum = ratings.reduce((acc, rating) => acc + parseInt(rating.rating), 0);
        const average = (sum / ratings.length).toFixed(1);

        // Update UI
        document.getElementById('avgRating').textContent = average;
        document.getElementById('totalRatings').textContent = ratings.length + '+';
    }

    // Load and display initial stats
    const initialRatings = JSON.parse(localStorage.getItem('ratings')) || [];
    if (initialRatings.length > 0) {
        updateRatingStats(initialRatings);
    }
});
