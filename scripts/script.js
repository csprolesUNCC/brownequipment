const form = document.querySelector('.contact-form');
const popup = document.getElementById('success-popup');
const popupMessage = popup.querySelector('p');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const formUrl = form.getAttribute('action');
    const submitButton = form.querySelector('.primary-cta');

    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        const response = await fetch(formUrl, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        
        if (response.ok && result.success) {
            const name = formData.get('name') || 'Valued Customer';
            popupMessage.innerHTML = `Thank you, **${name}**! Your quote request has been sent successfully. We will review your files and contact you shortly.`;
            popup.classList.add('popup-visible');
            form.reset();
        } else {
            alert('Submission Failed: ' + (result.message || 'Please check your connection and try again.'));
        }

    } catch (error) {
        console.error('Submission error:', error);
        alert('A network error occurred. Please call us at 704-921-4644.');
    } finally {
        submitButton.textContent = 'Request Quote & Upload File';
        submitButton.disabled = false;
    }
});

function closePopup() {
    popup.classList.remove('popup-visible');
}