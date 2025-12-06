// Image Protection
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
        
        img.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });
    });
    
    // Protect dynamically added images
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    const newImages = node.querySelectorAll ? node.querySelectorAll('img') : [];
                    newImages.forEach(img => {
                        img.addEventListener('contextmenu', (e) => {
                            e.preventDefault();
                            return false;
                        });
                        img.addEventListener('dragstart', (e) => {
                            e.preventDefault();
                            return false;
                        });
                    });
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});
