// Complete S3 Gallery System
const S3_CONFIG = {
    bucketUrl: 'https://my-grandfather-art-gallery-and-media.s3.me-south-1.amazonaws.com',
    region: 'me-south-1'
};

const MEDIA_CATALOG = {
    paintings: [
        { key: '(1)Eid Happiness.JPG', title: 'Eid Happiness', size: 'large' },
        { key: '(2)Al houbara.JPG', title: 'Al Houbara', size: 'medium' },
        { key: '(5)Al Halah.JPG', title: 'Al Halah', size: 'large' },
        { key: 'Abstract.png', title: 'Abstract', size: 'medium' },
        { key: 'Abstract(2).png', title: 'Abstract 2', size: 'medium' },
        { key: 'Al Budaiya.png', title: 'Al Budaiya', size: 'large' },
        { key: 'Al Damah Game.png', title: 'Al Damah Game', size: 'medium' },
        { key: 'Al Eid.png', title: 'Al Eid', size: 'large' },
        { key: 'Al Hunainia.png', title: 'Al Hunainia', size: 'medium' },
        { key: 'Al Khalifa.png', title: 'Al Khalifa', size: 'large' },
        { key: 'Al Khamis Mosque.png', title: 'Al Khamis Mosque', size: 'medium' },
        { key: 'Al Nashel.png', title: 'Al Nashel', size: 'medium' },
        { key: 'Falconry.png', title: 'Falconry', size: 'small' },
        { key: 'The Diver.png', title: 'The Diver', size: 'medium' },
        { key: 'Motherhood.JPG', title: 'Motherhood', size: 'small' },
        { key: 'The Holy Quran Teacher.png', title: 'The Holy Quran Teacher', size: 'large' },
        { key: 'Shipbuilder.png', title: 'Shipbuilder', size: 'medium' }
    ],
    designs: [
        { key: 'Bapco Logo design.png', title: 'Bapco Logo Design', size: 'small' },
        { key: 'Statue Design.png', title: 'Statue Design 1', size: 'medium' },
        { key: 'Statue Design(2).png', title: 'Statue Design 2', size: 'medium' },
        { key: 'Statue Design(3).png', title: 'Statue Design 3', size: 'medium' },
        { key: 'Tara Logo Design.png', title: 'Tara Logo Design', size: 'small' },
        { key: '3 Piece View.png', title: '3 Piece View', size: 'large' }
    ],
    sketches: [
        { key: 'Bwanish(1).png', title: 'Bwanish Study 1', size: 'small' },
        { key: 'Bwanish(2).png', title: 'Bwanish Study 2', size: 'small' },
        { key: 'Bwanish(3).png', title: 'Bwanish Study 3', size: 'small' },
        { key: 'Bwanish(4).png', title: 'Bwanish Study 4', size: 'small' },
        { key: 'Bwanish(5).png', title: 'Bwanish Study 5', size: 'small' }
    ],
    photos: [
        { key: 'Screenshot_26-5-2025_193710_.jpeg', title: 'Artist Portrait', size: 'medium' },
        { key: 'BAH_P_142.jpg', title: 'Studio Documentation', size: 'large' },
        { key: 'Fishing.jpg', title: 'Reference Photo', size: 'medium' }
    ]
};

class S3Gallery {
    constructor() {
        this.currentCategory = 'paintings';
        this.currentIndex = 0;
        this.currentImages = [];
        this.imageCache = new Map();
        this.connectionStatus = 'online';
        this.init();
    }

    init() {
        this.createInterface();
        this.displayCategory('paintings');
        this.setupEventListeners();
        this.monitorConnection();
        this.startPreloading();
    }

