import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, CheckCircle2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyRides = () => {
  // Mock data for demo
  const postedRides = [
    {
      id: 'p1',
      to: 'Kozhikode Railway Station',
      date: '2025-11-26',
      time: '14:30',
      seats: 2,
      seatsBooked: 1,
      status: 'upcoming',
    },
    {
      id: 'p2',
      to: 'Calicut Airport',
      date: '2025-11-20',
      time: '09:00',
      seats: 3,
      seatsBooked: 3,
      status: 'completed',
    },
  ];

  const joinedRides = [
    {
      id: 'j1',
      to: 'Calicut Airport',
      date: '2025-11-27',
      time: '11:30',
      postedBy: 'Anjali Nair',
      farePerPerson: 250,
      status: 'upcoming',
    },
    {
      id: 'j2',
      to: 'Kozhikode Railway Station',
      date: '2025-11-18',
      time: '18:00',
      postedBy: 'Vikram Singh',
      farePerPerson: 200,
      status: 'completed',
    },
  ];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Rides</h1>
          <p className="text-muted-foreground">Manage your posted and joined rides</p>
        </div>

        <Tabs defaultValue="posted" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="posted">Rides I Posted</TabsTrigger>
            <TabsTrigger value="joined">Rides I Joined</TabsTrigger>
          </TabsList>

          {/* Posted Rides */}
          <TabsContent value="posted" className="space-y-4">
            {postedRides.length > 0 ? (
              postedRides.map((ride) => (
                <Card key={ride.id} className="shadow-card hover:shadow-card-hover transition-base">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="h-4 w-4 text-primary" />
                              <h3 className="font-semibold text-lg">{ride.to}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">From NIT Calicut</p>
                          </div>
                          <Badge variant={ride.status === 'upcoming' ? 'default' : 'secondary'}>
                            {ride.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(ride.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{ride.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-primary" />
                            <span className="font-medium">
                              {ride.seatsBooked}/{ride.seats} seats filled
                            </span>
                          </div>
                        </div>

                        {ride.seatsBooked === ride.seats && (
                          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="font-medium">Fully booked!</span>
                          </div>
                        )}
                      </div>

                      {ride.status === 'upcoming' && (
                        <Button variant="outline">View Details</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-card">
                <CardContent className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">You haven't posted any rides yet.</p>
                  <Button asChild>
                    <Link to="/post-ride">Post Your First Ride</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Joined Rides */}
          <TabsContent value="joined" className="space-y-4">
            {joinedRides.length > 0 ? (
              joinedRides.map((ride) => (
                <Card key={ride.id} className="shadow-card hover:shadow-card-hover transition-base">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="h-4 w-4 text-primary" />
                              <h3 className="font-semibold text-lg">{ride.to}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">Posted by {ride.postedBy}</p>
                          </div>
                          <Badge variant={ride.status === 'upcoming' ? 'default' : 'secondary'}>
                            {ride.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(ride.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{ride.time}</span>
                          </div>
                        </div>

                        <div className="bg-accent/10 rounded-lg px-3 py-2 inline-block">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Your fare:</span>{' '}
                            <span className="font-semibold text-accent">₹{ride.farePerPerson}</span>
                          </p>
                        </div>
                      </div>

                      {ride.status === 'upcoming' && (
                        <Button variant="outline">View Details</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="shadow-card">
                <CardContent className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">You haven't joined any rides yet.</p>
                  <Button asChild>
                    <Link to="/rides">Browse Available Rides</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyRides;
