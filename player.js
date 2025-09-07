const video = document.getElementById("video");
const seekbar = document.getElementById("seekbar");
const playBtn = document.getElementById("playBtn")
const videoBox = document.querySelector(".videoBox")
const playIcon = document.getElementById("playIcon")
const controls = document.querySelector(".controls");
const playlistBox = document.querySelector(".playlistBox")
const loadingSpinner = document.getElementById("loadingSpinner");
const currentDurationLabel = document.getElementById("currentDurationLabel")
const totalDurationLabel = document.getElementById("totalDurationLabel")
const backwardBtn = document.getElementById("backwardBtn")
const forwardBtn = document.getElementById("forwardBtn")
const volumeSeekBar = document.getElementById("volumeSeekBar")
const volumeBtn = document.getElementById("volumeBtn")
const volumeIcon = document.getElementById("volumeIcon")
const fullscreenBtn = document.getElementById("fullscreenBtn")
const fullscreenIcon = document.getElementById("fullscreenIcon")
let autoplay = true;





/*functions*/
function updateSeekbar() {
    currentDurationLabel.innerHTML = formatTime(video.currentTime)
    seekbar.value = video.currentTime
    let percentage = (video.currentTime / video.duration) * 100
    seekbar.style.backgroundImage = `linear-gradient(to right, rgb(255, 255, 255) ${percentage}%, rgba(0, 0, 0, 0.603) 0%)`
    if (percentage == 100) {
        /*HAVE TO WRITE AUTOPLAY CODE*/
    }
    if (video.currentTime % 5) {


        if (series) {
            log[name] = [videoUrl, percentage, video.currentTime]
        } else {
            log[name] = [percentage, video.currentTime]
        }
        localStorage.setItem("log", JSON.stringify(log))
    }
}

function urlTrim(url) {
    url = url.split(".")[0];
    url = url.split("/");
    url = url[url.length - 1];
    return url;
}

function formatTime(seconds, showHours = true) {
    seconds = Math.floor(seconds);
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (showHours) {
        return [hrs, mins, secs]
            .map(v => String(v).padStart(2, "0"))
            .join(":");
    } else {
        return [mins + hrs * 60, secs]
            .map(v => String(v).padStart(2, "0"))
            .join(":");
    }
}

function updateVolumeIcon(volumeLevel) {
    if (volumeLevel == 0 && volumeIcon.src.indexOf("site_media/volume-xmark-solid-full.svg") == -1) {
        volumeIcon.src = "site_media/volume-xmark-solid-full.svg"
    } else if ((volumeLevel > 0 && volumeLevel < 50) && volumeIcon.src.indexOf("site_media/volume-low-solid-full.svg") == -1) {
        volumeIcon.src = "site_media/volume-low-solid-full.svg"
    } else if (volumeLevel >= 50 && volumeIcon.src.indexOf("site_media/volume-high-solid-full.svg") == -1) {
        volumeIcon.src = "site_media/volume-high-solid-full.svg"
    }
}




/*local Storage*/
const name = localStorage.getItem("name");
let url = localStorage.getItem("url");
const series = JSON.parse(localStorage.getItem("series"))
let videoUrl = localStorage.getItem("currentURL");
document.title = name

let log = {}
if (localStorage.getItem("log") === null) {
    localStorage.setItem("log", JSON.stringify(log));
} else {
    log = JSON.parse(localStorage.getItem("log"));
}

let logExits = (log[name]) ? true : false
if (!logExits) {
    if (series) {
        log[name] = [videoUrl, 0, 0]
    } else {
        log[name] = [0]
    }
    localStorage.setItem("log", JSON.stringify(log))
}




/*Video Player*/
let isPlaying = true
video.src = videoUrl
video.play()
playIcon.src = "site_media/pause-solid-full.svg"

video.onloadedmetadata = () => {
    seekbar.max = video.duration
    video.currentTime = (series) ? log[name][2] : log[name][1]
    console.log(video.currentTime)
    totalDurationLabel.innerHTML = formatTime(video.duration)
    setInterval(() => {
        updateSeekbar()
    }, 800)
    if (video.textTracks.length === 0) {
        console.log("No subtitles available for this video.");
    } else {
        console.log("Subtitles found!");
    }
}

loadingSpinner.style.display = "block"
video.addEventListener("canplay", () => {
    loadingSpinner.style.display = "none"
})

