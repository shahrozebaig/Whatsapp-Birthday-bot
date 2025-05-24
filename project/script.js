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
        
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const templateId = templateSelect.value;
        const sendTime = document.getElementById('sendTime').value;
        
        let message = '';
        if (templateId === 'template4') {
            message = document.getElementById('customMessage').value;
        } else {
            message = templates[templateId].replace('[NAME]', name);
        }
        
        // In a real application, this would send data to the Python backend
        // Instead, we'll just add it to the scheduled wishes list
        addToScheduledWishes(name, phone, message, sendTime);
        
        // Show confirmation
        confirmation.style.display = 'flex';
        
        // Create confetti effect
        createConfetti();
    });
    
    // Close confirmation
    confirmationClose.addEventListener('click', function() {
        confirmation.style.display = 'none';
    });
    
    // Add to scheduled wishes list
    function addToScheduledWishes(name, phone, message, sendTime) {
        const li = document.createElement('li');
        const formattedTime = new Date(sendTime).toLocaleString();
        
        li.innerHTML = `
            <div class="wish-info">
                <strong>${name}</strong> - ${formattedTime}
                <div class="wish-message">${message.substring(0, 50)}${message.length > 50 ? '...' : ''}</div>
            </div>
            <div class="wish-actions">
                <button class="delete-wish">Cancel</button>
            </div>
        `;
        
        wishesList.appendChild(li);
        
        // Add event listener for delete button
        const deleteBtn = li.querySelector('.delete-wish');
        deleteBtn.addEventListener('click', function() {
            li.remove();
        });
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
        
        // Add CSS animation for confetti
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                0% {
                    transform: translateY(-20px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});