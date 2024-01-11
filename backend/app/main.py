from flask import Flask
from server import Server


app = Flask(__name__)
# Create an instance of the Server class
server = Server(app)


@app.route('/')
def hello_world():
    server.run()
    return 'Hello, World! from route /'


if __name__ == '__main__':
    app.run(debug=True)  # This will print 'Hello, World!' to the console
