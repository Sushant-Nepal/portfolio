// Admin panel functionality

let currentImageData = null;
let currentProfilePhotoData = null;

// Profile data management
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

function loadCurrentProfile() {
    const profileData = getProfileData();
    const preview = document.getElementById('currentProfilePreview');
    if (preview) {
        preview.innerHTML = `<img src="${profileData.photo}" alt="Current Profile" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover;">`;
    }
}

function updateProfilePhoto(photoData) {
    const profileData = getProfileData();
    profileData.photo = photoData;
    saveProfileData(profileData);
    loadCurrentProfile();
}

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

function saveGalleryData(data) {
    localStorage.setItem('galleryData', JSON.stringify(data));
}

function generateId() {
    return Date.now();
}

function loadAdminGallery() {
    const container = document.getElementById('adminGalleryList');
    if (!container) return;
    
    const galleryData = getGalleryData();
    container.innerHTML = '';
    
    if (galleryData.length === 0) {
        container.innerHTML = '<p>No images in gallery yet.</p>';
        return;
    }
    
    galleryData.forEach(item => {
        const adminItem = document.createElement('div');
        adminItem.className = 'admin-gallery-item';
        adminItem.innerHTML = `
            <img src="${item.url}" alt="${item.title}">
            <div class="admin-item-info">
                <h4>${item.title}</h4>
                <p>${item.description || 'No description'}</p>
                <small>ID: ${item.id}</small>
            </div>
            <div class="admin-item-actions">
                <button class="btn-edit" onclick="editImage(${item.id})">Edit</button>
                <button class="btn-delete" onclick="deleteImage(${item.id})">Delete</button>
            </div>
        `;
        container.appendChild(adminItem);
    });
}

function addImage(url, title, description) {
    const galleryData = getGalleryData();
    const newImage = {
        id: generateId(),
        url: url,
        title: title,
        description: description
    };
    galleryData.push(newImage);
    saveGalleryData(galleryData);
    loadAdminGallery();
}

function editImage(id) {
    const galleryData = getGalleryData();
    const image = galleryData.find(item => item.id === id);
    
    if (!image) return;
    
    // Create edit modal
    const modal = document.createElement('div');
    modal.className = 'edit-modal';
    modal.innerHTML = `
        <div class="edit-modal-content">
            <span class="edit-modal-close">&times;</span>
            <h3>Edit Image</h3>
            <form id="editImageForm">
                <div class="form-group">
                    <label>Current Image</label>
                    <img src="${image.url}" alt="${image.title}" style="max-width: 200px; border-radius: 5px;">
                </div>
                <div class="form-group">
                    <label for="editImageFile">Replace Image (optional)</label>
                    <input type="file" id="editImageFile" accept="image/*">
                    <div id="editImagePreview" class="image-preview"></div>
                </div>
                <div class="form-group">
                    <label for="editImageTitle">Image Title</label>
                    <input type="text" id="editImageTitle" value="${image.title}" required>
                </div>
                <div class="form-group">
                    <label for="editImageDescription">Description</label>
                    <textarea id="editImageDescription" rows="3">${image.description || ''}</textarea>
                </div>
                <button type="submit" class="btn">Update Image</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal
    const closeBtn = modal.querySelector('.edit-modal-close');
    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    // Handle image preview for edit
    let editImageData = null;
    const editFileInput = document.getElementById('editImageFile');
    editFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                editImageData = event.target.result;
                const preview = document.getElementById('editImagePreview');
                preview.innerHTML = `<img src="${editImageData}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Handle form submission
    const editForm = document.getElementById('editImageForm');
    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        image.url = editImageData || image.url;
        image.title = document.getElementById('editImageTitle').value;
        image.description = document.getElementById('editImageDescription').value;
        
        saveGalleryData(galleryData);
        loadAdminGallery();
        modal.remove();
        alert('Image updated successfully!');
    });
}

function deleteImage(id) {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    const galleryData = getGalleryData();
    const filteredData = galleryData.filter(item => item.id !== id);
    saveGalleryData(filteredData);
    loadAdminGallery();
    alert('Image deleted successfully!');
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    loadAdminGallery();
    loadCurrentProfile();
    
    // Handle profile photo update
    const profilePhotoInput = document.getElementById('profilePhoto');
    if (profilePhotoInput) {
        profilePhotoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    alert('Image size should be less than 5MB');
                    profilePhotoInput.value = '';
                    return;
                }
                
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file');
                    profilePhotoInput.value = '';
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentProfilePhotoData = event.target.result;
                    const preview = document.getElementById('profilePhotoPreview');
                    preview.innerHTML = `<img src="${currentProfilePhotoData}" alt="Preview" style="width: 150px; height: 150px; border-radius: 50%; object-fit: cover;">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    const updateProfileForm = document.getElementById('updateProfileForm');
    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!currentProfilePhotoData) {
                alert('Please select a profile photo');
                return;
            }
            
            updateProfilePhoto(currentProfilePhotoData);
            
            updateProfileForm.reset();
            document.getElementById('profilePhotoPreview').innerHTML = '';
            currentProfilePhotoData = null;
            alert('Profile photo updated successfully!');
        });
    }
    
    // Handle image file selection and preview
    const imageFileInput = document.getElementById('imageFile');
    if (imageFileInput) {
        imageFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Image size should be less than 5MB');
                    imageFileInput.value = '';
                    return;
                }
                
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    alert('Please select a valid image file');
                    imageFileInput.value = '';
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentImageData = event.target.result;
                    const preview = document.getElementById('imagePreview');
                    preview.innerHTML = `<img src="${currentImageData}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    const addImageForm = document.getElementById('addImageForm');
    if (addImageForm) {
        addImageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!currentImageData) {
                alert('Please select an image file');
                return;
            }
            
            const title = document.getElementById('imageTitle').value;
            const description = document.getElementById('imageDescription').value;
            
            addImage(currentImageData, title, description);
            
            addImageForm.reset();
            document.getElementById('imagePreview').innerHTML = '';
            currentImageData = null;
            alert('Image added successfully!');
        });
    }
});
