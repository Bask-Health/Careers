"use client";
import { ArrowLeft, Eye, Github, Twitter } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  job: {
    shortcode: string;
    title: string;
    description: string;
    application_url: string;
  };
  initialViews: number;
};

export const Header: React.FC<Props> = ({ job, initialViews }) => {
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIntersecting] = useState(true);
  const [views, setViews] = useState(initialViews);

  const links: { label: string; href: string }[] = [
    {
      label: "Apply",
      href: job.application_url,
    },
  ];

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting),
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const response = await fetch(`/api/views/${job.shortcode}`);
        if (response.ok) {
          const data = await response.json();
          setViews(data.views);
        }
      } catch (error) {
        console.error('Error fetching view count:', error);
      }
    };

    fetchViews();
    const interval = setInterval(fetchViews, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [job.shortcode]);

  const trimDescription = (description: string): string => {
    // Remove HTML tags
    const plainText = description.replace(/<[^>]+>/g, '');
    // Split into sentences
    const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [];
    // Take up to 4 sentences
    return sentences.slice(0, 4).join(' ').trim();
  };

  return (
    <header
      ref={ref}
      className="relative isolate overflow-hidden bg-gradient-to-tl from-black via-zinc-900 to-black"
    >
      <div
        className={`fixed inset-x-0 top-0 z-50 backdrop-blur lg:backdrop-blur-none duration-200 border-b lg:bg-transparent ${
          isIntersecting
            ? "bg-zinc-900/0 border-transparent"
            : "bg-white/10  border-zinc-200 lg:border-transparent"
        }`}
      >
        <div className="container flex flex-row-reverse items-center justify-between p-6 mx-auto">
          <div className="flex justify-between gap-8">
            <span
              title="View counter for this page"
              className={`duration-200 hover:font-medium flex items-center gap-1 ${
                isIntersecting
                  ? " text-zinc-400 hover:text-zinc-100"
                  : "text-zinc-600 hover:text-zinc-900"
              } `}
            >
              <Eye className="w-5 h-5" />{" "}
              {Intl.NumberFormat("en-US", { notation: "compact" }).format(
                views,
              )}
            </span>
            <Link target="_blank" href="https://twitter.com/baskhealth">
              <Twitter
                className={`w-6 h-6 duration-200 hover:font-medium ${
                  isIntersecting
                    ? " text-zinc-400 hover:text-zinc-100"
                    : "text-zinc-600 hover:text-zinc-900"
                } `}
              />
            </Link>
            <Link target="_blank" href="https://github.com/bask-health">
              <Github
                className={`w-6 h-6 duration-200 hover:font-medium ${
                  isIntersecting
                    ? " text-zinc-400 hover:text-zinc-100"
                    : "text-zinc-600 hover:text-zinc-900"
                } `}
              />
            </Link>
          </div>

          <Link
            href="/careers"
            className={`duration-200 hover:font-medium ${
              isIntersecting
                ? " text-zinc-400 hover:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900"
            } `}
          >
            <ArrowLeft className="w-6 h-6 " />
          </Link>
        </div>
      </div>
      <div className="container mx-auto relative isolate overflow-hidden  py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-display">
              {job.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-300">
              {trimDescription(job.description)}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-y-6 gap-x-8 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
              {links.map((link) => (
                <Link target="_blank" key={link.label} href={link.href}>
                  {link.label} <span aria-hidden="true">&rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};