// Admin functionality for editing about page
document.addEventListener('DOMContentLoaded', function() {
    const adminBtn = document.getElementById('adminBtn');
    const adminModal = document.getElementById('adminModal');
    const adminClose = document.querySelector('.admin-close');
    const loginForm = document.getElementById('loginForm');
    const editForm = document.getElementById('editForm');
    
    // Admin password (in production, this should be more secure)
    const ADMIN_PASSWORD = 'admin123';
    
    // Load saved content on page load
    loadSavedContent();
    
    // Admin button click
    adminBtn.addEventListener('click', function(e) {
        e.preventDefault();
        adminModal.style.display = 'block';
    });
    
    // Close modal
    adminClose.addEventListener('click', function() {
        adminModal.style.display = 'none';
        resetModal();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === adminModal) {
            adminModal.style.display = 'none';
            resetModal();
        }
    });
    
    // Enter key for password
    document.getElementById('adminPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adminLogin();
        }
    });
});

function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    const loginForm = document.getElementById('loginForm');
    const editForm = document.getElementById('editForm');
    
    if (password === 'admin123') {
        loginForm.style.display = 'none';
        editForm.classList.remove('edit-form-hidden');
        loadCurrentContent();
    } else {
        alert('Incorrect password');
        document.getElementById('adminPassword').value = '';
    }
}

function loadCurrentContent() {
    // Load current bio content
    document.getElementById('editBio1').value = document.getElementById('bio1').textContent.trim();
    document.getElementById('editBio2').value = document.getElementById('bio2').textContent.trim();
    
    // Load current milestones
    const milestones = document.querySelectorAll('#milestones li');
    const milestonesText = Array.from(milestones).map(li => li.textContent.trim()).join('\n');
    document.getElementById('editMilestones').value = milestonesText;
}

function saveChanges() {
    const bio1 = document.getElementById('editBio1').value;
    const bio2 = document.getElementById('editBio2').value;
    const milestones = document.getElementById('editMilestones').value;
    
    // Save to localStorage
    localStorage.setItem('aboutBio1', bio1);
    localStorage.setItem('aboutBio2', bio2);
    localStorage.setItem('aboutMilestones', milestones);
    
    // Update page content
    document.getElementById('bio1').textContent = bio1;
    document.getElementById('bio2').textContent = bio2;
    
    // Update milestones
    const milestonesList = document.getElementById('milestones');
    milestonesList.innerHTML = '';
    
    milestones.split('\n').forEach(milestone => {
        if (milestone.trim()) {
            const li = document.createElement('li');
            // Parse year and description
            const parts = milestone.split(':');
            if (parts.length >= 2) {
                const year = parts[0].trim();
                const description = parts.slice(1).join(':').trim();
                li.innerHTML = `<strong>${year}:</strong> ${description}`;
            } else {
                li.textContent = milestone;
            }
            milestonesList.appendChild(li);
        }
    });
    
    alert('Changes saved successfully!');
    document.getElementById('adminModal').style.display = 'none';
    resetModal();
}

function loadSavedContent() {
    // Load saved bio content
    const savedBio1 = localStorage.getItem('aboutBio1');
    const savedBio2 = localStorage.getItem('aboutBio2');
    const savedMilestones = localStorage.getItem('aboutMilestones');
    
    if (savedBio1) {
        document.getElementById('bio1').textContent = savedBio1;
    }
    
    if (savedBio2) {
        document.getElementById('bio2').textContent = savedBio2;
    }
    
    if (savedMilestones) {
        const milestonesList = document.getElementById('milestones');
        milestonesList.innerHTML = '';
        
        savedMilestones.split('\n').forEach(milestone => {
            if (milestone.trim()) {
                const li = document.createElement('li');
                const parts = milestone.split(':');
                if (parts.length >= 2) {
                    const year = parts[0].trim();
                    const description = parts.slice(1).join(':').trim();
                    li.innerHTML = `<strong>${year}:</strong> ${description}`;
                } else {
                    li.textContent = milestone;
                }
                milestonesList.appendChild(li);
            }
        });
    }
}

function resetModal() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('editForm').classList.add('edit-form-hidden');
    document.getElementById('adminPassword').value = '';
}