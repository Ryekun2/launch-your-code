"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, X, Code2, CheckCircle, Upload, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useProjects } from "@/contexts/projects-context"

export default function UploadPage() {
  const router = useRouter()
  const { addProject } = useProjects()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    githubUrl: "",
    demoUrl: "",
    author: "",
    imageUrl: "",
    contractAddress: "",
    twitterUrl: "",
  })

  const [techStack, setTechStack] = useState<string[]>([])
  const [currentTech, setCurrentTech] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addTech = () => {
    if (currentTech.trim() && !techStack.includes(currentTech.trim())) {
      setTechStack([...techStack, currentTech.trim()])
      setCurrentTech("")
    }
  }

  const removeTech = (tech: string) => {
    setTechStack(techStack.filter((t) => t !== tech))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)

    try {
      // Convert file to base64 for storage
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64String = event.target?.result as string
        setImagePreview(base64String)
        setFormData((prev) => ({ ...prev, imageUrl: base64String }))
        setIsUploadingImage(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading image:", error)
      setIsUploadingImage(false)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    setFormData((prev) => ({ ...prev, imageUrl: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      await addProject({
        ...formData,
        techStack,
      })

      setIsSuccess(true)

      // Show success state for 2 seconds, then redirect
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (error) {
      console.error("Error submitting project:", error)
      setError("Failed to upload project. Please try again.")
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Project Uploaded!</h2>
            <p className="text-muted-foreground mb-4">Your project has been successfully added to the showcase.</p>
            <p className="text-sm text-muted-foreground">Redirecting to homepage...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Upload Project</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Upload Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Share Your Project</CardTitle>
              <CardDescription>Upload your coding project to share with the developer community</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="flex items-center gap-2 text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      placeholder="My Awesome Project"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Your Name *</Label>
                    <Input
                      id="author"
                      placeholder="John Doe"
                      value={formData.author}
                      onChange={(e) => handleInputChange("author", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project, its features, and what makes it special..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub URL *</Label>
                    <Input
                      id="github"
                      type="url"
                      placeholder="https://github.com/username/project"
                      value={formData.githubUrl}
                      onChange={(e) => handleInputChange("githubUrl", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="demo">Demo URL</Label>
                    <Input
                      id="demo"
                      type="url"
                      placeholder="https://myproject.vercel.app"
                      value={formData.demoUrl}
                      onChange={(e) => handleInputChange("demoUrl", e.target.value)}
                    />
                  </div>
                </div>

                {/* Social Links Section */}
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X Profile</Label>
                  <Input
                    id="twitter"
                    type="url"
                    placeholder="https://twitter.com/yourusername or https://x.com/yourusername"
                    value={formData.twitterUrl}
                    onChange={(e) => handleInputChange("twitterUrl", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional: Add your Twitter/X profile to show on your project card
                  </p>
                </div>

                {/* Enhanced Image Upload Section */}
                <div className="space-y-2">
                  <Label>Project Image</Label>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative">
                      <div className="aspect-video relative overflow-hidden rounded-lg border">
                        <Image
                          src={imagePreview || "/placeholder.svg"}
                          alt="Project preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Upload Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* File Upload */}
                    <div>
                      <Label htmlFor="image-file" className="cursor-pointer">
                        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 transition-colors">
                          <div className="text-center">
                            {isUploadingImage ? (
                              <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                <p className="text-sm text-muted-foreground mt-2">Uploading...</p>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium">Upload from files</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Label>
                      <Input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isUploadingImage}
                      />
                    </div>

                    {/* URL Input */}
                    <div className="space-y-2">
                      <Label htmlFor="image-url">Or paste image URL</Label>
                      <Input
                        id="image-url"
                        type="url"
                        placeholder="https://example.com/image.png"
                        value={formData.imageUrl.startsWith("data:") ? "" : formData.imageUrl}
                        onChange={(e) => {
                          handleInputChange("imageUrl", e.target.value)
                          if (e.target.value) {
                            setImagePreview(e.target.value)
                          }
                        }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">Add a screenshot or preview image of your project</p>
                </div>

                {/* Contract Address Field */}
                <div className="space-y-2">
                  <Label htmlFor="contract">Contract Address</Label>
                  <Input
                    id="contract"
                    placeholder="0x1234567890123456789012345678901234567890"
                    value={formData.contractAddress}
                    onChange={(e) => handleInputChange("contractAddress", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional: Add your smart contract address if this is a blockchain project
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Tech Stack</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g., React, Node.js, MongoDB"
                      value={currentTech}
                      onChange={(e) => setCurrentTech(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                    />
                    <Button type="button" onClick={addTech} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {techStack.map((tech) => (
                        <Badge key={tech} variant="secondary" className="gap-1">
                          {tech}
                          <button type="button" onClick={() => removeTech(tech)} className="hover:text-destructive">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting || isUploadingImage}>
                  {isSubmitting ? "Uploading..." : "Upload Project"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
