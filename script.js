const HomeBox = document.getElementById("HomeBox");
let dataset = {};
let movies_snippits = []
let movies_series_snippts = []
let series_snippts = []


/* Functions */

function urlTrim(url) {
  url = url.split(".")[0];
  url = url.split("/");
  url = url[url.length - 1];
  return url;
}

function getPoster(name) {
  for (let i = 0; i < dataset.poster.length; i++) {
    if (name === urlTrim(dataset.poster[i])) {
      return dataset.poster[i];
    }
  }
  return "Posters/default.png";
}

function selectCard(name, url, poster, series) {
  series = JSON.parse(series)
  localStorage.setItem("name", name)
  localStorage.setItem("poster", poster)
  localStorage.setItem("url", url)
  localStorage.setItem("series", series)
  window.location.href = "preview.html"
}



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
      let movieName = urlTrim(dataset.movies[i])
      let movieUrl = dataset.movies[i]
      let moviePoster = getPoster(movieName)
      movies_snippits.push(`<div class="movieCard" onclick="selectCard('${movieName}','${movieUrl}','${moviePoster}',false)">
                    <div class="imgBox">
                        <img src="${moviePoster}" alt="">
                    </div>
                    <p>${movieName}</p>
                </div>`)
    }
    HomeBox.innerHTML += movies_snippits.join("");
    let series_names = Object.keys(dataset.series)
    for (let i = 0; i < series_names.length; i++) {
      let series_name = series_names[i]
      let series_poster = getPoster(series_name)
      let series_urls = dataset.series[series_name]

      series_snippts.push(`<div class="movieCard" onclick="selectCard('${series_name}','${series_urls}','${series_poster}',true)">
                    <div class="imgBox">
                        <img src="${series_poster}" alt="">
                    </div>
                    <p>${series_name}</p>
                </div>`)

    }
    HomeBox.innerHTML += series_snippts.join("")
  });


