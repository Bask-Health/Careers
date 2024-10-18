'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Eye } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Job {
  id: string
  title: string
  published_on: string
  shortcode: string
  description: string
  department: string
  full_description: string
}

export function JobListComponent() {
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
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <header className="flex justify-between items-center mb-12">
        <Button variant="ghost" className="text-white hover:bg-transparent hover:text-gray-300">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex gap-4 items-center">
          <span className="text-lg font-semibold">Bask Health</span>
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
            Apply
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">Open Positions</h1>
        <p className="text-xl text-gray-400 mb-12">We're currently looking for help in the following areas</p>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="bg-[#141414] border-[#2A2A2A] rounded-lg overflow-hidden">
                <CardHeader className="p-6">
                  <Skeleton className="h-4 w-1/4 bg-[#2A2A2A]" />
                  <Skeleton className="h-8 w-3/4 mt-4 bg-[#2A2A2A]" />
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <Skeleton className="h-4 w-full bg-[#2A2A2A]" />
                  <Skeleton className="h-4 w-full mt-2 bg-[#2A2A2A]" />
                </CardContent>
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
          <div className="text-center p-8 bg-[#141414] rounded-lg border border-[#2A2A2A]">
            No open positions available at the moment.
          </div>
        )}

        {jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {jobs.map((job, index) => (
              <Card key={job.id} className={`bg-[#141414] border-[#2A2A2A] rounded-lg overflow-hidden ${index === 0 ? 'md:col-span-2' : ''}`}>
                <CardHeader className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400 text-sm">{formatDate(job.published_on)}</span>
                    <span className="flex items-center text-gray-400 text-sm">
                      <Eye className="mr-1 h-4 w-4" /> {Math.floor(Math.random() * 1000) + 100}
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <p className="text-gray-400">{job.description || job.full_description?.slice(0, 150) + '...' || 'No description available.'}</p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button variant="link" className="text-white p-0 hover:text-gray-300">
                    Read more →
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}