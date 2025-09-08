const movieName = document.getElementById("movieName")
const posterImg = document.getElementById("posterImg")
const episodes_count = document.getElementById("episodes")
const duration = document.getElementById("duration")
const previewPlaylistBox = document.querySelector(".previewPlaylistBox")
const watchBtn = document.querySelector(".watchBtn")
const progressBar = document.getElementById("progressBar")


/*Functions */
function formatTime(seconds) {
    seconds = Math.floor(seconds);

    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0 && mins > 0) {
        return `${hrs}hrs ${mins}mins`;
    } else if (hrs > 0) {
        return `${hrs}hrs`;
    } else {
        return `${mins}mins`;
    }
}

function urlTrim(url) {
  url = url.split(".");
  url = url[url.length-2]
  url = url.split("/");
  url = url[url.length - 1];
  return url;
}



/* local storage */
const name = localStorage.getItem("name");
const poster = localStorage.getItem("poster");
const series = JSON.parse(localStorage.getItem("series"))
let log = {}
if (localStorage.getItem("log") === null) {
    localStorage.setItem("log", JSON.stringify(log));
} else {
    log = JSON.parse(localStorage.getItem("log"));
}
let logExits = (log[name]) ? true : false


document.title = name
movieName.innerHTML = name
posterImg.src = poster
document.body.style.backgroundImage = `url('${poster}')`

/* loading metadata to find video duration */
const video = document.createElement("video")
video.preload = "metadata"
video.onloadedmetadata = () => {
    duration.innerHTML = formatTime(video.duration)
}


/* playlist for series */
let url = localStorage.getItem("url");
let urls = null
if (series) {

    urls = url.split(",")
    video.src = urls[0]
    url = null
    episodes_count.innerHTML = `${urls.length} Episodes`
    for (let i = 0; i < urls.length; i++) {
        let episodeCard = document.createElement("div")
        if (logExits) {
            let index = urls.indexOf(log[name][0])
            if (i < index) {
                episodeCard.classList.add("watchedCard")
            } else if (i == index) {
                let progress = Math.floor(log[name][1])
                episodeCard.classList.add("watchingCard")
                episodeCard.style.backgroundImage = `linear-gradient(to right, rgba(124, 124, 124, 0.725) ${progress}%, rgba(124, 124, 124, 0.223) ${progress}%)`;
            }
            else {
                episodeCard.classList.add("card")
            }
        } else {
            episodeCard.classList.add("card")
        }
        let episodesName = document.createElement("p")
        episodesName.innerHTML = urlTrim(urls[i])
        episodeCard.appendChild(episodesName)
        previewPlaylistBox.appendChild(episodeCard)

        episodeCard.addEventListener("click", () => {
            let currentURL = urls[i]
            localStorage.setItem("currentURL", currentURL)
            if (logExits) {
                log[name][2] = 0
                localStorage.setItem("log", JSON.stringify(log))
            }
            window.location.href = "./movie_player.html"
        })
    }
} else {
    episodes_count.innerHTML = `Movie`
    previewPlaylistBox.style.display = "none"
    video.src = url
}



/* To update seekbar if log exits */
if (logExits) {
    if (series) {
        let index = urls.indexOf(log[name][0])
        let progress = ((index + 1) / urls.length) * 100
        progressBar.style.backgroundImage = `linear-gradient(to right, #ffffff 0%, #ffffff ${progress}%, #88888886 ${progress}%, #88888886 100%)`
    } else {
        let progress = Math.floor(log[name][0])
        progressBar.style.backgroundImage = `linear-gradient(to right, #ffffff 0%, #ffffff ${progress}%, #88888886 ${progress}%, #88888886 100%)`
    }
} else {
    progressBar.style.backgroundImage = `linear-gradient(to right, #ffffff 0%, #ffffff 0%, #88888886 0%, #88888886 100%)`
}


watchBtn.addEventListener("click", () => {
    let currentURL = (series) ? urls[0] : url
    if (logExits && series) {
        currentURL = log[name][0]
    }
    localStorage.setItem("currentURL", currentURL)

    window.location.href = "./movie_player.html"
})