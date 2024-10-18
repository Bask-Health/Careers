import type { NextApiRequest, NextApiResponse } from 'next'

type WorkableJob = {
  id: string;
  title: string;
  full_title: string;
  shortcode: string;
  code: string | null;
  state: string;
  department: string;
  url: string;
  application_url: string;
  shortlink: string;
  location: {
    country: string;
    country_code: string;
    region: string;
    region_code: string;
    city: string;
    zip_code: string;
    telecommuting: boolean;
  };
  created_at: string;
}

type ApiResponse = {
  jobs: WorkableJob[];
} | {
  error: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ error: `Method ${req.method} Not Allowed` })
    return
  }

  try {
    console.log('Fetching jobs from Workable API');
    const response = await fetch('https://bask-health-1.workable.com/spi/v3/jobs', {
      headers: {
        'Authorization': `Bearer ${process.env.WORKABLE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error(`Workable API error. Status: ${response.status}`);
      console.error('Response:', await response.text());
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Received data from Workable API:', data);

    if (!data.jobs || !Array.isArray(data.jobs)) {
      throw new Error('Invalid data structure received from Workable API')
    }

    const jobs: WorkableJob[] = data.jobs.map(job => ({
      id: job.id,
      title: job.title,
      full_title: job.full_title,
      shortcode: job.shortcode,
      code: job.code,
      state: job.state,
      department: job.department,
      url: job.url,
      application_url: job.application_url,
      shortlink: job.shortlink,
      location: {
        country: job.location.country,
        country_code: job.location.country_code,
        region: job.location.region,
        region_code: job.location.region_code,
        city: job.location.city,
        zip_code: job.location.zip_code,
        telecommuting: job.location.telecommuting,
      },
      created_at: job.created_at,
    }));

    res.status(200).json({ jobs })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    res.status(500).json({ error: 'Failed to fetch jobs from Workable API' })
  }
}