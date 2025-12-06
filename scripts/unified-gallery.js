// Unified Gallery - All Artworks
const ALL_ARTWORKS = [
    '(1)Eid Happiness.JPG', '(2)Al houbara.JPG', '(5)Al Halah.JPG', '3 Piece View.png', 'A Car.png',
    'Abstract.png', 'Abstract(2).png', 'Al Budaiya.png', 'Al Damah Game.png', 'Al Eid.png',
    'Al Hunainia.png', 'Al Khalifa.png', 'Al Khamis Mosque.png', 'Al Nashel.png', 'Babco.png',
    'Back Home.png', 'Bahraini and His Horse.png', 'Bapco Logo design.png', 'Beach Front.png', 'Boat.png',
    'Bullhead.png', 'Bwanish(1).png', 'Bwanish(2).png', 'Bwanish(3).png', 'Bwanish(4).png',
    'Bwanish(5).png', 'Cactus.png', 'Country Horses.png', 'Cupping.png', 'Delmon Heritage.png',
    'Design_.png', 'Dirwazah.png', 'District in Manama.png', 'European Countryside.png', 'Falconry.png',
    'Faskara Fish.png', 'Female.png', 'Fishermen_.png', 'Fishing.jpg', 'Foreign Girl.png',
    'Form.png', 'Formation.png', 'Freej Gathering.png', 'Giveaway.png', 'Heritage Abstract.png',
    'Heritage Design.png', 'Hoori_.png', 'Horse.png', 'Houbara(2).png', 'Houbara(3).png',
    'Houses of The Past.png', 'In The Market.png', 'In The Market(2).png', 'In The Name Of Allah.png', 'Kaaba.png',
    'Landscape(1).png', 'Landscape(3).png', 'Landscape(4).png', 'Landscape(5).png', 'Landscape(6).png',
    'Landscape(7).png', 'Limbo.png', 'LOLO Bird.png', 'Min AlMahd.png', 'Mommy and Son.png',
    'Motherhood.JPG', 'Mountain Houses.png', 'My Friend.png', 'National Day Celebrations.png', 'Noon Letter.png',
    'On The Sea Beach.png', 'Oyster Split.png', 'Part of The Bull Head Statue.png', 'Pottery Vase.png', 'Predation_.png',
    'Predatory Drawings.png', 'Predatory Drawings(2).png', 'Predatory Drawings(3).png', 'Preparing For Fishing.png', "Rashed's Mother.png",
    'Rocks.png', 'Safi Fish.png', 'Sea View_.png', 'Sheikh Abdulaziz Bin Mohammed.png', 'Shipbuilder Night.png',
    'Shipbuilder.png', 'Side Portrait.png', 'Statue Design.png', 'Statue Design(2).png', 'Statue Design(3).png',
    'Statue Design(4).png', 'Statue Design(5).png', 'Statue design(6).png', 'Statue Design(7).png', 'Still life.png',
    'Tara Logo Design.png', 'Tarab Session.png', 'Tarab Session(2).png', 'Thank Be To Allah.png', 'The  Two Friends.png',
    'The Banoosh Night.png', 'The Banoosh(1).png', 'The Banoosh(2).png', 'The Banoosh(3).png', 'The Banoosh(4).png',
    'The Bird.png', 'The Boat on The Beach.png', 'The Boat.png', 'The Boats.png', 'The Boats(2).png',
    'The Boats(3).png', 'The Boy(Abstract).png', 'The Camel Racing.png', 'The Camel.PNG', 'The Captive.png',
    'The Carrier.png', 'The Castle.png', 'The Church.png', 'The Clown.png', 'The Cock.png',
    'The Coffee Dallah_.png', 'The confused girl.JPG', 'The Convoy.png', 'The Couple.png', 'The Diver.png',
    'The Divers Guidence.png', 'The Falcon Head.png', 'The Falcon Statue.png', 'The Falcon.png', 'The Family.png',
    'The Farm.png', 'The Farm(2).png', 'The Faskara and Shere Fish.png', 'The Fish Trap.png', 'The Fish Trap(2).png',
    'The Flying Falcon.png', 'The Foreign Horse.png', 'The Friends.png', 'The Funeral.png', 'The Gergaoon Play.png',
    'The Green Grocer.png', 'The Greens Grocer.png', 'The Grocer items.JPG', 'The Holy Quran Teacher.png', 'the Horse Head.png',
    'The Houbara and The Falcon.png', 'The Jalboot Pulling.png', 'The Landscape(2).png', 'The Last Painting.png', 'The Lead.png',
    'The Little Girl.png', 'The Lizard(1).png', 'The Lizard(2).png', 'The Lizard(3).png', 'The Lizard(4).png',
    'The Lizard(5).png', 'The Luan(Zrnoog).jpg', 'The Man and The Camel.png', 'The March of Life.png', 'The meditating girl.png',
    'The Mosque(1).png', 'The Mosque(2).png', 'The Newborn.png', 'The Oasis Ruins.png', 'The Old Door.png',
    'The Old Lady at Night.png', 'The Prey.png', 'The Principal and The Student.png', 'The Principal and The Teacher.png', 'The Principal and The Teachers.png',
    'The Sadu Tent.png', 'The Seabed.png', 'The Three Fish.png', 'The Traffic Man.png', 'The Traveler_.png',
    'The Tree.png', 'The Two Birds.png', 'The Two Men.png', 'The Two Women.png', 'The Village(1).png',
    'The Village(2).png', 'The War.png', 'The Water Stream(AlSaab).png', 'The Woman and The Old Man.png', 'The Woman.png',
    'Things.png', 'Woman Portrait_.png', 'Women.png', 'Worries.png', 'Ya Jarheni.png'
];