/* Play Pause Controls */
videoBox.addEventListener("click", () => {
    if (isPlaying) {
        video.pause()
        playIcon.src = "site_media/play-solid-full.svg"
        isPlaying = false
    } else {
        video.play()
        playIcon.src = "site_media/pause-solid-full.svg"
        isPlaying = true
    }
})

videoBox.addEventListener("mouseover", () => {
    controls.classList.add("show")
    controls.classList.remove("hide")
})
videoBox.addEventListener("mouseout", () => {
    controls.classList.remove("show")
    controls.classList.add("hide")
})
controls.addEventListener("click", (e) => {
    e.stopPropagation();
});
playBtn.addEventListener("click", (e) => {
    if (isPlaying) {
        video.pause()
        playIcon.src = "site_media/play-solid-full.svg"
        isPlaying = false
    } else {
        video.play()
        playIcon.src = "site_media/pause-solid-full.svg"
        isPlaying = true
    }
})



/* Seekbar Control */
seekbar.addEventListener("input", (e) => {
    video.currentTime = seekbar.value;
    if (isPlaying) {
        video.play()
    }
    updateSeekbar()
});


/* Other Controls */

backwardBtn.addEventListener("click", () => {
    let updatedTime = video.currentTime - 10
    video.currentTime = (updatedTime >= 0) ? updatedTime : 0
})

forwardBtn.addEventListener("click", () => {
    let updatedTime = video.currentTime + 10
    video.currentTime = (updatedTime <= video.duration) ? updatedTime : video.duration
})

let volumeLevel = localStorage.getItem("volume") ?? 100
localStorage.setItem("volume", volumeLevel)
volumeSeekBar.value = volumeLevel;
volumeSeekBar.style.backgroundImage = `linear-gradient(to right, white ${volumeLevel}%, #d3d3d3 ${volumeLevel}%)`
video.volume = volumeLevel / 100;
updateVolumeIcon(volumeLevel)

volumeSeekBar.addEventListener("input", () => {
    volumeLevel = volumeSeekBar.value
    volumeSeekBar.style.backgroundImage = `linear-gradient(to right, white ${volumeLevel}%, #d3d3d3 ${volumeLevel}%)`
    video.volume = (volumeLevel) / 100
    localStorage.setItem("volume", volumeLevel)
    updateVolumeIcon(volumeLevel)

})

volumeBtn.addEventListener("click", () => {
    volumeSeekBar.value = 0
    video.volume = 0
    volumeSeekBar.style.backgroundImage = `linear-gradient(to right, white ${0}%, #d3d3d3 ${0}%)`
    localStorage.setItem("volume", 0)
    volumeIcon.src = "site_media/volume-xmark-solid-full.svg"
})


/* Full Screen Settings */
fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        if (videoBox.requestFullscreen) {
            videoBox.requestFullscreen();
        } else if (videoBox.mozRequestFullScreen) {
            videoBox.mozRequestFullScreen();
        } else if (videoBox.webkitRequestFullscreen) {
            videoBox.webkitRequestFullscreen();
        } else if (videoBox.msRequestFullscreen) {
            videoBox.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
})

document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        fullscreenIcon.src = "site_media/compress-solid-full.svg"
    } else {
        fullscreenIcon.src = "site_media/expand-solid-full.svg"
    }
});




/* Playlist for series */
if (series) {
    let selectedCard = null;
    let selectedLabel = null;
    playlistBox.style.display = "flex"
    let urls = url.split(",")
    for (let i = 0; i < urls.length; i++) {
        let isPlayingCard = (urls[i] == videoUrl)
        let card = document.createElement("div")
        let cardLabel = document.createElement("p")
        if (isPlayingCard) {
            cardLabel.style.color = "black"
            selectedCard = card
            selectedLabel = cardLabel
        }
        cardLabel.innerHTML = urlTrim(urls[i])
        card.classList.add(isPlayingCard ? "watchingCard" : "card")
        card.appendChild(cardLabel)
        playlistBox.appendChild(card)

        card.addEventListener("click", () => {
            selectedCard.classList.remove("watchingCard")
            selectedCard.classList.add("card")
            selectedLabel.style.color = "white"
            selectedCard = card
            selectedLabel = cardLabel
            localStorage.setItem("currentURL", urls[i])
            video.src = urls[i]
            videoUrl = urls[i]
            video.currentTime = 0
            log[name][2] = 0
            seekbar.value = 0
            video.play()
            playIcon.src = "site_media/pause-solid-full.svg"
            isPlaying = true
            card.classList.add("watchingCard")
            card.classList.remove("card")
            cardLabel.style.color = "black"

        })
    }
}