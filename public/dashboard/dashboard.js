// Check authentication before loading dashboard
const isAuth = sessionStorage.getItem('dashboard_auth');
const expiry = sessionStorage.getItem('dashboard_auth_expiry');

if (!isAuth || isAuth !== 'true' || !expiry || Date.now() >= parseInt(expiry)) {
    window.location.href = '/dashboard/login.html';
}

// Global state
let currentCustomer = null;
let conversations = [];
let allConversations = []; // Unfiltered
let messagesRefreshInterval = null;
let currentFilter = 'all';
let lastMessageCount = {};
let customerNotes = JSON.parse(localStorage.getItem('customerNotes') || '{}');

// Canned responses
const cannedResponses = [
    { title: 'Greeting', text: 'Hello! Thank you for contacting Hijau Group Landscape. How can we help you today?' },
    { title: 'Follow up soon', text: 'Thank you for your interest! Our team will contact you within 24 hours.' },
    { title: 'Received request', text: 'We have received your request and will get back to you shortly with a quotation.' },
    { title: 'Schedule visit', text: 'We would like to schedule a site visit. What date and time works best for you?' },
    { title: 'Thank you', text: 'Thank you for choosing Hijau Group Landscape! We look forward to working with you. 💚' },
    { title: 'Contact sales', text: 'For detailed pricing and quotations, please contact our Sales Team at 011-1062 9990' }
];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadConversations();
    initializeTheme();
    checkNotificationPermission();
    
    // Refresh every 5 seconds
    setInterval(loadConversations, 5000);
});

// Theme Management
function initializeTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeButton(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
    const btn = document.querySelector('.btn-theme');
    btn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

// Notifications
function checkNotificationPermission() {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'default') {
        document.getElementById('notification-banner').classList.add('show');
    }
}

function requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            hideNotificationBanner();
            showDesktopNotification('Notifications Enabled', 'You will now receive alerts for new messages');
        }
    });
}

function hideNotificationBanner() {
    document.getElementById('notification-banner').classList.remove('show');
}

function showDesktopNotification(title, body) {
    if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: body,
            icon: '/dashboard/icon.png',
            badge: '/dashboard/badge.png'
        });
        
        // Play sound
        const audio = document.getElementById('notification-sound');
        audio.play().catch(() => {});
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }
}

// Logout
function logout() {
    sessionStorage.removeItem('dashboard_auth');
    sessionStorage.removeItem('dashboard_auth_expiry');
    window.location.href = '/dashboard/login.html';
}

// Load conversations
async function loadConversations() {
    try {
        const response = await fetch('/api/dashboard/conversations');
        const newConversations = await response.json();
        
        // Check for new messages
        checkForNewMessages(newConversations);
        
        allConversations = newConversations;
        conversations = newConversations;
        
        filterConversations();
        updateStats();
    } catch (error) {
        console.error('Error loading conversations:', error);
    }
}

// Check for new messages and notify
function checkForNewMessages(newConversations) {
    newConversations.forEach(conv => {
        const oldCount = lastMessageCount[conv.phone] || 0;
        const newCount = conv.messageCount || 0;
        
        if (newCount > oldCount && oldCount > 0) {
            showDesktopNotification(
                `New message from ${conv.name}`,
                conv.lastMessage.substring(0, 50)
            );
        }
        
        lastMessageCount[conv.phone] = newCount;
    });
}

// Filter conversations
function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    filterConversations();
}

function filterConversations() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    conversations = allConversations.filter(conv => {
        // Search filter
        const matchesSearch = conv.name.toLowerCase().includes(searchTerm) || 
                             conv.phone.includes(searchTerm);
        
        if (!matchesSearch) return false;
        
        // Status filter
        if (currentFilter === 'all') return true;
        if (currentFilter === 'active') return !conv.isPaused;
        if (currentFilter === 'paused') return conv.isPaused;
        if (currentFilter === 'unread') return conv.unreadCount > 0;
        
        return true;
    });
    
    renderConversations();
}

