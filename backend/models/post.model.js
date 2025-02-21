<<<<<<< HEAD
import mongoose from "mongoose";
=======
import mongoose from 'mongoose';

>>>>>>> 49590355027ad6c67f9a42be0e717e3b3c943902
const postSchema = new mongoose.Schema({
    caption:{type:String, default:''},
    image:{type:String, required:true},
    author:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    likes:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    comments:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}],
});
export const Post = mongoose.model('Post', postSchema);