document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const birthdayForm = document.getElementById('birthdayForm');
    const templateSelect = document.getElementById('template');
    const customMessageContainer = document.getElementById('customMessageContainer');
    const previewBtn = document.getElementById('previewBtn');
    const previewContainer = document.getElementById('previewContainer');
    const previewText = document.getElementById('previewText');
    const closePreviewBtn = document.getElementById('closePreview');
    const wishesList = document.getElementById('wishesList');
    const confirmation = document.getElementById('confirmation');
    const confirmationClose = document.getElementById('confirmationClose');
    
    // Templates
    const templates = {
        template1: "Happy birthday, [NAME]! 🎂 Wishing you a day filled with happiness and a year filled with joy. May all your dreams come true! 🎉🎈",
        template2: "Guess who's getting older today? It's you, [NAME]! 🤣 Hope your birthday is as awesome as you are! 🎉 Don't eat too much cake... or do, I'm not your boss! 🍰",
        template3: "Happy birthday, [NAME]! 🌟 Another year of amazing experiences and growth. May this new chapter of your life be filled with success and happiness. Remember, the best is yet to come! 💫",
        template4: "" // Custom message
    };
    
    // Set default date and time to tomorrow at 9:00 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    
    const sendTimeInput = document.getElementById('sendTime');
    sendTimeInput.value = tomorrow.toISOString().slice(0, 16);
    
    // Show/hide custom message field based on template selection
    templateSelect.addEventListener('change', function() {
        if (this.value === 'template4') {
            customMessageContainer.style.display = 'block';
        } else {
            customMessageContainer.style.display = 'none';
        }
    });
    
    // Preview message
    previewBtn.addEventListener('click', function() {
        const name = document.getElementById('name').value || '[NAME]';
        let templateId = templateSelect.value;
        let message = '';
        
        if (templateId === 'template4') {
            message = document.getElementById('customMessage').value;
        } else {
            message = templates[templateId].replace('[NAME]', name);
        }
        
        previewText.textContent = message;
        previewContainer.style.display = 'block';
        
        // Scroll to preview
        previewContainer.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Close preview
    closePreviewBtn.addEventListener('click', function() {
        previewContainer.style.display = 'none';
    });
    
    // Form submission
    birthdayForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(birthdayForm);
        
        // Send data to server
        fetch('/send_wish', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update scheduled wishes list
                loadScheduledWishes();
                
                // Show confirmation
                confirmation.style.display = 'flex';
                
                // Create confetti effect
                createConfetti();
                
                // Reset form
                birthdayForm.reset();
                
                // Set default date and time again
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(9, 0, 0, 0);
                sendTimeInput.value = tomorrow.toISOString().slice(0, 16);
            }
        })
        .catch(error => console.error('Error:', error));
    });
    
    // Close confirmation
    confirmationClose.addEventListener('click', function() {
        confirmation.style.display = 'none';
    });
    
    // Load scheduled wishes from server
    function loadScheduledWishes() {
        fetch('/get_scheduled_wishes')
        .then(response => response.json())
        .then(wishes => {
            wishesList.innerHTML = '';
            
            if (wishes.length === 0) {
                wishesList.innerHTML = '<li class="no-wishes">No wishes scheduled yet.</li>';
                return;
            }
            
            wishes.forEach((wish, index) => {
                const li = document.createElement('li');
                const formattedTime = new Date(wish.send_time).toLocaleString();
                
                li.innerHTML = `
                    <div class="wish-info">
                        <strong>${wish.name}</strong> - ${formattedTime}
                        <div class="wish-message">${wish.message.substring(0, 50)}${wish.message.length > 50 ? '...' : ''}</div>
                    </div>
                    <div class="wish-actions">
                        <button class="delete-wish" data-index="${index}">Cancel</button>
                    </div>
                `;
                
                wishesList.appendChild(li);
            });
            
            // Add event listeners for delete buttons
            document.querySelectorAll('.delete-wish').forEach(button => {
                button.addEventListener('click', function() {
                    const index = this.getAttribute('data-index');
                    deleteWish(index);
                });
            });
        })
        .catch(error => console.error('Error:', error));
    }
    
    // Delete wish
    function deleteWish(index) {
        const formData = new FormData();
        formData.append('index', index);
        
        fetch('/delete_wish', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadScheduledWishes();
            }
        })
        .catch(error => console.error('Error:', error));
    }
    
    // Create confetti effect
    function createConfetti() {
        const confettiContainer = document.querySelector('.confetti');
        confettiContainer.innerHTML = '';
        
        const colors = ['#ff6b6b', '#5d9cec', '#feca57', '#2ecc71'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.position = 'absolute';
            confetti.style.top = `${Math.random() * 100}%`;
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confetti.style.opacity = Math.random() + 0.5;
            
            const animationDuration = Math.random() * 3 + 2;
            confetti.style.animation = `fall ${animationDuration}s linear forwards`;
            
            confettiContainer.appendChild(confetti);
        }
    }
    
    // Load scheduled wishes on page load
    loadScheduledWishes();

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add transition animation
        themeToggle.style.transform = 'scale(0.8)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 200);
    });
});