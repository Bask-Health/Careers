import { notFound } from "next/navigation";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import { Redis } from "@upstash/redis";

export const revalidate = 60;

type Props = {
  params: {
    shortcode: string;
  };
};

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

const redis = Redis.fromEnv();

async function getJob(shortcode: string): Promise<WorkableJob | null> {
  try {
    console.log(`Fetching job data for shortcode: ${shortcode}`);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${shortcode}`, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`Failed to fetch job data. Status: ${res.status}`);
      return null;
    }
    const data = await res.json();
    console.log('Received job data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching job data:', error);
    return null;
  }
}

export default async function JobPage({ params }: Props) {
  console.log('Received params:', params);
  const shortcode = params?.shortcode;

  if (!shortcode) {
    console.error('Shortcode is undefined in params');
    notFound();
  }

  console.log(`Rendering job page for shortcode: ${shortcode}`);

  const job = await getJob(shortcode);

  if (!job) {
    console.log(`Job not found for shortcode: ${shortcode}`);
    notFound();
  }

  let initialViews: number;
  try {
    initialViews = (await redis.get<number>(["pageviews", "careers", shortcode].join(":"))) ?? 0;
  } catch (error) {
    console.error('Error fetching view count:', error);
    initialViews = 0;
  }

  return (
    <div className="bg-zinc-50 min-h-screen">
      <Header job={job} initialViews={initialViews} />
      <ReportView shortcode={shortcode} />

      <article className="px-4 py-12 mx-auto prose prose-zinc prose-quoteless">
        <h1>{job.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: job.description }} />
        <h2>Job Details</h2>
        <ul>
          <li>Department: {job.department}</li>
          <li>Location: {job.location.city || 'New York, NY'}, {job.location.country}</li>
          <li>Employment Type: {job.employment_type}</li>
        </ul>
        <h2>Requirements</h2>
        <div dangerouslySetInnerHTML={{ __html: job.requirements }} />
        <h2>Benefits</h2>
        <div dangerouslySetInnerHTML={{ __html: job.benefits }} />
        <h2>Full Description</h2>
        <div dangerouslySetInnerHTML={{ __html: job.full_description }} />
      </article>
    </div>
  );
}