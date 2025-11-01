// Language switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('langToggle');
    let currentLang = localStorage.getItem('language') || 'en';
    
    // Set initial language
    setLanguage(currentLang);
    
    // Language toggle click
    langToggle.addEventListener('click', function() {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(currentLang);
        localStorage.setItem('language', currentLang);
    });
    
    function setLanguage(lang) {
        const elements = document.querySelectorAll('[data-en][data-ar]');
        
        elements.forEach(element => {
            if (lang === 'ar') {
                element.textContent = element.getAttribute('data-ar');
            } else {
                element.textContent = element.getAttribute('data-en');
            }
        });
        
        // Update language button text
        langToggle.textContent = lang === 'en' ? 'العربية' : 'English';
        
        // Update placeholders
        const placeholderElements = document.querySelectorAll('[data-en-placeholder][data-ar-placeholder]');
        placeholderElements.forEach(element => {
            if (lang === 'ar') {
                element.placeholder = element.getAttribute('data-ar-placeholder');
            } else {
                element.placeholder = element.getAttribute('data-en-placeholder');
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = lang === 'ar' ? 'ar' : 'en-GB';
        
        // Add/remove RTL class
        if (lang === 'ar') {
            document.body.classList.add('rtl');
        } else {
            document.body.classList.remove('rtl');
        }
        
        currentLang = lang;
    }
});