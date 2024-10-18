import { NextApiRequest, NextApiResponse } from 'next'
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { shortcode } = req.query;

  if (typeof shortcode !== 'string') {
    return res.status(400).json({ error: 'Invalid shortcode' });
  }

  try {
    const views = await redis.get<number>(["pageviews", "careers", shortcode].join(":")) ?? 0;
    res.status(200).json({ views });
  } catch (error) {
    console.error('Error fetching view count:', error);
    res.status(500).json({ error: 'Failed to fetch view count' });
  }
}