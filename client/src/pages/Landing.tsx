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
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import heroImage from '@/assets/hero-ride-sharing.jpg';
import studentsAppImage from '@/assets/students-app.jpg';
import campusMobilityImage from '@/assets/campus-mobility.jpg';
import costSavingsImage from '@/assets/cost-savings.jpg';

const Landing = () => {
  const features = [
    {
      icon: IndianRupee,
      title: 'Save 50%+ on every ride',
      description: 'Split ₹600 fares into ₹200-300 per person. Real savings every time you travel.',
      image: costSavingsImage,
    },
    {
      icon: Shield,
      title: 'Verified NITC community',
      description: 'Travel only with verified NIT Calicut students. Safe, trusted, and secure.',
      image: studentsAppImage,
    },
    {
      icon: Clock,
      title: 'Instant ride matching',
      description: 'No more digging through WhatsApp groups. Find your ride in seconds.',
      image: campusMobilityImage,
    },
  ];

  const stats = [
    { value: '500+', label: 'Active Students' },
    { value: '₹2L+', label: 'Total Saved' },
    { value: '1000+', label: 'Rides Shared' },
    { value: '4.8★', label: 'Average Rating' },
  ];

  const faqs = [
    {
      question: 'How does RideConnect save me money?',
      answer: 'Instead of paying ₹600 for a solo ride to the railway station or airport, RideConnect lets you split the fare with other NITC students traveling the same route. With 3 people, you pay just ₹200 each!',
    },
    {
      question: 'Is it safe? How do I know who I\'m riding with?',
      answer: 'All RideConnect users are verified NIT Calicut students. You can see rider profiles, ratings, and reviews before joining a ride. Plus, you can coordinate via group chat before the trip.',
    },
    {
      question: 'What if my plans change?',
      answer: 'You can cancel your ride booking up to 2 hours before departure. Just notify the group via the in-app chat so others can plan accordingly.',
    },
    {
      question: 'How do I pay my share of the fare?',
      answer: 'Payment is coordinated directly between riders. Most students use UPI apps to split the fare. RideConnect helps you calculate the per-person cost automatically.',
    },
    {
      question: 'What routes are covered?',
      answer: 'Popular routes include NIT Calicut to Kozhikode Railway Station, Calicut Airport, and City Center. You can also post custom routes based on your needs.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                  Go anywhere with RideConnect
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground">
                  Your campus mobility partner. Share rides, split costs, and transform every journey into a shared experience.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-base h-12 px-8">
                  <Link to="/rides">
                    Find a ride
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base h-12 px-8">
                  <Link to="/post-ride">Offer a ride</Link>
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">Active users</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <div className="text-3xl font-bold">₹2L+</div>
                  <div className="text-sm text-muted-foreground">Money saved</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src={heroImage} 
                  alt="Students sharing a ride" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              NITC students waste ₹600+ on solo rides
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              WhatsApp coordination is messy and unreliable. Messages get buried. 
              Rides fall through. There's a better way.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why RideConnect?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Built specifically for NIT Calicut students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="overflow-hidden border-0 shadow-card hover:shadow-card-hover transition-base group"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                How it works
              </h2>
              <p className="text-lg md:text-xl opacity-90">
                Three simple steps to start saving
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary-foreground text-primary flex items-center justify-center text-2xl font-bold mx-auto">
                  1
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Post or search</h3>
                  <p className="opacity-90">
                    Post your ride or find existing ones going your way
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary-foreground text-primary flex items-center justify-center text-2xl font-bold mx-auto">
                  2
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Match & connect</h3>
                  <p className="opacity-90">
                    Connect with verified NITC students traveling at the same time
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary-foreground text-primary flex items-center justify-center text-2xl font-bold mx-auto">
                  3
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Share & travel</h3>
                  <p className="opacity-90">
                    Coordinate via chat, split fare, and travel together
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center space-y-2">
                  <div className="text-4xl md:text-5xl font-bold">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Frequently asked questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about RideConnect
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-card rounded-lg border px-6 shadow-sm"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="font-semibold text-lg pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Ready to start saving?
            </h2>
            <p className="text-lg md:text-xl opacity-95">
              Join 500+ NITC students already saving money on every ride
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="text-base h-12 px-8 bg-primary text-primary-foreground hover:bg-primary-hover">
                <Link to="/rides">
                  Browse available rides
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-base h-12 px-8 border-2 border-primary-foreground/20 hover:bg-primary-foreground/10">
                <Link to="/about">Learn more</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
