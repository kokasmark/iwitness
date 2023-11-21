from flask import Flask, request ,send_from_directory  # Import flask

app = Flask(__name__, static_url_path='')  # Setup the Flask app by creating an instance of Flask


@app.route('/') 
def index(): 
    return app.send_static_file('index.html') 
@app.route('/', methods = ['POST'])  # When someone goes to / on the server, execute the following function
def home():
    data = request.get_json()
    print(data)
    line = str(data['articleTitle']) + ';' + str(data['articleText']) + ';' + str(data['coordinates'])+ ';' + str(data['createdAt'])+ '\n'
    if request.method == 'POST': 
        with open('data.txt', 'a+') as f:
            f.write(line)
    return app.send_static_file('index.html')  # Return index.html from the static folder


#return send_from_directory(DOWNLOAD_DIRECTORY, path, as_attachment=True)

# You can add your other routes here if you want
# You could event have other API routes that the React app requests

if __name__ == '__main__':  # If the script that was run is this script (we have not been imported)
    app.run(debug = True)  # Start the server