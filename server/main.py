from flask import Flask, request , make_response # Import flask
from flask_cors import CORS, cross_origin

app = Flask(__name__, static_url_path='')  # Setup the Flask app by creating an instance of Flask
cors = CORS(app, resources={r"/data": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/') 
def index(): 
    return app.send_static_file('index.html') 
@app.route('/', methods = ['POST'])  # When someone goes to / on the server, execute the following function
def home():
    data = request.get_json()
    print(data)
    line = str(data['articleTitle']) + ';' + str(data['articleText']) + ';' + str(data['coordinates'])+ ';' + str(data['createdAt'])+ '\n'
    if request.method == 'POST': 
        with open('./static/data.txt', 'a+') as f:
            f.write(line)
    if request.method == 'GET':
        response = make_response("hello world", 200)
        response.mimetype = "text/plain"
        return response        
    return app.send_static_file('index.html') # Return index.html from the static folder

@app.route('/data', methods = ['GET'])  # When someone goes to / on the server, execute the following function
def data():
    if request.method == 'GET':
        response = make_response(open('data.txt','r').read(), 200)
        response.mimetype = "text/plain"
        return response        

# You can add your other routes here if you want
# You could event have other API routes that the React app requests

if __name__ == '__main__':  # If the script that was run is this script (we have not been imported)
    app.run(debug = True)  # Start the server