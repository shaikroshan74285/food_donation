// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // IMPORTANT: Replace with your actual API key
    authDomain: "efooddonation.firebaseapp.com",
    databaseURL: "https://efooddonation-default-rtdb.firebaseio.com",
    projectId: "efooddonation",
    storageBucket: "efooddonation.appspot.com",
    messagingSenderId: "675449254256",
    appId: "1:675449254256:web:9adc152d406fe49dc91fb5",
    measurementId: "G-MRLZ0V85PJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsContainer = document.getElementById('resultsContainer');
const locationForm = document.getElementById('locationForm');
const imageUploadBox = document.getElementById('imageUploadBox');
const imageUpload = document.getElementById('imageUpload');
const alertModal = document.getElementById('alertModal');
const understandBtn = document.getElementById('understandBtn');
const closeModal = document.querySelector('.close');
const imageWarningModal = document.getElementById('imageWarningModal');
const closeImageWarning = document.querySelector('.close-image-warning');
const statNumbers = document.querySelectorAll('.stat-number');

// Create scroll up button
const scrollUpButton = document.createElement('button');
scrollUpButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollUpButton.className = 'scroll-up-btn';
document.body.appendChild(scrollUpButton);

const predefinedLocations = [
    {
        areaName: "Dharavi Slum",
        cityName: "Mumbai",
        peopleCount: 1000,
        gpsLink: "https://maps.app.goo.gl/SmiE3Pd94czvJ96EA",
        description: "One of Asia's largest slums with severe food scarcity issues.",
        landmark: "Near Mahim Railway Station",
        imageId: "dharavi"
    },
    {
        areaName: "Nizamuddin Basti",
        cityName: "Delhi",
        peopleCount: 500,
        gpsLink: "https://maps.app.goo.gl/4VrDgGTJ83WQTt3PA",
        description: "Urban slum near Nizamuddin Dargah with many homeless families.",
        landmark: "Opposite Nizamuddin Railway Station",
        imageId: "nizamuddin"
    },
    {
        areaName: "Howrah Railway Station Area",
        cityName: "Kolkata",
        peopleCount: 300,
        gpsLink: "https://maps.app.goo.gl/QtRWHCwJj386GdhAA",
        description: "Many homeless people live around the station premises.",
        landmark: "Howrah Railway Station",
        imageId: "howrah"
    }
];

// Add predefined data to Firebase (for testing)
function addPredefinedData() {
    predefinedLocations.forEach((location, index) => {
        const key = location.imageId || `predefined-${index}`;
        database.ref('locations/' + key).set(location)
            .then(() => console.log(`Location ${key} added successfully`))
            .catch(error => console.error(`Error adding location ${key}:`, error));
    });
}

// Uncomment to add predefined data (run once if needed)
// database.ref('locations').once('value').then(snapshot => {
//     if (!snapshot.exists()) {
//         addPredefinedData();
//         console.log("Added predefined data to Firebase.");
//     }
// });

// Consolidated DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu functionality
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight || 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                closeMobileMenu();
            });
        });
    }

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }

    // Modal functionality
    if (closeModal) {
        closeModal.addEventListener('click', () => closeModalWithAnimation(alertModal));
    }
    if (understandBtn) {
        understandBtn.addEventListener('click', () => closeModalWithAnimation(alertModal));
    }
    if (closeImageWarning) {
        closeImageWarning.addEventListener('click', () => closeModalWithAnimation(imageWarningModal));
    }

    // Image upload warning with animation
    if (imageUploadBox) {
        imageUploadBox.addEventListener('click', () => {
            if (imageWarningModal) {
                imageWarningModal.style.display = 'flex';
                imageWarningModal.classList.add('slide-in');
            }
        });
    }

    // Add event listener for actual file selection
    if (imageUpload) {
        imageUpload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                console.log('File selected:', file.name);
                const uploadText = imageUploadBox?.querySelector('p');
                if (uploadText) uploadText.textContent = `Selected: ${file.name}`;
            }
        });
    }

    // Animation and stat initialization
    animateOnScroll();
    checkAndAnimateStats();

    // Add target data attributes to stat numbers
    statNumbers.forEach(num => {
        if (!num.hasAttribute('data-target')) {
            const value = parseInt(num.innerText.replace(/,/g, '')) || 0;
            num.setAttribute('data-target', value);
            num.innerText = '0';
        } else {
            num.innerText = '0';
        }
    });
    checkAndAnimateStats();

    // Initialize charts
    try {
        initCharts();
    } catch (error) {
        console.error('Error initializing charts:', error);
        const chartSection = document.getElementById('info');
        if (chartSection) {
            chartSection.innerHTML += '<p class="error-message">Could not load charts. Please try refreshing.</p>';
        }
    }
});

