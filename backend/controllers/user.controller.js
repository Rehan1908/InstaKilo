import {User} from "../models/user.model.js";
import {Post} from "../models/post.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import  getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
	try {
		if (!req.body.username || !req.body.email || !req.body.password) {
			return res.status(400).send("All fields are required");
		}
		if (req.body.username.length < 7 || req.body.username.length > 20) {
			return res.status(400).send("Username must be 7-20 characters long");
		}
		if (req.body.username.includes(" ")) {
			return res.status(400).send("Username cannot contain spaces");
		}
		if (req.body.username.match(/[^a-zA-Z0-9]/)) {
			return res
				.status(400)
				.send("Username can only contain letters and numbers");
		}
		if (req.body.password.length < 8) {
			return res
				.status(400)
				.send("Password must be at least 8 characters long");
		}
		if (req.body.password.match(/[^a-zA-Z0-9]/)) {
			return res
				.status(400)
				.send("Password can only contain letters and numbers");
		}
		if (req.body.password.includes(" ")) {
			return res.status(400).send("Password cannot contain spaces");
		}
		if (!req.body.email.includes("@") || !req.body.email.includes(".")) {
			return res.status(400).send("Invalid email");
		}
		const userExists = await User.findOne({ email: req.body.email });
		if (userExists) {
			return res.status(400).send("User already exists");
		}
		const hashedpassword =  bcrypt.hashSync(req.body.password, 10);
		const user = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedpassword,
		});
		await user.save();
		res.status(201).json({	message: "User created successfully", success: true , user});
	} catch (error) {
		console.log(error);
	}
};
export const login = async (req, res) => {
	try {
			const { email, password } = req.body;
			if (!email || !password) {
					return res.status(401).json({
							message: "Something is missing, please check!",
							success: false,
					});
			}
			let user = await User.findOne({ email });
			if (!user) {
					return res.status(401).json({
							message: "Incorrect email or password",
							success: false,
					});
			}
			const isPasswordMatch = await bcrypt.compare(password, user.password);
			if (!isPasswordMatch) {
					return res.status(401).json({
							message: "Incorrect email or password",
							success: false,
					});
			};

			const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

			// populate each post if in the posts array
			const populatedPosts = await Promise.all(
					user.posts.map( async (postId) => {
							const post = await Post.findById(postId);
							if(post.author.equals(user._id)){
									return post;
							}
							return null;
					})
			)
			user = {
					_id: user._id,
					username: user.username,
					email: user.email,
					profilePicture: user.profilePicture,
					bio: user.bio,
					followers: user.followers,
					following: user.following,
					posts: populatedPosts
			}
			return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
					message: `Welcome back ${user.username}`,
					success: true,
					user
			});

	} catch (error) {
			console.log(error);
	}
};


export const logout = async (req, res) => {
	try {
	 return res.cookie("token", "", {maxAge: 0}).json({
		message: "Logged out successfully",
		success: true,
	})
} catch (error) {
	console.log(error);
}};

export const getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select("-password");
		if (!user) {
			return res.status(400).json({ message: "User not found", success: false });
		}
		return res.status(200).json({ user, success: true });
	}
	catch (error) {
		return res.status(500).json({ success: false, error: error.message });
	}
}

export const editProfile = async (req, res) => {
	try {
			const userId = req.id;
			const { bio, gender } = req.body;
			const profilePicture = req.file;
			let cloudResponse;

			if (profilePicture) {
					const fileUri = getDataUri(profilePicture);
					cloudResponse = await cloudinary.uploader.upload(fileUri);
			}

			const user = await User.findById(userId).select('-password');
			if (!user) {
					return res.status(404).json({
							message: 'User not found.',
							success: false
					});
			};
			if (bio) user.bio = bio;
			if (gender) user.gender = gender;
			if (profilePicture) user.profilePicture = cloudResponse.secure_url;

			await user.save();

			return res.status(200).json({
					message: 'Profile updated.',
					success: true,
					user
			});

	} catch (error) {
			console.log(error);
	}
};

export const getSuggestedUsers = async (req, res) => {
	try {
			const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
			if (!suggestedUsers) {
					return res.status(400).json({
							message: 'Currently do not have any users',
					})
			};
			return res.status(200).json({
					success: true,
					users: suggestedUsers
			})
	} catch (error) {
			console.log(error);
	}
};

export const followOrUnfollow = async (req, res) => {
	try {
		const followerId = req.id;
		const targetUserId = req.params.id;

		if (followerId === targetUserId) {
			return res.status(400).json({
				message: 'You Cannot Follow yourself',
				success: false
			});
		}

		const [follower, target] = await Promise.all([
			User.findById(followerId),
			User.findById(targetUserId)
		]);

		if (!follower || !target) {
			return res.status(400).json({
				message: 'User not found',
				success: false
			});
		}

		const isFollowing = follower.following.includes(targetUserId);
		const operation = isFollowing ? '$pull' : '$push';
		const message = isFollowing ? 'Unfollowed' : 'Followed';

		await Promise.all([
			User.updateOne(
				{ _id: followerId }, 
				{ [operation]: { following: targetUserId }}
			),
			User.updateOne(
				{ _id: targetUserId }, 
				{ [operation]: { followers: followerId }}
			)
		]);

		return res.status(200).json({
			message: `${message} successfully`,
			success: true
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Internal server error',
			success: false
		});
	}
};