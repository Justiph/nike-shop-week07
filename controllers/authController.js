const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.register = async (req, res) => {
  const { username, email, password, confirmPassword, role } = req.body;

  console.log("register", username, email, password, confirmPassword);

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "72h" }
    );

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  
    
    // Redirect to login page after successful registration
    return res.redirect('/auth/login');  // Redirect to login page

    
  } catch (error) {
    if (error.code === 11000 && error.keyValue.username) {
      return res.status(400).json({ message: "Username đã tồn tại" });
    }
    if (error.code === 11000 && error.keyValue.email) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }
    // Lỗi khác
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log("email: ", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '72h' }
    );
    // Save token in cookies (optional, but commonly done for session management)
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    // res.status(200).json({
    //   message: "Logged in successfully",
    //   token,
    //   user: {
    //     id: user._id,
    //     username: user.username,
    //     email: user.email,
    //     role: user.role,
    //   },
    // });
    
    
    // Redirect to homepage after successful login
    return res.redirect('/');  // Redirect to homepage
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

