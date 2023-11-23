from flask import Flask, request, make_response  # Import flask
from flask_cors import CORS, cross_origin
from apscheduler.schedulers.background import BackgroundScheduler
import json
from datetime import datetime
import os
import glob

app = Flask(
    __name__,
    static_url_path='')  # Setup the Flask app by creating an instance of Flask
cors = CORS(app, resources={r"/data": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

scheduler = BackgroundScheduler()

today = open('today.txt', 'r').read()


def clearServer():
  global today
  t = str(datetime.now().strftime("%d"))

  if (t != today):
    server_path = os.path.dirname(__file__)
    filenames = glob.glob(server_path + "/data/*.dat")

    for f in filenames:
      os.remove(f)

    print('DATA WIPED')

  print("Status OK - " + str(datetime.now()))

  today = t
  open('today.txt', 'w').write(today)


scheduler.add_job(func=clearServer, trigger='interval', seconds=30)


def getSave(coords):
  if coords != 'all':
    n = str(coords[0])[:6] + "-" + str(coords[1])[:6]
    server_path = os.path.dirname(__file__)
    rel_path = "data/" + n + ".dat"
    abs_file_path = os.path.join(server_path, rel_path)
    return abs_file_path
  else:
    server_path = os.path.dirname(__file__)
    rel_path = "data/all.dat"
    abs_file_path = os.path.join(server_path, rel_path)
    return abs_file_path


def toJson(data):
  getid = len(open('data.txt', 'r').read().split('\n'))
  json = "{" + '"title": "{0}", "text": "{1}", "coordinates": {2}, "createdAt": {3}, "author": "{4}", "id": {5}, "votes": {6}'.format(
      data['title'], data['text'], data['coordinates'], data['createdAt'],
      data['author'], getid, data['votes']) + "}"
  return json + "\n"


@app.route('/')
def index():
  return app.send_static_file('index.html')


@app.route('/', methods=[
    'POST'
])  # When someone goes to / on the server, execute the following function
def home():
  data = request.get_json()
  print(data)
  json = toJson(data)
  if request.method == 'POST':
    with open(getSave(data["coordinates"]), 'a') as f:
      f.write(json)
  return app.send_static_file(
      'index.html')  # Return index.html from the static folder


@app.route('/data', methods=[
    'GET'
])  # When someone goes to / on the server, execute the following function
def data():
  if request.method == 'GET':
    data = []
    server_path = os.path.dirname(__file__)
    filenames = glob.glob(server_path + "/data/*.dat")

    for f in filenames:
      d = str(open(f, "r").read())
      for line in d.split('\n'):
        try:
          d = json.loads(line)
          data.append(d)
        except:
          continue

    response = make_response(data, 200)
    response.mimetype = "text/plain"
    return response


@app.route('/updateMarker', methods=[
    'POST'
])  # When someone goes to / on the server, execute the following function
def updateMarker():
  data = request.get_json()
  id = data["id"] - 1

  if request.method == 'POST':
    articles = ""
    with open(getSave(data["coordinates"]), 'r') as f:
      articles = f.readlines()
    print(data)
    a = json.loads(articles[id])
    a["votes"] = data["votes"]
    articles[id] = toJson(a)
    with open(getSave(data["coordinates"]), 'w') as f:
      f.writelines(articles)
  return app.send_static_file('index.html')


if __name__ == '__main__':
  scheduler.start(
  )  # If the script that was run is this script (we have not been imported)
  app.run(debug=True, host='0.0.0.0', port=5000)  # Start the server
