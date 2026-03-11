// --- DATA & CONFIG ---
const TICKET_PRICE = 40;
const WHATSAPP_NUMBER = "94770446824";

// The 16 Categories (used for filtering)
const CATEGORIES = [
    "Ada Kotipathi", "Shanida", "Lagna Wasana", "Supiri Dhana Sampatha", 
    "Super Ball", "Kapruka", "Sasiri", "Jaya Sampatha", 
    "Mahajana Sampatha", "Govisetha", "Suba Dawasak", "Dhana Nidhanaya", 
    "Mega Power", "Handahana", "Ada Sampatha", "NLB Jaya"
];

// Specific colors for some prominent lotteries to give the UI a nice aesthetic
const BRAND_COLORS = {
    "Mahajana Sampatha": "from-red-600 to-red-800",
    "Govisetha": "from-green-600 to-green-800",
    "Ada Kotipathi": "from-blue-600 to-blue-800",
    "Shanida": "from-purple-600 to-purple-800",
    "Supiri Dhana Sampatha": "from-yellow-600 to-yellow-800",
    "Super Ball": "from-pink-600 to-pink-800",
    "Lagna Wasana": "from-orange-600 to-orange-800",
    "Mega Power": "from-indigo-600 to-indigo-800",
    "Kapruka": "from-teal-600 to-teal-800",
    "Sasiri": "from-cyan-600 to-cyan-800"
};

// State
let allTickets = [];
let allResults = [];
let cart = [];
let currentCategory = "All";

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    initFilters();
    loadTickets();
    loadResults();
    loadCartFromStorage();
});

// --- TAB NAVIGATION ---
function switchTab(tabId) {
    // Hide all tabs
    document.getElementById('tab-home').classList.add('hidden');
    document.getElementById('tab-tickets').classList.add('hidden');
    document.getElementById('tab-results').classList.add('hidden');
    
    // Reset nav buttons
    document.querySelectorAll('.nav-btn > span').forEach(span => {
        span.classList.remove('w-full', 'scale-x-100');
        span.classList.add('w-0');
    });
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-brand-gold');
        btn.classList.add('text-slate-300');
    });

    // Mobile nav reset
    document.querySelectorAll('.nav-btn-mobile').forEach(btn => {
        btn.classList.remove('text-brand-gold');
        btn.classList.add('text-slate-300');
    });

    // Show selected tab
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');
    
    // Update nav headers (Desktop)
    const activeBtns = Array.from(document.querySelectorAll('.nav-btn')).filter(b => b.textContent.trim().toLowerCase().includes(tabId === 'home' ? 'home' : (tabId === 'tickets' ? 'buy' : 'winning')));
    activeBtns.forEach(btn => {
        btn.classList.remove('text-slate-300');
        btn.classList.add('text-brand-gold');
        const span = btn.querySelector('span');
        if(span) {
            span.classList.remove('w-0');
            span.classList.add('w-full');
            if(tabId === 'home') span.classList.add('scale-x-100');
        }
    });

    // Update nav headers (Mobile)
    const mobileActiveBtns = Array.from(document.querySelectorAll('.nav-btn-mobile')).filter(b => b.textContent.trim().toLowerCase().includes(tabId === 'home' ? 'home' : (tabId === 'tickets' ? 'buy' : 'winning')));
    mobileActiveBtns.forEach(btn => {
        btn.classList.remove('text-slate-300');
        btn.classList.add('text-brand-gold');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- DATA FETCHING ---
async function loadTickets() {
    const loading = document.getElementById('tickets-loading');
    const errorCont = document.getElementById('tickets-error');
    const grid = document.getElementById('tickets-grid');
    
    if(loading) loading.classList.remove('hidden');
    if(errorCont) errorCont.classList.add('hidden');
    if(grid) grid.innerHTML = '';

    try {
        const response = await fetch('tickets.json');
        if (!response.ok) throw new Error('Failed to fetch data');
        allTickets = await response.json();
        renderTickets();
    } catch (error) {
        console.error(error);
        if(errorCont) errorCont.classList.remove('hidden');
    } finally {
        if(loading) loading.classList.add('hidden');
    }
}

async function loadResults() {
    const loading = document.getElementById('results-loading');
    const grid = document.getElementById('results-grid');
    
    if(loading) loading.classList.remove('hidden');
    
    try {
        const response = await fetch('results.json');
        if (!response.ok) throw new Error('Failed to fetch results');
        allResults = await response.json();
        renderResults();
    } catch (error) {
        console.error("Failed to load results", error);
        if(grid) grid.innerHTML = '<p class="col-span-full text-center text-red-400">Unable to load results. Please check results.json.</p>';
    } finally {
        if(loading) loading.classList.add('hidden');
    }
}

// --- RENDERING TICKETS ---
function initFilters() {
    const filterCont = document.getElementById('category-filters');
    if(!filterCont) return;
    
    CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = "filter-btn px-5 py-2.5 rounded-full border border-white/10 text-slate-300 font-medium text-sm hover:bg-white/5 transition-all shadow-sm";
        btn.textContent = cat;
        btn.dataset.category = cat;
        btn.onclick = () => {
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('bg-brand-gold', 'text-brand-dark', 'font-bold', 'border-brand-gold', 'shadow-lg', 'shadow-brand-gold/20');
                b.classList.add('border-white/10', 'text-slate-300', 'font-medium');
            });
            btn.classList.remove('border-white/10', 'text-slate-300', 'font-medium');
            btn.classList.add('bg-brand-gold', 'text-brand-dark', 'font-bold', 'border-brand-gold', 'shadow-lg', 'shadow-brand-gold/20');
            
            currentCategory = cat;
            renderTickets();
        };
        filterCont.appendChild(btn);
    });
}

