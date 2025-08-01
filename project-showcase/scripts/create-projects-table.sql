-- Create the projects table
CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT NOT NULL,
  demo_url TEXT,
  image_url TEXT,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contract_address TEXT,
  twitter_url TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows everyone to read projects
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

-- Create a policy that allows anyone to insert projects
CREATE POLICY "Anyone can insert projects" ON projects
  FOR INSERT WITH CHECK (true);

-- Create an index on created_at for better performance
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects(created_at DESC);
