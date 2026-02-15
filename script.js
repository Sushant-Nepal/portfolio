// Profile data storage
function getProfileData() {
    const data = localStorage.getItem('profileData');
    if (!data) {
        const defaultData = {
            photo: 'me.jpg',
            name: 'Sushant Nepal',
            titles: [
                'Python Core Trainer',
                'Education Intern at Aspire College',
                'Technical Education Student'
            ]
        };
        localStorage.setItem('profileData', JSON.stringify(defaultData));
        return defaultData;
    }
    return JSON.parse(data);
}

function saveProfileData(data) {
    localStorage.setItem('profileData', JSON.stringify(data));
}

// Typing animation
function typeWriter(texts, elementId, speed = 100) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = speed;
        
        if (isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next text
        }
        
        setTimeout(type, typeSpeed);
    }
    
    type();
}

// Load profile on hero section
function loadHeroProfile() {
    const profileData = getProfileData();
    const profileImageContainer = document.getElementById('heroProfileImage');
    
    if (profileImageContainer) {
        const img = profileImageContainer.querySelector('img');
        if (img) {
            img.src = profileData.photo;
            img.alt = profileData.name;
        }
    }
    
    // Start typing animation
    if (document.getElementById('typingText')) {
        typeWriter(profileData.titles, 'typingText', 100);
    }
}

// Gallery data storage using localStorage
function getGalleryData() {
    // Always use the correct default images
    const defaultData = [
        {
            id: 1,
            url: 'taught_1.jpeg',
            title: 'Python Training Session',
            description: 'Teaching Python fundamentals to 3rd semester students'
        },
        {
            id: 2,
            url: 'taught_2.jpeg',
            title: 'OOP Concepts Workshop',
            description: 'Interactive session on Object-Oriented Programming'
        },
        {
            id: 3,
            url: 'taught_3.jpeg',
            title: 'Coding Practice',
            description: 'Students working on Python exercises'
        },
        {
            id: 4,
            url: 'taught_4.jpeg',
            title: 'Classroom Teaching',
            description: 'Explaining core Python features at Aspire College'
        }
    ];
    
    const data = localStorage.getItem('galleryData');
    if (!data) {
        localStorage.setItem('galleryData', JSON.stringify(defaultData));
        return defaultData;
    }
    
    // Check if stored data has the old placeholder URLs
    const storedData = JSON.parse(data);
    const hasOldData = storedData.some(item => item.url.includes('unsplash.com') || item.url.includes('placeholder'));
    
    if (hasOldData) {
        // Replace with correct images
        localStorage.setItem('galleryData', JSON.stringify(defaultData));
        return defaultData;
    }
    
    return storedData;
}

// Load gallery images
function loadGallery(containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const galleryData = getGalleryData();
    const images = limit ? galleryData.slice(0, limit) : galleryData;
    
    container.innerHTML = '';
    
    images.forEach(item => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${item.url}" alt="${item.title}" loading="lazy">
            <div class="gallery-item-overlay">
                <h4>${item.title}</h4>
                <p>${item.description || ''}</p>
            </div>
        `;
        
        galleryItem.addEventListener('click', () => {
            openLightbox(item.url, item.title);
        });
        
        container.appendChild(galleryItem);
    });
}

// Lightbox functionality
function openLightbox(url, title) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const caption = document.getElementById('caption');
    
    if (lightbox && lightboxImg) {
        lightbox.style.display = 'block';
        lightboxImg.src = url;
        if (caption) caption.textContent = title;
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.style.display = 'none';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load hero profile
    loadHeroProfile();
    
    const closeBtn = document.querySelector('.lightbox .close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Load galleries based on page
    if (document.getElementById('home-gallery')) {
        loadGallery('home-gallery', 3);
    }
    
    if (document.getElementById('main-gallery')) {
        loadGallery('main-gallery');
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! This is a demo form.');
            contactForm.reset();
        });
    }
});
