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
const leftIcon = document.querySelector(".left")
const centreIcon = document.querySelector(".centre")
const rightIcon = document.querySelector(".right")
const captionBtn = document.getElementById("captionBtn")
const captionImg = document.getElementById("captionImg")
const settingBtn = document.getElementById("settingBtn")
let subtitles = []
let currentSubtitleLabel = null
let subtitleState = false
let subtitlesLoaded = false
let autoplay = true

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
    url = url.split(".");
    url = url[url.length - 2]
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

function playPause() {
    if (isPlaying) {
        video.pause()
        playIcon.src = "site_media/play-solid-full.svg"
        isPlaying = false
    } else {
        video.play()
        playIcon.src = "site_media/pause-solid-full.svg"
        isPlaying = true
    }
}

function fullscreen() {
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
}

function updatePlaybackRate(x) {
    video.playbackRate = x
}

function mute() {
    volumeSeekBar.value = 0
    video.volume = 0
    volumeSeekBar.style.backgroundImage = `linear-gradient(to right, white ${0}%, #d3d3d3 ${0}%)`
    localStorage.setItem("volume", 0)
    volumeIcon.src = "site_media/volume-xmark-solid-full.svg"
}

function addSubtitleTrack(video, subtitleURL, subtitleName) {
    const track = document.createElement("track");
    track.kind = "subtitles"
    track.label = subtitleName
    track.src = subtitleURL
    video.appendChild(track)
}


function getSubtitles(video_path) {

    let lastDotIndex = video_path.lastIndexOf(".")
    video_path = video_path.slice(0, lastDotIndex)
    video_path = video_path.slice(2, video_path.length)
    video_path = "subtitles" + video_path

    let subtitlesList = dataset['subtitles']
    let videoSubtitles = []
    for (let i = 0; i < subtitlesList.length; i++) {
        let subtitleURL = subtitlesList[i]
        if (subtitleURL.includes(video_path)) {
            let parts = subtitleURL.split("/");
            let subtitleName = parts[parts.length - 1];
            lastDotIndex = subtitleName.lastIndexOf(".")
            subtitleName = subtitleName.slice(0, lastDotIndex)
            videoSubtitles.push([subtitleName, subtitlesList[i]])
        }
    }
    return videoSubtitles
}

function switchSubtitle(video, subtitleName) {
    for (let i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].mode = video.textTracks[i].label == subtitleName ? "showing" : "disabled";
    }
}

function offSubttiles(video) {
    for (let i = 0; i < video.textTracks.length; i++) {
        video.textTracks[i].mode = "disabled"
    }
}


function clearSubtitleTracks(video) {
    offSubttiles(video)
    const tracks = video.querySelectorAll("track")
    for (let i = 0; i < tracks.length; i++) {
        let track = tracks[i]
        track.remove()
    }
}

function initSubtitles(videoUrl) {
    let videoSubtitles = getSubtitles(videoUrl)
    subtitles = []
    for (let i = 0; i < videoSubtitles.length; i++) {
        let subtitleName = videoSubtitles[i][0]
        let subtitleURL = videoSubtitles[i][1]
        subtitles.push(subtitleName)
        addSubtitleTrack(video, subtitleURL, subtitleName)
        subtitlesLoaded = true
    }
    if(!currentSubtitleLabel){
        currentSubtitleLabel = subtitles[0]
    }
    if (subtitleState) {
        switchSubtitle(video, currentSubtitleLabel)
    }
}


let centreIconTimeout = null
let rightIconTimeout = null
let leftIconTimeout = null
function displayIcon(icon, content, duration) {
    if (icon == rightIcon && rightIconTimeout) {
        clearInterval(rightIconTimeout)
    } else if (icon == leftIcon && leftIconTimeout) {
        clearInterval(leftIconTimeout)
    } else if (icon == centreIcon && centreIconTimeout) {
        clearInterval(centreIconTimeout)
    }
    icon.style.opacity = "1"
    icon.innerHTML = content
    setTimeout(() => {
        icon.style.opacity = "0"
        icon.innerHTML = "&nbsp;&nbsp;&nbsp;"
    }, duration)
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
        log[name] = [0, 0]
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
    let currentTime = (series) ? log[name][2] : log[name][1]
    video.currentTime = currentTime
    totalDurationLabel.innerHTML = formatTime(video.duration)
    setInterval(() => {
        updateSeekbar()
    }, 800)
}

