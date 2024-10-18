"use client";

import { useEffect } from "react";

export const ReportView: React.FC<{ shortcode: string }> = ({ shortcode }) => {
  useEffect(() => {
    const incrementView = async () => {
      try {
        const response = await fetch("/api/incr", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shortcode }),
        });

        if (!response.ok) {
          throw new Error('Failed to increment view count');
        }

        const data = await response.json();
        console.log('View count incremented:', data);
      } catch (error) {
        console.error('Error incrementing view count:', error);
      }
    };

    incrementView();
  }, [shortcode]);

  return null;
};