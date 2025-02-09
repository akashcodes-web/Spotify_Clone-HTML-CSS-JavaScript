let audio = new Audio()
let currentlyPlayingCard = null; 
let isPlaying = false; 

// Get references to controls
const footerPlayPauseButton = document.getElementById("footer-play-pause");
const progressBar = document.getElementById("progress-bar");
const currentTimeDisplay = document.getElementById("curr_time");
const totalTimeDisplay = document.getElementById("total_time");
const volumeControl = document.getElementById("volume-control");

// Format time as mm:ss
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Update progress bar and time displays
function updateProgress() {
    if (!isNaN(audio.duration)) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        currentTimeDisplay.textContent = formatTime(audio.currentTime); 
        totalTimeDisplay.textContent = formatTime(audio.duration);
    }
}

// Play a new song or toggle play/pause
function playSong(cardElement) {
    const songPath = cardElement.getAttribute("data-song");
    const songTitle = cardElement.querySelector(".card_title").textContent;
    const artistName = cardElement.querySelector(".card_info").textContent;

    // Stop the currently playing song if another card is clicked
    if (currentlyPlayingCard && currentlyPlayingCard !== cardElement) {
        currentlyPlayingCard.querySelector('.play-icon').src = "images.png";
        audio.pause(); 
        audio.currentTime = 0; 
    }

    if (currentlyPlayingCard === cardElement) {
        // Toggle play/pause for the current song
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            cardElement.querySelector('.play-icon').src = "player_icon3.png";
            footerPlayPauseButton.src = "player_icon3.png";
        } else {
            audio.play();
            isPlaying = true;
            cardElement.querySelector('.play-icon').src = "pause.jpg";
            footerPlayPauseButton.src = "pause.jpg";
        }
    } else {
        // Load and play the new song
        currentlyPlayingCard = cardElement; 
        audio.src = songPath;

        // Load metadata to set total time
        audio.addEventListener("loadedmetadata", () => {
            totalTimeDisplay.textContent = formatTime(audio.duration);
        });

        audio.play();
        isPlaying = true;

        // Update play icon for the new card and footer
        cardElement.querySelector('.play-icon').src = "pause.jpg";
        footerPlayPauseButton.src = "pause.jpg";

    }
}

// Footer play/pause button functionality
footerPlayPauseButton.addEventListener("click", () => {
    if (currentlyPlayingCard) {
        playSong(currentlyPlayingCard);
    }
});

// Add event listeners for all album cards
document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', () => playSong(card));
});

// Update progress bar during playback
audio.addEventListener("timeupdate", updateProgress);

// Reset progress bar and icon when song ends
audio.addEventListener("ended", () => {
    if (currentlyPlayingCard) {
        currentlyPlayingCard.querySelector('.play-icon').src = "images.png";
        currentlyPlayingCard = null;
    }
    footerPlayPauseButton.src = "player_icon3.png";
    progressBar.value = 0;
    currentTimeDisplay.textContent = "00:00";
    isPlaying = false;
});

// Allow seeking using progress bar
progressBar.addEventListener("input", () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

// Volume control functionality
volumeControl.addEventListener("input", () => {
    audio.volume = volumeControl.value; 
});