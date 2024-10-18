import Link from "next/link";
import React from "react";
import { Navigation } from "../components/nav";
import { Card } from "../components/card";
import { Eye } from "lucide-react";
import { Redis } from "@upstash/redis";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const redis = Redis.fromEnv();

export const revalidate = 60;

type Job = {
  id: string;
  title: string;
  shortcode: string;
  department: string;
  location: {
    city: string;
    country: string;
    workplace_type: string;
  };
  created_at: string;
}

async function getJobs(): Promise<Job[]> {
  // Make sure to set the WORKABLE_API_TOKEN in your environment variables
  const res = await fetch('https://bask-health-1.workable.com/spi/v3/jobs', {
    headers: {
      'Authorization': `Bearer ${process.env.WORKABLE_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch jobs');
  }

  const data = await res.json();
  return data.jobs.map((job: any) => ({
    id: job.id,
    title: job.title,
    shortcode: job.shortcode,
    department: job.department,
    location: {
      city: job.location.city,
      country: job.location.country,
      workplace_type: job.location.workplace_type,
    },
    created_at: job.created_at,
  }));
}

export default async function CareersPage() {
  const jobs = await getJobs();

  const views = (
    await redis.mget<number[]>(
      ...jobs.map((job) => ["pageviews", "careers", job.shortcode].join(":"))
    )
  ).reduce((acc, v, i) => {
    acc[jobs[i].shortcode] = v ?? 0;
    return acc;
  }, {} as Record<string, number>);

  const featured = jobs[0];
  const top2 = jobs[1];
  const top3 = jobs[2];
  const sorted = jobs.slice(3);

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Open Positions
          </h2>
          <p className="mt-4 text-zinc-400">
            We're currently looking for help in the following areas
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />

        <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-2 ">
          <Card>
            <Link href={`/careers/${featured.shortcode}`}>
              <article className="relative h-full w-full p-4 md:p-8">
                <div className="flex justify-between gap-2 items-center">
                  <div className="text-xs text-zinc-100">
                    {new Date(featured.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <span className="text-zinc-500 text-xs flex items-center gap-1">
                    <Eye className="w-4 h-4" />{" "}
                    {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                      views[featured.shortcode] ?? 0
                    )}
                  </span>
                </div>

                <h2 id="featured-post" className="mt-4 text-3xl font-bold text-zinc-100 group-hover:text-white sm:text-4xl font-display">
                  {featured.title}
                </h2>
                <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                  {featured.department} • {capitalizeFirstLetter(featured.location.workplace_type)} • {featured.location.city || 'New York, NY'}
                </p>
                <div className="absolute bottom-4 md:bottom-8">
                  <p className="hidden text-zinc-200 hover:text-zinc-50 lg:block">
                    Read more <span aria-hidden="true">&rarr;</span>
                  </p>
                </div>
              </article>
            </Link>
          </Card>

          <div className="flex flex-col w-full gap-8 mx-auto border-t border-gray-900/10 lg:mx-0 lg:border-t-0 ">
            {[top2, top3].map((job) => (
              <Card key={job.shortcode}>
                <Link href={`/careers/${job.shortcode}`}>
                  <article className="relative w-full h-full p-4 md:p-8">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs text-zinc-100">
                        {new Date(job.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <span className="text-zinc-500 text-xs flex items-center gap-1">
                        <Eye className="w-4 h-4" />{" "}
                        {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                          views[job.shortcode] ?? 0
                        )}
                      </span>
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-zinc-100 group-hover:text-white font-display">
                      {job.title}
                    </h2>
                    <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                      {job.department} • {capitalizeFirstLetter(job.location.workplace_type)} • {job.location.city || 'New York, NY'}
                    </p>
                  </article>
                </Link>
              </Card>
            ))}
          </div>
        </div>
        <div className="hidden w-full h-px md:block bg-zinc-800" />

        <div className="grid grid-cols-1 gap-4 mx-auto lg:mx-0 md:grid-cols-3">
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 0)
              .map((job) => (
                <Card key={job.shortcode}>
                  <Link href={`/careers/${job.shortcode}`}>
                    <article className="relative w-full h-full p-4 md:p-8">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs text-zinc-100">
                          {new Date(job.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <span className="text-zinc-500 text-xs flex items-center gap-1">
                          <Eye className="w-4 h-4" />{" "}
                          {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                            views[job.shortcode] ?? 0
                          )}
                        </span>
                      </div>
                      <h2 className="mt-4 text-lg font-bold text-zinc-100 group-hover:text-white font-display">
                        {job.title}
                      </h2>
                      <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                        {job.department} • {capitalizeFirstLetter(job.location.workplace_type)} • {job.location.city || 'New York, NY'}
                      </p>
                    </article>
                  </Link>
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 1)
              .map((job) => (
                <Card key={job.shortcode}>
                  <Link href={`/careers/${job.shortcode}`}>
                    <article className="relative w-full h-full p-4 md:p-8">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs text-zinc-100">
                          {new Date(job.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <span className="text-zinc-500 text-xs flex items-center gap-1">
                          <Eye className="w-4 h-4" />{" "}
                          {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                            views[job.shortcode] ?? 0
                          )}
                        </span>
                      </div>
                      <h2 className="mt-4 text-lg font-bold text-zinc-100 group-hover:text-white font-display">
                        {job.title}
                      </h2>
                      <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                        {job.department} • {capitalizeFirstLetter(job.location.workplace_type)} • {job.location.city || 'New York, NY'}
                      </p>
                    </article>
                  </Link>
                </Card>
              ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {sorted
              .filter((_, i) => i % 3 === 2)
              .map((job) => (
                <Card key={job.shortcode}>
                  <Link href={`/careers/${job.shortcode}`}>
                    <article className="relative w-full h-full p-4 md:p-8">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs text-zinc-100">
                          {new Date(job.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <span className="text-zinc-500 text-xs flex items-center gap-1">
                          <Eye className="w-4 h-4" />{" "}
                          {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                            views[job.shortcode] ?? 0
                          )}
                        </span>
                      </div>
                      <h2 className="mt-4 text-lg font-bold text-zinc-100 group-hover:text-white font-display">
                        {job.title}
                      </h2>
                      <p className="mt-4 leading-8 duration-150 text-zinc-400 group-hover:text-zinc-300">
                        {job.department} • {capitalizeFirstLetter(job.location.workplace_type)} • {job.location.city || 'New York, NY'}
                      </p>
                    </article>
                  </Link>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}