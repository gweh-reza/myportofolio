// script.js - Portfolio Website JavaScript

// Portfolio data (default)
let portfolioWorks = [
    {
        id: 1,
        title: "Branding Startup Tech",
        category: "design",
        description: "Desain logo dan identitas visual lengkap untuk startup teknologi dengan konsep modern dan minimalis.",
        tools: "Adobe Illustrator, Photoshop",
        image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        date: "2024-01-15"
    },
    {
        id: 2,
        title: "Video Promosi Produk Skincare",
        category: "video",
        description: "Video promosi 60 detik untuk produk skincare dengan efek visual yang menarik dan musik yang engaging.",
        tools: "DaVinci Resolve, After Effects",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        date: "2024-02-20"
    },
    {
        id: 3,
        title: "Color Grading Film Drama Pendek",
        category: "davinci",
        description: "Color grading cinematic untuk film pendek drama dengan mood yang emosional dan visual yang menarik.",
        tools: "DaVinci Resolve Studio",
        image: "https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        date: "2024-03-10"
    },
    {
        id: 4,
        title: "Social Media Kit Fashion Brand",
        category: "design",
        description: "Paket desain lengkap untuk konten sosial media brand fashion dengan konsistensi visual yang kuat.",
        tools: "Photoshop, Illustrator, Canva",
        image: "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        date: "2024-03-25"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initMobileMenu();
    initPortfolio();
    initContactForm();
    initAdminPanel();
    initSmoothScroll();
    initScrollToTop();
    initActiveNav();
});

// ===== MOBILE MENU =====
function initMobileMenu() {
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
}

// ===== PORTFOLIO =====
function initPortfolio() {
    loadPortfolio();
    
    // Portfolio filter buttons
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
}