    createInterface() {
        const container = document.querySelector('.container');
        const interfaceHTML = `
            <div class="s3-status-bar">
                <span class="connection-status online" id="connectionStatus">🟢 Connected to S3</span>
                <span class="cache-status" id="cacheStatus">Cache: 0 images</span>
            </div>
            <div class="gallery-tabs">
                <button class="tab-btn active" data-category="paintings">
                    <span>🎨</span> Paintings <span class="count">${MEDIA_CATALOG.paintings.length}</span>
                </button>
                <button class="tab-btn" data-category="designs">
                    <span>✏️</span> Designs <span class="count">${MEDIA_CATALOG.designs.length}</span>
                </button>
                <button class="tab-btn" data-category="sketches">
                    <span>📝</span> Sketches <span class="count">${MEDIA_CATALOG.sketches.length}</span>
                </button>
                <button class="tab-btn" data-category="photos">
                    <span>📷</span> Photos <span class="count">${MEDIA_CATALOG.photos.length}</span>
                </button>
            </div>
            <div class="loading-indicator" id="loadingIndicator">
                <div class="s3-spinner"></div>
                <p>Loading from S3...</p>
            </div>
        `;
        container.insertAdjacentHTML('afterbegin', interfaceHTML);
    }

    async displayCategory(category) {
        this.currentCategory = category;
        this.currentImages = MEDIA_CATALOG[category] || [];
        
        this.updateTabs(category);
        this.showLoading(true);
        
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.style.display = category === 'paintings' ? 'block' : 'none';
        }