// Show alert modal and hero animations on page load
window.addEventListener('load', () => {
    // Hero content animation
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const heroTitle = heroContent.querySelector('.hero-title');
        if (heroTitle) {
            const titleText = heroTitle.textContent;
            heroTitle.innerHTML = '';
            titleText.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char;
                span.style.animationDelay = `${index * 0.05}s`;
                span.classList.add('hero-char-animate');
                heroTitle.appendChild(span);
            });
        }
        const heroSubtitle = heroContent.querySelector('.hero-subtitle');
        const searchContainer = heroContent.querySelector('.search-container');
        if (heroSubtitle) heroSubtitle.style.animationDelay = '1s';
        if (searchContainer) searchContainer.style.animationDelay = '1.2s';
        heroContent.classList.add('visible');
    }

    // Show alert modal after a delay
    setTimeout(() => {
        if (alertModal) {
            alertModal.style.display = 'flex';
            alertModal.classList.add('fade-in');
        }
    }, 1500);
});

// Close modal with animation
function closeModalWithAnimation(modal) {
    if (!modal) return;
    const animationClass = modal.classList.contains('slide-in') ? 'slide-out' : 'fade-out';
    modal.classList.add(animationClass);
    modal.classList.remove(modal.classList.contains('slide-in') ? 'slide-in' : 'fade-in');
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove(animationClass);
    }, 300);
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === alertModal) {
        closeModalWithAnimation(alertModal);
    }
    if (e.target === imageWarningModal) {
        closeModalWithAnimation(imageWarningModal);
    }
});

// Scroll up button functionality
scrollUpButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Show/hide scroll up button and trigger animations on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollUpButton.classList.add('show');
    } else {
        scrollUpButton.classList.remove('show');
    }
    animateOnScroll();
    checkAndAnimateStats();
});

// Animation Functions
const animatedElements = document.querySelectorAll('.section-header, .result-card, .stat-card, .chart-wrapper, .footer-links, .footer-contact, .references');
function animateOnScroll() {
    const screenPosition = window.innerHeight / 1.15;
    animatedElements.forEach((element, index) => {
        const elementPosition = element.getBoundingClientRect().top;
        if (elementPosition < screenPosition && !element.classList.contains('in-view')) {
            if (element.classList.contains('result-card')) {
                element.style.transitionDelay = `${index * 0.08}s`;
            }
            if (element.classList.contains('footer-links') || element.classList.contains('footer-contact')) {
                element.style.transitionDelay = `${index * 0.1}s`;
            }
            element.classList.add('in-view');
        }
    });
}

function checkAndAnimateStats() {
    const screenPosition = window.innerHeight / 1.2;
    statNumbers.forEach(statNum => {
        const statCard = statNum.closest('.stat-card');
        if (!statCard || statCard.classList.contains('counted')) return;
        const elementPosition = statCard.getBoundingClientRect().top;
        if (elementPosition < screenPosition) {
            statCard.classList.add('counted');
            const target = +statNum.getAttribute('data-target');
            const duration = 1500;
            animateCountUp(statNum, target, duration);
        }
    });
}

function animateCountUp(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    const startTime = performance.now();
    function updateCount(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(1, elapsedTime / duration);
        start = Math.ceil(target * progress);
        element.innerText = start.toLocaleString();
        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            element.innerText = target.toLocaleString();
        }
    }
    requestAnimationFrame(updateCount);
}

// Check if GPS URL exists in Firebase
function checkGpsLinkExists(gpsLink) {
    return new Promise((resolve) => {
        database.ref('locations').orderByChild('gpsLink').equalTo(gpsLink).once('value')
            .then(snapshot => {
                resolve(snapshot.exists());
            })
            .catch(error => {
                console.error('Error checking GPS link:', error);
                resolve(false); // Proceed as if not found in case of error
            });
    });
}

