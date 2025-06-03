
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookUser, Bell, User, File } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  // Mock data for demonstration
  const recommendedJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      type: "Full-time",
      match: 95,
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      type: "Remote",
      match: 88,
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "Software Engineer",
      company: "StartupXYZ",
      location: "Austin, TX",
      type: "Hybrid",
      match: 82,
      posted: "3 days ago"
    }
  ];

  const activeAlumni = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "Google",
      position: "Senior Engineer",
      department: "Computer Science",
      availability: "Available"
    },
    {
      id: 2,
      name: "Michael Chen",
      company: "Microsoft",
      position: "Product Manager",
      department: "Computer Science",
      availability: "Busy"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Student Dashboard</h1>
            <p className="text-foreground/70 mt-2">Welcome back! Here's your personalized career hub.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-blue-accent/30 hover:border-blue-accent">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button className="bg-blue-accent hover:bg-blue-accent/90">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Profile Score</p>
                  <p className="text-2xl font-bold text-green-bright">85%</p>
                </div>
                <div className="w-12 h-12 bg-green-bright/20 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-green-bright" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Applications</p>
                  <p className="text-2xl font-bold text-blue-accent">12</p>
                </div>
                <div className="w-12 h-12 bg-blue-accent/20 rounded-full flex items-center justify-center">
                  <File className="w-6 h-6 text-blue-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Referrals</p>
                  <p className="text-2xl font-bold text-green-secondary">5</p>
                </div>
                <div className="w-12 h-12 bg-green-secondary/20 rounded-full flex items-center justify-center">
                  <BookUser className="w-6 h-6 text-green-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Responses</p>
                  <p className="text-2xl font-bold text-foreground">3</p>
                </div>
                <div className="w-12 h-12 bg-foreground/20 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recommended Jobs */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-bright rounded-full"></div>
                <span>AI Recommended Jobs</span>
              </CardTitle>
              <CardDescription>
                Jobs matched based on your profile and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedJobs.map((job) => (
                <div key={job.id} className="p-4 rounded-lg border border-border/40 hover:border-blue-accent/40 transition-colors hover-scale">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      <p className="text-sm text-foreground/70">{job.company}</p>
                      <p className="text-sm text-foreground/60">{job.location}</p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="bg-green-bright/20 text-green-bright border-green-bright/30"
                    >
                      {job.match}% match
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{job.type}</Badge>
                      <span className="text-xs text-foreground/50">{job.posted}</span>
                    </div>
                    <Button size="sm" className="bg-blue-accent hover:bg-blue-accent/90">
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Active Alumni */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-accent rounded-full"></div>
                <span>Active Alumni</span>
              </CardTitle>
              <CardDescription>
                Connect with alumni in your department
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeAlumni.map((alumni) => (
                <div key={alumni.id} className="p-4 rounded-lg border border-border/40 hover:border-blue-accent/40 transition-colors hover-scale">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{alumni.name}</h3>
                      <p className="text-sm text-foreground/70">{alumni.position}</p>
                      <p className="text-sm text-foreground/60">{alumni.company}</p>
                    </div>
                    <Badge 
                      variant={alumni.availability === 'Available' ? 'default' : 'secondary'}
                      className={alumni.availability === 'Available' 
                        ? 'bg-green-secondary/20 text-green-secondary border-green-secondary/30' 
                        : 'bg-foreground/20 text-foreground/70'
                      }
                    >
                      {alumni.availability}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-foreground/50">{alumni.department}</span>
                    <div className="space-x-2">
                      <Button size="sm" variant="outline" className="border-blue-accent/30 hover:border-blue-accent">
                        Message
                      </Button>
                      <Button size="sm" className="bg-green-secondary hover:bg-green-secondary/90 text-navy-deep">
                        Request Referral
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
