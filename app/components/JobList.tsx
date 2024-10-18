'use client'

import { useState, useEffect } from 'react'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card } from './card'

interface Job {
  id: string
  title: string
  created_at: string
  shortcode: string
  description: string
  department: string
  full_description: string
  application_url: string
}

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/jobs')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setJobs(data.jobs)
      } catch (error) {
        console.error('Error fetching jobs:', error)
        setError('Failed to load jobs. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not available'
    const date = new Date(dateString)
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  const getDescription = (job: Job) => {
    if (job.description) return job.description
    if (job.full_description) return job.full_description.slice(0, 150) + '...'
    return 'No description available.'
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <main className="max-w-7xl mx-auto">
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, index) => (
              <Card key={index}>
                <div className="p-6">
                  <Skeleton className="h-4 w-1/4 bg-[#2A2A2A]" />
                  <Skeleton className="h-8 w-3/4 mt-4 bg-[#2A2A2A]" />
                  <Skeleton className="h-4 w-full mt-4 bg-[#2A2A2A]" />
                  <Skeleton className="h-4 w-full mt-2 bg-[#2A2A2A]" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && jobs.length === 0 && (
          <div className="text-center p-8 bg-[#141414] rounded-xl border border-zinc-600">
            No open positions available at the moment.
          </div>
        )}

        {jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {jobs.map((job, index) => (
              <Card key={job.id}>
                <div className={`p-6 ${index === 0 ? 'md:col-span-2' : ''}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400 text-sm">{formatDate(job.created_at)}</span>
                    <span className="flex items-center text-gray-400 text-sm">
                      <Eye className="mr-1 h-4 w-4" /> {Math.floor(Math.random() * 1000) + 100}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{job.title}</h2>
                  <p className="text-gray-400 mb-4">
                    {getDescription(job)}
                  </p>
                  <div className="flex justify-between items-center">
                    <Button variant="link" className="text-white p-0 hover:text-gray-300">
                      Read more →
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-white border-white hover:bg-white hover:text-black"
                      onClick={() => window.open(job.application_url, '_blank')}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}