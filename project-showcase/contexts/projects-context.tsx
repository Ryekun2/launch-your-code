"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Project {
  id: number
  title: string
  description: string
  techStack: string[]
  githubUrl: string
  demoUrl: string
  imageUrl: string
  author: string
  createdAt: string
  contractAddress?: string
  twitterUrl?: string
}

interface ProjectsContextType {
  projects: Project[]
  addProject: (project: Omit<Project, "id" | "createdAt">) => Promise<void>
  loading: boolean
  error: string | null
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined)

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load projects from Supabase on mount
  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)

      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError("Database not configured. Please add Supabase environment variables.")
        setProjects([])
        setLoading(false)
        return
      }

      // Dynamically import supabase to avoid initialization errors
      const { supabase } = await import("@/lib/supabase")

      const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      // Transform the data to match our interface
      const transformedProjects: Project[] = (data || []).map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        techStack: project.tech_stack || [],
        githubUrl: project.github_url,
        demoUrl: project.demo_url || "",
        imageUrl: project.image_url || "",
        author: project.author,
        createdAt: new Date(project.created_at).toISOString().split("T")[0],
        contractAddress: project.contract_address || undefined,
        twitterUrl: project.twitter_url || undefined,
      }))

      setProjects(transformedProjects)
    } catch (error) {
      console.error("Error loading projects:", error)
      setError("Failed to load projects. Please check your database configuration.")
    } finally {
      setLoading(false)
    }
  }

  const addProject = async (projectData: Omit<Project, "id" | "createdAt">) => {
    try {
      setError(null)

      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error("Database not configured. Please add Supabase environment variables.")
      }

      // Dynamically import supabase to avoid initialization errors
      const { supabase } = await import("@/lib/supabase")

      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            title: projectData.title,
            description: projectData.description,
            tech_stack: projectData.techStack,
            github_url: projectData.githubUrl,
            demo_url: projectData.demoUrl || null,
            image_url: projectData.imageUrl || null,
            author: projectData.author,
            contract_address: projectData.contractAddress || null,
            twitter_url: projectData.twitterUrl || null,
          },
        ])
        .select()
        .single()

      if (error) {
        throw error
      }

      // Add the new project to the local state
      if (data) {
        const newProject: Project = {
          id: data.id,
          title: data.title,
          description: data.description,
          techStack: data.tech_stack || [],
          githubUrl: data.github_url,
          demoUrl: data.demo_url || "",
          imageUrl: data.image_url || "",
          author: data.author,
          createdAt: new Date(data.created_at).toISOString().split("T")[0],
          contractAddress: data.contract_address || undefined,
          twitterUrl: data.twitter_url || undefined,
        }

        setProjects((prev) => [newProject, ...prev])
      }
    } catch (error) {
      console.error("Error adding project:", error)
      setError("Failed to add project")
      throw error
    }
  }

  return (
    <ProjectsContext.Provider value={{ projects, addProject, loading, error }}>{children}</ProjectsContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectsContext)
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider")
  }
  return context
}
