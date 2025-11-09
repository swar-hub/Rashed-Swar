// Enhanced gallery with improved UX features
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    let artworks = [];
    let currentImageIndex = 0;
    let filteredArtworks = [];
    let isLoading = false;
    
    // Enhanced loading with skeleton screens
    function showLoadingState() {
        gallery.innerHTML = Array(6).fill().map(() => `
            <div class="card skeleton">
                <div class="skeleton-image"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                </div>
            </div>
        `).join('');
    }
    
    // Lazy loading with intersection observer
    function setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Enhanced search with debouncing
    let searchTimeout;
    function debounceSearch(func, delay) {
        return function(...args) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    // Filter functionality
    function createFilters() {
        const types = [...new Set(artworks.map(art => art.type))];
        const mediums = [...new Set(artworks.map(art => art.medium))];
        
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        filterContainer.innerHTML = `
            <div class="filter-group">
                <label>Type:</label>
                <select id="typeFilter">
                    <option value="">All Types</option>
                    ${types.map(type => `<option value="${type}">${type}</option>`).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label>Medium:</label>
                <select id="mediumFilter">
                    <option value="">All Mediums</option>
                    ${mediums.map(medium => `<option value="${medium}">${medium}</option>`).join('')}
                </select>
            </div>
            <button id="clearFilters" class="clear-btn">Clear All</button>
        `;
        
        document.querySelector('.search-container').appendChild(filterContainer);
        
        // Filter event listeners
        document.getElementById('typeFilter').addEventListener('change', applyFilters);
        document.getElementById('mediumFilter').addEventListener('change', applyFilters);
        document.getElementById('clearFilters').addEventListener('click', clearFilters);
    }
    
    function applyFilters() {
        const typeFilter = document.getElementById('typeFilter').value;
        const mediumFilter = document.getElementById('mediumFilter').value;
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        
        let filtered = artworks.filter(artwork => {
            const matchesType = !typeFilter || artwork.type === typeFilter;
            const matchesMedium = !mediumFilter || artwork.medium === mediumFilter;
            const matchesSearch = !searchTerm || 
                artwork.title.toLowerCase().includes(searchTerm) ||
                artwork.type.toLowerCase().includes(searchTerm);
            
            return matchesType && matchesMedium && matchesSearch;
        });
        
        createGallery(filtered);
        updateResultsCount(filtered.length);
    }
    
    function clearFilters() {
        document.getElementById('typeFilter').value = '';
        document.getElementById('mediumFilter').value = '';
        document.getElementById('searchInput').value = '';
        createGallery(artworks);
        updateResultsCount(artworks.length);
    }
    
    function updateResultsCount(count) {
        let counter = document.getElementById('resultsCounter');
        if (!counter) {
            counter = document.createElement('div');
            counter.id = 'resultsCounter';
            counter.className = 'results-counter';
            document.querySelector('.gallery-title').after(counter);
        }
        counter.textContent = `${count} artwork${count !== 1 ? 's' : ''} found`;
    }
    
    // Enhanced gallery creation with animations
    function createGallery(artworksToShow = artworks) {
        if (isLoading) return;
        
        gallery.innerHTML = '';
        filteredArtworks = artworksToShow;
        
        if (artworksToShow.length === 0) {
            gallery.innerHTML = `
                <div class="no-results">
                    <h3>No artworks found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }
        
        artworksToShow.forEach((artwork, index) => {
            const card = document.createElement('div');
            card.className = 'card fade-in';
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index * 100).toString());
            
            card.innerHTML = `
                <div class="card-image-container">
                    <img data-src="${artwork.image}" 
                         src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3C/svg%3E"
                         alt="${artwork.title}" 
                         class="lazy"
                         loading="lazy">
                    <div class="card-overlay">
                        <button class="view-btn" aria-label="View ${artwork.title}">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="card-info">
                    <h3 class="card-title">${artwork.title}</h3>
                    <div class="card-details">
                        <p class="artwork-type">${artwork.type}</p>
                        <p class="artwork-medium">${artwork.medium}</p>
                        <p class="artwork-size">${artwork.size}</p>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', function() {
                currentImageIndex = artworks.findIndex(art => art.id === artwork.id);
                openModal(artwork);
            });
            
            gallery.appendChild(card);
            
            setTimeout(() => card.classList.add('show'), index * 50);
        });
        
        setupLazyLoading();
    }
    
    // Enhanced modal with keyboard navigation and touch gestures
    function setupModal() {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const closeBtn = document.getElementsByClassName('close')[0];
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        // Touch gesture support
        let touchStartX = 0;
        let touchEndX = 0;
        
        modal.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        modal.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        });
        
        function handleGesture() {
            if (touchEndX < touchStartX - 50) showNextImage();
            if (touchEndX > touchStartX + 50) showPrevImage();
        }
        
        // Enhanced keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (modal.style.display === 'block') {
                switch(e.key) {
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        showPrevImage();
                        break;
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        showNextImage();
                        break;
                    case 'Escape':
                        e.preventDefault();
                        closeModal();
                        break;
                    case ' ':
                        e.preventDefault();
                        showNextImage();
                        break;
                }
            }
        });
        
        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        closeBtn.onclick = closeModal;
        prevBtn.onclick = showPrevImage;
        nextBtn.onclick = showNextImage;
        
        modal.onclick = function(event) {
            if (event.target === modal) closeModal();
        };
    }
    
    function openModal(artwork) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        modalImg.src = artwork.image;
        modalTitle.innerHTML = `
            <h3>${artwork.title}</h3>
            <div class="modal-details">
                <span class="detail-item">${artwork.type}</span>
                <span class="detail-separator">•</span>
                <span class="detail-item">${artwork.medium}</span>
                <span class="detail-separator">•</span>
                <span class="detail-item">${artwork.size}</span>
            </div>
        `;
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + artworks.length) % artworks.length;
        openModal(artworks[currentImageIndex]);
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % artworks.length;
        openModal(artworks[currentImageIndex]);
    }
    
    // Load artworks with enhanced error handling
    async function loadArtworks() {
        showLoadingState();
        isLoading = true;
        
        try {
            const response = await fetch('data/artworks.json');
            if (!response.ok) throw new Error('Network response was not ok');
            artworks = await response.json();
            filteredArtworks = [...artworks];
            createGallery(artworks);
            createFilters();
            updateResultsCount(artworks.length);
        } catch (error) {
            console.error('Error loading artworks:', error);
            // Use fallback data with all paintings
            artworks = generateFallbackArtworks();
            filteredArtworks = [...artworks];
            createGallery(artworks);
            createFilters();
            updateResultsCount(artworks.length);
        } finally {
            isLoading = false;
        }
    }
    
    // Generate comprehensive fallback data
    function generateFallbackArtworks() {
        const paintings = ['(1)Eid Happiness.JPG','(2)Al houbara.JPG','(5)Al Halah.JPG','3 Piece View.png','A Car.png','Abstract.png','Abstract(2).png','Al Budaiya.png','Al Damah Game.png','Al Eid.png','Al Hunainia.png','Al Khalifa.png','Al Khamis Mosque.png','Al Nashel.png','Babco.png','Back Home.png','Bahraini and His Horse.png','Bapco Logo design.png','Beach Front.png','Boat.png','Bullhead.png','Bwanish(1).png','Bwanish(2).png','Bwanish(3).png','Bwanish(4).png','Bwanish(5).png','Cactus.png','Country Horses.png','Cupping.png','Delmon Heritage.png','Design_.png','Dirwazah.png','District in Manama.png','European Countryside.png','Falconry.png','Faskara Fish.png','Female.png','Fishermen_.png','Fishing.jpg','Foreign Girl.png','Form.png','Formation.png','Freej Gathering.png','Giveaway.png','Heritage Abstract.png','Heritage Design.png','Hoori_.png','Horse.png','Houbara(2).png','Houbara(3).png','Houses of The Past.png','In The Market.png','In The Market(2).png','In The Name Of Allah.png','Kaaba.png','Landscape(1).png','Landscape(3).png','Landscape(4).png','Landscape(5).png','Landscape(6).png','Landscape(7).png','Limbo.png','LOLO Bird.png','Min AlMahd.png','Mommy and Son.png','Motherhood.JPG','Mountain Houses.png','My Friend.png','National Day Celebrations.png','Noon Letter.png','On The Sea Beach.png','Oyster Split.png','Part of The Bull Head Statue.png','Pottery Vase.png','Predation_.png','Predatory Drawings.png','Predatory Drawings(2).png','Predatory Drawings(3).png','Preparing For Fishing.png','Rashed\'s Mother.png','Rocks.png','Safi Fish.png','Sea View_.png','Sheikh Abdulaziz Bin Mohammed.png','Shipbuilder.png','Shipbuilder Night.png','Side Portrait.png','Statue Design.png','Statue Design(2).png','Statue Design(3).png','Statue Design(4).png','Statue Design(5).png','Statue design(6).png','Statue Design(7).png','Still life.png','Tara Logo Design.png','Tarab Session.png','Tarab Session(2).png','Thank Be To Allah.png','The  Two Friends.png','The Banoosh Night.png','The Banoosh(1).png','The Banoosh(2).png','The Banoosh(3).png','The Banoosh(4).png','The Bird.png','The Boat.png','The Boat on The Beach.png','The Boats.png','The Boats(2).png','The Boats(3).png','The Boy(Abstract).png','The Camel.PNG','The Camel Racing.png','The Captive.png','The Carrier.png','The Castle.png','The Church.png','The Clown.png','The Cock.png','The Coffee Dallah_.png','The confused girl.JPG','The Convoy_.png','The Couple.png','The Diver.png','The Divers Guidence.png','The Falcon.png','The Falcon Head.png','The Falcon Statue.png','The Family.png','The Farm.png','The Farm(2).png','The Faskara and Shere Fish.png','The Fish Trap.png','The Fish Trap(2).png','The Flying Falcon.png','The Foreign Horse.png','The Friends.png','The Funeral.png','The Gergaoon Play.png','The Green Grocer.png','The Greens Grocer.png','The Grocer items.JPG','The Holy Quran Teacher.png','the Horse Head.png','The Houbara and The Falcon.png','The Jalboot Pulling.png','The Landscape(2).png','The Last Painting.png','The Lead.png','The Little Girl.png','The Lizard(1).png','The Lizard(2).png','The Lizard(3).png','The Lizard(4).png','The Lizard(5).png','The Luan(Zrnoog).jpg','The Man and The Camel.png','The March of Life.png','The meditating girl.png','The Mosque(1).png','The Mosque(2).png','The Newborn.png','The Oasis Ruins.png','The Old Door.png','The Old Lady at Night.png','The Prey.png','The Principal and The Student.png','The Principal and The Teacher.png','The Principal and The Teachers.png','The Sadu Tent.png','The Seabed.png','The Three Fish.png','The Traffic Man.png','The Traveler_.png','The Tree.png','The Two Birds.png','The Two Men.png','The Two Women.png','The Village(1).png','The Village(2).png','The War.png','The Water Stream(AlSaab).png','The Woman.png','The Woman and The Old Man.png','Things.png','Woman Portrait_.png','Women.png','Worries.png','Ya Jarheni.png'];
        
        return paintings.map((painting, index) => {
            const info = getArtworkInfo(painting);
            return {
                id: index + 1,
                title: painting.replace(/\.(png|jpg|JPG|PNG)$/i, ''),
                image: `images/${painting}`,
                type: info.type,
                medium: info.medium,
                size: info.size
            };
        });
    }
    
    function getArtworkInfo(filename) {
        const name = filename.replace(/\.(png|jpg|JPG|PNG)$/i, '').toLowerCase();
        let type = 'Oil Painting', medium = 'Oil on Canvas', size = '50 × 70 cm';
        
        if (name.includes('abstract') || name.includes('form')) {
            type = 'Abstract Art'; medium = 'Mixed Media'; size = '60 × 80 cm';
        } else if (name.includes('statue') || name.includes('design') || name.includes('logo')) {
            type = 'Design Study'; medium = 'Pencil & Charcoal'; size = '30 × 40 cm';
        } else if (name.includes('landscape') || name.includes('mountain') || name.includes('countryside') || name.includes('village') || name.includes('oasis')) {
            type = 'Landscape'; medium = 'Watercolor'; size = '50 × 70 cm';
        } else if (name.includes('portrait') || name.includes('mother') || name.includes('girl') || name.includes('woman') || name.includes('man') || name.includes('couple') || name.includes('family') || name.includes('friends') || name.includes('clown')) {
            type = 'Portrait'; medium = 'Oil on Canvas'; size = '40 × 60 cm';
        } else if (name.includes('allah') || name.includes('quran') || name.includes('calligraphy') || name.includes('thank be to allah')) {
            type = 'Islamic Calligraphy'; medium = 'Ink & Gold Leaf'; size = '35 × 50 cm';
        } else if (name.includes('mosque') || name.includes('church') || name.includes('castle') || name.includes('door') || name.includes('houses')) {
            type = 'Architecture'; medium = 'Watercolor'; size = '45 × 65 cm';
        } else if (name.includes('falcon') || name.includes('bird') || name.includes('camel') || name.includes('horse') || name.includes('houbara') || name.includes('cock') || name.includes('lizard')) {
            type = 'Wildlife Art'; medium = 'Oil on Canvas'; size = '50 × 70 cm';
        } else if (name.includes('boat') || name.includes('diver') || name.includes('fish') || name.includes('sea') || name.includes('beach') || name.includes('shipbuilder') || name.includes('jalboot')) {
            type = 'Maritime Heritage'; medium = 'Oil on Canvas'; size = '60 × 90 cm';
        } else if (name.includes('still life') || name.includes('pottery') || name.includes('vase') || name.includes('things')) {
            type = 'Still Life'; medium = 'Oil on Canvas'; size = '40 × 50 cm';
        } else if (name.includes('market') || name.includes('grocer') || name.includes('teacher') || name.includes('student') || name.includes('session') || name.includes('gathering') || name.includes('celebration')) {
            type = 'Cultural Scene'; medium = 'Oil on Canvas'; size = '70 × 100 cm';
        }
        
        return { type, medium, size };
    }
    
    // Enhanced search with debouncing
    const searchInput = document.getElementById('searchInput');
    const debouncedSearch = debounceSearch(applyFilters, 300);
    searchInput.addEventListener('input', debouncedSearch);
    
    // Initialize
    setupModal();
    loadArtworks();
});