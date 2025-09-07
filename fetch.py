import os , json

os.makedirs('Movies',exist_ok=True)
os.makedirs('Posters',exist_ok=True)
movies_Foloder = os.listdir('Movies')
series_folder = os.listdir('Series')
posters = os.listdir('Posters')
posters = [f"Posters/{x}" for x in posters]

movies = []
movie_series = {}
series = {}
dataBase = {}
for i in movies_Foloder:
    if "." in i:
        movies.append(f"Movies/{i}")
    else:
        movieList = os.listdir(f'Movies/{i}')
        movieList =  [f"Movies/{i}/{x}" for x in movieList]
        movie_series[i] = movieList


for series_name in series_folder:
    series_files = list(os.listdir(os.path.join('Series',series_name)))
    series_files = [f"Series/{series_name}/{x}" for x in series_files]
    series[series_name]=series_files


dataBase["movie_series"] = movie_series
dataBase["movies"] = movies
dataBase['series'] = series
dataBase["poster"] = posters

with open("database.json", "w") as file:
    json.dump(dataBase, file, indent=4)