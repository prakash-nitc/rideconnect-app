import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Users, TrendingUp, Shield, Target } from 'lucide-react';

const About = () => {
  const problems = [
    'NITC students pay ₹600+ for solo trips to the railway station or airport',
    'WhatsApp group ride-sharing is messy, with messages getting buried',
    'No structured matching or verification of fellow travelers',
    'Coordination is time-consuming and unreliable',
  ];

  const solutions = [
    'Real-time ride posting and matching with verified students',
    'Automatic fare splitting calculations',
    'NITC student verification for trust and safety',
    'In-app coordination and reminders',
    'Searchable, organized ride listings',
  ];

  const stakeholders = [
    {
      icon: Users,
      title: 'Students',
      benefits: ['Save 50%+ on travel costs', 'Travel with trusted peers', 'Convenient coordination', 'Reduced travel anxiety'],
    },
    {
      icon: TrendingUp,
      title: 'Drivers',
      benefits: ['Full auto/cab capacity', 'Predictable demand', 'Repeat customers', 'Better income'],
    },
    {
      icon: Shield,
      title: 'Parents',
      benefits: ['Lower costs', 'Enhanced safety', 'Peace of mind', 'Community support'],
    },
    {
      icon: Target,
      title: 'Institute',
      benefits: ['Student welfare', 'Cost efficiency', 'Community building', 'Campus safety'],
    },
  ];

  return (
    <div className="min-h-screen gradient-bg py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Why RideConnect?</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Understanding the problem and building the solution for NITC campus mobility
          </p>
        </div>

        {/* The Problem */}
        <section className="mb-16">
          <Card className="shadow-card">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">The Problem</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  NIT Calicut students face a significant mobility challenge. The campus is located away from
                  major transport hubs, and students regularly need to travel to Kozhikode Railway Station or
                  Calicut Airport for journeys home or academic purposes.
                </p>
                
                <div className="bg-muted rounded-lg p-6">
                  <p className="font-semibold mb-3">Current challenges:</p>
                  <ul className="space-y-3">
                    {problems.map((problem, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{problem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-accent/5 border-l-4 border-accent rounded-r-lg p-6">
                  <p className="text-lg">
                    <span className="font-bold text-accent">Result:</span> Students either pay the full ₹600-700
                    fare alone, or spend hours coordinating unreliable ride shares through cluttered WhatsApp groups.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* The Solution */}
        <section className="mb-16">
          <Card className="shadow-card border-primary/20">
            <CardContent className="p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">Our Solution</h2>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  RideConnect is a hyper-local ride-sharing platform built specifically for the NIT Calicut
                  community. We solve the coordination problem with a structured, searchable, and trustworthy
                  platform.
                </p>
                
                <div className="bg-primary/5 rounded-lg p-6">
                  <p className="font-semibold mb-3 text-primary">Key features:</p>
                  <ul className="space-y-3">
                    {solutions.map((solution, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-5">
                    <p className="font-semibold mb-2">Before RideConnect</p>
                    <p className="text-3xl font-bold text-destructive mb-1">₹600</p>
                    <p className="text-sm text-muted-foreground">Solo ride cost</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-5">
                    <p className="font-semibold mb-2">With RideConnect</p>
                    <p className="text-3xl font-bold text-primary mb-1">₹200</p>
                    <p className="text-sm text-muted-foreground">Split fare (3 people)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* For Stakeholders */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Benefits for Everyone</h2>
            <p className="text-lg text-muted-foreground">
              RideConnect creates value across the entire ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {stakeholders.map((stakeholder, index) => (
              <Card key={index} className="shadow-card hover:shadow-card-hover transition-base">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <stakeholder.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{stakeholder.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {stakeholder.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Vision */}
        <section className="mt-16">
          <Card className="shadow-card gradient-hero text-primary-foreground">
            <CardContent className="p-8 md:p-10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Vision</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
                To make campus mobility affordable, safe, and convenient for every NITC student. By building
                trust and facilitating connections, we're not just sharing rides—we're building a stronger
                campus community.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;
