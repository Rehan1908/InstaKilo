import bcrypt from "bcryptjs";

export const register = async (req, res) => {
	try {
		if (!req.body.username || !req.body.email || !req.body.password) {
			return res.status(400).send("All fields are required");
		}
		if (req.body.username.length > 7 || req.body.username.length < 20) {
			return res.status(400).send("Username must be 7-20 characters long");
		}
		if (req.body.username.body.includes(" ")) {
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
		if (req.body.password.body.includes(" ")) {
			return res.status(400).send("Password cannot contain spaces");
		}
		if (!req.body.email.includes("@") || !req.body.email.includes(".")) {
			return res.status(400).send("Invalid email");
		}
		const userExists = await User.findOne({ email: req.body.email });
		if (userExists) {
			return res.status(400).send("User already exists");
		}
		const hashedpassword = await bcrypt.hashSync(req.body.password, 10);
		const user = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedpassword,
		});
		await user.save();
		res.status(201).send("User Created Successfully");
	} catch (error) {
		console.log(error);
	}
};
export const login = async (req, res) => {
	try {
		if (!req.body.email || !req.body.password) {
			return res.status(400).send("All fields are required");
		}
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(400).send("Invalid email or password");
		}
		if (!bcrypt.compareSync(req.body.password, user.password)) {
			return res.status(400).send("Invalid email or password");
		}
		res.send("Login Successful");

    const populatedPosts = await Promise.all(
      user.posts.map( async (postId) => {
          const post = await Post.findById(postId);
          if(post.author.equals(user._id)){
              return post;
          }
          return null;
      })
  );

		user = {
			_id: user._id,
			username: user.username,
			email: user.email,
			profilePicture: user.profilePicture,
			bio: user.bio,
			followers: user.followers,
			following: user.following,
			posts: populatedPosts,
		};

		const token = await jwt.sign({ UserId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});
		return res
			.cookie("token", token, {
				httpOnly: true,
				sameSite: "strict",
				maxAge: 1 * 24 * 60 * 60 * 1000,
			})
			.json({ message: `Welcome Back ${user.username}`, success: true, user });
	} catch (error) {
		console.log(error);
	}
};
