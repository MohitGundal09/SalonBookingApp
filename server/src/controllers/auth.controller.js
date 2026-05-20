const User = require("../models/user.model.js")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
    try {
        
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
    
        res.status(201).json({
            message: "User created successfully",
            user,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};



async function login(req, res) {
    try {
        const { email, password } = req.body
        
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Credentials"
            })
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign({
            id: user._id, role: user.role
        }, process.env.JWT_SECRET,
            {
            expiresIn: "7d"
            })
        
        res.json({
            message: "Login Successful",
            token,
            user,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}


async function getMe(req, res) {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user
        });
        
        
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
}


module.exports = {
    register,
    login,
    getMe,
}