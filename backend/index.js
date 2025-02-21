import express , {urlencoded} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.route.js';
<<<<<<< HEAD
import postRoute from './routes/post.route.js';
import messageRoute from './routes/message.route.js';
=======
>>>>>>> 49590355027ad6c67f9a42be0e717e3b3c943902


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
<<<<<<< HEAD
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

=======
>>>>>>> 49590355027ad6c67f9a42be0e717e3b3c943902



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});