// Render conversations
function renderConversations() {
    const list = document.getElementById('conversations-list');
    
    if (conversations.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>No conversations found</p></div>';
        return;
    }
    
    list.innerHTML = conversations.map(conv => `
        <div class="conversation-item ${conv.isPaused ? 'paused' : ''} ${currentCustomer === conv.phone ? 'active' : ''}" 
             onclick="selectConversation('${conv.phone}', ${conv.isPaused})">
            <div class="avatar">${conv.name.charAt(0).toUpperCase()}</div>
            <div class="conversation-content">
                <div class="conversation-header">
                    <span class="customer-name">${conv.name || conv.phone}</span>
                    <span class="time">${formatRelativeTime(conv.lastMessageTime)}</span>
                </div>
                <div class="last-message">${conv.lastMessage.substring(0, 60)}...</div>
                <div class="conversation-tags">
                    ${getCustomerTags(conv).map(tag => `<span class="tag ${tag.class}">${tag.text}</span>`).join('')}
                    ${conv.isPaused ? '<span class="tag" style="background: #fed7d7; color: #9b2c2c;">⏸️ Paused</span>' : ''}
                </div>
            </div>
            ${conv.unreadCount > 0 ? `<div class="unread-badge">${conv.unreadCount}</div>` : ''}
        </div>
    `).join('');
}

// Get customer interest tags
function getCustomerTags(conv) {
    const tags = [];
    const interests = conv.interests || [];
    const lastMsg = conv.lastMessage.toLowerCase();
    
    if (interests.includes('water_feature') || lastMsg.includes('water') || lastMsg.includes('kolam')) {
        tags.push({ class: 'water', text: '💧 Water' });
    }
    if (interests.includes('grass') || lastMsg.includes('rumput') || lastMsg.includes('grass')) {
        tags.push({ class: 'grass', text: '🌱 Grass' });
    }
    if (interests.includes('planter_box') || lastMsg.includes('planter') || lastMsg.includes('box')) {
        tags.push({ class: 'planter', text: '🪴 Planter' });
    }
    if (interests.includes('consultation') || lastMsg.includes('consult') || lastMsg.includes('site visit')) {
        tags.push({ class: 'consultation', text: '📋 Consult' });
    }
    
    // Hot lead detection (multiple messages or pricing questions)
    if (conv.messageCount > 5 || lastMsg.includes('price') || lastMsg.includes('harga') || lastMsg.includes('quotation')) {
        tags.push({ class: 'hot-lead', text: '🔥 Hot Lead' });
    }
    
    return tags.slice(0, 3); // Max 3 tags
}

// Format relative time (2 mins ago, 1 hour ago, etc.)
function formatRelativeTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return time.toLocaleDateString();
}

// Update stats
function updateStats() {
    const today = new Date().toDateString();
    const todayConvs = allConversations.filter(c => 
        new Date(c.lastMessageTime).toDateString() === today
    );
    const activeConvs = allConversations.filter(c => !c.isPaused);
    const pausedConvs = allConversations.filter(c => c.isPaused);
    
    document.getElementById('stat-today').textContent = todayConvs.length;
    document.getElementById('stat-active').textContent = activeConvs.length;
    document.getElementById('stat-paused').textContent = pausedConvs.length;
    document.getElementById('stat-avg-time').textContent = '< 1min';
}

// Select conversation
async function selectConversation(phone, isPaused = false) {
    currentCustomer = phone;
    const conv = conversations.find(c => c.phone === phone) || allConversations.find(c => c.phone === phone);
    
    document.getElementById('customer-name').textContent = conv ? conv.name : phone;
    document.getElementById('customer-phone').textContent = phone;
    document.getElementById('bot-controls').style.display = 'flex';
    document.getElementById('reply-area').style.display = 'flex';
    
    // Toggle pause/resume buttons
    const pauseBtn = document.querySelector('.btn-pause');
    const resumeBtn = document.querySelector('.btn-resume');
    if (isPaused) {
        pauseBtn.style.display = 'none';
        resumeBtn.style.display = 'inline-block';
    } else {
        pauseBtn.style.display = 'inline-block';
        resumeBtn.style.display = 'none';
    }
    
    // Show notes if any
    displayNotes(phone);
    
    // Clear existing interval
    if (messagesRefreshInterval) {
        clearInterval(messagesRefreshInterval);
    }
    
    // Load messages
    await refreshMessages();
    
    // Auto-refresh every 3 seconds
    messagesRefreshInterval = setInterval(refreshMessages, 3000);
    
    // Mark active in list
    renderConversations();
}

