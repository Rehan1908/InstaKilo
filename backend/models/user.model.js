import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
username: { type: String, required: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: true },
profilePic: { type: String, required: true , default:
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
  // 
   },
bio: { type: String, default: 'Personalize your profile by adding a Bio.' },
followers: [{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
following: [{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
posts: [{type:mongoose.Schema.Types.ObjectId, ref:'Post'}],
savedposts: [{type:mongoose.Schema.Types.ObjectId, ref:'Post'}],
},{timestamps:true});

export const User = mongoose.model('User', userSchema);
