import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const jwks = jwksClient({
  jwksUri: "https://harmless-ram-88.clerk.accounts.dev/.well-known/jwks.json",
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10
});

function getKey(header, callback) {
  jwks.getSigningKey(header.kid, function(err, key) {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

export const signup = async (req, res) => {
  try {
    const { userName, fullName, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid Email Format" });
    }

    const existingEmail = await User.findOne({ email });
    const existingUserName = await User.findOne({ userName });

    if (existingEmail || existingUserName) {
      return res.status(400).json({ error: "Already Existing User or Email" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password Atleast must have 6 char length" });
    }

    // hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(200).json({
        _id: newUser._id,
        userName: newUser.userName,
        fullName: newUser.fullName,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
        bio: newUser.bio,
        link: newUser.link,
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log(`Error in signup controller : ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ error: "Username and Password are required" });
    }

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      _id: user._id,
      userName: user.userName,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
      bio: user.bio,
      link: user.link,
    });

  } catch (error) {
    console.log(`Error in login controller : ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    console.log(`Error in Logout Controller ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }  
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(`Error in getMe controller ${error}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const syncClerkUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, getKey, { algorithms: ["RS256"] }, async (err, decoded) => {
      if (err) {
        console.error("Clerk Token Verification failed in Sync:", err);
        return res.status(401).json({ error: "Unauthorized: Invalid Clerk token" });
      }

      const clerkId = decoded.sub;
      const { userName, fullName, email, profileImg } = req.body;

      let user = await User.findOne({ clerkId });

      if (!user) {
        if (email) {
          user = await User.findOne({ email });
        }
      }

      if (!user) {
        let finalUserName = userName || email?.split("@")[0] || `user_${Date.now()}`;
        
        const usernameExists = await User.findOne({ userName: finalUserName });
        if (usernameExists) {
          finalUserName = `${finalUserName}_${Math.floor(Math.random() * 1000)}`;
        }

        user = new User({
          clerkId,
          userName: finalUserName,
          fullName: fullName || finalUserName,
          email: email || `${clerkId}@clerk.local`,
          profileImg: profileImg || "",
          coverImg: "",
          bio: "",
          link: ""
        });
        await user.save();
      } else {
        let updated = false;
        if (!user.clerkId) {
          user.clerkId = clerkId;
          updated = true;
        }
        if (profileImg && !user.profileImg) {
          user.profileImg = profileImg;
          updated = true;
        }
        if (updated) {
          await user.save();
        }
      }

      user.password = undefined;
      return res.status(200).json(user);
    });
  } catch (error) {
    console.error("Error in syncClerkUser controller:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