// Form submission with GPS URL check
locationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const areaName = document.getElementById('areaName').value.trim();
    const cityName = document.getElementById('cityName').value.trim();
    const peopleCount = parseInt(document.getElementById('peopleCount').value);
    const gpsLink = document.getElementById('gpsLink').value.trim();
    const description = document.getElementById('description').value.trim();
    const landmark = document.getElementById('landmark').value.trim();

    // Validate required fields
    if (!areaName || !cityName || !gpsLink || isNaN(peopleCount) || peopleCount <= 0) {
        showNotification('Please fill in all required fields with valid data (People Count must be positive).', 'error');
        return;
    }
    if (!gpsLink.toLowerCase().startsWith('http://') && !gpsLink.toLowerCase().startsWith('https://')) {
        showNotification('Please provide a valid GPS link (starting with http:// or https://).', 'error');
        return;
    }

    const submitBtn = locationForm.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    submitBtn.classList.add('submitting');

    try {
        // Check if GPS URL already exists
        const gpsLinkExists = await checkGpsLinkExists(gpsLink);
        if (gpsLinkExists) {
            showNotification('This Google Maps URL already exists in the database.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Location';
            submitBtn.classList.remove('submitting');
            return;
        }

        // Proceed with saving new location
        const newLocation = {
            areaName,
            cityName,
            peopleCount,
            gpsLink,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        if (description) newLocation.description = description;
        if (landmark) newLocation.landmark = landmark;

        await database.ref('locations').push(newLocation);
        showNotification('Location data submitted successfully! Thank you!', 'success');
        locationForm.reset();
        if (imageUploadBox) {
            const uploadText = imageUploadBox.querySelector('p');
            if (uploadText) uploadText.textContent = 'Click to add image (Optional)';
        }
    } catch (error) {
        console.error('Error submitting data:', error);
        showNotification('Submission Error: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Location';
        submitBtn.classList.remove('submitting');
    }
});

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <div class="notification-progress"></div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    const progressBar = notification.querySelector('.notification-progress');
    const duration = 4000;
    progressBar.style.animation = `progress ${duration}ms linear forwards`;

    setTimeout(() => {
        notification.classList.remove('show');
        notification.addEventListener('transitionend', () => notification.remove());
    }, duration);
}

