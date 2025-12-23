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
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
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
            if (this.getAttribute('href') === '#' || this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                alert('Harap isi semua field yang diperlukan!');
                return;
            }
            
            // Show success message
            alert('Pesan berhasil dikirim! Terima kasih telah menghubungi.');
            
            // Reset form
            this.reset();
            
            // In production, you would send data to a server here
            console.log('Form data:', data);
        });
    });
    
    // Active nav link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link.active').forEach(link => {
                    link.classList.remove('active');
                });
                document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
            }
        });
    });
});

// Portfolio data (default)
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
    },
    {
        id: 3,
        title: "Color Grading Film Pendek",
        category: "davinci",
        description: "Color grading untuk film pendek drama menggunakan DaVinci Resolve.",
        tools: "DaVinci Resolve Studio",
        image: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        date: "2024-03-10"
    }
];

// Load works from localStorage
function loadPortfolio() {
    try {
        const saved = localStorage.getItem('portfolioWorks');
        if (saved) {
            portfolioWorks = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading portfolio from localStorage:', error);
        // Keep default data
    }
    renderPortfolio();
}

// Save works to localStorage
function savePortfolio() {
    try {
        localStorage.setItem('portfolioWorks', JSON.stringify(portfolioWorks));
    } catch (error) {
        console.error('Error saving portfolio to localStorage:', error);
    }
    
    // Update admin if exists
    if (typeof window.updateAdminWorks === 'function') {
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
            <div class="empty-portfolio">
                <i class="fas fa-images"></i>
                <h3>Belum ada karya di kategori ini</h3>
                <p>Silakan tambahkan karya melalui dashboard admin</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = filtered.map(work => `
        <div class="portfolio-item" data-category="${work.category}">
            <img src="${work.image}" alt="${work.title}" class="portfolio-img" loading="lazy">
            <div class="portfolio-info">
                <h3>${work.title}</h3>
                <p>${work.description}</p>
                <div class="portfolio-meta">
                    <span class="portfolio-date"><i class="far fa-calendar"></i> ${formatDate(work.date)}</span>
                    <span class="portfolio-tools"><i class="fas fa-tools"></i> ${work.tools}</span>
                </div>
                <div class="portfolio-tags">
                    <span class="portfolio-tag ${work.category}">${getCategoryName(work.category)}</span>
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

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Add new work (called from admin)
window.addWork = function(newWork) {
    const maxId = portfolioWorks.length > 0 
        ? Math.max(...portfolioWorks.map(w => w.id)) 
        : 0;
    
    newWork.id = maxId + 1;
    
    // Add current date if not provided
    if (!newWork.date) {
        newWork.date = new Date().toISOString().split('T')[0];
    }
    
    portfolioWorks.push(newWork);
    savePortfolio();
    
    // Keep filter active
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter) {
        renderPortfolio(activeFilter.getAttribute('data-filter'));
    } else {
        renderPortfolio('all');
    }
    
    // Show success message
    alert(`Karya "${newWork.title}" berhasil ditambahkan!`);
};

// Remove work (called from admin)
window.removeWork = function(id) {
    const work = portfolioWorks.find(w => w.id === id);
    if (work && confirm(`Apakah Anda yakin ingin menghapus karya "${work.title}"?`)) {
        portfolioWorks = portfolioWorks.filter(w => w.id !== id);
        savePortfolio();
        
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter) {
            renderPortfolio(activeFilter.getAttribute('data-filter'));
        } else {
            renderPortfolio('all');
        }
        
        alert('Karya berhasil dihapus!');
    }
};

// Get all works (for admin)
window.getPortfolioWorks = function() {
    return [...portfolioWorks]; // Return copy
};

// Update works (for admin)
window.updateWorks = function(works) {
    portfolioWorks = [...works];
    savePortfolio();
    
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter) {
        renderPortfolio(activeFilter.getAttribute('data-filter'));
    } else {
        renderPortfolio('all');
    }
    
    alert('Portofolio berhasil diperbarui!');
};

// Initialize portfolio on page load
if (document.getElementById('portfolioGrid')) {
    loadPortfolio();
}

// Export for Node.js/CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        portfolioWorks,
        loadPortfolio,
        savePortfolio,
        renderPortfolio,
        getCategoryName,
        addWork: window.addWork,
        removeWork: window.removeWork,
        getPortfolioWorks: window.getPortfolioWorks,
        updateWorks: window.updateWorks
    };
}
