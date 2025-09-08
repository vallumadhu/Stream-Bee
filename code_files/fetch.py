import os , json

def get_files(path):
    return [file for file in os.listdir(path) if file != ".gitkeep"]

movies_Folder = get_files('Movies')
series_folder = get_files('Series')
posters = get_files('Posters')
posters = [f"../Posters/{x}" for x in posters]

movies = []
movie_series = {}
series = {}
dataBase = {}
for i in movies_Folder:
    if "." in i:
        movies.append(f"../Movies/{i}")
    else:
        movieList = os.listdir(f'Movies/{i}')
        movieList =  [f"../Movies/{i}/{x}" for x in movieList]
        movie_series[i] = movieList


for series_name in series_folder:
    series_files = list(os.listdir(os.path.join('Series',series_name)))
    series_files = [f"../Series/{series_name}/{x}" for x in series_files]
    series[series_name]=series_files


dataBase["movie_series"] = movie_series
dataBase["movies"] = movies
dataBase['series'] = series
dataBase["poster"] = posters

with open("./code_files/database.json", "w") as file:
    json.dump(dataBase, file, indent=4)