import { rateLimit } from "express-rate-limit";
import ip from "ip";

export const Limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 64,
  skip: (req) => {
    const clientIp = req.ip;

    if (!clientIp) return false;

    return ip.isPrivate(clientIp) || ip.isLoopback(clientIp);
  },
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
});
