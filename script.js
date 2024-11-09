// Smooth scrolling
document.addEventListener('DOMContentLoaded', () => {
    const scrollLinks = document.querySelectorAll('.scroll-link');

    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent the default anchor click behavior
            
            const targetId = link.getAttribute('href').substring(1); // Get the target id from href
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Scroll to the start of the target element
                });
            }
        });
    });
});

// Back to Top button
document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.getElementById('backToTop');
    const content = document.querySelector('.content');

    const toggleButtonVisibility = () => {
        const sections = document.querySelectorAll('section'); // Get all sections
        const secondSection = sections[1]; // Target the second section (index 1)
        const sectionTop = secondSection.getBoundingClientRect().top + content.scrollTop;
        const scrollTop = content.scrollTop || 0;

        if (scrollTop >= sectionTop) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    };

    // Initial check to set button visibility
    toggleButtonVisibility();

    // Attach scroll event listener to the scrollable container
    content.addEventListener('scroll', toggleButtonVisibility);

    // Smooth scroll to top on button click
    backToTopButton.addEventListener('click', () => {
        content.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});


// Rent out form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reservation-form');
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission
    
            const name = document.getElementById('name').value;
            const studentNumber = document.getElementById('student-number').value;
            const personalMessage = document.getElementById('personal-message').value;
            const instrumentName = document.getElementById('instrument').textContent;
    
            const receiver = 'ja.rozema@pl.hanze.nl';
            const subject = `Evert Kluter Instruments - ${instrumentName} Reservation Request`;
            const body = `*This is an automatically generated email.*\r\n\r\n` +
                `A student would like to reserve the ${instrumentName}. Please find student details below:\r\n\r\n` +
                `Student Name: ${name}\r\n` +
                `Student Number: ${studentNumber}\r\n` +
                `Student Message:\r\n` +
                `------------------------\r\n\r\n` +
                `${personalMessage}\r\n\r\n` +
                `------------------------\r\n\r\n` +
                `Kind regards,\r\n\r\n` +
                `${name}`;
    
    
            // Create the mailto link with the pre-filled subject and body
            const mailtoLink = `mailto:${encodeURIComponent(receiver)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
            // Open the user's email client with the mailto link
            window.location.href = mailtoLink;
        });
    }
});

