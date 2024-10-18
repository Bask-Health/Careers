import type { NextApiRequest, NextApiResponse } from 'next'

type WorkableJob = {
  id: string;
  title: string;
  shortcode: string;
  description: string;
  requirements: string;
  benefits: string;
  employment_type: string;
  department: string;
  created_at: string;
  full_description: string;
  application_url: string;
  location: {
    country: string;
    city: string;
  };
}

type ApiResponse = WorkableJob | { error: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { shortcode } = req.query

  console.log('API received shortcode:', shortcode);

  if (typeof shortcode !== 'string') {
    console.error('Invalid shortcode:', shortcode);
    res.status(400).json({ error: 'Invalid shortcode' })
    return
  }

  try {
    const apiUrl = `https://bask-health-1.workable.com/spi/v3/jobs/${shortcode}`;
    console.log('Fetching from Workable API:', apiUrl);

    const response = await fetch(apiUrl, {
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

    const job: WorkableJob = {
      id: data.id,
      title: data.title,
      shortcode: data.shortcode,
      description: data.description,
      requirements: data.requirements,
      benefits: data.benefits,
      employment_type: data.employment_type,
      department: data.department,
      created_at: data.created_at,
      full_description: data.full_description,
      application_url: data.application_url,
      location: {
        country: data.location?.country || '',
        city: data.location?.city || '',
      },
    }

    res.status(200).json(job)
  } catch (error) {
    console.error('Error fetching job:', error)
    res.status(500).json({ error: 'Failed to fetch job from Workable API' })
  }
}