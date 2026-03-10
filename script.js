document.addEventListener('DOMContentLoaded', () => {
    // සයිට් එකේ ටිකට් පේන තැන හරියටම අල්ලගන්නවා
    const lotteryGrid = document.querySelector('.lottery-grid') || document.getElementById('lotteryGrid') || document.querySelector('main div');
    const categoryLinks = document.querySelectorAll('.category-list a, .categories a');
    let allTickets = [];

    if (!lotteryGrid) {
        console.error("Error: Could not find lottery grid element!");
        return;
    }

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allTickets = data;
            displayTickets('Ada Kotipathi');
        })
        .catch(error => console.error('Error loading tickets:', error));

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category') || link.innerText.trim();
            displayTickets(category);
        });
    });

    function displayTickets(category) {
        lotteryGrid.innerHTML = '';
        const filteredTickets = allTickets.filter(t => t.lottery_name === category);

        if (filteredTickets.length === 0) {
            lotteryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">දැනට මෙම ලොතරැයිය සඳහා ටිකට්පත් නොමැත.</p>';
            return;
        }

        filteredTickets.forEach(ticket => {
            const isSold = ticket.status && ticket.status.toLowerCase() === 'sold';
            const card = document.createElement('div');
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