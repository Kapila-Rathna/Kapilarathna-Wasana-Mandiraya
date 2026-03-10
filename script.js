document.addEventListener('DOMContentLoaded', () => {
    const lotteryGrid = document.getElementById('lotteryGrid');
    const categoryLinks = document.querySelectorAll('.category-list a');
    let allTickets = [];

    // Load data from data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allTickets = data;
            displayTickets('Ada Kotipathi'); // Default view
        })
        .catch(error => console.error('Error loading tickets:', error));

    // Category click event
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            displayTickets(category);
        });
    });

    function displayTickets(category) {
        lotteryGrid.innerHTML = '';
        const filteredTickets = allTickets.filter(t => t.lottery_name === category);

        if (filteredTickets.length === 0) {
            lotteryGrid.innerHTML = '<p class="no-tickets">දැනට මෙම ලොතරැයිය සඳහා ටිකට්පත් නොමැත.</p>';
            return;
        }

        filteredTickets.forEach(ticket => {
            const isSold = ticket.status.toLowerCase() === 'sold';
            const card = document.createElement('div');
            
            // Sold නම් අළු පාට කරන class එකක් (sold-card) දානවා
            card.className = `lottery-card ${isSold ? 'sold-card' : ''}`;
            
            card.innerHTML = `
                ${isSold ? '<div class="sold-badge">SOLD OUT</div>' : ''}
                <h3>${ticket.lottery_name}</h3>
                <div class="ticket-info">
                    <p><span>අංකය:</span> ${ticket.ticket_number}</p>
                    <p><span>දිනය:</span> ${ticket.draw_date}</p>
                    <p><span>වාරය:</span> ${ticket.draw_number}</p>
                    <p class="price">මිල: රු. ${ticket.price}</p>
                </div>
                <button class="buy-btn" ${isSold ? 'disabled' : ''}>
                    ${isSold ? 'විකුණා ඇත' : 'දැන්ම මිලදී ගන්න'}
                </button>
            `;
            lotteryGrid.appendChild(card);
        });
    }
});