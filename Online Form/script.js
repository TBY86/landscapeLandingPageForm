// Application State
const AppState = {
    currentCard: 1,
    userData: {},
    serviceFlow: 'branch1', // 'branch1' or 'branch2'
    selectedServices: [],
    cardHistory: [],
    
    // Reset state
    reset() {
        this.currentCard = 1;
        this.userData = {};
        this.serviceFlow = 'branch1';
        this.selectedServices = [];
        this.cardHistory = [];
    },
    
    // Save user data
    saveData(key, value) {
        this.userData[key] = value;
    },
    
    // Get user data
    getData(key) {
        return this.userData[key];
    },
    
    // Add to history
    addToHistory(cardNumber) {
        if (this.cardHistory[this.cardHistory.length - 1] !== cardNumber) {
            this.cardHistory.push(cardNumber);
        }
    },
    
    // Get previous card
    getPreviousCard() {
        if (this.cardHistory.length > 1) {
            this.cardHistory.pop(); // Remove current card
            return this.cardHistory[this.cardHistory.length - 1];
        }
        return null;
    }
};

// Card Navigation Controller
const CardController = {
    // Show specific card
    showCard(cardNumber) {
        // Hide all cards
        const allCards = document.querySelectorAll('.card');
        allCards.forEach(card => {
            card.classList.remove('active');
        });
        
        // Show target card
        const targetCard = document.getElementById(`card-${cardNumber}`);
        if (targetCard) {
            targetCard.classList.add('active');
            AppState.currentCard = cardNumber;
            AppState.addToHistory(cardNumber);
            
            // Update back button visibility
            this.updateBackButton();
            
            // Scroll to top of popup
            const popupContainer = document.querySelector('.popup-container');
            if (popupContainer) {
                popupContainer.scrollTop = 0;
            }
        }
    },
    
    // Update back button visibility
    updateBackButton() {
        const backBtn = document.getElementById('back-btn');
        if (AppState.cardHistory.length > 1 && AppState.currentCard !== 1) {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }
    },
    
    // Go back to previous card
    goBack() {
        const previousCard = AppState.getPreviousCard();
        if (previousCard) {
            this.showCard(previousCard);
        }
    },
    
    // Navigate based on current card and selection
    navigateNext(selection = null) {
        const currentCard = AppState.currentCard;
        
        switch (currentCard) {
            case 1: // Client Type Selection
                AppState.saveData('clientType', selection);
                this.showCard(2);
                break;
                
            case 2: // Service Selection
                AppState.saveData('serviceType', selection);
                if (selection === 'landscape' || selection === 'gardening') {
                    AppState.serviceFlow = 'branch1';
                    this.showCard(3);
                } else if (selection === 'turf' || selection === 'mowing') {
                    AppState.serviceFlow = 'branch2';
                    this.showCard(12);
                }
                break;
                
            case 3: // Name Input Branch 1
                this.showCard(4);
                break;
                
            case 4: // Property Address Branch 1
                const differentBilling = document.getElementById('different-billing').checked;
                if (differentBilling) {
                    this.showCard(5);
                } else {
                    this.showCard(6);
                }
                break;
                
            case 5: // Billing Address Branch 1
                this.showCard(6);
                break;
                
            case 6: // Phone Number Branch 1
                this.showCard(7);
                break;
                
            case 7: // Email Address Branch 1
                this.showCard(8);
                break;
                
            case 8: // How Did You Hear Branch 1
                AppState.saveData('referralSource', selection);
                this.showCard(9);
                break;
                
            case 9: // Project Description
                this.showCard(10);
                break;
                
            case 10: // Budget Selection
                AppState.saveData('budget', selection);
                this.showCard(11);
                break;
                
            case 12: // Name Input Branch 2
                this.showCard(13);
                break;
                
            case 13: // Property Address Branch 2
                const differentBilling2 = document.getElementById('different-billing-2').checked;
                if (differentBilling2) {
                    this.showCard(14);
                } else {
                    this.showCard(15);
                }
                break;
                
            case 14: // Billing Address Branch 2
                this.showCard(15);
                break;
                
            case 15: // Phone Number Branch 2
                this.showCard(16);
                break;
                
            case 16: // Email Address Branch 2
                this.showCard(17);
                break;
                
            case 17: // How Did You Hear Branch 2
                AppState.saveData('referralSource', selection);
                this.showCard(18);
                break;
                
            case 18: // Service Selection Branch 2
                this.processServiceSelection();
                break;
                
            case 19: // Lawn Size
                AppState.saveData('lawnSize', selection);
                this.processLawnSizeSelection();
                break;
                
            case 20: // Fertilization Type
                AppState.saveData('fertilizationType', selection);
                this.processFertilizationSelection();
                break;
                
            case 21: // Garden Frequency
                AppState.saveData('gardenFrequency', selection);
                this.processGardenFrequencySelection();
                break;
                
            case 22: // Contact Soon - End
                this.closePopup();
                break;
                
            case 23: // Special Offer
                this.showCard(24);
                break;
                
            case 24: // Appointment Scheduling
                this.showCard(25);
                break;
                
            case 25: // Credit Card Info
                this.showCard(26);
                break;
                
            case 26: // Order Review
                this.processOrderConfirmation();
                break;
                
            case 27: // Single Service Confirmation
            case 28: // Multiple Services Confirmation
                this.closePopup();
                break;
        }
    },
    
    // Process service selection logic
    processServiceSelection() {
        const serviceCheckboxes = document.querySelectorAll('input[name="services"]:checked');
        const selectedServices = Array.from(serviceCheckboxes).map(cb => cb.value);
        AppState.selectedServices = selectedServices;
        AppState.saveData('selectedServices', selectedServices);
        
        // Determine next card based on service combinations
        const hasMowing = selectedServices.includes('biweekly-mowing') || selectedServices.includes('weekly-mowing');
        const hasFertilization = selectedServices.includes('fertilization');
        const hasGardening = selectedServices.includes('gardening');
        const hasIrrigation = selectedServices.includes('irrigation');
        
        if (selectedServices.length === 0) {
            alert('Please select at least one service.');
            return;
        }
        
        // Single service flows
        if (selectedServices.length === 1) {
            if (hasMowing) {
                this.showCard(19); // Lawn Size
            } else if (hasFertilization) {
                this.showCard(20); // Fertilization Type
            } else if (hasGardening) {
                this.showCard(21); // Garden Frequency
            } else if (hasIrrigation) {
                this.showCard(22); // Contact Soon
            }
        } else {
            // Multiple service flows
            if (hasMowing) {
                this.showCard(19); // Start with lawn size if mowing is selected
            } else if (hasFertilization || hasGardening || hasIrrigation) {
                this.showCard(22); // Complex service combinations
            }
        }
    },
    
    // Process lawn size selection
    processLawnSizeSelection() {
        const services = AppState.selectedServices;
        const hasMowing = services.includes('biweekly-mowing') || services.includes('weekly-mowing');
        const hasFertilization = services.includes('fertilization');
        const hasGardening = services.includes('gardening');
        
        if (services.length === 1 && hasMowing) {
            this.showCard(23); // Special offer for mowing only
        } else if (hasMowing && hasFertilization && !hasGardening) {
            this.showCard(20); // Fertilization type
        } else if (hasMowing && hasGardening && !hasFertilization) {
            this.showCard(21); // Garden frequency
        } else if (hasMowing && hasFertilization && hasGardening) {
            this.showCard(20); // Fertilization type first
        } else {
            this.showCard(23); // Default to special offer
        }
    },
    
    // Process fertilization selection
    processFertilizationSelection() {
        const services = AppState.selectedServices;
        const hasMowing = services.includes('biweekly-mowing') || services.includes('weekly-mowing');
        const hasGardening = services.includes('gardening');
        
        if (services.length === 1) {
            this.showCard(22); // Contact soon for fertilization only
        } else if (hasMowing && hasGardening) {
            this.showCard(21); // Garden frequency
        } else if (hasMowing) {
            this.showCard(23); // Special offer
        } else {
            this.showCard(22); // Contact soon
        }
    },
    
    // Process garden frequency selection
    processGardenFrequencySelection() {
        const services = AppState.selectedServices;
        const hasMowing = services.includes('biweekly-mowing') || services.includes('weekly-mowing');
        
        if (hasMowing) {
            this.showCard(23); // Special offer
        } else {
            this.showCard(22); // Contact soon
        }
    },
    
    // Process order confirmation
    processOrderConfirmation() {
        const services = AppState.selectedServices;
        
        if (services.length === 1) {
            this.showCard(27); // Single service confirmation
        } else {
            this.showCard(28); // Multiple services confirmation
        }
    },
    
    // Close popup
    closePopup() {
        const overlay = document.getElementById('popup-overlay');
        overlay.style.display = 'none';
        AppState.reset();
    }
};

