import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';


const app = express();

app.use(express.json());

dotenv.config();

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('Connected to MongoDB');
});

app.get('/test', (req, res) => {
res.send('Server is ready');
});



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});