document.addEventListener('DOMContentLoaded', () => {
    const wasteForm = document.getElementById('wasteForm');
    const historyTableBody = document.getElementById('historyTableBody');
    const recyclableAmount = document.getElementById('recyclableAmount');
    const nonRecyclableAmount = document.getElementById('nonRecyclableAmount');
    const totalAmount = document.getElementById('totalAmount');
    const navLinks = document.querySelectorAll('header nav a');

    if (
        !wasteForm ||
        !historyTableBody ||
        !recyclableAmount ||
        !nonRecyclableAmount ||
        !totalAmount
    ) {
        console.error('Required DOM elements not found');
        return;
    }

    // Enhanced smooth scroll function with proper timing and error handling
    function smoothScrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element with id '${elementId}' not found`);
            return;
        }

        const headerHeight = 80; // Match the CSS header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
            elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth',
        });
    }

    // Handle navigation links
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            smoothScrollToElement(targetId);
            // Update URL without triggering scroll
            history.pushState(null, '', `#${targetId}`);
        });
    });

    // Handle initial hash if present
    if (window.location.hash) {
        const targetId = window.location.hash.slice(1);
        requestAnimationFrame(() => {
            smoothScrollToElement(targetId);
        });
    }

    // Load data from local storage
    const savedWaste = JSON.parse(localStorage.getItem('wasteData')) || [];

    // Initialize dashboard and table
    updateDashboard(savedWaste);
    renderWasteHistory(savedWaste);

    // Rest of the existing code remains the same...
    wasteForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const wasteType = document.getElementById('wasteType').value;
        const wasteAmount = Number(
            document.getElementById('wasteAmount').value,
        );
        const editIndex = document.getElementById('editIndex').value;

        if (!wasteAmount || wasteAmount <= 0) {
            return alert('Please enter a valid waste amount!');
        }

        const wasteEntry = { type: wasteType, amount: Number(wasteAmount) };

        if (editIndex !== '') {
            savedWaste[editIndex] = wasteEntry;
            document.getElementById('editIndex').value = '';
        } else {
            savedWaste.push(wasteEntry);
        }

        localStorage.setItem('wasteData', JSON.stringify(savedWaste));

        requestAnimationFrame(() => {
            renderWasteHistory(savedWaste);
            updateDashboard(savedWaste);
            wasteForm.reset();
        });
    });

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

    function renderWasteHistory(data) {
        historyTableBody.innerHTML = '';
        data.forEach((waste, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${capitalize(waste.type)}</td>
                <td>${waste.amount} kg</td>
                <td>
                    <button data-index="${index}">Edit</button>
                    <button data-index="${index}">Delete</button>
                </td>
            `;
            historyTableBody.appendChild(row);
        });
    }

    historyTableBody.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const index = parseInt(event.target.dataset.index);
            if (index >= 0 && index < savedWaste.length) {
                if (event.target.textContent === 'Edit') {
                    const waste = savedWaste[index];
                    document.getElementById('wasteType').value = waste.type;
                    document.getElementById('wasteAmount').value = waste.amount;
                    document.getElementById('editIndex').value = index;

                    requestAnimationFrame(() => {
                        smoothScrollToElement('track');
                    });
                } else if (event.target.textContent === 'Delete') {
                    if (
                        confirm('Are you sure you want to delete this entry?')
                    ) {
                        savedWaste.splice(index, 1);
                        localStorage.setItem(
                            'wasteData',
                            JSON.stringify(savedWaste),
                        );
                        renderWasteHistory(savedWaste);
                        updateDashboard(savedWaste);
                    }
                }
            }
        }
    });

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
});
