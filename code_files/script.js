const HomeBox = document.getElementById("HomeBox");
const WatchingBox = document.getElementById("WatchingBox")
let dataset = {};
let movies_snippits = []
let movies_series_snippts = []
let series_snippts = []


/* Functions */

function urlTrim(url) {
  url = url.split(".");
  url = url[url.length - 2]
  url = url.split("/");
  url = url[url.length - 1];
  return url;
}

function esc(str) {
  return String(str).replace(/'/g, "\\'");
}

function getPoster(name) {
  for (let i = 0; i < dataset.poster.length; i++) {
    if (name === urlTrim(dataset.poster[i])) {
      return dataset.poster[i];
    }
  }
  return "../Posters/default.png";
}


function selectCard(name, url, poster, series) {
  series = JSON.parse(series)
  localStorage.setItem("name", name)
  localStorage.setItem("poster", poster)
  localStorage.setItem("url", url)
  localStorage.setItem("series", series)
  window.location.href = "./preview.html"
}


/* local storage */
let log = {}
if (localStorage.getItem("log") === null) {
  localStorage.setItem("log", JSON.stringify(log));
} else {
  log = JSON.parse(localStorage.getItem("log"));
}

let currentlyWatchingItems = Object.keys(log)


/* Fetching from database.json */
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
    dataset = Object(data);
    console.log("Fetched data:", dataset);
    for (let i = 0; i < dataset.movies.length; i++) {
      let isWatching = false;
      let movieName = esc(urlTrim(dataset.movies[i]))
      for (let j = 0; j < currentlyWatchingItems.length; j++) {
        if (currentlyWatchingItems[j] == movieName) {
          console.log(log[movieName][0], log[movieName][1])
          isWatching = true;
          break;
        }
      }
      let movieUrl = esc(dataset.movies[i])
      let moviePoster = esc(getPoster(movieName))
      movies_snippits.push(`<div class="movieCard" onclick="selectCard('${movieName}','${movieUrl}','${moviePoster}',false)">
                    <div class="imgBox">
                        <img src="${moviePoster}" alt="">
                    </div>
                    <p>${movieName}</p>
                </div>`)
      if (isWatching) {
        WatchingBox.innerHTML += movies_snippits[i];
      }
    }
    HomeBox.innerHTML += movies_snippits.join("");
    let series_names = Object.keys(dataset.series)
    for (let i = 0; i < series_names.length; i++) {
      let isWatching = false;
      let series_name = esc(series_names[i])
      for (let j = 0; j < currentlyWatchingItems.length; j++) {
        if (currentlyWatchingItems[j] == series_name) {
          isWatching = true;
          break;
        }
      }
      let series_poster = esc(getPoster(series_name))
      let series_urls = dataset.series[series_name]
      for (let j = 0; j < series_urls.length; j++) {
        series_urls[j] = esc(series_urls[j])
      }
      series_snippts.push(`<div class="movieCard" onclick="selectCard('${series_name}','${series_urls}','${series_poster}',true)">
                    <div class="imgBox">
                        <img src="${series_poster}" alt="">
                    </div>
                    <p>${series_name}</p>
                </div>`)
      if (isWatching) {
        WatchingBox.innerHTML += series_snippts[i];
      }

    }
    HomeBox.innerHTML += series_snippts.join("")
  });


