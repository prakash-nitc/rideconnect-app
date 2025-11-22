import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Driver } from '@/types/driver';
import DriverCard from '@/components/DriverCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, Car, Star, BadgeCheck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';

export default function FindDriver() {
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: drivers = [], isLoading, isError, error } = useQuery({
    queryKey: ['drivers'],
    queryFn: api.fetchDrivers,
  });

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesVehicle = vehicleFilter === 'all' || driver.vehicleType === vehicleFilter;
      const matchesQuery =
        !searchQuery ||
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.routes.some((route) => route.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesVehicle && matchesQuery;
    });
  }, [drivers, vehicleFilter, searchQuery]);

  const handleContactDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsContactModalOpen(true);
  };

  const handleConfirmContact = () => {
    if (selectedDriver) {
      toast({
        title: 'Contact information',
        description: `You can reach ${selectedDriver.name} at ${selectedDriver.phone}`,
      });
      setIsContactModalOpen(false);
    }
  };

  const availableDrivers = filteredDrivers.filter(
    (d) => d.availability === 'Available'
  ).length;
  const availabilityText = isError
    ? 'Unable to load drivers'
    : isLoading
      ? 'Checking driver availability…'
      : `${availableDrivers} drivers available now`;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Car className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Find Verified Drivers</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Book trusted, verified drivers for your campus trips. All drivers are
            background-checked and RideConnect certified.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-muted-foreground">
              {availabilityText}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Filter Drivers</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="Auto">Auto</SelectItem>
                <SelectItem value="Sedan">Sedan</SelectItem>
                <SelectItem value="SUV">SUV</SelectItem>
                <SelectItem value="Hatchback">Hatchback</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Drivers Grid */}
        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground">Loading verified drivers…</div>
        ) : isError ? (
          <div className="text-center py-16 text-destructive">
            {(error as Error)?.message || 'Unable to load drivers.'}
          </div>
        ) : filteredDrivers.length === 0 ? (
          <div className="text-center py-16">
            <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No drivers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrivers.map((driver) => (
              <DriverCard
                key={driver.id}
                driver={driver}
                onContact={handleContactDriver}
              />
            ))}
          </div>
        )}

        {/* Why Choose RideConnect Drivers */}
        <div className="mt-16 bg-card border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Why Choose RideConnect Drivers?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Car className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Verified & Licensed</h3>
              <p className="text-sm text-muted-foreground">
                All drivers are background-checked with valid licenses and insurance
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Highly Rated</h3>
              <p className="text-sm text-muted-foreground">
                Student-reviewed drivers with consistent 4.5+ ratings
              </p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <BadgeCheck className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Campus Familiar</h3>
              <p className="text-sm text-muted-foreground">
                Experienced with NITC routes and student preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {selectedDriver?.name}</DialogTitle>
            <DialogDescription>
              You're about to get contact details for this verified driver
            </DialogDescription>
          </DialogHeader>
          {selectedDriver && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">{selectedDriver.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedDriver.vehicleType} • {selectedDriver.vehicleNumber}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Phone Number</div>
                <div className="text-lg font-semibold">{selectedDriver.phone}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Base Fare</div>
                <div className="text-lg font-semibold">
                  ₹{selectedDriver.pricePerKm}/km
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Tip: Negotiate the final fare before starting your journey. Always
                verify the vehicle number before boarding.
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmContact}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
