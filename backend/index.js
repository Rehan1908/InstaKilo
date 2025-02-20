import express , {urlencoded} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.route.js';
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';


const app = express();

app.use(express.json());

dotenv.config();

app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: process.env.URL,
    credentials: true
}
app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('Connected to MongoDB');
});

app.get('/test', (req, res) => {
res.send('Server is ready');
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);




app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});