import { useState, useMemo } from 'react';
import { mockRides } from '@/data/mockRides';
import RideCard from '@/components/RideCard';
import RideDetailModal from '@/components/RideDetailModal';
import { Ride } from '@/types/ride';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

const Rides = () => {
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);
  const [filters, setFilters] = useState({
    to: 'all',
    date: '',
    timeSlot: 'all',
  });

  const destinations = ['all', 'Kozhikode Railway Station', 'Calicut Airport'];
  const timeSlots = [
    { value: 'all', label: 'Any time' },
    { value: 'morning', label: 'Morning (6AM - 12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM - 5PM)' },
    { value: 'evening', label: 'Evening (5PM - 10PM)' },
    { value: 'night', label: 'Night (10PM - 6AM)' },
  ];

  const getTimeSlot = (time: string): string => {
    const [hours] = time.split(':').map(Number);
    if (hours >= 6 && hours < 12) return 'morning';
    if (hours >= 12 && hours < 17) return 'afternoon';
    if (hours >= 17 && hours < 22) return 'evening';
    return 'night';
  };

  const filteredRides = useMemo(() => {
    return mockRides.filter((ride) => {
      // Filter by destination
      if (filters.to !== 'all' && ride.to !== filters.to) return false;

      // Filter by date
      if (filters.date && ride.date !== filters.date) return false;

      // Filter by time slot
      if (filters.timeSlot !== 'all' && getTimeSlot(ride.time) !== filters.timeSlot) return false;

      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Available Rides</h1>
          <p className="text-muted-foreground">Find and join rides with fellow NITC students</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <Search className="h-5 w-5" />
              <h2 className="font-semibold">Filter Rides</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Select value={filters.to} onValueChange={(value) => setFilters({ ...filters, to: value })}>
                  <SelectTrigger id="destination">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    {destinations.slice(1).map((dest) => (
                      <SelectItem key={dest} value={dest}>
                        {dest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={filters.date}
                  onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Time Slot */}
              <div className="space-y-2">
                <Label htmlFor="timeSlot">Time Slot</Label>
                <Select value={filters.timeSlot} onValueChange={(value) => setFilters({ ...filters, timeSlot: value })}>
                  <SelectTrigger id="timeSlot">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredRides.length} {filteredRides.length === 1 ? 'ride' : 'rides'} found
          </p>
        </div>

        {/* Rides List */}
        {filteredRides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRides.map((ride) => (
              <RideCard key={ride.id} ride={ride} onViewDetails={setSelectedRide} />
            ))}
          </div>
        ) : (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No rides found matching your filters.</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or check back later for new rides.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Ride Detail Modal */}
      <RideDetailModal
        ride={selectedRide}
        open={!!selectedRide}
        onClose={() => setSelectedRide(null)}
      />
    </div>
  );
};

export default Rides;
