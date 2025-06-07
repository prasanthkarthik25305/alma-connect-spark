
# Technical Documentation - Alumni Student Network Platform

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [API Requirements & Reference](#api-requirements--reference)
3. [Form Structures & Data Flow](#form-structures--data-flow)
4. [Error Handling & Monitoring](#error-handling--monitoring)
5. [Database Schema & Access Patterns](#database-schema--access-patterns)
6. [AWS Migration Plan](#aws-migration-plan)
7. [ServiceNow Integration](#servicenow-integration)
8. [ML Model Integration](#ml-model-integration)
9. [Security & Compliance](#security--compliance)
10. [Appendices](#appendices)

---

## Architecture Overview

### High-Level System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   External      │
│   (React/TS)    │◄──►│   Backend       │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • React 18      │    │ • PostgreSQL    │    │ • ServiceNow    │
│ • TypeScript    │    │ • Auth          │    │ • ML Models     │
│ • Tailwind CSS  │    │ • Real-time     │    │ • Email Service │
│ • Vite          │    │ • Storage       │    │                 │
│ • React Query   │    │ • Edge Functions│    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Deployment Topology

- **Frontend**: Static React application deployed via Vite
- **Backend**: Supabase hosted PostgreSQL with built-in authentication
- **Real-time**: WebSocket connections through Supabase channels
- **Storage**: Supabase storage for file uploads (resumes, profile pictures)
- **CDN**: Static assets served through Vite build process

### Technology Stack

**Frontend:**
- React 18.3.1 with TypeScript
- Vite for build tooling and development server
- Tailwind CSS for styling
- Shadcn/UI component library
- React Query for state management and caching
- React Router for navigation

**Backend:**
- Supabase (PostgreSQL 15+)
- Row Level Security (RLS) for authorization
- Real-time subscriptions
- Edge Functions for serverless operations

---

## API Requirements & Reference

### Authentication Endpoints

#### Sign Up
```typescript
// Endpoint: Supabase Auth
// Method: supabase.auth.signUp()
const { data, error } = await supabase.auth.signUp({
  email: string,
  password: string,
  options: {
    data: {
      full_name: string,
      role: 'student' | 'alumni' | 'admin',
      department?: string
    }
  }
})
```

#### Sign In
```typescript
// Method: supabase.auth.signInWithPassword()
const { data, error } = await supabase.auth.signInWithPassword({
  email: string,
  password: string
})
```

#### Sign Out
```typescript
// Method: supabase.auth.signOut()
const { error } = await supabase.auth.signOut()
```

### User Management Endpoints

#### Get Current User
```typescript
// Method: supabase.auth.getUser()
const { data: { user }, error } = await supabase.auth.getUser()
```

#### Update User Profile
```typescript
// Endpoint: /users/{id}
// Method: UPDATE via supabase.from('users')
const { data, error } = await supabase
  .from('users')
  .update({
    full_name: string,
    department: string,
    theme_preference: 'light' | 'dark'
  })
  .eq('id', userId)
```

### Profile Management Endpoints

#### Student Profiles
```typescript
// Create/Update Student Profile
const { data, error } = await supabase
  .from('student_profiles')
  .upsert({
    user_id: string,
    roll_number: string,
    current_education: string,
    year: string,
    cgpa: number,
    skills: string[],
    interests: string[],
    certifications: string[],
    address: string,
    gender: string,
    resume_url: string,
    profile_picture: string,
    placement_readiness_score: number
  })
```

#### Alumni Profiles
```typescript
// Create/Update Alumni Profile
const { data, error } = await supabase
  .from('alumni_profiles')
  .upsert({
    user_id: string,
    roll_number: string,
    graduation_year: string,
    company: string,
    designation: string,
    domain: string,
    experience_years: number,
    location: string,
    skills: string[],
    certifications: string[],
    success_story: string,
    education_summary: string,
    linkedin_url: string,
    resume_url: string,
    profile_picture: string,
    availability_for_mentorship: boolean
  })
```

### Job Management Endpoints

#### Create Job Posting
```typescript
const { data, error } = await supabase
  .from('job_postings')
  .insert({
    title: string,
    description: string,
    company: string,
    domain: string,
    location: string,
    salary_range: string,
    requirements: string[],
    posted_by: string, // user_id
    success_rate: number, // Alumni can set this
    is_active: boolean
  })
```

#### Get Job Listings
```typescript
const { data, error } = await supabase
  .from('job_postings')
  .select(`
    *,
    poster:users!job_postings_posted_by_fkey(full_name, role)
  `)
  .eq('is_active', true)
  .order('posted_at', { ascending: false })
```

### Messaging Endpoints

#### Send Message
```typescript
const { data, error } = await supabase
  .from('messages')
  .insert({
    sender_id: string,
    recipient_id: string,
    message: string
  })
```

#### Get Conversation
```typescript
const { data, error } = await supabase
  .from('messages')
  .select(`
    *,
    sender:users!messages_sender_id_fkey(full_name, role)
  `)
  .or(`and(sender_id.eq.${userId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${userId})`)
  .order('created_at', { ascending: true })
```

#### Mark Messages as Read
```typescript
const { error } = await supabase
  .from('messages')
  .update({ is_read: true })
  .eq('recipient_id', userId)
  .eq('is_read', false)
```

### Real-time Subscriptions

#### Message Updates
```typescript
const channel = supabase
  .channel('messages')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      // Handle new message
    }
  )
  .subscribe()
```

### Rate Limiting & Authentication

- **Authentication**: JWT tokens managed by Supabase Auth
- **Authorization**: Row Level Security (RLS) policies
- **Rate Limiting**: Handled by Supabase infrastructure
- **API Keys**: Supabase anon key for client-side operations

---

## Form Structures & Data Flow

### User Registration Form

**Fields:**
- `full_name`: string (required)
- `email`: string (required, email validation)
- `password`: string (required, min 8 characters)
- `role`: 'student' | 'alumni' | 'admin' (required)
- `department`: string (optional)

**Validation:**
- Client-side: React Hook Form with Zod schema
- Server-side: Supabase Auth validation

**Data Flow:**
1. User submits form → AuthModal component
2. Form validation → React Hook Form
3. API call → supabase.auth.signUp()
4. Success → Redirect to dashboard
5. Error → Display toast notification

### Student Profile Form

**Fields:**
```typescript
interface StudentProfileForm {
  roll_number: string
  current_education: string
  year: string
  cgpa: number
  skills: string[]
  interests: string[]
  certifications: string[]
  address: string
  gender: string
  resume_url?: string
  profile_picture?: string
}
```

**Validation Rules:**
- CGPA: 0.0 - 10.0 range
- Year: Current academic year format
- Skills/Interests: Array of strings, max 10 items
- Resume: PDF file, max 5MB

### Job Posting Form

**Fields:**
```typescript
interface JobPostingForm {
  title: string
  description: string
  company: string
  domain: string
  location: string
  salary_range: string
  requirements: string[]
  success_rate?: number // Only for alumni
}
```

**Validation:**
- Title: Max 100 characters
- Description: Max 2000 characters
- Requirements: Array of strings, max 10 items
- Success rate: 0-100 percentage (alumni only)

### Message Form

**Fields:**
- `message`: string (required, max 1000 characters)
- `recipient_id`: string (required)

**Real-time Updates:**
- Messages update in real-time via Supabase channels
- Unread count updates automatically
- Typing indicators (future enhancement)

---

## Error Handling & Monitoring

### Error Code Mapping

#### Authentication Errors
```typescript
// Common Supabase Auth errors
const authErrorMessages = {
  'Invalid login credentials': 'Invalid email or password',
  'Email not confirmed': 'Please check your email and confirm your account',
  'Password should be at least 8 characters': 'Password must be at least 8 characters long',
  'User already registered': 'An account with this email already exists'
}
```

#### Database Errors
```typescript
// Common database constraint errors
const dbErrorMessages = {
  '23505': 'This record already exists', // Unique constraint
  '23503': 'Referenced record not found', // Foreign key constraint
  '23514': 'Invalid data provided', // Check constraint
  'PGRST116': 'No matching records found'
}
```

### Client-Side Error Display

**Toast Notifications:**
```typescript
import { toast } from '@/components/ui/use-toast'

// Success toast
toast({
  title: "Success",
  description: "Operation completed successfully",
})

// Error toast
toast({
  title: "Error",
  description: "Something went wrong. Please try again.",
  variant: "destructive",
})
```

**Form Validation Errors:**
- Inline field validation with React Hook Form
- Error messages displayed below form fields
- Form submission disabled until all errors resolved

### Logging Strategy

**Frontend Logging:**
```typescript
// Console logging for development
console.log('User action:', { action, userId, timestamp })
console.error('Error occurred:', error)

// Production logging (integrate with service like Sentry)
if (import.meta.env.PROD) {
  // Send to monitoring service
}
```

**Backend Logging:**
- Supabase provides built-in logging for database operations
- Edge Functions have console.log output in Supabase dashboard
- Authentication events logged automatically

### Monitoring Setup

**Recommended Tools:**
- **Sentry**: Frontend error tracking and performance monitoring
- **Supabase Insights**: Database performance and query analytics
- **Uptime Robot**: Application availability monitoring
- **LogRocket**: User session recording and debugging

---

## Database Schema & Access Patterns

### Entity Relationship Diagram

```
Users (1) ──── (0..1) StudentProfiles
  │
  ├── (1) ──── (0..1) AlumniProfiles
  │
  ├── (1) ──── (0..*) Messages (sender)
  │
  ├── (1) ──── (0..*) Messages (recipient)
  │
  ├── (1) ──── (0..*) JobPostings
  │
  ├── (1) ──── (0..*) MentorshipRequests (student)
  │
  ├── (1) ──── (0..*) MentorshipRequests (alumni)
  │
  ├── (1) ──── (0..*) Referrals (student)
  │
  ├── (1) ──── (0..*) Referrals (alumni)
  │
  └── (1) ──── (0..*) SupportTickets

JobPostings (1) ──── (0..*) Referrals
```

### Table Definitions

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  role user_role NOT NULL, -- enum: student, alumni, admin
  department TEXT,
  theme_preference theme_preference DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### Student Profiles
```sql
CREATE TABLE student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  roll_number TEXT,
  current_education TEXT,
  year TEXT,
  cgpa NUMERIC(3,2),
  skills JSONB DEFAULT '[]',
  interests JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  address TEXT,
  gender TEXT,
  resume_url TEXT,
  profile_picture TEXT,
  placement_readiness_score NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### Alumni Profiles
```sql
CREATE TABLE alumni_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  roll_number TEXT,
  graduation_year TEXT,
  company TEXT,
  designation TEXT,
  domain TEXT,
  experience_years INTEGER,
  location TEXT,
  skills JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  success_story TEXT,
  education_summary TEXT,
  linkedin_url TEXT,
  resume_url TEXT,
  profile_picture TEXT,
  availability_for_mentorship BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### Job Postings
```sql
CREATE TABLE job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company TEXT NOT NULL,
  domain TEXT,
  location TEXT,
  salary_range TEXT,
  requirements JSONB DEFAULT '[]',
  posted_by UUID REFERENCES users(id),
  success_rate INTEGER,
  is_active BOOLEAN DEFAULT true,
  posted_at TIMESTAMPTZ DEFAULT now()
);
```

#### Messages
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) NOT NULL,
  recipient_id UUID REFERENCES users(id) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Indexing Strategy

```sql
-- Performance indexes
CREATE INDEX idx_messages_conversation ON messages(sender_id, recipient_id, created_at);
CREATE INDEX idx_messages_recipient_unread ON messages(recipient_id) WHERE is_read = false;
CREATE INDEX idx_job_postings_active ON job_postings(posted_at DESC) WHERE is_active = true;
CREATE INDEX idx_student_profiles_user ON student_profiles(user_id);
CREATE INDEX idx_alumni_profiles_user ON alumni_profiles(user_id);
CREATE INDEX idx_users_role ON users(role);
```

### Common Query Patterns

#### Get User Dashboard Data
```sql
-- Student dashboard query
SELECT 
  u.full_name,
  u.role,
  sp.*,
  COUNT(m.id) as unread_messages
FROM users u
LEFT JOIN student_profiles sp ON u.id = sp.user_id
LEFT JOIN messages m ON u.id = m.recipient_id AND m.is_read = false
WHERE u.id = $1
GROUP BY u.id, sp.id;
```

#### Get Job Recommendations
```sql
-- Jobs matching student skills/interests
SELECT DISTINCT jp.*
FROM job_postings jp
CROSS JOIN student_profiles sp
WHERE sp.user_id = $1
  AND jp.is_active = true
  AND (
    jp.requirements ?| sp.skills::text[]
    OR jp.domain = ANY(sp.interests::text[])
  )
ORDER BY jp.posted_at DESC;
```

---

## AWS Migration Plan

### Recommended AWS Services Mapping

#### Current → AWS Migration

| Current Service | AWS Equivalent | Rationale |
|----------------|----------------|-----------|
| Supabase PostgreSQL | Amazon RDS PostgreSQL | Managed database with automated backups |
| Supabase Auth | Amazon Cognito | User management and authentication |
| Supabase Real-time | API Gateway WebSocket | Real-time messaging infrastructure |
| Supabase Edge Functions | AWS Lambda | Serverless compute for backend logic |
| Supabase Storage | Amazon S3 | Object storage for files |
| Frontend Hosting | Amazon CloudFront + S3 | CDN and static hosting |

### Infrastructure as Code

#### Terraform Configuration

```hcl
# terraform/main.tf
provider "aws" {
  region = var.aws_region
}

# VPC and Networking
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "alumni-network-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = false
}

# RDS PostgreSQL
resource "aws_db_instance" "main" {
  identifier = "alumni-network-db"
  
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true
  
  db_name  = "alumni_network"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = false
  final_snapshot_identifier = "alumni-network-final-snapshot"
}

# Lambda Functions
resource "aws_lambda_function" "api" {
  filename         = "api.zip"
  function_name    = "alumni-network-api"
  role            = aws_iam_role.lambda.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  
  vpc_config {
    subnet_ids         = module.vpc.private_subnets
    security_group_ids = [aws_security_group.lambda.id]
  }
  
  environment {
    variables = {
      DATABASE_URL = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.main.endpoint}/${aws_db_instance.main.db_name}"
      JWT_SECRET   = var.jwt_secret
    }
  }
}

# API Gateway
resource "aws_api_gateway_rest_api" "main" {
  name        = "alumni-network-api"
  description = "Alumni Network API"
  
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# Cognito User Pool
resource "aws_cognito_user_pool" "main" {
  name = "alumni-network-users"
  
  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }
  
  auto_verified_attributes = ["email"]
  
  schema {
    attribute_data_type = "String"
    name               = "email"
    required           = true
    mutable            = true
  }
  
  schema {
    attribute_data_type = "String"
    name               = "role"
    required           = false
    mutable            = true
  }
}

# S3 Bucket for file storage
resource "aws_s3_bucket" "files" {
  bucket = "alumni-network-files-${random_id.bucket_suffix.hex}"
}

resource "aws_s3_bucket_versioning" "files" {
  bucket = aws_s3_bucket.files.id
  versioning_configuration {
    status = "Enabled"
  }
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "main" {
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.frontend.id}"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }
  
  enabled             = true
  default_root_object = "index.html"
  
  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "S3-${aws_s3_bucket.frontend.id}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

### Data Migration Steps

#### 1. Export from Supabase
```bash
# Export schema
pg_dump -h db.project.supabase.co -U postgres -s alumni_network > schema.sql

# Export data
pg_dump -h db.project.supabase.co -U postgres -a alumni_network > data.sql

# Export specific tables
pg_dump -h db.project.supabase.co -U postgres -t users -t student_profiles alumni_network > users_data.sql
```

#### 2. Transform for AWS RDS
```sql
-- Remove Supabase-specific extensions and functions
-- Update any Supabase auth references to use Cognito user IDs
-- Modify RLS policies to work with application-level security

-- Example transformation script
UPDATE users SET id = cognito_user_id WHERE cognito_user_id IS NOT NULL;
```

#### 3. Import to AWS RDS
```bash
# Restore schema
psql -h alumni-network-db.amazonaws.com -U dbuser -d alumni_network < schema.sql

# Restore data
psql -h alumni-network-db.amazonaws.com -U dbuser -d alumni_network < data.sql
```

### CI/CD Pipeline Adjustments

#### CodePipeline Configuration
```yaml
# buildspec.yml
version: 0.2
phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker image...
      - docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG
```

---

## ServiceNow Integration

### Business Event Triggers

#### New User Registration
```typescript
// Trigger: User completes registration
const triggerServiceNowIncident = async (userData: {
  id: string
  full_name: string
  email: string
  role: string
  department: string
}) => {
  const incident = {
    short_description: `New ${userData.role} registration: ${userData.full_name}`,
    description: `A new ${userData.role} has registered with email ${userData.email} in department ${userData.department}`,
    category: 'User Management',
    subcategory: 'Registration',
    priority: '4',
    state: '1', // New
    caller_id: userData.email,
    u_user_role: userData.role,
    u_department: userData.department
  }
  
  await sendToServiceNow('/api/now/table/incident', incident)
}
```

#### Job Posting Events
```typescript
// Trigger: New job posting created
const createJobPostingTicket = async (jobData: {
  title: string
  company: string
  posted_by: string
  domain: string
}) => {
  const ticket = {
    short_description: `New job posting: ${jobData.title} at ${jobData.company}`,
    description: `A new job opportunity has been posted in ${jobData.domain} domain`,
    category: 'Job Management',
    subcategory: 'New Posting',
    priority: '3',
    state: '1',
    u_job_title: jobData.title,
    u_company: jobData.company,
    u_domain: jobData.domain
  }
  
  await sendToServiceNow('/api/now/table/u_job_postings', ticket)
}
```

#### Support Ticket Integration
```typescript
// Trigger: User creates support ticket
const createServiceNowTicket = async (supportTicket: {
  title: string
  description: string
  user_id: string
  status: string
}) => {
  const incident = {
    short_description: supportTicket.title,
    description: supportTicket.description,
    category: 'Technical Support',
    priority: '3',
    state: '1',
    caller_id: supportTicket.user_id,
    u_original_ticket_id: supportTicket.id
  }
  
  await sendToServiceNow('/api/now/table/incident', incident)
}
```

### ServiceNow API Integration

#### Authentication Configuration
```typescript
// ServiceNow client configuration
const serviceNowConfig = {
  instance: process.env.SERVICENOW_INSTANCE, // e.g., 'dev12345'
  username: process.env.SERVICENOW_USERNAME,
  password: process.env.SERVICENOW_PASSWORD,
  baseUrl: `https://${process.env.SERVICENOW_INSTANCE}.service-now.com`
}

// Basic Auth headers
const getAuthHeaders = () => ({
  'Authorization': `Basic ${Buffer.from(`${serviceNowConfig.username}:${serviceNowConfig.password}`).toString('base64')}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
})
```

#### API Client Implementation
```typescript
// Edge Function: servicenow-integration
export async function sendToServiceNow(endpoint: string, data: any) {
  const url = `${serviceNowConfig.baseUrl}${endpoint}`
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    })
    
    if (!response.ok) {
      throw new Error(`ServiceNow API error: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    console.log('ServiceNow ticket created:', result.result.sys_id)
    
    return result.result
  } catch (error) {
    console.error('ServiceNow integration error:', error)
    
    // Store failed requests for retry
    await supabase
      .from('servicenow_queue')
      .insert({
        endpoint,
        payload: data,
        error_message: error.message,
        retry_count: 0,
        status: 'failed'
      })
    
    throw error
  }
}
```

### Error Recovery & Retry Logic

#### Retry Queue Implementation
```sql
-- ServiceNow integration queue table
CREATE TABLE servicenow_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_retry_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
```

#### Retry Logic
```typescript
// Edge Function: servicenow-retry-processor
export async function processRetryQueue() {
  const { data: queueItems } = await supabase
    .from('servicenow_queue')
    .select('*')
    .eq('status', 'failed')
    .lt('retry_count', 3)
    .order('created_at')
    .limit(10)
  
  for (const item of queueItems) {
    try {
      await sendToServiceNow(item.endpoint, item.payload)
      
      // Mark as completed
      await supabase
        .from('servicenow_queue')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', item.id)
        
    } catch (error) {
      // Increment retry count
      await supabase
        .from('servicenow_queue')
        .update({
          retry_count: item.retry_count + 1,
          last_retry_at: new Date().toISOString(),
          error_message: error.message,
          status: item.retry_count + 1 >= 3 ? 'failed_permanently' : 'failed'
        })
        .eq('id', item.id)
    }
  }
}
```

---

## ML Model Integration

### Placement Readiness Scoring

#### Model Endpoint Configuration
```typescript
// ML model configuration
const mlConfig = {
  placementModelEndpoint: process.env.ML_PLACEMENT_ENDPOINT,
  jobRecommendationEndpoint: process.env.ML_JOB_RECOMMENDATION_ENDPOINT,
  apiKey: process.env.ML_API_KEY,
  modelVersion: 'v1.0'
}
```

#### Placement Score Calculation
```typescript
// Edge Function: calculate-placement-score
export async function calculatePlacementScore(studentData: {
  cgpa: number
  skills: string[]
  certifications: string[]
  year: string
  domain_interests: string[]
}) {
  const payload = {
    features: {
      academic_score: studentData.cgpa,
      skill_count: studentData.skills.length,
      certification_count: studentData.certifications.length,
      academic_year: parseInt(studentData.year),
      skills_vector: await vectorizeSkills(studentData.skills),
      domain_vector: await vectorizeDomains(studentData.domain_interests)
    },
    model_version: mlConfig.modelVersion
  }
  
  try {
    const response = await fetch(mlConfig.placementModelEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mlConfig.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    const result = await response.json()
    const score = Math.round(result.placement_probability * 100)
    
    // Update student profile with new score
    await supabase
      .from('student_profiles')
      .update({ placement_readiness_score: score })
      .eq('user_id', studentData.user_id)
    
    return score
  } catch (error) {
    console.error('ML model error:', error)
    return null
  }
}
```

### Job Recommendation System

#### Recommendation Algorithm
```typescript
// Edge Function: job-recommendations
export async function getJobRecommendations(studentId: string) {
  // Get student profile and preferences
  const { data: student } = await supabase
    .from('student_profiles')
    .select(`
      *,
      user:users(*)
    `)
    .eq('user_id', studentId)
    .single()
  
  // Get available jobs
  const { data: jobs } = await supabase
    .from('job_postings')
    .select('*')
    .eq('is_active', true)
  
  // Prepare ML payload
  const payload = {
    student_profile: {
      skills: student.skills,
      interests: student.interests,
      cgpa: student.cgpa,
      domain_preferences: student.interests
    },
    job_listings: jobs.map(job => ({
      id: job.id,
      title: job.title,
      domain: job.domain,
      requirements: job.requirements,
      company: job.company,
      location: job.location
    }))
  }
  
  try {
    const response = await fetch(mlConfig.jobRecommendationEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mlConfig.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    const recommendations = await response.json()
    
    // Return jobs ranked by ML model score
    return recommendations.ranked_jobs.map(item => ({
      ...jobs.find(job => job.id === item.job_id),
      match_score: item.score,
      reasoning: item.reasoning
    }))
    
  } catch (error) {
    console.error('Job recommendation error:', error)
    // Fallback to rule-based recommendations
    return getRuleBasedRecommendations(student, jobs)
  }
}
```

### Model Hosting & Versioning

#### AWS SageMaker Integration
```typescript
// SageMaker model endpoint configuration
const sagemakerConfig = {
  region: 'us-east-1',
  placementModelEndpoint: 'placement-model-endpoint-v1',
  jobRecommendationEndpoint: 'job-recommendation-endpoint-v1'
}

// SageMaker client
import { SageMakerRuntimeClient, InvokeEndpointCommand } from "@aws-sdk/client-sagemaker-runtime"

const sagemakerClient = new SageMakerRuntimeClient({
  region: sagemakerConfig.region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

export async function invokeSageMakerModel(endpointName: string, payload: any) {
  const command = new InvokeEndpointCommand({
    EndpointName: endpointName,
    ContentType: 'application/json',
    Body: JSON.stringify(payload)
  })
  
  try {
    const response = await sagemakerClient.send(command)
    const result = JSON.parse(new TextDecoder().decode(response.Body))
    return result
  } catch (error) {
    console.error('SageMaker invocation error:', error)
    throw error
  }
}
```

#### Model Version Management
```sql
-- Model versioning table
CREATE TABLE ml_model_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL,
  version TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  performance_metrics JSONB,
  deployed_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES users(id)
);

-- Model prediction logs
CREATE TABLE ml_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL,
  input_data JSONB NOT NULL,
  prediction_result JSONB NOT NULL,
  confidence_score DECIMAL,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Data Preprocessing Requirements

#### Feature Engineering Pipeline
```typescript
// Preprocessing utilities
export const preprocessStudentData = (rawData: any) => {
  return {
    // Normalize CGPA to 0-1 scale
    cgpa_normalized: rawData.cgpa / 10.0,
    
    // Convert skills to embeddings
    skills_embedding: vectorizeSkills(rawData.skills),
    
    // Calculate experience score
    experience_score: calculateExperienceScore(rawData.certifications, rawData.projects),
    
    // Academic year encoding
    year_encoded: encodeAcademicYear(rawData.year),
    
    // Domain preference vector
    domain_vector: encodeDomainPreferences(rawData.interests)
  }
}

export const vectorizeSkills = async (skills: string[]) => {
  // Predefined skill categories and weights
  const skillCategories = {
    'programming': ['javascript', 'python', 'java', 'react', 'node.js'],
    'data_science': ['machine learning', 'data analysis', 'sql', 'python'],
    'design': ['ui/ux', 'figma', 'photoshop', 'design thinking'],
    'management': ['project management', 'leadership', 'communication']
  }
  
  const vector = Object.keys(skillCategories).map(category => {
    const categorySkills = skillCategories[category]
    const matchCount = skills.filter(skill => 
      categorySkills.some(catSkill => 
        skill.toLowerCase().includes(catSkill.toLowerCase())
      )
    ).length
    return matchCount / categorySkills.length
  })
  
  return vector
}
```

---

## Security & Compliance

### Data Encryption

#### At Rest
- **Database**: AWS RDS encryption enabled by default
- **File Storage**: S3 server-side encryption (SSE-S3)
- **Secrets**: AWS Secrets Manager for sensitive configuration

#### In Transit
- **API Communication**: HTTPS/TLS 1.3 for all API calls
- **Database Connections**: SSL/TLS encrypted connections
- **WebSocket**: WSS (WebSocket Secure) for real-time messaging

#### Application Level
```typescript
// Password hashing (handled by Supabase Auth)
// Additional sensitive data encryption
import crypto from 'crypto'

const encryptSensitiveData = (data: string, key: string) => {
  const cipher = crypto.createCipher('aes-256-cbc', key)
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

const decryptSensitiveData = (encryptedData: string, key: string) => {
  const decipher = crypto.createDecipher('aes-256-cbc', key)
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}
```

### IAM Roles & Least Privilege

#### AWS IAM Policies

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DatabaseAccess",
      "Effect": "Allow",
      "Action": [
        "rds:DescribeDBInstances",
        "rds:Connect"
      ],
      "Resource": [
        "arn:aws:rds:*:*:db:alumni-network-*"
      ]
    },
    {
      "Sid": "S3FileAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::alumni-network-files/*"
      ]
    },
    {
      "Sid": "MLModelAccess",
      "Effect": "Allow",
      "Action": [
        "sagemaker:InvokeEndpoint"
      ],
      "Resource": [
        "arn:aws:sagemaker:*:*:endpoint/placement-model-*",
        "arn:aws:sagemaker:*:*:endpoint/job-recommendation-*"
      ]
    }
  ]
}
```

#### Application-Level Access Control

```typescript
// Role-based access control middleware
export const requireRole = (allowedRoles: string[]) => {
  return async (req: Request) => {
    const user = await getCurrentUser(req)
    
    if (!user || !allowedRoles.includes(user.role)) {
      throw new Error('Insufficient permissions')
    }
    
    return user
  }
}

// Usage in API endpoints
app.post('/api/jobs', requireRole(['admin', 'alumni']), async (req, res) => {
  // Only admins and alumni can post jobs
})

app.get('/api/admin/analytics', requireRole(['admin']), async (req, res) => {
  // Only admins can access analytics
})
```

### Compliance Requirements

#### GDPR Compliance

```typescript
// Data export functionality
export const exportUserData = async (userId: string) => {
  const userData = await supabase
    .from('users')
    .select(`
      *,
      student_profile:student_profiles(*),
      alumni_profile:alumni_profiles(*),
      messages_sent:messages!messages_sender_id_fkey(*),
      messages_received:messages!messages_recipient_id_fkey(*),
      job_postings(*),
      support_tickets(*)
    `)
    .eq('id', userId)
    .single()
  
  return {
    exportDate: new Date().toISOString(),
    userData: userData.data
  }
}

// Data deletion functionality
export const deleteUserData = async (userId: string) => {
  // Anonymize instead of hard delete to maintain referential integrity
  await supabase
    .from('users')
    .update({
      full_name: 'Deleted User',
      email: null,
      deleted_at: new Date().toISOString()
    })
    .eq('id', userId)
  
  // Soft delete related records
  await supabase
    .from('messages')
    .update({ message: '[Message deleted]' })
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
}
```

#### Audit Logging

```sql
-- Audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (action, resource_type, resource_id, new_values)
    VALUES ('INSERT', TG_TABLE_NAME, NEW.id::text, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (action, resource_type, resource_id, old_values, new_values)
    VALUES ('UPDATE', TG_TABLE_NAME, NEW.id::text, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (action, resource_type, resource_id, old_values)
    VALUES ('DELETE', TG_TABLE_NAME, OLD.id::text, to_jsonb(OLD));
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

---

## Appendices

### Environment Variables

#### Development Environment
```bash
# .env.local
VITE_SUPABASE_URL=https://izvqijnaakgdmbaidozk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_URL=http://localhost:5173

# Backend Environment Variables (Supabase Edge Functions)
DATABASE_URL=postgresql://postgres:password@db.project.supabase.co:5432/postgres
JWT_SECRET=your-jwt-secret
SERVICENOW_INSTANCE=dev12345
SERVICENOW_USERNAME=api_user
SERVICENOW_PASSWORD=api_password
ML_PLACEMENT_ENDPOINT=https://api.ml-service.com/placement/predict
ML_JOB_RECOMMENDATION_ENDPOINT=https://api.ml-service.com/jobs/recommend
ML_API_KEY=ml-api-key
RESEND_API_KEY=re_your_resend_key
```

#### Production Environment (AWS)
```bash
# AWS Environment Variables
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
RDS_ENDPOINT=alumni-network-db.cluster-xyz.us-east-1.rds.amazonaws.com
RDS_USERNAME=dbuser
RDS_PASSWORD=secure-password
S3_BUCKET=alumni-network-files
COGNITO_USER_POOL_ID=us-east-1_ABC123
COGNITO_CLIENT_ID=abcd1234...
SAGEMAKER_PLACEMENT_ENDPOINT=placement-model-endpoint-v1
SAGEMAKER_JOB_RECOMMENDATION_ENDPOINT=job-recommendation-endpoint-v1
```

### Post-Deployment Runbooks

#### Database Maintenance
```sql
-- Weekly maintenance tasks

-- Update placement readiness scores
SELECT calculate_placement_scores_batch();

-- Clean up old messages (older than 1 year)
DELETE FROM messages 
WHERE created_at < NOW() - INTERVAL '1 year' 
AND is_read = true;

-- Archive completed support tickets
UPDATE support_tickets 
SET archived = true 
WHERE status = 'resolved' 
AND updated_at < NOW() - INTERVAL '6 months';

-- Refresh materialized views (if any)
REFRESH MATERIALIZED VIEW user_activity_summary;
```

#### Performance Monitoring
```sql
-- Check database performance
SELECT 
  schemaname,
  tablename,
  seq_scan,
  seq_tup_read,
  idx_scan,
  idx_tup_fetch
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan
ORDER BY seq_tup_read DESC;

-- Check slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

#### Backup Procedures
```bash
# Daily database backup
pg_dump -h $RDS_ENDPOINT -U $RDS_USERNAME -d alumni_network | \
gzip > /backups/alumni_network_$(date +%Y%m%d).sql.gz

# S3 file backup
aws s3 sync s3://alumni-network-files s3://alumni-network-backups/$(date +%Y%m%d)/

# Backup verification
psql -h $RDS_ENDPOINT -U $RDS_USERNAME -d alumni_network_test < latest_backup.sql
```

### Glossary

| Term | Definition |
|------|------------|
| **RLS** | Row Level Security - PostgreSQL feature for table-level authorization |
| **JWT** | JSON Web Token - Standard for secure token-based authentication |
| **CORS** | Cross-Origin Resource Sharing - Web security feature |
| **Edge Function** | Serverless function that runs close to users geographically |
| **Realtime** | WebSocket-based live data synchronization |
| **Supabase** | Open source Firebase alternative with PostgreSQL |
| **SageMaker** | AWS machine learning platform |
| **Cognito** | AWS user management and authentication service |
| **RDS** | Relational Database Service - AWS managed database |
| **IAM** | Identity and Access Management - AWS permission system |
| **VPC** | Virtual Private Cloud - AWS isolated network |
| **API Gateway** | AWS service for creating and managing APIs |
| **CloudFront** | AWS content delivery network (CDN) |
| **ServiceNow** | Enterprise service management platform |

### API Response Examples

#### Successful Authentication Response
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "john.doe@example.com",
      "role": "student",
      "full_name": "John Doe",
      "department": "Computer Science",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "session": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_at": 1705312200
    }
  },
  "error": null
}
```

#### Job Listings Response
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "Software Engineer",
      "description": "We are looking for a talented software engineer...",
      "company": "TechCorp Inc.",
      "domain": "Technology",
      "location": "San Francisco, CA",
      "salary_range": "$80,000 - $120,000",
      "requirements": ["JavaScript", "React", "Node.js"],
      "posted_by": "550e8400-e29b-41d4-a716-446655440002",
      "success_rate": 85,
      "is_active": true,
      "posted_at": "2024-01-15T10:30:00Z",
      "poster": {
        "full_name": "Jane Smith",
        "role": "alumni"
      }
    }
  ],
  "error": null,
  "count": 1
}
```

#### Error Response
```json
{
  "data": null,
  "error": {
    "message": "Invalid credentials",
    "code": "INVALID_CREDENTIALS",
    "details": null,
    "hint": null
  }
}
```

---

*This documentation is maintained by the development team and should be updated whenever system architecture or API endpoints change. Last updated: [Current Date]*
