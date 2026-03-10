document.addEventListener('DOMContentLoaded', () => {
    const lotteryGrid = document.querySelector('.lottery-grid') || document.getElementById('lotteryGrid') || document.querySelector('main div.grid');
    const categoryLinks = document.querySelectorAll('.category-list a, .categories a');
    let allTickets = [];

    if (!lotteryGrid) {
        console.error("Error: Grid not found");
        return;
    }

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            allTickets = data;
            displayTickets('Ada Kotipathi');
        })
        .catch(error => {
            console.error('Error:', error);
            lotteryGrid.innerHTML = '<p>දත්ත පූරණය කිරීමේ දෝෂයකි.</p>';
        });

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
            card.style.position = 'relative';
            
            card.innerHTML = `
                ${isSold ? '<div style="position: absolute; top: 10px; right: 10px; background: red; color: white; padding: 5px 10px; font-weight: bold; border-radius: 5px; z-index: 5;">SOLD OUT</div>' : ''}
                <h3 style="margin-top: 10px;">${ticket.lottery_name}</h3>
                <div class="ticket-info">
                    <p><span>අංකය:</span> ${ticket.ticket_number}</p>
                    <p><span>දිනය:</span> ${ticket.draw_date}</p>
                    <p><span>වාරය:</span> ${ticket.draw_number}</p>
                    <p class="price" style="font-weight: bold; color: #2ecc71;">මිල: රු. ${ticket.price}</p>
                </div>
                <button class="buy-btn" ${isSold ? 'disabled' : ''} style="width: 100%; padding: 10px; border: none; border-radius: 5px; background: ${isSold ? '#888' : '#27ae60'}; color: white; cursor: ${isSold ? 'not-allowed' : 'pointer'};">
                    ${isSold ? 'විකුණා ඇත' : 'දැන්ම මිලදී ගන්න'}
                </button>
            `;
            lotteryGrid.appendChild(card);
        });
    }
});
