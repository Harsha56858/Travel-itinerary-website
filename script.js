// Initialize AOS animations with custom settings
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false,
    mirror: true,
    offset: 100,
    delay: 0
});

// Plane creation functionality
class PlaneCreator {
    constructor() {
        this.planeContainer = document.getElementById('airplaneContainer');
        this.colorInput = document.getElementById('planeColor');
        this.createButton = document.getElementById('createPlane');
        this.planes = [];
        this.maxPlanes = 3;

        this.createButton.addEventListener('click', () => this.createPlane());
    }

    createPlane() {
        if (this.planes.length >= this.maxPlanes) {
            this.planes[0].remove();
            this.planes.shift();
        }

        const plane = document.createElement('div');
        plane.className = 'airplane';
        plane.style.backgroundImage = `url('https://cdn-icons-png.flaticon.com/512/3212/3212567.png')`;
        plane.style.filter = `hue-rotate(${this.getHueRotation(this.colorInput.value)})`;
        
        this.planeContainer.appendChild(plane);
        this.planes.push(plane);

        // Add animation
        plane.style.animation = 'none';
        plane.offsetHeight; // Trigger reflow
        plane.style.animation = 'fly 15s linear infinite';
    }

    getHueRotation(color) {
        // Convert hex to RGB
        const r = parseInt(color.substr(1,2), 16);
        const g = parseInt(color.substr(3,2), 16);
        const b = parseInt(color.substr(5,2), 16);
        
        // Calculate hue rotation
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let hue = 0;
        
        if (max === min) {
            hue = 0;
        } else if (max === r) {
            hue = 60 * ((g - b) / (max - min));
        } else if (max === g) {
            hue = 60 * (2 + (b - r) / (max - min));
        } else {
            hue = 60 * (4 + (r - g) / (max - min));
        }
        
        return `${hue}deg`;
    }
}

// Add scroll progress indicator
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${progress}%`;
    });
};

// Add parallax effect to cards on scroll
const addParallaxEffect = () => {
    const cards = document.querySelectorAll('.activity-card');
    
    window.addEventListener('scroll', () => {
        cards.forEach(card => {
            const speed = 0.1;
            const rect = card.getBoundingClientRect();
            const scroll = window.pageYOffset;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(scroll * speed);
                card.style.transform = `translateY(${yPos}px)`;
            }
        });
    });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createScrollProgress();
    addParallaxEffect();
    new PlaneCreator();

    const activityCards = document.querySelectorAll('.activity-card');
    const dayColumns = document.querySelectorAll('.day-column');

    // Add drag events to cards
    activityCards.forEach(card => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });

    // Add drop events to columns
    dayColumns.forEach(column => {
        column.addEventListener('dragover', handleDragOver);
        column.addEventListener('dragleave', handleDragLeave);
        column.addEventListener('drop', handleDrop);
    });

    function handleDragStart(e) {
        this.classList.add('dragging');
        e.dataTransfer.setData('text/plain', this.innerHTML);
        e.dataTransfer.effectAllowed = 'move';
        
        // Add animation class
        this.style.transform = 'scale(1.05) rotate(2deg)';
    }

    function handleDragEnd(e) {
        this.classList.remove('dragging');
        this.style.transform = '';
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('drag-over');
    }

    function handleDragLeave(e) {
        this.classList.remove('drag-over');
    }

    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        const cardContent = e.dataTransfer.getData('text/plain');
        const newCard = document.createElement('div');
        newCard.className = 'activity-card';
        newCard.draggable = true;
        newCard.innerHTML = cardContent;
        
        // Add drag events to new card
        newCard.addEventListener('dragstart', handleDragStart);
        newCard.addEventListener('dragend', handleDragEnd);
        
        // Add animation to new card
        newCard.setAttribute('data-aos', 'flip-left');
        AOS.refresh();
        
        this.appendChild(newCard);
    }
});

// Add smooth scrolling for navigation
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add parallax effect to airplane
window.addEventListener('mousemove', (e) => {
    const airplanes = document.querySelectorAll('.airplane');
    airplanes.forEach(airplane => {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        airplane.style.transform = `translateX(${x}px) translateY(${y}px)`;
    });
});

// Add responsive navbar toggle
const createMobileMenu = () => {
    const nav = document.querySelector('nav');
    const menuButton = document.createElement('button');
    menuButton.className = 'md:hidden p-2';
    menuButton.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
    `;
    
    nav.querySelector('.flex').appendChild(menuButton);
    
    menuButton.addEventListener('click', () => {
        const menu = nav.querySelector('.hidden');
        menu.classList.toggle('hidden');
        menu.classList.toggle('block');
    });
};

createMobileMenu(); 