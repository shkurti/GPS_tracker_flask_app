const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

// Replace the following line with your MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://code7lab:password@cluster0.jlosawe.mongodb.net/';

app.use(cors());
app.use(express.json());

app.post('/insertData/:dbIndex', async (req, res) => {
  try {
    const { dbIndex } = req.params;
    console.log(`Received POST request for dbIndex ${dbIndex}`);

    console.log(`Connecting to MongoDB Atlas at ${mongoURI}`);

    const client = new MongoClient(mongoURI, { useUnifiedTopology: true });

    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const db = client.db(); // Specify your database name in the connection string
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
