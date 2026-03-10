// script.js

const WHATSAPP_NUMBER = "94770446824";

// The 16 required categories
const CATEGORIES = [
    "Ada Kotipathi",
    "Shanida",
    "Lagna Wasana",
    "Supiri Dhana Sampatha",
    "Super Ball",
    "Kapruka",
    "Sasiri",
    "Jaya Sampatha",
    "Mahajana Sampatha",
    "Govisetha",
    "Suba Dawasak",
    "Dhana Nidhanaya",
    "Mega Power",
    "Handahana",
    "Ada Sampatha",
    "NLB Jaya"
];

let allTickets = [];
let cart = [];
let currentCategory = "All";

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    fetchData();
    setupSearch();
});

// Fetch data from data.json
async function fetchData() {
    const loadingState = document.getElementById("loading-state");
    const grid = document.getElementById("tickets-grid");
    
    try {
        const response = await fetch("data.json");
        if (!response.ok) throw new Error("Data file not found");
        
        allTickets = await response.json();
    } catch (error) {
        console.error("Error loading tickets:", error);
        allTickets = []; // Default to empty if data.json is missing
    }
    
    // Sort tickets by draw date initially
    allTickets.sort((a, b) => new Date(a.draw_date) - new Date(b.draw_date));
    
    loadingState.classList.add("hidden");
    grid.classList.remove("hidden");
    
    renderCategories();
    renderTickets();
}

function setupSearch() {
    const searchInput = document.getElementById("category-search");
    searchInput.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        renderCategories(term);
    });
}

// category rendering
function renderCategories(searchTerm = "") {
    const list = document.getElementById("category-list");
    list.innerHTML = "";
    
    // "All" option
    if ("All".toLowerCase().includes(searchTerm)) {
        list.appendChild(createCategoryItem("All", currentCategory === "All"));
    }
    
    CATEGORIES.forEach(cat => {
        if (cat.toLowerCase().includes(searchTerm)) {
            list.appendChild(createCategoryItem(cat, currentCategory === cat));
        }
    });
}

function createCategoryItem(name, isActive) {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = `w-full text-left px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-between ${
        isActive 
            ? "bg-brand-50 text-brand-700 border border-brand-200 shadow-sm" 
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
    }`;
    btn.onclick = () => selectCategory(name);
    
    // Count available tickets for this category
    const count = name === "All" ? allTickets.length : allTickets.filter(t => t.lottery_name === name).length;
    
    btn.innerHTML = `
        <span class="truncate pr-2">${name}</span>
        <span class="${isActive ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'} text-xs py-0.5 px-2 rounded-full font-semibold min-w-[1.5rem] text-center">${count}</span>
    `;
    
    li.appendChild(btn);
    return li;
}

function selectCategory(name) {
    currentCategory = name;
    document.getElementById("current-category-title").textContent = name === "All" ? "All Lotteries" : name;
    renderCategories(); // re-render to update active state (clears search term temporarily visually here, which is fine)
    document.getElementById("category-search").value = "";
    renderTickets();
}

