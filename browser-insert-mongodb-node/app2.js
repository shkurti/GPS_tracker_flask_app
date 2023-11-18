const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

// MongoDB connection details
const mongoHost = 'host.docker.internal';

const mongoPorts = [27030, 27031, 27032];
const databases = ['mongo-1', 'mongo-2', 'mongo-3'];

// Use the cors middleware
app.use(cors());

app.use(express.json());

app.post('/insertData/:dbIndex', async (req, res) => {
  try {
    const { dbIndex } = req.params;
    console.log(`Received POST request for dbIndex ${dbIndex}`);

    const mongoPort = mongoPorts[dbIndex];
    const mongoURI = `mongodb://${mongoHost}:${mongoPort}/${databases[dbIndex]}?serverSelectionTimeoutMS=5000&serverSelectionTryOnce=true`;
    console.log(`Connecting to MongoDB at ${mongoURI}`);

    const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('coordinates');

    const data = req.body;
    console.log('Inserting data:', data);

    await collection.insertOne(data);
    console.log('Data inserted successfully');

    client.close();

    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `An error occurred: ${err.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