function renderTickets() {
    const grid = document.getElementById('tickets-grid');
    if(!grid) return;
    grid.innerHTML = '';
    
    const filtered = currentCategory === "All" 
        ? allTickets 
        : allTickets.filter(t => t.lottery_name === currentCategory);

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-16 text-slate-400 bg-white/5 rounded-2xl border border-white/10 mt-4">
                <i class="fa-solid fa-ticket text-6xl mb-4 opacity-20"></i>
                <p class="text-lg">No tickets available for this category right now.</p>
                <button onclick="document.querySelector('.filter-btn[data-category=\\'All\\']').click()" class="mt-4 text-brand-gold hover:underline">View All Tickets</button>
            </div>
        `;
        return;
    }

    filtered.forEach(ticket => {
        const colorClass = BRAND_COLORS[ticket.lottery_name] || "from-slate-600 to-slate-800";
        
        const card = document.createElement('div');
        card.className = "ticket-card flex flex-col justify-between";
        card.innerHTML = `
            <div class="h-16 bg-gradient-to-r ${colorClass} flex items-center justify-center px-4 relative border-b border-black/30">
                <h3 class="font-bold text-white text-lg tracking-wide shadow-sm text-center drop-shadow-md">${ticket.lottery_name}</h3>
            </div>
            
            <div class="p-6 flex-grow flex flex-col items-center text-center">
                <div class="text-xs font-bold text-brand-gold bg-brand-gold/10 px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider border border-brand-gold/20">
                    Draw: #${ticket.draw_number}
                </div>
                
                <p class="text-sm border flex items-center justify-center gap-2 border-slate-700/50 bg-slate-800/50 rounded-lg px-3 py-2 text-slate-300 mb-4 w-full shadow-inner"><i class="fa-regular fa-calendar text-brand-gold"></i> ${ticket.draw_date}</p>
                
                <div class="ticket-divider"></div>
                
                <h2 class="text-3xl font-black text-white tracking-[0.15em] my-3 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    ${ticket.ticket_number}
                </h2>
                
                <div class="ticket-divider"></div>
            </div>

            <div class="p-5 pt-0 flex items-center justify-between">
                <div class="text-xl font-black text-brand-gold drop-shadow-sm"><span class="text-sm font-medium text-slate-400 mr-1">Rs.</span>${TICKET_PRICE}</div>
                <button onclick="addToCart('${ticket.lottery_name}', '${ticket.ticket_number}')" class="bg-white/10 hover:bg-brand-gold hover:text-brand-dark text-white px-5 py-2.5 rounded-lg font-bold transition-all transform hover:scale-105 flex items-center gap-2 text-sm shadow-md">
                    <i class="fa-solid fa-cart-plus"></i> Add
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- RENDERING RESULTS ---
function renderResults() {
    const grid = document.getElementById('results-grid');
    if(!grid) return;
    grid.innerHTML = '';

    if (allResults.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-slate-400 py-10">No results found.</div>';
        return;
    }

    allResults.forEach(res => {
        // Fix string splitting for winning numbers (e.g. A-14-22 -> ['A', '14', '22'])
        let numbersArray = res.winning_numbers ? res.winning_numbers.split('-') : [];
        
        let numbersHTML = numbersArray.map(num => {
            const isLetter = isNaN(num); 
            return `<div class="${isLetter ? 'winning-circle winning-letter' : 'winning-circle'}">${num}</div>`;
        }).join('');

        const card = document.createElement('div');
        card.className = "result-card p-6 flex flex-col items-center bg-brand-card";
        card.innerHTML = `
            <div class="w-full flex justify-between items-start mb-4">
                <h3 class="text-xl font-bold text-white leading-tight">${res.lottery_name}</h3>
                <div class="bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-2 py-1 rounded text-xs font-bold">
                    #${res.draw_number}
                </div>
            </div>
            
            <div class="flex items-center gap-2 text-sm text-slate-400 mb-6 w-full pb-4 border-b border-white/5">
                <i class="fa-regular fa-calendar text-brand-gold"></i>
                <span class="font-medium">${res.draw_date}</span>
            </div>
            
            <div class="flex flex-wrap items-center justify-center gap-3 px-4 py-6 bg-brand-dark/60 rounded-xl border border-white/5 w-full shadow-inner">
                ${numbersHTML}
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- CART LOGIC ---
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if(!drawer || !overlay) return;
    
    if (drawer.classList.contains('translate-x-full')) {
        drawer.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
    } else {
        drawer.classList.add('translate-x-full');
        overlay.classList.add('hidden');
    }
}

function addToCart(lotteryName, ticketNumber) {
    const ticket = allTickets.find(t => t.lottery_name === lotteryName && t.ticket_number === ticketNumber);
    if (!ticket) return;

    if (cart.some(item => item.lottery_name === ticket.lottery_name && item.ticket_number === ticket.ticket_number)) {
        showToast("Ticket is already in the cart!");
        return;
    }

    cart.push(ticket);
    saveCart();
    updateCartUI();
    showToast("Added to cart!");
    
    const badge = document.getElementById('cart-badge');
    if(badge) {
        badge.classList.remove('badge-pop');
        void badge.offsetWidth; 
        badge.classList.add('badge-pop');
    }
}

function removeFromCart(lotteryName, ticketNumber) {
    cart = cart.filter(t => !(t.lottery_name === lotteryName && t.ticket_number === ticketNumber));
    saveCart();
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const badge = document.getElementById('cart-badge');
    const checkoutBtn = document.getElementById('checkout-btn');
    if(!container) return;
    
    const totalQty = cart.length;
    const totalPrice = totalQty * TICKET_PRICE;
    
    const qtyElem = document.getElementById('cart-qty');
    const totalElem = document.getElementById('cart-total');
    if(qtyElem) qtyElem.innerText = totalQty;
    if(totalElem) totalElem.innerText = totalPrice;
    
    if (totalQty > 0) {
        if(badge) { badge.innerText = totalQty; badge.classList.remove('scale-0'); }
        if(checkoutBtn) checkoutBtn.disabled = false;
    } else {
        if(badge) badge.classList.add('scale-0');
        if(checkoutBtn) checkoutBtn.disabled = true;
    }

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                <div class="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
                    <i class="fa-solid fa-ticket text-5xl opacity-40"></i>
                </div>
                <p class="font-medium text-lg text-slate-400">Your cart is empty</p>
                <button onclick="toggleCart(); switchTab('tickets')" class="px-8 py-3 rounded-full border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark font-bold transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    Browse Tickets
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = "flex items-center justify-between p-4 bg-brand-dark/40 border border-white/5 rounded-xl hover:bg-white/5 hover:border-white/10 transition-all shadow-sm";
        div.innerHTML = `
            <div>
                <div class="font-bold text-white text-sm tracking-wide uppercase">${item.lottery_name}</div>
                <div class="text-sm text-brand-gold font-bold font-mono tracking-widest mt-1">${item.ticket_number}</div>
            </div>
            <div class="flex items-center gap-4">
                <div class="text-sm font-bold text-slate-200 bg-slate-800 px-2 py-1 rounded">Rs.${TICKET_PRICE}</div>
                <button onclick="removeFromCart('${item.lottery_name}', '${item.ticket_number}')" class="text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-colors">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

function saveCart() {
    localStorage.setItem('wm_cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('wm_cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch(e) {
            cart = [];
        }
    }
    updateCartUI();
}

// --- CHECKOUT LOGIC ---
function checkout() {
    if (cart.length === 0) return;

    let message = `*Hello, I need these tickets:*\n\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.lottery_name}* - ${item.ticket_number}\n`;
    });
    
    const totalPrice = cart.length * TICKET_PRICE;
    message += `\n*Total Tickets:* ${cart.length}\n*Total Amount:* Rs. ${totalPrice}\n\n`;
    message += `_Sent via Wasana Mandiraya Web_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
    
    window.open(whatsappURL, '_blank');
}

// --- UTILS ---
function showToast(msg) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    document.getElementById('toast-msg').innerText = msg;
    toast.classList.remove('translate-y-[200%]');
    setTimeout(() => {
        toast.classList.add('translate-y-[200%]');
    }, 3000);
}