document.addEventListener('DOMContentLoaded', () => {
  console.log('Dashboard script is definitely running!');

  // Safety checks
  try {
    // Dashboard Navigation
    const navItems = document.querySelectorAll('.dashboard-nav li');
    const sections = document.querySelectorAll('.dashboard-content > section');

    console.log('Found nav items:', navItems.length);
    console.log('Found sections:', sections.length);

    // Basic section switching
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        console.log('Nav item clicked:', item.getAttribute('data-section'));

        // Remove active class from all nav items and sections
        navItems.forEach(nav => {
          nav.classList.remove('active');
          console.log('Removing active from:', nav);
        });
        sections.forEach(section => {
          section.classList.remove('active-section');
          console.log('Removing active-section from:', section);
        });

        // Add active class to clicked nav item and corresponding section
        item.classList.add('active');
        const sectionId = item.getAttribute('data-section') + 'Section';
        const selectedSection = document.getElementById(sectionId);
        
        console.log('Selected section ID:', sectionId);
        console.log('Selected section element:', selectedSection);
        
        if (selectedSection) {
          selectedSection.classList.add('active-section');
        } else {
          console.error('Could not find section with ID:', sectionId);
        }
      });
    });

    // Family Member Addition
    const addMemberButton = document.querySelector('.add-member');
    const familyMembersContainer = document.querySelector('.family-members');

    console.log('Add Member Button:', addMemberButton);
    console.log('Family Members Container:', familyMembersContainer);

    if (addMemberButton && familyMembersContainer) {
      addMemberButton.addEventListener('click', () => {
        console.log('Add member button clicked');

        // Create new member input
        const newMemberInput = document.createElement('div');
        newMemberInput.classList.add('member-input');
        newMemberInput.innerHTML = `
          <input 
            type="text" 
            name="familyMember" 
            placeholder="Family Member Name" 
            required
          >
          <select name="familyMemberRelation" required>
            <option value="">Select Relation</option>
            <option value="spouse">Spouse</option>
            <option value="child">Child</option>
            <option value="parent">Parent</option>
            <option value="sibling">Sibling</option>
            <option value="grandparent">Grandparent</option>
            <option value="other">Other</option>
          </select>
          <button type="button" class="remove-member">
            <i class="fas fa-trash"></i>
          </button>
        `;

        // Add to container
        familyMembersContainer.appendChild(newMemberInput);

        // Add remove functionality to new member input
        const removeMemberButton = newMemberInput.querySelector('.remove-member');
        removeMemberButton.addEventListener('click', () => {
          console.log('Remove member button clicked');
          familyMembersContainer.removeChild(newMemberInput);
        });

        console.log('New family member input added');
      });
    } else {
      console.warn('Family member addition elements not found');
    }

    // Profile Picture Preview
    const profilePictureInput = document.getElementById('profilePictureUpload');
    const profilePictureDisplay = document.getElementById('profilePicture');

    console.log('Profile Picture Input:', profilePictureInput);
    console.log('Profile Picture Display:', profilePictureDisplay);

    if (profilePictureInput && profilePictureDisplay) {
      profilePictureInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            profilePictureDisplay.src = e.target.result;
            console.log('Profile picture preview updated');
          };
          reader.readAsDataURL(file);
        }
      });
    } else {
      console.warn('Profile picture elements not found');
    }

    // Populate user details from local storage
    function populateUserDetails() {
      const signupData = localStorage.getItem('userSignupData');
      if (signupData) {
        const userData = JSON.parse(signupData);
        
        const nameElement = document.getElementById('userName');
        const emailElement = document.getElementById('userEmail');
        
        console.log('User Data:', userData);
        
        if (nameElement) {
          nameElement.textContent = userData.name || 'User Name';
          console.log('Name updated to:', nameElement.textContent);
        } else {
          console.warn('Name element not found');
        }
        
        if (emailElement) {
          emailElement.textContent = userData.email || 'user@example.com';
          console.log('Email updated to:', emailElement.textContent);
        } else {
          console.warn('Email element not found');
        }
      } else {
        console.warn('No signup data found in localStorage');
      }
    }

    // Call function to populate user details
    populateUserDetails();

    // Preferences Section Interactivity
    console.log('Preferences script is running');

    // Service Chips Interaction
    const serviceChips = document.querySelectorAll('.service-chips .chip');
    serviceChips.forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        console.log(`Service chip toggled: ${chip.textContent}`);
      });
    });

    // Preferences Save and Reset
    const savePreferencesBtn = document.querySelector('.save-preferences');
    const resetPreferencesBtn = document.querySelector('.reset-preferences');

    if (savePreferencesBtn) {
      savePreferencesBtn.addEventListener('click', () => {
        const preferences = {
          transportation: {
            modes: Array.from(document.querySelectorAll('input[name="transportPreferences"]:checked'))
              .map(input => input.value),
            commuteFrequency: document.querySelector('select[name="commuteFrequency"]').value
          },
          cityServices: {
            notifications: Array.from(document.querySelectorAll('input[name="serviceNotifications"]:checked'))
              .map(input => input.value),
            preferredServices: Array.from(document.querySelectorAll('.service-chips .chip.active'))
              .map(chip => chip.textContent.trim())
          },
          communication: {
            contactMethods: Array.from(document.querySelectorAll('input[name="contactMethod"]:checked'))
              .map(input => input.value),
            language: document.querySelector('select[name="languagePreference"]').value
          },
          accessibility: {
            displayPreferences: Array.from(document.querySelectorAll('input[name="accessibilityPreferences"]:checked'))
              .map(input => input.value),
            screenReader: document.getElementById('screenReaderToggle').checked
          }
        };

        console.log('Saving Preferences:', preferences);
        
        // Save to localStorage
        localStorage.setItem('userPreferences', JSON.stringify(preferences));
        
        // Optional: Send to backend (you would implement this)
        // sendPreferencesToBackend(preferences);

        // Provide user feedback
        savePreferencesBtn.textContent = 'Saved!';
        savePreferencesBtn.disabled = true;
        setTimeout(() => {
          savePreferencesBtn.textContent = 'Save Preferences';
          savePreferencesBtn.disabled = false;
        }, 2000);
      });
    }

    if (resetPreferencesBtn) {
      resetPreferencesBtn.addEventListener('click', () => {
        // Reset checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
          checkbox.checked = checkbox.hasAttribute('checked');
        });

        // Reset dropdowns
        document.querySelectorAll('select').forEach(select => {
          select.selectedIndex = 0;
        });

        // Reset service chips
        document.querySelectorAll('.service-chips .chip').forEach(chip => {
          chip.classList.remove('active');
          if (chip.textContent === 'Healthcare' || chip.textContent === 'Public Safety') {
            chip.classList.add('active');
          }
        });

        // Remove saved preferences from localStorage
        localStorage.removeItem('userPreferences');

        console.log('Preferences reset to default');

        // Provide user feedback
        resetPreferencesBtn.textContent = 'Reset Complete';
        resetPreferencesBtn.disabled = true;
        setTimeout(() => {
          resetPreferencesBtn.textContent = 'Reset to Default';
          resetPreferencesBtn.disabled = false;
        }, 2000);
      });
    }

    // Load Saved Preferences on Page Load
    function loadSavedPreferences() {
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        
        // Restore transportation preferences
        preferences.transportation?.modes?.forEach(mode => {
          const checkbox = document.querySelector(`input[name="transportPreferences"][value="${mode}"]`);
          if (checkbox) checkbox.checked = true;
        });
        
        if (preferences.transportation?.commuteFrequency) {
          const commuteSelect = document.querySelector('select[name="commuteFrequency"]');
          commuteSelect.value = preferences.transportation.commuteFrequency;
        }

        // Restore service notifications
        preferences.cityServices?.notifications?.forEach(notification => {
          const checkbox = document.querySelector(`input[name="serviceNotifications"][value="${notification}"]`);
          if (checkbox) checkbox.checked = true;
        });

        // Restore preferred services
        preferences.cityServices?.preferredServices?.forEach(service => {
          const chip = Array.from(document.querySelectorAll('.service-chips .chip'))
            .find(c => c.textContent.trim() === service);
          if (chip) chip.classList.add('active');
        });

        // Restore communication preferences
        preferences.communication?.contactMethods?.forEach(method => {
          const checkbox = document.querySelector(`input[name="contactMethod"][value="${method}"]`);
          if (checkbox) checkbox.checked = true;
        });

        if (preferences.communication?.language) {
          const languageSelect = document.querySelector('select[name="languagePreference"]');
          languageSelect.value = preferences.communication.language;
        }

        // Restore accessibility preferences
        preferences.accessibility?.displayPreferences?.forEach(pref => {
          const checkbox = document.querySelector(`input[name="accessibilityPreferences"][value="${pref}"]`);
          if (checkbox) checkbox.checked = true;
        });

        if (preferences.accessibility?.screenReader !== undefined) {
          const screenReaderToggle = document.getElementById('screenReaderToggle');
          screenReaderToggle.checked = preferences.accessibility.screenReader;
        }

        console.log('Preferences loaded from localStorage');
      }
    }

    // Call load preferences on page load
    loadSavedPreferences();

    // Two-Factor Authentication and Screen Reader Interactivity
    const twoFactorToggle = document.getElementById('twoFactorToggle');
    const twoFactorMethods = document.getElementById('twoFactorMethods');
    const twoFactorMethodOptions = document.querySelectorAll('.method-option');

    if (twoFactorToggle && twoFactorMethods) {
      // Toggle visibility of two-factor methods
      twoFactorToggle.addEventListener('change', () => {
        if (twoFactorToggle.checked) {
          twoFactorMethods.style.display = 'grid';
          console.log('Two-Factor Authentication enabled');
        } else {
          twoFactorMethods.style.display = 'none';
          console.log('Two-Factor Authentication disabled');
        }
      });

      // Method selection interaction
      twoFactorMethodOptions.forEach(option => {
        const radioInput = option.querySelector('input[type="radio"]');
        
        option.addEventListener('click', () => {
          // Deselect all other options
          twoFactorMethodOptions.forEach(opt => {
            opt.classList.remove('selected');
            opt.querySelector('input[type="radio"]').checked = false;
          });

          // Select current option
          option.classList.add('selected');
          radioInput.checked = true;

          console.log(`Two-Factor Method Selected: ${radioInput.value}`);
        });
      });
    }

    // Screen Reader Support
    const screenReaderToggle = document.getElementById('screenReaderToggle');
    const screenReaderOptions = document.getElementById('screenReaderOptions');

    if (screenReaderToggle && screenReaderOptions) {
      // Toggle visibility of screen reader options
      screenReaderToggle.addEventListener('change', () => {
        if (screenReaderToggle.checked) {
          screenReaderOptions.style.display = 'block';
          console.log('Screen Reader Support enabled');
        } else {
          screenReaderOptions.style.display = 'none';
          console.log('Screen Reader Support disabled');
        }
      });

      // Initially hide options if not checked
      if (!screenReaderToggle.checked) {
        screenReaderOptions.style.display = 'none';
      }
    }

    // Voice Feedback and Text Adjustment Interactions
    const voiceFeedbackOptions = document.querySelectorAll('input[name="voiceFeedback"]');
    const textAdjustmentOptions = document.querySelectorAll('input[name="textAdjustment"]');

    function handleAccessibilityOptions(options) {
      options.forEach(option => {
        option.addEventListener('change', () => {
          console.log(`Accessibility Option Changed: ${option.value}, Checked: ${option.checked}`);
          
          // Additional logic can be added here for each option
          if (option.value === 'highContrast') {
            document.body.classList.toggle('high-contrast', option.checked);
          }
          
          if (option.value === 'largeText') {
            document.body.classList.toggle('large-text', option.checked);
          }
        });
      });
    }

    handleAccessibilityOptions(voiceFeedbackOptions);
    handleAccessibilityOptions(textAdjustmentOptions);

  } catch (error) {
    console.error('Critical error in dashboard script:', error);
  }

  console.log('User Dashboard Script Completed Execution');
});
