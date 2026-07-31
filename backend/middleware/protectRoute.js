import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import User from "../models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

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

const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      return jwt.verify(token, getKey, { algorithms: ["RS256"] }, async (err, decoded) => {
        if (err) {
          console.error("Clerk JWT Verification Error:", err);
          return res.status(401).json({ error: "Unauthorized: Invalid Clerk token" });
        }

        const clerkId = decoded.sub;
        let user = await User.findOne({ clerkId }).select("-password");

        if (!user) {
          const email = decoded.email || decoded.emails?.[0];
          if (email) {
            user = await User.findOne({ email }).select("-password");
            if (user) {
              user.clerkId = clerkId;
              await user.save();
            }
          }
        }

        if (!user) {
          return res.status(401).json({ error: "User profile not found. Please sync user first." });
        }

        req.user = user;
        return next();
      });
    }

    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(`Error in protectRoute: ${err}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;