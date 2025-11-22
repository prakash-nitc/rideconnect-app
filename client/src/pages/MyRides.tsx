import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, CheckCircle2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const MyRides = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: rides = [], isLoading, isError, error } = useQuery({
    queryKey: ['rides'],
    queryFn: api.fetchRides,
  });

  const postedRides = useMemo(() => {
    if (!user) return [];
    return rides.filter((ride) => ride.hostId === user.id);
  }, [rides, user]);

  const joinedRides = useMemo(() => {
    if (!user) return [];
    return rides.filter((ride) => ride.participants.some((participant) => participant.userId === user.id));
  }, [rides, user]);

  const renderLoadingCard = (message: string) => (
    <Card className="shadow-card">
      <CardContent className="p-12 text-center text-muted-foreground">{message}</CardContent>
    </Card>
  );
  const renderErrorCard = (message: string) => (
    <Card className="shadow-card">
      <CardContent className="p-12 text-center text-destructive">{message}</CardContent>
    </Card>
  );

  if (isAuthLoading) {
    return (
      <div className="min-h-screen gradient-bg py-8">
        <div className="container mx-auto px-4 max-w-3xl">{renderLoadingCard('Checking your ride history...')}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="shadow-card">
            <CardContent className="p-10 text-center space-y-4">
              <Users className="h-10 w-10 text-primary mx-auto" />
              <h2 className="text-2xl font-semibold">Sign in to manage rides</h2>
              <p className="text-muted-foreground">
                Create an account or log in to track rides you have posted and the ones you have joined.
              </p>
              <Button asChild>
                <Link to="/auth">Go to Auth</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

          <TabsContent value="posted" className="space-y-4">
            {isError
              ? renderErrorCard((error as Error)?.message || 'Unable to load your rides.')
              : isLoading
              ? renderLoadingCard('Loading your posted rides...')
              : postedRides.length > 0
                ? postedRides.map((ride) => {
                    const seatsFilled = ride.participants.length;
                    const isFull = seatsFilled >= ride.seats;
                    return (
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
                                  <p className="text-sm text-muted-foreground">From {ride.from}</p>
                                </div>
                                <Badge variant={ride.status === 'completed' ? 'secondary' : 'default'}>
                                  {ride.status === 'completed' ? 'Completed' : 'Upcoming'}
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
                                    {seatsFilled}/{ride.seats} seats filled
                                  </span>
                                </div>
                              </div>

                              {isFull && (
                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                  <CheckCircle2 className="h-4 w-4" />
                                  <span className="font-medium">Fully booked!</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                : (
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

          <TabsContent value="joined" className="space-y-4">
            {isError
              ? renderErrorCard((error as Error)?.message || 'Unable to load your rides.')
              : isLoading
              ? renderLoadingCard('Loading rides you joined...')
              : joinedRides.length > 0
                ? joinedRides.map((ride) => {
                    const farePerPerson = Math.ceil(ride.totalFare / (ride.seats + 1));
                    return (
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
                                <Badge variant={ride.status === 'completed' ? 'secondary' : 'default'}>
                                  {ride.status === 'completed' ? 'Completed' : 'Upcoming'}
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
                                  <span className="font-semibold text-accent">₹{farePerPerson}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                : (
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
