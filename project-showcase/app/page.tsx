"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Plus, Code2, Loader2, Copy, AlertCircle, Database } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useProjects } from "@/contexts/projects-context"

// Twitter/X Icon Component
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export default function HomePage() {
  const { projects, loading, error } = useProjects()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Launch Your Code</h1>
            </div>
            <Link href="/upload">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Upload Project
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Creator Credit Section */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Created by:</span>
            <a
              href="https://x.com/Ryekun2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <TwitterIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Launch Your Own Project</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Share your creations Onchain, brought to you by Ryekun. Launch Coder will be the hub of the most technical
            minds.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Code2 className="h-4 w-4" />
              {loading ? "..." : projects.length} Projects
            </span>
            <span>•</span>
            <span>Open Source</span>
            <span>•</span>
            <span>Community Driven</span>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {error && (
            <div className="flex flex-col items-center justify-center gap-4 text-center py-12">
              <div className="flex items-center gap-2 text-amber-600">
                <Database className="h-8 w-8" />
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Database Configuration Required</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  To enable project sharing, please add your Supabase environment variables and deploy the site.
                </p>
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  <p className="font-mono">NEXT_PUBLIC_SUPABASE_URL</p>
                  <p className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
                </div>
              </div>
            </div>
          )}

          {!error && loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}

          {!error && !loading && projects.length === 0 && (
            <div className="text-center py-12">
              <Code2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to share your project!</p>
              <Link href="/upload">
                <Button>Upload Your Project</Button>
              </Link>
            </div>
          )}

          {!error && !loading && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={project.imageUrl || "/placeholder.svg?height=200&width=400"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <CardDescription className="text-sm text-muted-foreground">
                            by {project.author}
                          </CardDescription>
                          {/* Twitter Icon */}
                          {project.twitterUrl && (
                            <a
                              href={project.twitterUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <TwitterIcon className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{project.description}</p>

                    {/* Contract Address Section */}
                    {project.contractAddress && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Contract Address</p>
                            <p className="text-sm font-mono break-all">{project.contractAddress}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(project.contractAddress!)}
                            className="ml-2 h-8 w-8 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.techStack.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4 mr-1" />
                          Code
                        </a>
                      </Button>
                      {project.demoUrl && (
                        <Button size="sm" className="flex-1" asChild>
                          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Demo
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Launch Your Code. Built with Next.js and shadcn/ui.</p>
        </div>
      </footer>
    </div>
  )
}
