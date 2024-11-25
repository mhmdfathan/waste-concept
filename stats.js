// stats.js
document.addEventListener('DOMContentLoaded', () => {
    // Monthly Collection Chart
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    new Chart(monthlyCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Total Waste (kg)',
                    data: [1200, 1900, 1700, 2100, 2500, 2300],
                    borderColor: '#28a745',
                    tension: 0.1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Waste Collection',
                },
            },
        },
    });

    // Waste Distribution Chart
    const distributionCtx = document
        .getElementById('distributionChart')
        .getContext('2d');
    new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Organic', 'Plastic', 'Paper', 'Metal', 'Glass'],
            datasets: [
                {
                    data: [45, 25, 15, 10, 5],
                    backgroundColor: [
                        '#28a745',
                        '#17a2b8',
                        '#ffc107',
                        '#dc3545',
                        '#6c757d',
                    ],
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Waste Type Distribution',
                },
            },
        },
    });
});
