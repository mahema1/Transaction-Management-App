const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const Transaction = require('./models/Transaction.js');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/transaction', async (req, res) => {
    const { name, description, datetime, price } = req.body;
  
    // Check if the required fields are provided
    if (!name || !description || !datetime || !price) {
      console.error('Error: Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }
  
    try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Request Body:', req.body); // Log the request body to verify the data sent
  
      // Create a new transaction
      const transaction = await Transaction.create({ name, description, datetime, price });
      console.log('Transaction Created:', transaction); // Log the created transaction
  
      // Send response back to the client
      res.json(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error.message); // More specific error logging
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.get('/api/transactions', async (req, res) => {
    try {
      await mongoose.connect(process.env.MONGO_URL);
      const transactions = await Transaction.find();
      console.log('Fetched Transactions:', transactions); // Log backend response
      res.json(transactions);
    } catch (err) {
      console.error('Error fetching transactions:', err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
const port = 4040;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
