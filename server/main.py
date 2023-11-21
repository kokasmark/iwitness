from flask import Flask, request , make_response # Import flask
from flask_cors import CORS, cross_origin
from flask_apscheduler import APScheduler
import json


app = Flask(__name__, static_url_path='')  # Setup the Flask app by creating an instance of Flask
cors = CORS(app, resources={r"/data": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
scheduler = APScheduler()
scheduler.init_app(app)

@scheduler.task('cron', id='clearServer', hour=0) # every day at noon
def clearServer():
    with open('data.txt', 'w') as f:
            f.write("")
    return 'server cleared'

def toJson(data):
    getid=len(open('data.txt','r').read().split('\n'))
    json = "{"+'"title": "{0}", "text": "{1}", "coordinates": {2}, "createdAt": {3}, "author": "{4}", "id": {5}, "votes": {6}'.format(
            data['title'],data['text'],data['coordinates'],data['createdAt'], data['author'],getid, data['votes'])+"}"
    return json + "\n"

@app.route('/') 
def index(): 
    return app.send_static_file('index.html') 
@app.route('/', methods = ['POST'])  # When someone goes to / on the server, execute the following function
def home():
    data = request.get_json()
    print(data)
    json = toJson(data)
    if request.method == 'POST': 
        with open('data.txt', 'a') as f:
            f.write(json)   
    return app.send_static_file('index.html') # Return index.html from the static folder

@app.route('/data', methods = ['GET'])  # When someone goes to / on the server, execute the following function
def data():
    if request.method == 'GET':
        response = make_response(open('data.txt','r').read(), 200)
        response.mimetype = "text/plain"
        return response     
@app.route('/updateMarker', methods = ['POST'])  # When someone goes to / on the server, execute the following function
def updateMarker():
    data = request.get_json()
    id = data["id"]

    if request.method == 'POST': 
        articles = ""
        with open('data.txt', 'r') as f:
            articles = f.readlines() 
        print(data)
        a = json.loads(articles[id])
        a["votes"] = data["votes"]
        articles[id] = toJson(a)
        with open('data.txt', 'w') as f:
            f.writelines(articles)
    return app.send_static_file('index.html')          

# You can add your other routes here if you want
# You could event have other API routes that the React app requests

if __name__ == '__main__':  # If the script that was run is this script (we have not been imported)
    app.run(debug = True)  # Start the server