// Generate an abstract SVG pattern based on a string (for ticket styling)
function getGradientFromString(str) {
    const colors = [
        ['from-blue-500', 'to-cyan-400'],
        ['from-purple-500', 'to-indigo-500'],
        ['from-emerald-500', 'to-teal-400'],
        ['from-orange-500', 'to-amber-400'],
        ['from-rose-500', 'to-pink-400'],
        ['from-yellow-500', 'to-orange-400'],
        ['from-brand-600', 'to-brand-400'],
        ['from-red-500', 'to-rose-400'],
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return `${colors[index][0]} ${colors[index][1]}`;
}

// ticket rendering
function renderTickets() {
    const grid = document.getElementById("tickets-grid");
    const emptyState = document.getElementById("empty-state");
    const countSpan = document.getElementById("ticket-count");
    
    let filtered = allTickets;
    if (currentCategory !== "All") {
        filtered = allTickets.filter(t => t.lottery_name === currentCategory);
    }
    
    countSpan.textContent = `${filtered.length} Ticket${filtered.length !== 1 ? 's' : ''}`;
    
    grid.innerHTML = "";
    
    if (filtered.length === 0) {
        grid.classList.add("hidden");
        emptyState.classList.remove("hidden");
        return;
    }
    
    emptyState.classList.add("hidden");
    grid.classList.remove("hidden");
    
    filtered.forEach(ticket => {
        // Check if in cart
        const inCart = cart.some(item => item.id === ticket.id);
        
        const gradient = getGradientFromString(ticket.lottery_name);
        
        const card = document.createElement("div");
        card.className = "ticket-card bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden group transform hover:-translate-y-1";
        
        // Format Date
        const dateObj = new Date(ticket.draw_date);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        card.innerHTML = `
            <!-- Top Color Bar -->
            <div class="h-20 bg-gradient-to-r ${gradient} relative flex items-center justify-center p-4 text-white">
                <div class="absolute w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <!-- Semi-circles for ticket punch effect -->
                <div class="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full"></div>
                <div class="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full"></div>
                
                <h4 class="font-bold text-lg text-center z-10 w-full line-clamp-1 drop-shadow-md tracking-wider">${ticket.lottery_name}</h4>
            </div>
            
            <!-- Ticket Info -->
            <div class="p-5 flex-grow border-b border-dashed border-gray-200 relative bg-white mix-blend-normal">
                
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Draw Date</p>
                        <p class="text-sm font-semibold text-gray-800"><i class="fa-regular fa-calendar-days mr-1 text-gray-400"></i>${dateStr}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Draw No.</p>
                        <p class="text-sm font-semibold text-gray-800">#${ticket.draw_number}</p>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center relative overflow-hidden mb-2">
                    <p class="text-[10px] uppercase font-bold text-gray-500 mb-1 tracking-widest">Ticket Details</p>
                    <p class="text-xl md:text-2xl font-black text-gray-900 tracking-widest font-mono drop-shadow-sm">${ticket.ticket_number}</p>
                </div>
            </div>
            
            <!-- Bottom Action -->
            <div class="p-4 bg-gray-50/50 flex justify-between items-center bg-white relative">
                 <!-- Semi-circles for ticket punch effect -->
                 <div class="absolute -top-3 -left-3 w-6 h-6 bg-white rounded-full border border-gray-100 border-t-0 border-l-0 border-r-0"></div>
                 <div class="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full border border-gray-100 border-t-0 border-r-0 border-l-0"></div>
                 
                <div class="pl-2">
                    <p class="text-xs text-gray-500 font-medium">Price</p>
                    <p class="text-lg font-bold text-brand-600">Rs. ${ticket.price.toFixed(2)}</p>
                </div>
                <button 
                    onclick="toggleCartItem('${ticket.id}')" 
                    id="btn-${ticket.id}"
                    class="px-5 py-2.5 rounded-xl font-bold text-sm transition duration-300 flex items-center space-x-1.5 ${
                        inCart 
                            ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                            : 'bg-brand-600 text-white shadow-md shadow-brand-500/20 hover:bg-brand-500 hover:-translate-y-0.5'
                    }">
                    <i class="fa-solid ${inCart ? 'fa-trash-can' : 'fa-cart-plus'}"></i>
                    <span>${inCart ? 'Remove' : 'Add to Cart'}</span>
                </button>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Cart functionality
function toggleCartItem(id) {
    const ticket = allTickets.find(t => t.id === id);
    if (!ticket) return;
    
    const index = cart.findIndex(item => item.id === id);
    
    if (index > -1) {
        cart.splice(index, 1);
        showToast("Removed from cart", false);
    } else {
        cart.push(ticket);
        showToast("Added to cart", true);
    }
    
    saveCart();
    updateCartUI();
    renderTickets(); // Re-render to update button states
}

function updateCartUI() {
    // Update counts
    document.getElementById("cart-count").textContent = cart.length;
    document.getElementById("cart-count-mobile").textContent = cart.length;
    document.getElementById("cart-total-count").textContent = cart.length;
    
    // Update total price
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById("cart-total-price").textContent = total.toFixed(2);
    
    // Update cart drawer items
    const cartItemsContainer = document.getElementById("cart-items");
    const emptyMsg = document.getElementById("cart-empty-msg");
    
    // Clear all existing dynamic items (keep empty msg)
    const items = cartItemsContainer.querySelectorAll('.cart-item-row');
    items.forEach(item => item.remove());
    
    if (cart.length === 0) {
        emptyMsg.classList.remove("hidden");
        emptyMsg.classList.add("flex");
    } else {
        emptyMsg.classList.add("hidden");
        emptyMsg.classList.remove("flex");
        
        cart.forEach(item => {
            const gradient = getGradientFromString(item.lottery_name);
            const row = document.createElement("div");
            row.className = "cart-item-row bg-white rounded-xl p-3 flex gap-3 shadow-sm border border-gray-100 relative overflow-hidden";
            row.innerHTML = `
                <div class="w-2 h-full absolute left-0 top-0 bg-gradient-to-b ${gradient}"></div>
                <div class="pl-2 flex-grow">
                    <p class="font-bold text-gray-800 text-sm mb-0.5">${item.lottery_name}</p>
                    <p class="text-xs text-gray-500 font-mono tracking-wider mb-1">${item.ticket_number}</p>
                    <p class="text-sm font-bold text-brand-600">Rs. ${item.price.toFixed(2)}</p>
                </div>
                <button onclick="toggleCartItem('${item.id}')" class="text-gray-400 hover:text-red-500 transition p-2 flex items-center justify-center rounded-lg hover:bg-red-50 my-auto h-10 w-10">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            `;
            cartItemsContainer.appendChild(row);
        });
    }
}

// Local Storage
function saveCart() {
    localStorage.setItem("ticketCart", JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem("ticketCart");
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
    updateCartUI();
}

// Drawer Toggle
function toggleCart() {
    const drawer = document.getElementById("cart-drawer");
    const overlay = document.getElementById("cart-overlay");
    
    const isClosed = drawer.classList.contains("translate-x-full");
    
    if (isClosed) {
        // Open
        overlay.classList.remove("hidden");
        // small timeout to allow display:block to apply before changing opacity
        setTimeout(() => {
            overlay.classList.remove("opacity-0");
            drawer.classList.remove("translate-x-full");
        }, 10);
    } else {
        // Close
        drawer.classList.add("translate-x-full");
        overlay.classList.add("opacity-0");
        setTimeout(() => {
            overlay.classList.add("hidden");
        }, 300); // match transition duration
    }
}

// Toast Notification
function showToast(message, isSuccess = true) {
    const toast = document.getElementById("toast");
    const msg = document.getElementById("toast-message");
    const icon = toast.querySelector("i");
    
    msg.textContent = message;
    
    if (isSuccess) {
        icon.className = "fa-solid fa-circle-check text-green-400";
    } else {
        icon.className = "fa-solid fa-circle-info text-blue-400";
    }
    
    toast.classList.remove("opacity-0", "translate-y-10", "pointer-events-none");
    
    // Clear existing timeout if multiple clicks
    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    
    window.toastTimeout = setTimeout(() => {
        toast.classList.add("opacity-0", "translate-y-10", "pointer-events-none");
    }, 2500);
}

// WhatsApp Checkout
function checkoutWhatsApp() {
    if (cart.length === 0) {
        showToast("Your cart is empty!", false);
        return;
    }
    
    let message = "Hello, I want to buy the following tickets from Kapilarathna Wasana Mandiraya:\n\n";
    
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.lottery_name}*\n`;
        message += `   Number: ${item.ticket_number} | Draw: #${item.draw_number}\n`;
        message += `   Price: Rs. ${item.price.toFixed(2)}\n\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    message += `*Total Tickets:* ${cart.length}\n`;
    message += `*Total Amount:* Rs. ${total.toFixed(2)}\n\n`;
    message += "Please confirm the availability.";
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappURL, "_blank");
}