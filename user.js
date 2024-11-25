document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const roleBadge = document.getElementById('roleBadge');

    // Load saved profile data
    const savedProfile = JSON.parse(localStorage.getItem('userProfile')) || {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        role: 'nasabah',
    };

    // Initialize form with saved data
    Object.keys(savedProfile).forEach((key) => {
        const input = document.getElementById(key);
        if (input) {
            input.value = savedProfile[key];
        }
    });

    // Update role badge
    roleBadge.textContent =
        savedProfile.role.charAt(0).toUpperCase() + savedProfile.role.slice(1);

    // Handle form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            role: document.getElementById('role').value,
        };

        localStorage.setItem('userProfile', JSON.stringify(formData));
        roleBadge.textContent =
            formData.role.charAt(0).toUpperCase() + formData.role.slice(1);
        alert('Profile updated successfully!');
    });

    // Handle role change
    document.getElementById('role').addEventListener('change', (e) => {
        roleBadge.textContent =
            e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    });
});