// Search functionality
function searchLocations(query) {
    resultsContainer.innerHTML = `
        <div class="search-loading">
            <div class="spinner"></div>
            <p>Searching for locations...</p>
        </div>`;

    database.ref('locations').once('value')
        .then(snapshot => {
            const locations = [];
            if (snapshot.exists()) {
                snapshot.forEach(childSnapshot => {
                    locations.push({
                        id: childSnapshot.key,
                        ...childSnapshot.val()
                    });
                });
            }

            const allLocationData = [...locations];
            const firebaseIds = new Set(locations.map(loc => loc.id));

            predefinedLocations.forEach((predefLoc, index) => {
                const key = predefLoc.imageId || `predefined-${index}`;
                if (!firebaseIds.has(key)) {
                    allLocationData.push({
                        id: key,
                        ...predefLoc
                    });
                }
            });

            const lowerCaseQuery = query.toLowerCase();
            const filteredLocations = allLocationData.filter(location => {
                const areaMatch = location.areaName?.toLowerCase().includes(lowerCaseQuery);
                const cityMatch = location.cityName?.toLowerCase().includes(lowerCaseQuery);
                const descMatch = location.description?.toLowerCase().includes(lowerCaseQuery);
                return areaMatch || cityMatch || descMatch;
            });

            displayResults(filteredLocations);

            const resultsSection = document.getElementById('results');
            if (resultsSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight || 0;
                const elementPosition = resultsSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight - 20;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsContainer.innerHTML = `
                <div class="no-results error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading data. Please check your connection and try again.</p>
                </div>`;
        });
}

function displayResults(locations) {
    if (locations.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No locations found matching your search.</p>
                <span>Try searching for a different area or city.</span>
            </div>`;
        return;
    }

    resultsContainer.innerHTML = '';

    locations.forEach((location, index) => {
        const resultCard = document.createElement('div');
        resultCard.className = 'result-card';

        let imagePath = location.imageUrl || `images/${location.imageId || location.id}.jpg`;
        let imageHtml = `<div class="result-image" style="background-image: url('${imagePath}');" role="img" aria-label="${location.areaName}"></div>`;

        const img = new Image();
        img.src = imagePath;
        img.onerror = () => {
            const cardImageDiv = resultCard.querySelector('.result-image');
            if (cardImageDiv) {
                cardImageDiv.style.backgroundImage = 'url("images/placeholder-food.jpg")';
                cardImageDiv.classList.add('placeholder');
            }
        };

        resultCard.innerHTML = `
            ${imageHtml}
            <div class="result-content">
                <h3 class="result-title">${location.areaName}</h3>
                <p class="result-location"><i class="fas fa-map-marker-alt"></i> ${location.cityName || 'N/A'}</p>
                <p class="result-people"><i class="fas fa-users"></i> Needs approx. ${location.peopleCount || 'N/A'} people</p>
                ${location.description ? `<p class="result-description"><i class="fas fa-info-circle"></i> ${location.description}</p>` : ''}
                ${location.landmark ? `<p class="result-landmark"><i class="fas fa-map-pin"></i> Landmark: ${location.landmark}</p>` : ''}
                <a href="${location.gpsLink || '#'}" target="_blank" class="result-link" ${!location.gpsLink ? 'disabled' : ''}>
                    <i class="fas fa-directions"></i> Get Directions
                </a>
            </div>
        `;

        resultsContainer.appendChild(resultCard);

        setTimeout(() => {
            resultCard.classList.add('in-view');
        }, index * 100);
    });
}

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchLocations(query);
    } else {
        showNotification('Please enter a search term (e.g., city or area name).', 'error');
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Initialize charts
function initCharts() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library is not loaded.');
        return;
    }

    const wasteCtx = document.getElementById('wasteChart')?.getContext('2d');
    const hungerCtx = document.getElementById('hungerChart')?.getContext('2d');

    if (!wasteCtx || !hungerCtx) {
        console.error('One or both chart canvas elements not found.');
        return;
    }

    const chartOptionsBase = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    boxWidth: 12,
                    font: { size: 13 }
                }
            },
            title: {
                display: true,
                font: { size: 18, weight: 'bold' },
                padding: { top: 10, bottom: 20 },
                color: '#333'
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 10,
                boxPadding: 4
            }
        },
        animation: {
            duration: 1200,
            easing: 'easeInOutQuart',
            delay: (context) => {
                let delay = 0;
                if (context.type === 'data') {
                    delay = context.dataIndex * 50;
                }
                return delay;
            },
        },
    };

    const wasteChart = new Chart(wasteCtx, {
        type: 'bar',
        data: {
            labels: ['Weddings', 'Hotels', 'Restaurants', 'Households', 'Events'],
            datasets: [{
                label: 'Food Wasted (Est. Tons/Year)',
                data: [15, 10, 8, 20, 14],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1,
                borderRadius: 5,
            }]
        },
        options: {
            ...chartOptionsBase,
            plugins: {
                ...chartOptionsBase.plugins,
                title: {
                    ...chartOptionsBase.plugins.title,
                    text: 'Estimated Food Waste Sources'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Est. Tons per Year (Millions)',
                        font: { size: 14 }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.08)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            onHover: (event, chartElement) => {
                event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
            },
        }
    });

    const hungerChart = new Chart(hungerCtx, {
        type: 'doughnut',
        data: {
            labels: ['Undernourished (%)', 'Food Secure (%)', 'Severely Food Insecure (%)'],
            datasets: [{
                label: 'Food Security Status',
                data: [15, 60, 25],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
                borderColor: ['#ffffff', '#ffffff', '#ffffff'],
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            ...chartOptionsBase,
            plugins: {
                ...chartOptionsBase.plugins,
                title: {
                    ...chartOptionsBase.plugins.title,
                    text: 'Food Security Distribution (Est. %)'
                },
                legend: {
                    ...chartOptionsBase.plugins.legend,
                    position: 'right'
                }
            },
            cutout: '65%',
            onHover: (event, chartElement) => {
                event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
            },
        }
    });
}
