from flask import Flask, render_template, Response, stream_with_context
from pymongo import MongoClient
import json
import threading
import time

app = Flask(__name__)

# Replace the following line with your MongoDB Atlas connection string
client = MongoClient("mongodb+srv://code7lab:XfZOOYjLLN8c4hs2@cluster0.jlosawe.mongodb.net/test?retryWrites=true&w=majority")

# Access the 'test' database using dictionary-style notation
db = client['test']

collection = db.coordinates

def event_stream():
    with collection.watch() as stream:
        while stream.alive:
            change = stream.try_next()
            if change is not None and 'fullDocument' in change:
                new_data = change['fullDocument']
                new_data['_id'] = str(new_data['_id'])
                yield f"data: {json.dumps(new_data)}\n\n"
            else:
                time.sleep(1)

@app.route('/stream')
def stream():
    return Response(event_stream(), content_type='text/event-stream')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