// Form Handler
const FormHandler = {
    // Validate current card form
    validateCurrentCard() {
        const currentCard = document.getElementById(`card-${AppState.currentCard}`);
        const form = currentCard.querySelector('.card-form');
        
        if (!form) return true; // No form to validate
        
        const requiredFields = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#e74c3c';
                isValid = false;
            } else {
                field.style.borderColor = '#e0e0e0';
            }
        });
        
        return isValid;
    },
    
    // Save form data
    saveFormData() {
        const currentCard = document.getElementById(`card-${AppState.currentCard}`);
        const form = currentCard.querySelector('.card-form');
        
        if (!form) return;
        
        const formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            AppState.saveData(key, value);
        }
    },
    
    // Update order summary
    updateOrderSummary() {
        const serviceSummary = document.getElementById('service-summary');
        const lawnSizeSummary = document.getElementById('lawn-size-summary');
        const appointmentSummary = document.getElementById('appointment-summary');
        const totalPrice = document.getElementById('total-price');
        
        // Service summary
        if (serviceSummary) {
            const services = AppState.selectedServices;
            serviceSummary.innerHTML = services.map(service => 
                service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
            ).join(', ');
        }
        
        // Lawn size summary
        if (lawnSizeSummary) {
            const lawnSize = AppState.getData('lawnSize');
            lawnSizeSummary.textContent = lawnSize ? lawnSize.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A';
        }
        
        // Appointment summary
        if (appointmentSummary) {
            const date = AppState.getData('appointmentDate');
            const time = AppState.getData('appointmentTime');
            appointmentSummary.textContent = date && time ? `${date} at ${time}` : 'Not scheduled';
        }
        
        // Calculate total price (simplified pricing logic)
        if (totalPrice) {
            let total = 0;
            const services = AppState.selectedServices;
            const lawnSize = AppState.getData('lawnSize');
            
            // Basic pricing logic
            if (services.includes('weekly-mowing')) {
                total += lawnSize === 'small' ? 50 : lawnSize === 'medium' ? 75 : lawnSize === 'large' ? 100 : 150;
            }
            if (services.includes('biweekly-mowing')) {
                total += lawnSize === 'small' ? 30 : lawnSize === 'medium' ? 45 : lawnSize === 'large' ? 60 : 90;
            }
            if (services.includes('fertilization')) {
                total += 75;
            }
            if (services.includes('gardening')) {
                total += 100;
            }
            
            totalPrice.textContent = `$${total}`;
        }
    },
    
    // Update confirmation services list
    updateConfirmationServices() {
        const servicesList = document.getElementById('confirmed-services-list');
        if (servicesList) {
            const services = AppState.selectedServices;
            servicesList.innerHTML = '<h4>Confirmed Services:</h4><ul>' + 
                services.map(service => 
                    `<li>${service.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>`
                ).join('') + '</ul>';
        }
    }
};

