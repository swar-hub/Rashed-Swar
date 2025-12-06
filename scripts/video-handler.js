// Enhanced MOV Video Handler
document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.artist-video');
    
    if (video) {
        // Force video to load
        video.load();
        
        // Handle video errors and retry with different approaches
        video.addEventListener('error', function(e) {
            console.log('Video error, attempting alternative loading method');
            
            // Try reloading the video
            setTimeout(() => {
                video.load();
            }, 1000);
        });
        
        // Ensure video metadata is loaded
        video.addEventListener('loadedmetadata', function() {
            console.log('Video metadata loaded successfully');
            console.log('Duration:', video.duration);
            console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
        });
        
        // Monitor video loading
        video.addEventListener('loadeddata', function() {
            console.log('Video data loaded');
        });
        
        // Handle playback
        video.addEventListener('canplay', function() {
            console.log('Video can play');
        });
        
        // Handle stalled loading
        video.addEventListener('stalled', function() {
            console.log('Video loading stalled, retrying...');
            video.load();
        });
        
        // Add click to play functionality
        video.addEventListener('click', function() {
            if (video.paused) {
                video.play().catch(err => {
                    console.log('Play error:', err);
                });
            } else {
                video.pause();
            }
        });
    }
});