// Refresh messages
async function refreshMessages() {
    if (!currentCustomer) return;
    
    try {
        const response = await fetch(`/api/dashboard/messages/${currentCustomer}`);
        const messages = await response.json();
        renderMessages(messages);
    } catch (error) {
        console.error('Error refreshing messages:', error);
    }
}

// Render messages
function renderMessages(messages) {
    const container = document.getElementById('messages-container');
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
    
    container.innerHTML = messages.map(msg => `
        <div class="message ${msg.type}">
            <div class="message-bubble">
                <div style="white-space: pre-wrap;">${escapeHtml(msg.text)}</div>
                <div class="message-time">
                    ${formatRelativeTime(msg.timestamp)}
                    ${msg.type === 'user' ? '<span class="message-status">✓✓</span>' : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    if (isAtBottom) {
        container.scrollTop = container.scrollHeight;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Send message
async function sendMessage() {
    const input = document.getElementById('reply-input');
    const message = input.value.trim();
    if (!message || !currentCustomer) return;
    
    try {
        await fetch('/api/dashboard/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: currentCustomer, message })
        });
        
        input.value = '';
        input.style.height = 'auto';
        await refreshMessages();
    } catch (error) {
        alert('Failed to send message: ' + error.message);
    }
}

// Handle Enter key
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
    
    // Auto-resize textarea
    event.target.style.height = 'auto';
    event.target.style.height = event.target.scrollHeight + 'px';
}

// Canned responses
function toggleCannedResponses() {
    const dropdown = document.getElementById('canned-dropdown');
    const isVisible = dropdown.classList.contains('show');
    
    if (isVisible) {
        dropdown.classList.remove('show');
    } else {
        renderCannedResponses();
        dropdown.classList.add('show');
    }
}

function renderCannedResponses() {
    const dropdown = document.getElementById('canned-dropdown');
    dropdown.innerHTML = cannedResponses.map((response, idx) => `
        <div class="canned-item" onclick="useCannedResponse(${idx})">
            <div class="canned-title">${response.title}</div>
            <div class="canned-text">${response.text}</div>
        </div>
    `).join('');
}

function useCannedResponse(index) {
    const response = cannedResponses[index];
    document.getElementById('reply-input').value = response.text;
    document.getElementById('canned-dropdown').classList.remove('show');
    document.getElementById('reply-input').focus();
}

// Notes
function displayNotes(phone) {
    const notes = customerNotes[phone] || [];
    const notesSection = document.getElementById('customer-notes');
    const notesList = document.getElementById('notes-list');
    
    if (notes.length === 0) {
        notesSection.classList.remove('show');
        return;
    }
    
    notesList.innerHTML = notes.map(note => `
        <div class="note-item">
            <strong>${note.date}</strong>: ${note.text}
        </div>
    `).join('');
    
    notesSection.classList.add('show');
}

function addNote() {
    const note = prompt('Add a note for this customer:');
    if (!note) return;
    
    if (!customerNotes[currentCustomer]) {
        customerNotes[currentCustomer] = [];
    }
    
    customerNotes[currentCustomer].push({
        text: note,
        date: new Date().toLocaleString()
    });
    
    localStorage.setItem('customerNotes', JSON.stringify(customerNotes));
    displayNotes(currentCustomer);
}

// Pause/Resume
async function pauseBot() {
    await fetch('/api/dashboard/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: currentCustomer })
    });
    
    document.querySelector('.btn-pause').style.display = 'none';
    document.querySelector('.btn-resume').style.display = 'inline-block';
    await loadConversations();
}

async function resumeBot() {
    await fetch('/api/dashboard/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: currentCustomer })
    });
    
    document.querySelector('.btn-pause').style.display = 'inline-block';
    document.querySelector('.btn-resume').style.display = 'none';
    await loadConversations();
}

// Close canned dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('canned-dropdown');
    const btn = document.querySelector('.btn-canned');
    
    if (dropdown && !dropdown.contains(e.target) && e.target !== btn) {
        dropdown.classList.remove('show');
    }
});