class UnifiedGallery {
    constructor() {
        this.currentIndex = 0;
        this.filteredImages = ALL_ARTWORKS;
        this.init();
    }

    init() {
        this.renderGallery();
        this.setupEventListeners();
    }

    getTitle(filename) {
        return filename.replace(/\.(jpg|jpeg|png|JPG|PNG)$/i, '').replace(/[_()]/g, ' ');
    }

    renderGallery() {
        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';

        this.filteredImages.forEach((filename, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            item.innerHTML = `
                <div class="item-container">
                    <img src="images/${filename}" 
                         alt="${this.getTitle(filename)}" 
                         loading="lazy"
                         onload="this.classList.add('loaded')">
                    <div class="item-overlay">
                        <h3>${this.getTitle(filename)}</h3>
                    </div>
                </div>
            `;
            
            item.addEventListener('click', () => this.openModal(index));
            gallery.appendChild(item);
        });

        this.animateItems();
    }

    animateItems() {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            setTimeout(() => item.classList.add('show'), index * 50);
        });
    }

    openModal(index) {
        this.currentIndex = index;
        const filename = this.filteredImages[index];
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const caption = document.getElementById('caption');
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        modalImg.src = `images/${filename}`;
        caption.innerHTML = `
            <h3>${this.getTitle(filename)}</h3>
            <p>${index + 1} of ${this.filteredImages.length}</p>
        `;
        
        this.updateNavButtons();
    }

    closeModal() {
        document.getElementById('imageModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    nextImage() {
        if (this.currentIndex < this.filteredImages.length - 1) {
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
        if (nextBtn) nextBtn.style.opacity = this.currentIndex < this.filteredImages.length - 1 ? '1' : '0.3';
    }

    search() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        this.filteredImages = ALL_ARTWORKS.filter(filename => 
            this.getTitle(filename).toLowerCase().includes(searchTerm)
        );
        this.renderGallery();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.search());
        }

        document.querySelector('.close')?.addEventListener('click', () => this.closeModal());
        document.querySelector('.modal-nav.prev')?.addEventListener('click', () => this.prevImage());
        document.querySelector('.modal-nav.next')?.addEventListener('click', () => this.nextImage());

        const modal = document.getElementById('imageModal');
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (modal && modal.style.display === 'block') {
                if (e.key === 'Escape') this.closeModal();
                if (e.key === 'ArrowRight') this.nextImage();
                if (e.key === 'ArrowLeft') this.prevImage();
            }
        });
    }
}

window.closeModal = function() { gallery.closeModal(); };
window.nextImage = function() { gallery.nextImage(); };
window.prevImage = function() { gallery.prevImage(); };

let gallery;
document.addEventListener('DOMContentLoaded', () => {
    gallery = new UnifiedGallery();
});
