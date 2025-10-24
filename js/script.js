// Welcome Popup functionality
const welcomePopup = document.getElementById('welcomePopup');
const welcomeForm = document.getElementById('welcomeForm');
const welcomeMessage = document.getElementById('welcomeMessage');
const welcomeText = document.getElementById('welcomeText');

// Show welcome popup on page load
window.addEventListener('load', () => {
	const visitorName = localStorage.getItem('visitorName');
	if (!visitorName) {
		welcomePopup.classList.remove('hidden');
	} else {
		displayWelcomeMessage(visitorName);
	}
});

// Handle welcome form submission
welcomeForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const name = document.getElementById('visitorName').value.trim();
	if (name) {
		localStorage.setItem('visitorName', name);
		welcomePopup.classList.add('hidden');
		displayWelcomeMessage(name);
	}
});

// Display welcome message
function displayWelcomeMessage(name) {
	const message = `Hi, ${name}! Welcome to my profile page!`;
	welcomeText.textContent = message;
	welcomeMessage.classList.remove('hidden');
}

// Mobile menu functionality
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
	mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking on a link
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileNavLinks.forEach((link) => {
	link.addEventListener('click', (e) => {
		e.preventDefault();

		// Close mobile menu
		mobileMenu.classList.add('hidden');

		// Get target section and scroll to it
		const targetId = link.getAttribute('href');
		const targetSection = document.querySelector(targetId);

		if (targetSection) {
			// Use larger offset for mobile to account for navbar
			const offsetTop = targetSection.offsetTop - 36;
			window.scrollTo({
				top: offsetTop,
				behavior: 'smooth',
			});
		}
	});
});

// Navigation functionality - smooth scroll and active state
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach((link) => {
	link.addEventListener('click', (e) => {
		e.preventDefault();

		// Remove active class from all links
		navLinks.forEach((l) => l.classList.remove('active'));

		// Add active class to clicked link
		link.classList.add('active');

		// Get target section and scroll to it
		const targetId = link.getAttribute('href');
		const targetSection = document.querySelector(targetId);

		if (targetSection) {
			// Calculate offset based on viewport width
			const isMobile = window.innerWidth < 768;
			const offsetTop = targetSection.offsetTop - (isMobile ? 80 : 64);
			window.scrollTo({
				top: offsetTop,
				behavior: 'smooth',
			});
		}
	});
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
	let current = '';
	const sections = document.querySelectorAll('section');

	sections.forEach((section) => {
		const sectionTop = section.offsetTop - 120;
		const sectionHeight = section.clientHeight;

		if (
			window.scrollY >= sectionTop &&
			window.scrollY < sectionTop + sectionHeight
		) {
			current = section.getAttribute('id');
		}
	});

	navLinks.forEach((link) => {
		link.classList.remove('active');
		if (link.getAttribute('href') === `#${current}`) {
			link.classList.add('active');
		}
	});
});

// Download CV
document
	.getElementById('downloadCV')
	.addEventListener('click', async function (e) {
		e.preventDefault();
		try {
			const response = await fetch('./assets/CV_Moch_Faisal_Khoirudin.pdf');
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.style.display = 'none';
			a.href = url;
			a.download = 'CV_Faisal.pdf';
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			document.body.removeChild(a);
		} catch (error) {
			console.error('Download failed:', error);
			// Fallback to direct link
			window.open('./assets/CV_Moch_Faisal_Khoirudin.pdf', '_blank');
		}
	});

// Form submission and messages display
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const messagesList = document.getElementById('messagesList');
let messages = JSON.parse(localStorage.getItem('messages')) || [];

// Display existing messages on page load
displayMessages();

contactForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// Get form data
	const formData = {
		id: Date.now(),
		name: document.getElementById('name').value,
		email: document.getElementById('email').value,
		dob: document.getElementById('dob').value,
		gender: document.querySelector('input[name="gender"]:checked').value,
		message: document.getElementById('message').value,
		timestamp: new Date().toLocaleString(),
	};

	// Add to messages array
	messages.unshift(formData);

	// Keep only last 5 messages
	if (messages.length > 5) {
		messages = messages.slice(0, 5);
	}

	// Save to localStorage
	localStorage.setItem('messages', JSON.stringify(messages));

	// Display messages
	displayMessages();

	// Show success message
	successMessage.classList.remove('hidden');

	// Reset form
	contactForm.reset();

	// Hide success message after 5 seconds
	setTimeout(() => {
		successMessage.classList.add('hidden');
	}, 5000);
});

// Function to display messages
function displayMessages() {
	if (messages.length === 0) {
		messagesList.innerHTML =
			'<p class="text-gray-500 text-center py-8">No messages yet</p>';
		return;
	}

	messagesList.innerHTML = messages
		.map(
			(msg) => `
        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-2">
                <h4 class="font-bold text-gray-900 flex items-center">
                    <span class="material-icons text-blue-600 text-sm mr-1">person</span>
                    ${msg.name}
                </h4>
            </div>
            <div class="space-y-1 text-sm">
                <p class="text-gray-600 flex items-center">
                    <span class="material-icons text-xs mr-1">email</span>
                    ${msg.email}
                </p>
                <p class="text-gray-600 flex items-center">
                    <span class="material-icons text-xs mr-1">cake</span>
                    ${msg.dob}
                </p>
                <p class="text-gray-600 flex items-center">
                    <span class="material-icons text-xs mr-1">wc</span>
                    ${msg.gender}
                </p>
                <p class="text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                    ${msg.message}
                </p>
                <p class="text-xs text-gray-400 mt-2">${msg.timestamp}</p>
            </div>
        </div>
    `
		)
		.join('');
}
