document.addEventListener('DOMContentLoaded', () => {
    // Navigation Handling
    const navItems = document.querySelectorAll('.dashboard-nav li');
    const sections = document.querySelectorAll('.dashboard-content section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all nav items and sections
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active-section'));

            // Add active class to clicked nav item and corresponding section
            item.classList.add('active');
            const sectionId = item.getAttribute('data-section') + 'Section';
            document.getElementById(sectionId).classList.add('active-section');
        });
    });

    // Page Navigation Links
    const pageLinks = {
        'Home': 'index.html',
        'Services': 'services.html',
        'About Us': 'aboutus.html',
        'Contact': 'contact.html',
        'Wallet': 'wallet.html',
        'Login': 'auth.html'
    };

    // Add click event listeners to navigation links
    document.querySelectorAll('.nav-links a, .nav-buttons a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && pageLinks[link.textContent.trim()]) {
                window.location.href = href;
            }
        });
    });

    // Populate user details from signup or stored data
    function populateUserDetails() {
        const signupData = localStorage.getItem('userSignupData');
        const profileData = localStorage.getItem('userProfileData');

        if (signupData) {
            const userData = JSON.parse(signupData);
            
            // Update user name and email
            document.getElementById('userName').textContent = userData.name || 'User Name';
            document.getElementById('userEmail').textContent = userData.email || 'user@example.com';
        }

        if (profileData) {
            const profileDetails = JSON.parse(profileData);
            // Additional profile population can be added here
        }
    }

    // Call function to populate user details
    populateUserDetails();

    // Profile Completion Form
    const profileForm = document.getElementById('profileCompletionForm');
    const addMemberButton = document.querySelector('.add-member');
    const familyMembersContainer = document.querySelector('.family-members');

    // Dynamic Family Member Addition
    addMemberButton.addEventListener('click', () => {
        const newMemberInput = document.createElement('div');
        newMemberInput.classList.add('member-input');
        newMemberInput.innerHTML = `
            <input type="text" name="familyMember" placeholder="Name">
            <select name="familyMemberRelation">
                <option value="">Relation</option>
                <option value="spouse">Spouse</option>
                <option value="child">Child</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
            </select>
            <button type="button" class="remove-member">-</button>
        `;
        familyMembersContainer.appendChild(newMemberInput);

        // Add remove functionality to new member input
        newMemberInput.querySelector('.remove-member').addEventListener('click', () => {
            familyMembersContainer.removeChild(newMemberInput);
        });
    });

    // Profile Picture Preview
    const profilePictureInput = document.getElementById('profilePictureUpload');
    const profilePictureDisplay = document.getElementById('profilePicture');

    profilePictureInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePictureDisplay.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Form Submission
    profileForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Collect form data
        const formData = new FormData(profileForm);
        const profileData = {};

        for (let [key, value] of formData.entries()) {
            // Handle multiple values for checkboxes and family members
            if (profileData[key]) {
                if (!Array.isArray(profileData[key])) {
                    profileData[key] = [profileData[key]];
                }
                profileData[key].push(value);
            } else {
                profileData[key] = value;
            }
        }

        // Simulate data storage (replace with actual backend call)
        console.log('Profile Data:', profileData);
        localStorage.setItem('userProfileData', JSON.stringify(profileData));

        // Optional: Show success message or redirect
        alert('Profile updated successfully!');
    });

    // Populate form with existing data if available
    const storedProfileData = localStorage.getItem('userProfileData');
    if (storedProfileData) {
        const profileData = JSON.parse(storedProfileData);
        
        // Populate form fields
        Object.keys(profileData).forEach(key => {
            const field = document.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    // Handle checkbox values
                    const values = Array.isArray(profileData[key]) ? profileData[key] : [profileData[key]];
                    values.forEach(value => {
                        const checkbox = document.querySelector(`[name="${key}"][value="${value}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                } else {
                    field.value = profileData[key];
                }
            }
        });
    }
});
