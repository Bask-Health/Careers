import { NextApiRequest, NextApiResponse } from 'next'

const WORKABLE_API_URL = 'https://bask-health.workable.com/spi/v3/jobs'
const API_TOKEN = ''

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(WORKABLE_API_URL, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch jobs')
    }

    const data = await response.json()
    return res.status(200).json(data.jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return res.status(500).json({ error: 'Failed to fetch jobs' })
  }
}