// Event Listeners
const EventListeners = {
    init() {
        // Close button
        document.getElementById('close-btn').addEventListener('click', () => {
            CardController.closePopup();
        });
        
        // Back button
        document.getElementById('back-btn').addEventListener('click', () => {
            CardController.goBack();
        });
        
        // Close final buttons
        document.querySelectorAll('.close-final-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                CardController.closePopup();
            });
        });
        
        // Option buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const value = e.target.closest('.option-btn').dataset.value;
                CardController.navigateNext(value);
            });
        });
        
        // Next buttons
        document.querySelectorAll('.next-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (FormHandler.validateCurrentCard()) {
                    FormHandler.saveFormData();
                    CardController.navigateNext();
                }
            });
        });
        
        // Confirm button
        document.querySelector('.confirm-btn')?.addEventListener('click', () => {
            FormHandler.saveFormData();
            CardController.navigateNext();
        });
        
        // Form submissions
        document.querySelectorAll('.card-form').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (FormHandler.validateCurrentCard()) {
                    FormHandler.saveFormData();
                    CardController.navigateNext();
                }
            });
        });
        
        // Card 26 (Order Review) - update summary when shown
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.id === 'card-26' && target.classList.contains('active')) {
                        FormHandler.updateOrderSummary();
                    }
                    if ((target.id === 'card-27' || target.id === 'card-28') && target.classList.contains('active')) {
                        FormHandler.updateConfirmationServices();
                    }
                }
            });
        });
        
        document.querySelectorAll('.card').forEach(card => {
            observer.observe(card, { attributes: true });
        });
        
        // Overlay click to close
        document.getElementById('popup-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                CardController.closePopup();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                CardController.closePopup();
            }
        });
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    EventListeners.init();
    CardController.showCard(1); // Show first card
});

// Public API for external integration
window.LandscapeIntake = {
    open() {
        document.getElementById('popup-overlay').style.display = 'flex';
        AppState.reset();
        CardController.showCard(1);
    },
    
    close() {
        CardController.closePopup();
    },
    
    getUserData() {
        return { ...AppState.userData };
    }
};