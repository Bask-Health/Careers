import { NextApiRequest, NextApiResponse } from 'next'

type WorkableJob = {
  id: string;
  title: string;
  full_title: string;
  shortcode: string;
  code: string;
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

type WorkableApiResponse = {
  jobs: {
    id: string;
    title: string;
    full_title: string;
    shortcode: string;
    code: string;
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
  }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const response = await fetch('https://bask-health-1.workable.com/spi/v3/jobs', {
      headers: {
        'Authorization': `Bearer ${process.env.WORKABLE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch jobs from Workable API');
    }

    const data: WorkableApiResponse = await response.json();

    const jobs: WorkableJob[] = data.jobs.map((job: WorkableApiResponse['jobs'][0]) => ({
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

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}