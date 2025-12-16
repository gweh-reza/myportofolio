// admin.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginScreen = document.getElementById('loginScreen');
    const dashboard = document.getElementById('dashboard');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const uploadForm = document.getElementById('uploadForm');
    const uploadMessage = document.getElementById('uploadMessage');
    const worksList = document.getElementById('worksList');
    const worksCount = document.getElementById('worksCount');
    const backupBtn = document.getElementById('backupBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    
    // Check if already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }
    
    // Login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Simple authentication
            if (username === 'admin' && password === 'password123') {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', username);
                showDashboard();
            } else {
                alert('Username atau password salah!');
            }
        });
    }
    
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            localStorage.removeItem('adminUsername');
            location.reload();
        });
    }
    
    // Tab switching
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                // Remove active class from all
                sidebarLinks.forEach(l => l.classList.remove('active'));
                tabContents.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId + 'Tab').classList.add('active');
                
                // Load data if needed
                if (tabId === 'manage') {
                    loadWorksList();
                }
            }
        });
    });
    
    // Upload form
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const work = {
                title: document.getElementById('workTitle').value,
                category: document.getElementById('workCategory').value,
                description: document.getElementById('workDescription').value,
                tools: document.getElementById('workTools').value,
                image: document.getElementById('workImage').value,
                date: document.getElementById('workDate').value || new Date().toISOString().split('T')[0]
            };
            
            // Validate
            if (!work.title || !work.category || !work.description || !work.tools || !work.image) {
                showMessage('Harap isi semua field yang diperlukan!', 'error');
                return;
            }
            
            // Add work
            if (window.addWork) {
                window.addWork(work);
                showMessage('Karya berhasil ditambahkan!', 'success');
                uploadForm.reset();
                
                // Switch to manage tab
                document.querySelector('.sidebar-link[data-tab="manage"]').click();
            } else {
                showMessage('Error: Tidak dapat menambahkan karya', 'error');
            }
        });
    }
    
    // Backup data
    if (backupBtn) {
        backupBtn.addEventListener('click', function() {
            const works = window.getPortfolioWorks ? window.getPortfolioWorks() : [];
            const dataStr = JSON.stringify(works, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = 'portfolio-backup-' + new Date().toISOString().split('T')[0] + '.json';
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            showMessage('Backup berhasil diunduh!', 'success');
        });
    }
    
    // Import data
    if (importBtn) {
        importBtn.addEventListener('click', function() {
            importFile.click();
        });
        
        importFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(event) {
                try {
                    const works = JSON.parse(event.target.result);
                    
                    if (window.updateWorks) {
                        if (confirm('Import data akan mengganti semua karya yang ada. Lanjutkan?')) {
                            window.updateWorks(works);
                            showMessage('Data berhasil diimport!', 'success');
                            loadWorksList();
                        }
                    }
                } catch (error) {
                    showMessage('Error: File tidak valid', 'error');
                }
            };
            reader.readAsText(file);
        });
    }
    
    // Load works for manage tab
    function loadWorksList() {
        if (!worksList) return;
        
        const works = window.getPortfolioWorks ? window.getPortfolioWorks() : [];
        const searchTerm = document.getElementById('searchWorks')?.value.toLowerCase() || '';
        const filterCategory = document.getElementById('filterCategory')?.value || 'all';
        
        // Update count
        if (worksCount) {
            worksCount.textContent = works.length;
        }
        
        // Filter works
        let filteredWorks = works;
        
        if (searchTerm) {
            filteredWorks = filteredWorks.filter(work => 
                work.title.toLowerCase().includes(searchTerm) ||
                work.description.toLowerCase().includes(searchTerm) ||
                work.tools.toLowerCase().includes(searchTerm)
            );
        }
        
        if (filterCategory !== 'all') {
            filteredWorks = filteredWorks.filter(work => work.category === filterCategory);
        }
        
        // Render works
        if (filteredWorks.length === 0) {
            worksList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>Tidak ada karya</h3>
                    <p>Belum ada karya yang diupload</p>
                </div>
            `;
            return;
        }
        
        worksList.innerHTML = filteredWorks.map(work => `
            <div class="work-item">
                <img src="${work.image}" alt="${work.title}" class="work-thumb">
                <div class="work-content">
                    <h4>${work.title}</h4>
                    <p>${work.description}</p>
                    <div class="work-meta">
                        <span>${getCategoryName(work.category)}</span>
                        <span>${work.date}</span>
                        <span>${work.tools}</span>
                    </div>
                </div>
                <div class="work-actions">
                    <button class="action-btn edit-btn" onclick="editWork(${work.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteWork(${work.id})">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners for search and filter
        const searchInput = document.getElementById('searchWorks');
        const filterSelect = document.getElementById('filterCategory');
        
        if (searchInput) {
            searchInput.addEventListener('input', loadWorksList);
        }
        
        if (filterSelect) {
            filterSelect.addEventListener('change', loadWorksList);
        }
    }
    
    // Show dashboard
    function showDashboard() {
        loginScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
        
        // Set username
        const username = localStorage.getItem('adminUsername') || 'Admin';
        document.getElementById('currentUser').textContent = username;
        
        // Load initial data
        loadWorksList();
    }
    
    // Show message
    function showMessage(text, type) {
        if (!uploadMessage) return;
        
        uploadMessage.textContent = text;
        uploadMessage.className = 'message ' + type;
        
        setTimeout(() => {
            uploadMessage.className = 'message';
            uploadMessage.textContent = '';
        }, 3000);
    }
    
    // Get category name
    function getCategoryName(category) {
        const names = {
            'design': 'Desain Grafis',
            'video': 'Video Editing',
            'davinci': 'DaVinci Resolve'
        };
        return names[category] || category;
    }
    
    // Global functions for works
    window.editWork = function(id) {
        const works = window.getPortfolioWorks ? window.getPortfolioWorks() : [];
        const work = works.find(w => w.id === id);
        
        if (work) {
            // Switch to upload tab
            document.querySelector('.sidebar-link[data-tab="upload"]').click();
            
            // Fill form
            document.getElementById('workTitle').value = work.title;
            document.getElementById('workCategory').value = work.category;
            document.getElementById('workDescription').value = work.description;
            document.getElementById('workTools').value = work.tools;
            document.getElementById('workImage').value = work.image;
            document.getElementById('workDate').value = work.date;
            
            // Change submit button
            const submitBtn = document.querySelector('#uploadForm button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Karya';
            submitBtn.onclick = function(e) {
                e.preventDefault();
                
                // Update work
                const updatedWork = {
                    title: document.getElementById('workTitle').value,
                    category: document.getElementById('workCategory').value,
                    description: document.getElementById('workDescription').value,
                    tools: document.getElementById('workTools').value,
                    image: document.getElementById('workImage').value,
                    date: document.getElementById('workDate').value,
                    id: id
                };
                
                // Update in array
                const updatedWorks = works.map(w => w.id === id ? updatedWork : w);
                
                if (window.updateWorks) {
                    window.updateWorks(updatedWorks);
                    showMessage('Karya berhasil diupdate!', 'success');
                    
                    // Reset form
                    uploadForm.reset();
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Upload Karya';
                    submitBtn.onclick = null;
                    
                    // Switch back to manage
                    document.querySelector('.sidebar-link[data-tab="manage"]').click();
                }
            };
        }
    };
    
    window.deleteWork = function(id) {
        if (confirm('Apakah Anda yakin ingin menghapus karya ini?')) {
            if (window.removeWork) {
                window.removeWork(id);
                loadWorksList();
                showMessage('Karya berhasil dihapus!', 'success');
            }
        }
    };
    
    // Update admin when works change
    window.updateAdminWorks = function() {
        loadWorksList();
    };
});