document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    let artworks = [];
    let currentImageIndex = 0;
    let filteredArtworks = [];
    
    // All available paintings
    const paintings = ['(1)Eid Happiness.JPG','(2)Al houbara.JPG','(5)Al Halah.JPG','3 Piece View.png','A Car.png','Abstract.png','Abstract(2).png','Al Budaiya.png','Al Damah Game.png','Al Eid.png','Al Hunainia.png','Al Khalifa.png','Al Khamis Mosque.png','Al Nashel.png','Babco.png','Back Home.png','Bahraini and His Horse.png','Bapco Logo design.png','Beach Front.png','Boat.png','Bullhead.png','Bwanish(1).png','Bwanish(2).png','Bwanish(3).png','Bwanish(4).png','Bwanish(5).png','Cactus.png','Country Horses.png','Cupping.png','Delmon Heritage.png','Design_.png','Dirwazah.png','District in Manama.png','European Countryside.png','Falconry.png','Faskara Fish.png','Female.png','Fishermen_.png','Fishing.jpg','Foreign Girl.png','Form.png','Formation.png','Freej Gathering.png','Giveaway.png','Heritage Abstract.png','Heritage Design.png','Hoori_.png','Horse.png','Houbara(2).png','Houbara(3).png','Houses of The Past.png','In The Market.png','In The Market(2).png','In The Name Of Allah.png','Kaaba.png','Landscape(1).png','Landscape(3).png','Landscape(4).png','Landscape(5).png','Landscape(6).png','Landscape(7).png','Limbo.png','LOLO Bird.png','Min AlMahd.png','Mommy and Son.png','Motherhood.JPG','Mountain Houses.png','My Friend.png','National Day Celebrations.png','Noon Letter.png','On The Sea Beach.png','Oyster Split.png','Part of The Bull Head Statue.png','Pottery Vase.png','Predation_.png','Predatory Drawings.png','Predatory Drawings(2).png','Predatory Drawings(3).png','Preparing For Fishing.png','Rashed\'s Mother.png','Rocks.png','Safi Fish.png','Sea View_.png','Sheikh Abdulaziz Bin Mohammed.png','Shipbuilder.png','Shipbuilder Night.png','Side Portrait.png','Statue Design.png','Statue Design(2).png','Statue Design(3).png','Statue Design(4).png','Statue Design(5).png','Statue design(6).png','Statue Design(7).png','Still life.png','Tara Logo Design.png','Tarab Session.png','Tarab Session(2).png','Thank Be To Allah.png','The  Two Friends.png','The Banoosh Night.png','The Banoosh(1).png','The Banoosh(2).png','The Banoosh(3).png','The Banoosh(4).png','The Bird.png','The Boat.png','The Boat on The Beach.png','The Boats.png','The Boats(2).png','The Boats(3).png','The Boy(Abstract).png','The Camel.PNG','The Camel Racing.png','The Captive.png','The Carrier.png','The Castle.png','The Church.png','The Clown.png','The Cock.png','The Coffee Dallah_.png','The confused girl.JPG','The Convoy_.png','The Couple.png','The Diver.png','The Divers Guidence.png','The Falcon.png','The Falcon Head.png','The Falcon Statue.png','The Family.png','The Farm.png','The Farm(2).png','The Faskara and Shere Fish.png','The Fish Trap.png','The Fish Trap(2).png','The Flying Falcon.png','The Foreign Horse.png','The Friends.png','The Funeral.png','The Gergaoon Play.png','The Green Grocer.png','The Greens Grocer.png','The Grocer items.JPG','The Holy Quran Teacher.png','the Horse Head.png','The Houbara and The Falcon.png','The Jalboot Pulling.png','The Landscape(2).png','The Last Painting.png','The Lead.png','The Little Girl.png','The Lizard(1).png','The Lizard(2).png','The Lizard(3).png','The Lizard(4).png','The Lizard(5).png','The Luan(Zrnoog).jpg','The Man and The Camel.png','The March of Life.png','The meditating girl.png','The Mosque(1).png','The Mosque(2).png','The Newborn.png','The Oasis Ruins.png','The Old Door.png','The Old Lady at Night.png','The Prey.png','The Principal and The Student.png','The Principal and The Teacher.png','The Principal and The Teachers.png','The Sadu Tent.png','The Seabed.png','The Three Fish.png','The Traffic Man.png','The Traveler_.png','The Tree.png','The Two Birds.png','The Two Men.png','The Two Women.png','The Village(1).png','The Village(2).png','The War.png','The Water Stream(AlSaab).png','The Woman.png','The Woman and The Old Man.png','Things.png','Woman Portrait_.png','Women.png','Worries.png','Ya Jarheni.png'];
    
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
    
    const fallbackArtworks = paintings.map((painting, index) => {
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
    
    // Load artwork data from JSON
    async function loadArtworks() {
        try {
            const response = await fetch('data/artworks.json');
            if (!response.ok) throw new Error('Network response was not ok');
            artworks = await response.json();
            filteredArtworks = [...artworks];
            createGallery(artworks);
        } catch (error) {
            console.error('Error loading artworks:', error);
            artworks = fallbackArtworks;
            filteredArtworks = [...artworks];
            createGallery(artworks);
        }
    }
    
    // Create gallery cards from artwork data
    function createGallery(artworksToShow = artworks) {
        gallery.innerHTML = '';
        filteredArtworks = artworksToShow;
        
        artworksToShow.forEach((artwork, index) => {
            const card = document.createElement('div');
            card.className = 'card fade-in';
            
            const img = document.createElement('img');
            img.src = artwork.image;
            img.alt = artwork.title;
            img.loading = 'lazy';
            
            const info = document.createElement('div');
            info.className = 'card-info';
            
            const title = document.createElement('h3');
            title.className = 'card-title';
            title.textContent = artwork.title;
            
            const details = document.createElement('div');
            details.className = 'card-details';
            details.innerHTML = `
                <p class="artwork-type">${artwork.type}</p>
                <p class="artwork-medium">${artwork.medium}</p>
                <p class="artwork-size">${artwork.size}</p>
            `;
            
            info.appendChild(title);
            info.appendChild(details);
            card.appendChild(img);
            card.appendChild(info);
            
            // Add click event to open modal
            card.addEventListener('click', function() {
                currentImageIndex = artworks.findIndex(art => art.id === artwork.id);
                openModal(artwork);
            });
            
            gallery.appendChild(card);
            
            // Trigger animation
            setTimeout(() => card.classList.add('show'), index * 50);
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const filtered = artworks.filter(artwork => 
            artwork.title.toLowerCase().includes(searchTerm) ||
            artwork.type.toLowerCase().includes(searchTerm)
        );
        createGallery(filtered);
    });
    
    // Modal functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const closeBtn = document.getElementsByClassName('close')[0];
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    function openModal(artwork) {
        modal.style.display = 'block';
        modalImg.src = artwork.image;
        modalTitle.innerHTML = `
            <h3>${artwork.title}</h3>
            <p>${artwork.type} • ${artwork.medium} • ${artwork.size}</p>
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
    
    closeBtn.onclick = () => modal.style.display = 'none';
    prevBtn.onclick = showPrevImage;
    nextBtn.onclick = showNextImage;
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'Escape') modal.style.display = 'none';
        }
    });
    
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }
    
    // Initialize gallery
    loadArtworks();
});