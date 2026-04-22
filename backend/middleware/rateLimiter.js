import rateLimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success, remaining } = await rateLimit.limit("my-rate-limit");
    console.log("Remaining:", remaining);

    if (!success) {
      return res.status(429).json({ message: "Too many requests" });
    }
    next();
  } catch (error) {
    console.log("Rate Limit Error:", error);
    next();
  }
};

export default rateLimiter;
