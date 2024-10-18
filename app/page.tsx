'use client'

import { useEffect } from "react"
import { Navigation } from "./components/nav"

export default function CareersPage() {
  useEffect(() => {
    // Load Workable script
    const script = document.createElement('script')
    script.src = 'https://www.workable.com/assets/embed.js'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      // Initialize Workable embed
      if (window.whr) {
        window.whr_embed(671909, {detail: 'titles', base: 'jobs', zoom: 'country', grouping: 'none'})
      }
    }

    return () => {
      // Cleanup
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="relative pb-16">
      <Navigation />
      <div className="px-6 pt-16 mx-auto space-y-8 max-w-7xl lg:px-8 md:space-y-16 md:pt-24 lg:pt-32">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl">
            Careers
          </h2>
          <p className="mt-4 text-zinc-400">
            Join our team and help shape the future of healthcare technology.
          </p>
        </div>
        <div className="w-full h-px bg-zinc-800" />
        <div id="whr_embed_hook"></div>
      </div>
    </div>
  )
}