loadingSpinner.style.display = "block"
video.addEventListener("canplay", () => {
    loadingSpinner.style.display = "none"
})

/* Play Pause Controls */
videoBox.addEventListener("click", () => {
    playPause()
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
    playPause()
})

document.addEventListener("keydown", (e) => {
    let keyCode = e.keyCode
    if (keyCode == 32 || keyCode == 75) {
        event.preventDefault()
        playPause()
    } else if (keyCode == 37) {
        let updatedTime = video.currentTime - 5
        video.currentTime = (updatedTime >= 0) ? updatedTime : 0
        displayIcon(leftIcon, "<p>-5s</p>", 1000)
    } else if (keyCode == 39) {
        let updatedTime = video.currentTime + 5
        video.currentTime = (updatedTime <= video.duration) ? updatedTime : video.duration
        displayIcon(rightIcon, "<p>+5s</p>", 1000)
    } else if (keyCode == 70) {
        fullscreen()
    } else if (keyCode == 74) {
        let updatedTime = video.currentTime - 10
        video.currentTime = (updatedTime >= 0) ? updatedTime : 0
        displayIcon(leftIcon, "<p>-10s</p>", 2000)
    } else if (keyCode == 76) {
        let updatedTime = video.currentTime + 10
        video.currentTime = (updatedTime <= video.duration) ? updatedTime : video.duration
        displayIcon(rightIcon, "<p>+10s</p>", 2000)
    } else if (keyCode == 77) {
        mute()
        displayIcon(centreIcon, "<p>0%</p>", 2000)
    } else if (keyCode === 190 && event.shiftKey) {
        video.playbackRate += 0.25
        displayIcon(centreIcon, `<p>${video.playbackRate}x</p>`, 2000)
    } else if (keyCode === 188 && event.shiftKey) {
        video.playbackRate -= 0.25
        displayIcon(centreIcon, `<p>${video.playbackRate}x</p>`, 2000)
    } else if (keyCode >= 96 && keyCode <= 105) {
        let ratio = (keyCode - 96) * 0.1
        let updatedTime = video.duration * ratio
        video.currentTime = updatedTime
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
    displayIcon(leftIcon, "<p>-10s</p>", 2000)
})

forwardBtn.addEventListener("click", () => {
    let updatedTime = video.currentTime + 10
    video.currentTime = (updatedTime <= video.duration) ? updatedTime : video.duration
    displayIcon(rightIcon, "<p>+10s</p>", 2000)
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
    displayIcon(centreIcon, `<p>${volumeLevel}%</p>`, 2000)
})

volumeBtn.addEventListener("click", () => {
    mute()
})


/* Full Screen Settings */
fullscreenBtn.addEventListener("click", () => {
    fullscreen()
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
            subtitlesLoaded = false
            clearSubtitleTracks(video)
            initSubtitles(videoUrl)
            subtitlesLoaded = true
        })
    }
}


/* Subtitle Handling */
let dataset = {}
fetch(`./database.json?timestamp=${new Date().getTime()}`, {
    cache: 'no-store',
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    }
})
    .then((response) => response.json())
    .then((data) => {
        dataset = Object(data)
        initSubtitles(videoUrl)
    })

captionBtn.addEventListener("click", () => {
    if (!subtitlesLoaded) {
        return
    }
    if (subtitleState) {
        subtitleState = false
        captionImg.src = "site_media/caption-off.svg"
        offSubttiles(video)
    } else {
        subtitleState = true
        captionImg.src = "site_media/caption-on.svg"
        switchSubtitle(video, currentSubtitleLabel)
    }
})