        await this.renderGallery(this.currentImages);
        this.showLoading(false);
        this.updateCacheStatus();
    }

    updateTabs(activeCategory) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === activeCategory);
        });
    }

    async renderGallery(images) {
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';

        if (images.length === 0) {
            gallery.innerHTML = '<div class="no-results">📭 No items found in this category</div>';
            return;
        }

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < images.length; i++) {
            const item = images[i];
            const galleryItem = this.createGalleryItem(item, i);
            fragment.appendChild(galleryItem);
        }

        gallery.appendChild(fragment);
        this.animateItems();
    }

    createGalleryItem(item, index) {
        const element = document.createElement('div');
        element.className = 'gallery-item s3-item';
        
        const imageUrl = this.getImageUrl(item.key);
        
        element.innerHTML = `
            <div class="item-container">
                <div class="image-wrapper">
                    <img src="${imageUrl}" 
                         alt="${item.title}" 
                         loading="lazy"
                         onload="this.classList.add('loaded')"
                         onerror="this.parentElement.parentElement.classList.add('error')">
                    <div class="loading-overlay">
                        <div class="image-spinner"></div>
                    </div>
                </div>
                <div class="item-overlay">
                    <h3 class="item-title">${item.title}</h3>
                    <div class="item-meta">
                        <span class="item-category">${this.currentCategory.slice(0, -1)}</span>
                        <span class="item-size">${item.size}</span>
                        <span class="s3-indicator">☁️</span>
                    </div>
                </div>
            </div>
        `;
        
        element.addEventListener('click', () => this.openModal(index));
        return element;
    }

    getImageUrl(key) {
        return `${S3_CONFIG.bucketUrl}/${encodeURIComponent(key)}`;
    }

    getThumbnailUrl(key) {
        // For basic S3 without image processing, use original
        return this.getImageUrl(key);
    }

    async preloadImage(key) {
        const url = this.getImageUrl(key);
        if (this.imageCache.has(url)) return;
        
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                this.imageCache.set(url, img);
                this.updateCacheStatus();
                resolve();
            };
            img.onerror = () => resolve();
            img.src = url;
        });
    }

    startPreloading() {
        // Preload current category images
        this.currentImages.slice(0, 6).forEach(item => {
            this.preloadImage(item.key);
        });
    }

    animateItems() {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            setTimeout(() => item.classList.add('show'), index * 100);
        });
    }

    async openModal(index) {
        this.currentIndex = index;
        const item = this.currentImages[index];
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const caption = document.getElementById('caption');
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        modalImg.style.opacity = '0.5';
        modalImg.classList.add('loading');
        
        const imageUrl = this.getImageUrl(item.key);
        
        // Preload if not cached
        if (!this.imageCache.has(imageUrl)) {
            await this.preloadImage(item.key);
        }
        
        modalImg.src = imageUrl;
        modalImg.onload = () => {
            modalImg.style.opacity = '1';
            modalImg.classList.remove('loading');
        };
        
        caption.innerHTML = `
            <h3>${item.title}</h3>
            <p>${this.currentCategory.slice(0, -1)} • ${index + 1} of ${this.currentImages.length} • ${item.size}</p>
            <small>📍 Loaded from S3 ${S3_CONFIG.region}</small>
        `;
        
        this.updateNavButtons();
        this.preloadAdjacent();
    }

    preloadAdjacent() {
        const prev = this.currentIndex - 1;
        const next = this.currentIndex + 1;
        
        if (prev >= 0) this.preloadImage(this.currentImages[prev].key);
        if (next < this.currentImages.length) this.preloadImage(this.currentImages[next].key);
    }

    closeModal() {
        document.getElementById('imageModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    nextImage() {
        if (this.currentIndex < this.currentImages.length - 1) {
            this.openModal(this.currentIndex + 1);
        }
    }

    prevImage() {
        if (this.currentIndex > 0) {
            this.openModal(this.currentIndex - 1);
        }
    }

    updateNavButtons() {
        const prevBtn = document.querySelector('.modal-nav.prev');
        const nextBtn = document.querySelector('.modal-nav.next');
        
        if (prevBtn) prevBtn.style.opacity = this.currentIndex > 0 ? '1' : '0.3';
        if (nextBtn) nextBtn.style.opacity = this.currentIndex < this.currentImages.length - 1 ? '1' : '0.3';
    }

    searchPaintings() {
        if (this.currentCategory !== 'paintings') return;
        
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filtered = MEDIA_CATALOG.paintings.filter(item => 
            item.title.toLowerCase().includes(searchTerm)
        );
        this.renderGallery(filtered);
        this.currentImages = filtered;
    }

    showLoading(show) {
        const indicator = document.getElementById('loadingIndicator');
        if (indicator) {
            indicator.style.display = show ? 'flex' : 'none';
        }
    }

    updateCacheStatus() {
        const status = document.getElementById('cacheStatus');
        if (status) {
            status.textContent = `Cache: ${this.imageCache.size} images`;
        }
    }

    monitorConnection() {
        const updateStatus = (online) => {
            const status = document.getElementById('connectionStatus');
            if (status) {
                status.className = `connection-status ${online ? 'online' : 'offline'}`;
                status.textContent = online ? '🟢 Connected to S3' : '🔴 Connection Lost';
            }
        };

        window.addEventListener('online', () => updateStatus(true));
        window.addEventListener('offline', () => updateStatus(false));
    }

    setupEventListeners() {
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tab-btn')) {
                const btn = e.target.closest('.tab-btn');
                this.displayCategory(btn.dataset.category);
            }
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.searchPaintings());
        }

        // Modal controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close')) this.closeModal();
            if (e.target.classList.contains('prev')) this.prevImage();
            if (e.target.classList.contains('next')) this.nextImage();
        });

        // Modal backdrop
        const modal = document.getElementById('imageModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('imageModal');
            if (modal && modal.style.display === 'block') {
                if (e.key === 'Escape') this.closeModal();
                if (e.key === 'ArrowRight') this.nextImage();
                if (e.key === 'ArrowLeft') this.prevImage();
            }
        });

        // Touch gestures
        this.setupTouchGestures();
    }

    setupTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.addEventListener('touchend', (e) => {
            const modal = document.getElementById('imageModal');
            if (modal && modal.style.display === 'block') {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) this.nextImage();
                    else this.prevImage();
                }
            }
        });
    }
}

// Initialize S3 Gallery
document.addEventListener('DOMContentLoaded', () => {
    new S3Gallery();
});