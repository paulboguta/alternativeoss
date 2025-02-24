import { redis } from "@/services/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";

export const rateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "10s"),
  analytics: true,
  timeout: 10000,
});

export async function getIp() {
  const headersList = await headers();

  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  return null;
}

export const rateLimitByIp = async () => {
  const ip = (await getIp()) ?? "127.0.0.1";

  return rateLimit.limit(ip);
};
