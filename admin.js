// Admin Panel Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginScreen = document.getElementById('loginScreen');
    const adminPanel = document.getElementById('adminPanel');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const searchInput = document.getElementById('searchInput');
    const exportBtn = document.getElementById('exportBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const ratingSearchInput = document.getElementById('ratingSearchInput');
    const exportRatingsBtn = document.getElementById('exportRatingsBtn');
    const clearRatingsBtn = document.getElementById('clearRatingsBtn');

    // Admin credentials (in a real app, this would be server-side)
    const ADMIN_CREDENTIALS = {
        username: 'AniqLashari',
        password: 'aniq-123'
    };

    // Check if already logged in
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (isLoggedIn) {
        showAdminPanel();
    }

    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        loginError.style.display = 'none';

        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            showAdminPanel();
        } else {
            loginError.textContent = 'Invalid username or password';
            loginError.style.display = 'block';
        }
    });

    // Logout button
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('adminLoggedIn');
        loginScreen.style.display = 'block';
        adminPanel.style.display = 'none';
        loginForm.reset();
    });

    // Refresh button
    refreshBtn.addEventListener('click', function() {
        refreshBtn.style.animation = 'none';
        setTimeout(() => {
            refreshBtn.style.animation = 'pulse 0.6s ease-in-out';
        }, 10);
        
        displayClients();
        updateStats();
        displayRatings();
        updateRatingStats();
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        displayClients(this.value.toLowerCase());
    });

    // Export data button
    exportBtn.addEventListener('click', function() {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        if (clients.length === 0) {
            alert('No data to export');
            return;
        }

        // Convert to CSV
        const csv = convertToCSV(clients);
        downloadCSV(csv, 'clients_data.csv');
    });

    // Clear all data button
    clearAllBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all client data? This action cannot be undone.')) {
            if (confirm('This will permanently delete all client records. Continue?')) {
                localStorage.removeItem('clients');
                displayClients();
                updateStats();
                alert('All client data has been deleted.');
            }
        }
    });

    // Rating search functionality
    ratingSearchInput.addEventListener('input', function() {
        displayRatings(this.value.toLowerCase());
    });

    // Export ratings button
    exportRatingsBtn.addEventListener('click', function() {
        const ratings = JSON.parse(localStorage.getItem('ratings')) || [];
        if (ratings.length === 0) {
            alert('No ratings to export');
            return;
        }

        const csv = convertRatingsToCSV(ratings);
        downloadCSV(csv, 'ratings_data.csv');
    });

    // Clear all ratings button
    clearRatingsBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all ratings? This action cannot be undone.')) {
            if (confirm('This will permanently delete all rating records. Continue?')) {
                localStorage.removeItem('ratings');
                displayRatings();
                updateRatingStats();
                alert('All ratings have been deleted.');
            }
        }
    });

    function showAdminPanel() {
        loginScreen.style.display = 'none';
        adminPanel.style.display = 'block';
        displayClients();
        updateStats();
        displayRatings();
        updateRatingStats();
    }

    function displayClients(searchTerm = '') {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const clientsContainer = document.getElementById('clientsContainer');

        // Filter clients based on search term
        let filteredClients = clients;
        if (searchTerm) {
            filteredClients = clients.filter(client => 
                client.fullName.toLowerCase().includes(searchTerm) ||
                client.email.toLowerCase().includes(searchTerm) ||
                client.phone.includes(searchTerm) ||
                (client.company && client.company.toLowerCase().includes(searchTerm))
            );
        }

        if (filteredClients.length === 0) {
            clientsContainer.innerHTML = '<p class="no-data">No clients found.</p>';
            return;
        }

        // Create table
        let tableHTML = `
            <table class="clients-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Company</th>
                        <th>Service</th>
                        <th>Registered</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        filteredClients.reverse().forEach(client => {
            tableHTML += `
                <tr>
                    <td><strong>${escapeHtml(client.fullName)}</strong></td>
                    <td>${escapeHtml(client.email)}</td>
                    <td>${escapeHtml(client.phone)}</td>
                    <td>${client.company ? escapeHtml(client.company) : '-'}</td>
                    <td>${client.service ? '<span class="badge badge-primary">' + escapeHtml(client.service) + '</span>' : '-'}</td>
                    <td>
                        <small>${client.registeredDate || 'N/A'}<br>${client.registeredTime || ''}</small>
                    </td>
                    <td class="client-actions">
                        <button onclick="viewClient('${client.id}')" class="btn btn-primary btn-small">View</button>
                        <button onclick="deleteClient('${client.id}')" class="btn btn-danger btn-small">Delete</button>
                    </td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        clientsContainer.innerHTML = tableHTML;
    }

    function updateStats() {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const totalClients = clients.length;

        // Calculate clients registered today
        const today = new Date().toLocaleDateString();
        const newToday = clients.filter(client => client.registeredDate === today).length;

        // Calculate clients registered this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const thisWeek = clients.filter(client => {
            const clientDate = new Date(client.registeredAt);
            return clientDate >= oneWeekAgo;
        }).length;

        document.getElementById('totalClients').textContent = totalClients;
        document.getElementById('newToday').textContent = newToday;
        document.getElementById('thisWeek').textContent = thisWeek;
    }

    function convertToCSV(data) {
        const headers = ['Name', 'Email', 'Phone', 'Company', 'Service', 'Message', 'Registered Date', 'Registered Time'];
        const csvRows = [headers.join(',')];

        data.forEach(client => {
            const row = [
                `"${client.fullName}"`,
                `"${client.email}"`,
                `"${client.phone}"`,
                `"${client.company || ''}"`,
                `"${client.service || ''}"`,
                `"${client.message || ''}"`,
                `"${client.registeredDate || ''}"`,
                `"${client.registeredTime || ''}"`
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    function downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Make functions globally accessible
    window.viewClient = function(id) {
        const clients = JSON.parse(localStorage.getItem('clients')) || [];
        const client = clients.find(c => c.id === id);
        
        if (client) {
            let details = `
Client Details:
━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${client.fullName}
Email: ${client.email}
Phone: ${client.phone}
Company: ${client.company || 'Not provided'}
Service: ${client.service || 'Not specified'}
Registered: ${client.registeredDate} at ${client.registeredTime}

Message:
${client.message || 'No message provided'}
            `;
            alert(details);
        }
    };

    window.deleteClient = function(id) {
        if (confirm('Are you sure you want to delete this client?')) {
            let clients = JSON.parse(localStorage.getItem('clients')) || [];
            clients = clients.filter(c => c.id !== id);
            localStorage.setItem('clients', JSON.stringify(clients));
            displayClients(searchInput.value.toLowerCase());
            updateStats();
        }
    };

    function displayRatings(searchTerm = '') {
        const ratings = JSON.parse(localStorage.getItem('ratings')) || [];
        const ratingsContainer = document.getElementById('ratingsContainer');

        let filteredRatings = ratings;
        if (searchTerm) {
            filteredRatings = ratings.filter(rating => 
                rating.name.toLowerCase().includes(searchTerm) ||
                rating.email.toLowerCase().includes(searchTerm)
            );
        }

        if (filteredRatings.length === 0) {
            ratingsContainer.innerHTML = '<p class=\"no-data\">No ratings found.</p>';
            return;
        }

        let ratingsHTML = '<div class=\"ratings-grid\">';
        
        filteredRatings.reverse().forEach(rating => {
            const stars = '★'.repeat(rating.rating) + '☆'.repeat(5 - rating.rating);
            ratingsHTML += `
                <div class="rating-card">
                    <div class="rating-card-header">
                        <div>
                            <p class="rating-card-name">${escapeHtml(rating.name)}</p>
                            <p class="rating-card-email">${escapeHtml(rating.email)}</p>
                            <p class="rating-card-date">${rating.submittedDate} at ${rating.submittedTime}</p>
                        </div>
                        <div class="rating-card-stars">${stars}</div>
                    </div>
                    ${rating.review ? `<p class="rating-card-review">${escapeHtml(rating.review)}</p>` : ''}
                    <div class="rating-card-actions">
                        <button onclick="deleteRating('${rating.id}')" class="btn btn-danger btn-small">Delete</button>
                    </div>
                </div>
            `;
        });

        ratingsHTML += '</div>';
        ratingsContainer.innerHTML = ratingsHTML;
    }

    function updateRatingStats() {
        const ratings = JSON.parse(localStorage.getItem('ratings')) || [];
        
        if (ratings.length === 0) {
            document.getElementById('adminAvgRating').textContent = 'N/A';
            document.getElementById('overallScore').textContent = 'N/A';
            document.getElementById('adminTotalRatings').textContent = '0';
            document.getElementById('satisfactionRate').textContent = '0%';
            // Reset all percentages
            for (let i = 1; i <= 5; i++) {
                document.getElementById(`percent${i}`).textContent = '0%';
                document.getElementById(`progress${i}`).style.width = '0%';
            }
            return;
        }

        // Calculate average rating
        const sum = ratings.reduce((acc, rating) => acc + parseInt(rating.rating), 0);
        const average = (sum / ratings.length).toFixed(1);
        
        // Count each rating
        const counts = {};
        for (let i = 1; i <= 5; i++) {
            counts[i] = ratings.filter(r => r.rating === String(i)).length;
        }
        
        // Calculate percentages
        const total = ratings.length;
        const percentages = {};
        for (let i = 1; i <= 5; i++) {
            percentages[i] = Math.round((counts[i] / total) * 100);
        }
        
        // Calculate satisfaction rate (4+ stars)
        const positiveRatings = counts[5] + counts[4];
        const satisfactionRate = Math.round((positiveRatings / total) * 100);
        
        // Calculate overall score with negative impact from bad reviews
        // Base: average rating (0-5), Penalty: -5 for each 1-star and -2 for each 2-star
        let overallScore = parseFloat(average);
        const penalty = (counts[1] * 5 + counts[2] * 2) / total;
        overallScore = Math.max(0, overallScore - penalty).toFixed(1);
        
        // Update UI
        document.getElementById('adminAvgRating').textContent = average;
        document.getElementById('overallScore').textContent = overallScore;
        document.getElementById('adminTotalRatings').textContent = total;
        document.getElementById('satisfactionRate').textContent = satisfactionRate + '%';
        
        // Update progress bars and percentages
        for (let i = 1; i <= 5; i++) {
            document.getElementById(`percent${i}`).textContent = percentages[i] + '%';
            document.getElementById(`progress${i}`).style.width = percentages[i] + '%';
            document.getElementById(`progress${i}`).textContent = percentages[i] > 10 ? percentages[i] + '%' : '';
        }
    }

    function convertRatingsToCSV(data) {
        const headers = ['Name', 'Email', 'Rating', 'Review', 'Submitted Date', 'Submitted Time'];
        const csvRows = [headers.join(',')];

        data.forEach(rating => {
            const row = [
                `"${rating.name}"`,
                `"${rating.email}"`,
                rating.rating,
                `"${rating.review || ''}"`,
                `"${rating.submittedDate}"`,
                `"${rating.submittedTime}"`
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }

    window.deleteRating = function(id) {
        if (confirm('Are you sure you want to delete this rating?')) {
            let ratings = JSON.parse(localStorage.getItem('ratings')) || [];
            ratings = ratings.filter(r => r.id !== id);
            localStorage.setItem('ratings', JSON.stringify(ratings));
            displayRatings(ratingSearchInput.value.toLowerCase());
            updateRatingStats();
        }
    };
});
