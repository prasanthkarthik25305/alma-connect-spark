
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, BookUser, Bell, File } from 'lucide-react';

export const AlumniDashboard: React.FC = () => {
  // Mock data for demonstration
  const jobPostings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      applications: 24,
      matches: 8,
      posted: "2 days ago",
      status: "Active"
    },
    {
      id: 2,
      title: "Product Manager",
      company: "StartupXYZ",
      applications: 15,
      matches: 5,
      posted: "1 week ago",
      status: "Active"
    }
  ];

  const matchedStudents = [
    {
      id: 1,
      name: "Alex Rodriguez",
      degree: "Computer Science",
      skills: ["React", "TypeScript", "Node.js"],
      match: 92,
      cgpa: 8.5
    },
    {
      id: 2,
      name: "Emily Chen",
      degree: "Software Engineering",
      skills: ["Python", "Machine Learning", "AWS"],
      match: 88,
      cgpa: 8.8
    }
  ];

  const referralRequests = [
    {
      id: 1,
      studentName: "John Doe",
      position: "Frontend Developer",
      company: "Google",
      status: "Pending",
      requestDate: "2 days ago"
    },
    {
      id: 2,
      studentName: "Sarah Wilson",
      position: "UX Designer",
      company: "Apple",
      status: "Accepted",
      requestDate: "1 week ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Alumni Dashboard</h1>
            <p className="text-foreground/70 mt-2">Help shape the next generation of professionals.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-blue-accent/30 hover:border-blue-accent">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button className="bg-green-bright hover:bg-green-bright/90 text-navy-deep">
              <File className="w-4 h-4 mr-2" />
              Post Job
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Active Jobs</p>
                  <p className="text-2xl font-bold text-blue-accent">3</p>
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
                  <p className="text-sm text-foreground/60">Total Referrals</p>
                  <p className="text-2xl font-bold text-green-secondary">18</p>
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
                  <p className="text-sm text-foreground/60">Mentoring</p>
                  <p className="text-2xl font-bold text-green-bright">7</p>
                </div>
                <div className="w-12 h-12 bg-green-bright/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-bright" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground/60">Success Rate</p>
                  <p className="text-2xl font-bold text-foreground">85%</p>
                </div>
                <div className="w-12 h-12 bg-foreground/20 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Postings */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-accent rounded-full"></div>
                <span>Your Job Postings</span>
              </CardTitle>
              <CardDescription>
                Manage your active job postings and applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {jobPostings.map((job) => (
                <div key={job.id} className="p-4 rounded-lg border border-border/40 hover:border-blue-accent/40 transition-colors hover-scale">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{job.title}</h3>
                      <p className="text-sm text-foreground/70">{job.company}</p>
                    </div>
                    <Badge 
                      variant="default" 
                      className="bg-green-secondary/20 text-green-secondary border-green-secondary/30"
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center space-x-4 text-sm text-foreground/60">
                      <span>{job.applications} applications</span>
                      <span>{job.matches} matches</span>
                      <span>{job.posted}</span>
                    </div>
                    <Button size="sm" className="bg-blue-accent hover:bg-blue-accent/90">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Matched Students */}
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-green-bright rounded-full"></div>
                <span>AI Matched Students</span>
              </CardTitle>
              <CardDescription>
                Students that match your job requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {matchedStudents.map((student) => (
                <div key={student.id} className="p-4 rounded-lg border border-border/40 hover:border-blue-accent/40 transition-colors hover-scale">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{student.name}</h3>
                      <p className="text-sm text-foreground/70">{student.degree}</p>
                      <p className="text-sm text-foreground/60">CGPA: {student.cgpa}</p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className="bg-green-bright/20 text-green-bright border-green-bright/30"
                    >
                      {student.match}% match
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {student.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline" className="border-blue-accent/30 hover:border-blue-accent">
                      View Profile
                    </Button>
                    <Button size="sm" className="bg-green-secondary hover:bg-green-secondary/90 text-navy-deep">
                      Refer
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Referral Requests */}
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-secondary rounded-full"></div>
              <span>Recent Referral Requests</span>
            </CardTitle>
            <CardDescription>
              Students seeking your assistance with job referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {referralRequests.map((request) => (
                <div key={request.id} className="p-4 rounded-lg border border-border/40 hover:border-blue-accent/40 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-foreground">{request.studentName}</h3>
                      <p className="text-sm text-foreground/70">{request.position} at {request.company}</p>
                      <p className="text-xs text-foreground/50">{request.requestDate}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={request.status === 'Accepted' ? 'default' : 'secondary'}
                        className={request.status === 'Accepted' 
                          ? 'bg-green-secondary/20 text-green-secondary border-green-secondary/30' 
                          : 'bg-foreground/20 text-foreground/70'
                        }
                      >
                        {request.status}
                      </Badge>
                      {request.status === 'Pending' && (
                        <div className="space-x-2">
                          <Button size="sm" variant="outline" className="border-red-500/30 hover:border-red-500 text-red-500">
                            Decline
                          </Button>
                          <Button size="sm" className="bg-green-secondary hover:bg-green-secondary/90 text-navy-deep">
                            Accept
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
