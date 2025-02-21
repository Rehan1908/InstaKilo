<<<<<<< HEAD
import mongoose from "mongoose";
=======
import mongoose from 'mongoose';

>>>>>>> 49590355027ad6c67f9a42be0e717e3b3c943902
const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
});
export const Comment = mongoose.model('Comment', commentSchema);