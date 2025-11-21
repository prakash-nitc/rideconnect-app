import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  IndianRupee,
  Shield,
  Clock,
  Users,
  Search,
  MessageSquare,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

const Landing = () => {
  const benefits = [
    {
      icon: IndianRupee,
      title: 'Cost Savings',
      description: 'Save 50%+ on rides by sharing costs with fellow NITC students. No more paying ₹600 alone!',
    },
    {
      icon: Shield,
      title: 'Safety & Trust',
      description: 'Travel only with verified NIT Calicut students. Community-focused and secure.',
    },
    {
      icon: Clock,
      title: 'Convenience',
      description: 'Find rides instantly. No more digging through messy WhatsApp groups.',
    },
  ];

  const steps = [
    {
      icon: Search,
      title: 'Post or Search',
      description: 'Post your ride or search for existing ones going your way.',
    },
    {
      icon: Users,
      title: 'Match & Connect',
      description: 'Find verified NITC students traveling at the same time.',
    },
    {
      icon: MessageSquare,
      title: 'Share & Travel',
      description: 'Coordinate via group chat, split fare, and travel together.',
    },
  ];

  const routes = [
    'NIT Calicut → Kozhikode Railway Station',
    'NIT Calicut → Calicut Airport',
    'NIT Calicut → City Center',
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              RideConnect
            </h1>
            <p className="text-xl md:text-2xl opacity-95">
              Campus Mobility & Cost-Saving Platform
            </p>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Share rides. Cut ₹600 solo fares. Travel safer together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button asChild size="lg" variant="accent" className="text-base shadow-lg hover:shadow-xl">
                <Link to="/rides">Find a Ride</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link to="/post-ride">Offer a Ride</Link>
              </Button>
            </div>

            <p className="text-sm opacity-80 pt-4">
              Built for NIT Calicut students • Verified community
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl shadow-card p-8 md:p-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4">
                <IndianRupee className="h-8 w-8 text-accent" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">The Problem</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                NITC students pay <span className="font-semibold text-accent">₹600+ per solo ride</span> to
                the station or airport. WhatsApp group coordination is messy, unreliable, and spammy.
                There has to be a better way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start saving money and traveling together
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <Card key={index} className="shadow-card hover:shadow-card-hover transition-base">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                    <step.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="mb-2 text-sm font-semibold text-primary">Step {index + 1}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 gradient-bg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why RideConnect?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More than just ride-sharing—it's community-driven campus mobility
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <Card key={index} className="shadow-card hover:shadow-card-hover transition-base">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For NITC Campus */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-card border-primary/20">
              <CardContent className="p-8 md:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3">Built for NITC Campus</h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      RideConnect is hyper-focused on NIT Calicut. We know your routes, your schedules,
                      and your community. Every user is a verified NITC student.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mt-6">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                    Popular Routes
                  </h3>
                  {routes.map((route, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{route}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Saving?</h2>
            <p className="text-lg md:text-xl opacity-90">
              Join the RideConnect community and never pay ₹600 alone again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" variant="accent" className="text-base shadow-lg hover:shadow-xl">
                <Link to="/rides">Browse Available Rides</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