// Load works from localStorage
function loadPortfolio() {
    try {
        const saved = localStorage.getItem('portfolioWorks');
        if (saved) {
            portfolioWorks = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading portfolio:', error);
        // Keep default data
    }
    renderPortfolio();
}

// Save works to localStorage
function savePortfolio() {
    try {
        localStorage.setItem('portfolioWorks', JSON.stringify(portfolioWorks));
        updateWorksCount();
    } catch (error) {
        console.error('Error saving portfolio:', error);
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
                <p>Silakan tambahkan karya melalui mode admin</p>
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

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset errors
        clearErrors();
        
        // Get form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Validation
        let isValid = true;
        
        if (!name) {
            showError('nameError', 'Nama harus diisi');
            isValid = false;
        }
        
        if (!email) {
            showError('emailError', 'Email harus diisi');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('emailError', 'Email tidak valid');
            isValid = false;
        }
        
        if (!subject) {
            showError('subjectError', 'Subjek harus diisi');
            isValid = false;
        }
        
        if (!message) {
            showError('messageError', 'Pesan harus diisi');
            isValid = false;
        } else if (message.length < 10) {
            showError('messageError', 'Pesan minimal 10 karakter');
            isValid = false;
        }
        
        if (isValid) {
            // Simulate sending form data
            const formData = {
                name,
                email,
                subject,
                message,
                timestamp: new Date().toISOString()
            };
            
            // Save to localStorage (simulate database)
            saveContactMessage(formData);
            
            // Show success message
            showSuccess('formSuccess', 'Pesan berhasil dikirim! Saya akan menghubungi Anda segera.');
            
            // Reset form
            contactForm.reset();
            
            // Scroll to top of form
            contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
    document.getElementById('formSuccess').style.display = 'none';
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
    
    // Hide success message after 5 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function saveContactMessage(message) {
    try {
        const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push(message);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        console.log('Message saved:', message);
    } catch (error) {
        console.error('Error saving message:', error);
    }
}

// ===== ADMIN PANEL =====
function initAdminPanel() {
    const adminBtn = document.getElementById('adminBtn');
    const backBtn = document.getElementById('backToPortfolio');
    const addWorkForm = document.getElementById('addWorkForm');
    
    if (adminBtn) {
        adminBtn.addEventListener('click', function() {
            showAdminPanel();
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            hideAdminPanel();
        });
    }
    
    if (addWorkForm) {
        addWorkForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewWork();
        });
    }
    
    // Load admin works list
    loadAdminWorks();
}

function showAdminPanel() {
    document.getElementById('portfolio').style.display = 'none';
    document.getElementById('admin').style.display = 'block';
    loadAdminWorks();
    document.getElementById('admin').scrollIntoView({ behavior: 'smooth' });
}

function hideAdminPanel() {
    document.getElementById('admin').style.display = 'none';
    document.getElementById('portfolio').style.display = 'block';
    document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
}

function loadAdminWorks() {
    const worksList = document.getElementById('adminWorksList');
    if (!worksList) return;
    
    worksList.innerHTML = portfolioWorks.map(work => `
        <div class="work-item" data-id="${work.id}">
            <div class="work-item-header">
                <div class="work-item-title">${work.title}</div>
                <span class="work-item-category ${work.category}">${getCategoryName(work.category)}</span>
            </div>
            <p class="work-item-description">${work.description}</p>
            <div class="work-item-meta">
                <small><strong>Tools:</strong> ${work.tools}</small><br>
                <small><strong>Tanggal:</strong> ${formatDate(work.date)}</small>
            </div>
            <div class="work-item-actions">
                <button class="btn-danger" onclick="deleteWork(${work.id})">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </div>
        </div>
    `).join('');
    
    updateWorksCount();
}

function updateWorksCount() {
    const countElement = document.getElementById('worksCount');
    if (countElement) {
        countElement.textContent = `(${portfolioWorks.length} karya)`;
    }
}

function addNewWork() {
    const title = document.getElementById('workTitle').value.trim();
    const category = document.getElementById('workCategory').value;
    const description = document.getElementById('workDescription').value.trim();
    const tools = document.getElementById('workTools').value.trim();
    const image = document.getElementById('workImage').value.trim();
    
    // Validation
    if (!title || !category || !description || !tools || !image) {
        alert('Harap isi semua field!');
        return;
    }
    
    // URL validation
    if (!isValidUrl(image)) {
        alert('URL gambar tidak valid!');
        return;
    }
    
    // Create new work
    const newWork = {
        id: portfolioWorks.length > 0 ? Math.max(...portfolioWorks.map(w => w.id)) + 1 : 1,
        title,
        category,
        description,
        tools,
        image,
        date: new Date().toISOString().split('T')[0]
    };
    
    // Add to portfolio
    portfolioWorks.push(newWork);
    savePortfolio();
    
    // Update display
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter) {
        renderPortfolio(activeFilter.getAttribute('data-filter'));
    } else {
        renderPortfolio('all');
    }
    
    // Update admin list
    loadAdminWorks();
    
    // Reset form
    document.getElementById('addWorkForm').reset();
    
    // Show success message
    alert(`Karya "${title}" berhasil ditambahkan!`);
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function deleteWork(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus karya ini?')) {
        return;
    }
    
    portfolioWorks = portfolioWorks.filter(work => work.id !== id);
    savePortfolio();
    
    // Update portfolio display
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter) {
        renderPortfolio(activeFilter.getAttribute('data-filter'));
    } else {
        renderPortfolio('all');
    }
    
    // Update admin list
    loadAdminWorks();
    
    alert('Karya berhasil dihapus!');
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href.startsWith('#!')) {
                e.preventDefault();
                return;
            }
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ===== SCROLL TO TOP =====
function initScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
    
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== ACTIVE NAV LINK =====
function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.portfolioWorks = portfolioWorks;
window.loadPortfolio = loadPortfolio;
window.savePortfolio = savePortfolio;
window.renderPortfolio = renderPortfolio;
window.getCategoryName = getCategoryName;
window.addNewWork = addNewWork;
window.deleteWork = deleteWork;
window.loadAdminWorks = loadAdminWorks;