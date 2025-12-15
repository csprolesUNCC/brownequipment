const form = document.querySelector('.contact-form');

// Function to handle form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop the default browser submission/redirect

    const formData = new FormData(form);
    const formUrl = form.getAttribute('action');
    const submitButton = form.querySelector('.primary-cta');
    
    const name = formData.get('name') || 'Valued Customer';

    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
        const response = await fetch(formUrl, {
            method: 'POST',
            body: formData, 
        });

        const result = await response.json(); 
        
        if (response.ok && result.success) {
            alert(`✅ Success! Thank you, ${name}. Your quote request has been sent successfully. We will contact you shortly.`);
            form.reset(); // Clear the form fields
        } else {
            alert('❌ Submission Failed: ' + (result.message || 'An unknown error occurred. Please check your connection and try again.'));
        }

    } catch (error) {
        console.error('Submission error:', error);
        alert('⚠️ A network error occurred. Please call us directly at 704-921-4644.');
    } finally {
        submitButton.textContent = 'Request Quote & Upload File';
        submitButton.disabled = false;
    }
});