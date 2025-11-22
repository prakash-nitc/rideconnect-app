import { Driver } from '@/types/driver';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Phone, Car, MapPin, BadgeCheck, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DriverCardProps {
  driver: Driver;
  onContact: (driver: Driver) => void;
}

export default function DriverCard({ driver, onContact }: DriverCardProps) {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'Busy':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'Offline':
        return 'bg-gray-500/10 text-gray-700 dark:text-gray-400';
      default:
        return '';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <CardContent className="pt-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Car className="h-7 w-7 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{driver.name}</h3>
                {driver.isVerified && (
                  <BadgeCheck className="h-5 w-5 text-accent" />
                )}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium">{driver.rating}</span>
                <span>({driver.totalRides} rides)</span>
              </div>
            </div>
          </div>
          <Badge className={getAvailabilityColor(driver.availability)}>
            {driver.availability}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{driver.vehicleType}</span>
            <span className="text-muted-foreground">• {driver.vehicleNumber}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{driver.experience} experience</span>
          </div>

          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap gap-1">
              {driver.routes.map((route, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {route}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Languages:</span>
            <span className="font-medium">{driver.languages.join(', ')}</span>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="text-sm text-muted-foreground">Base fare</div>
            <div className="text-xl font-bold text-primary">₹{driver.pricePerKm}/km</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-6">
        <Button
          className="w-full gap-2"
          onClick={() => onContact(driver)}
          disabled={driver.availability !== 'Available'}
        >
          <Phone className="h-4 w-4" />
          {driver.availability === 'Available' ? 'Contact Driver' : 'Currently Unavailable'}
        </Button>
      </CardFooter>
    </Card>
  );
}
