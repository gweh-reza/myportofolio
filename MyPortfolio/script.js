// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Load portfolio works
    loadPortfolio();
    
    // Portfolio filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter portfolio
            const filter = this.getAttribute('data-filter');
            renderPortfolio(filter);
        });
    });
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Portfolio data
let portfolioWorks = [
    {
        id: 1,
        title: "Branding Startup Tech",
        category: "design",
        description: "Desain logo dan identitas visual lengkap untuk startup teknologi.",
        tools: "Adobe Illustrator, Photoshop",
        image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        date: "2024-01-15"
    },
    {
        id: 2,
        title: "Video Promosi Produk",
        category: "video",
        description: "Video promosi 60 detik untuk produk skincare.",
        tools: "DaVinci Resolve, After Effects",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        date: "2024-02-20"
    }
];

// Load works from localStorage
function loadPortfolio() {
    const saved = localStorage.getItem('portfolioWorks');
    if (saved) {
        portfolioWorks = JSON.parse(saved);
    }
    renderPortfolio();
}

// Save works to localStorage
function savePortfolio() {
    localStorage.setItem('portfolioWorks', JSON.stringify(portfolioWorks));
    // Update admin if exists
    if (window.updateAdminWorks) {
        window.updateAdminWorks();
    }
}

// Render portfolio
function renderPortfolio(filter = 'all') {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    
    const filtered = filter === 'all' 
        ? portfolioWorks 
        : portfolioWorks.filter(w => w.category === filter);
    
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="text-center" style="grid-column: 1/-1; padding: 3rem; color: var(--gray);">
                <i class="fas fa-images" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h3>Belum ada karya di kategori ini</h3>
                <p>Silakan tambahkan karya melalui dashboard admin</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filtered.map(work => `
        <div class="portfolio-item" data-category="${work.category}">
            <img src="${work.image}" alt="${work.title}" class="portfolio-img">
            <div class="portfolio-info">
                <h3>${work.title}</h3>
                <p>${work.description}</p>
                <div class="portfolio-tags">
                    <span class="portfolio-tag">${work.tools}</span>
                    <span class="portfolio-tag">${getCategoryName(work.category)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function getCategoryName(category) {
    const names = {
        'design': 'Desain Grafis',
        'video': 'Video Editing',
        'davinci': 'DaVinci Resolve'
    };
    return names[category] || category;
}

// Add new work (called from admin)
window.addWork = function(newWork) {
    const maxId = portfolioWorks.length > 0 
        ? Math.max(...portfolioWorks.map(w => w.id)) 
        : 0;
    
    newWork.id = maxId + 1;
    portfolioWorks.push(newWork);
    savePortfolio();
    renderPortfolio();
    
    // Keep filter active
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter) {
        renderPortfolio(activeFilter.getAttribute('data-filter'));
    }
};

// Remove work (called from admin)
window.removeWork = function(id) {
    portfolioWorks = portfolioWorks.filter(w => w.id !== id);
    savePortfolio();
    
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter) {
        renderPortfolio(activeFilter.getAttribute('data-filter'));
    }
};

// Get all works (for admin)
window.getPortfolioWorks = function() {
    return portfolioWorks;
};

// Update works (for admin)
window.updateWorks = function(works) {
    portfolioWorks = works;
    savePortfolio();
    renderPortfolio();
};