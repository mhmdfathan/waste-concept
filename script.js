document.addEventListener('DOMContentLoaded', () => {
    const wasteForm = document.getElementById('wasteForm');
    const historyTableBody = document.getElementById('historyTableBody');
    const recyclableAmount = document.getElementById('recyclableAmount');
    const nonRecyclableAmount = document.getElementById('nonRecyclableAmount');
    const totalAmount = document.getElementById('totalAmount');

    // Load data from local storage
    const savedWaste = JSON.parse(localStorage.getItem('wasteData')) || [];

    // Initialize dashboard and table
    updateDashboard(savedWaste);
    renderWasteHistory(savedWaste);

    // Add event listener for form submission
    wasteForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const wasteType = document.getElementById('wasteType').value;
        const wasteAmount = document.getElementById('wasteAmount').value;
        const editIndex = document.getElementById('editIndex').value;

        if (!wasteAmount || wasteAmount <= 0) {
            return alert('Please enter a valid waste amount!');
        }

        const wasteEntry = { type: wasteType, amount: Number(wasteAmount) };

        if (editIndex !== '') {
            // Update existing entry
            savedWaste[editIndex] = wasteEntry;
            document.getElementById('editIndex').value = '';
        } else {
            // Add new entry
            savedWaste.push(wasteEntry);
        }

        // Save to local storage
        localStorage.setItem('wasteData', JSON.stringify(savedWaste));

        // Update UI
        renderWasteHistory(savedWaste);
        updateDashboard(savedWaste);

        // Clear form
        wasteForm.reset();
    });

    // Function to update the dashboard
    function updateDashboard(data) {
        const recyclable = data
            .filter((waste) => waste.type === 'recyclable')
            .reduce((total, waste) => total + waste.amount, 0);

        const nonRecyclable = data
            .filter((waste) => waste.type === 'non-recyclable')
            .reduce((total, waste) => total + waste.amount, 0);

        const total = recyclable + nonRecyclable;

        recyclableAmount.textContent = `${recyclable} kg`;
        nonRecyclableAmount.textContent = `${nonRecyclable} kg`;
        totalAmount.textContent = `${total} kg`;
    }

    // Function to render waste history table
    function renderWasteHistory(data) {
        historyTableBody.innerHTML = '';
        data.forEach((waste, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${capitalize(waste.type)}</td>
                <td>${waste.amount} kg</td>
                <td>
                    <button onclick="editEntry(${index})">Edit</button>
                    <button onclick="deleteEntry(${index})">Delete</button>
                </td>
            `;

            historyTableBody.appendChild(row);
        });
    }

    // Global functions for edit and delete
    window.editEntry = (index) => {
        const waste = savedWaste[index];
        document.getElementById('wasteType').value = waste.type;
        document.getElementById('wasteAmount').value = waste.amount;
        document.getElementById('editIndex').value = index;
    };

    window.deleteEntry = (index) => {
        if (confirm('Are you sure you want to delete this entry?')) {
            savedWaste.splice(index, 1);
            localStorage.setItem('wasteData', JSON.stringify(savedWaste));
            renderWasteHistory(savedWaste);
            updateDashboard(savedWaste);
        }
    };

    // Helper function to capitalize waste type
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
