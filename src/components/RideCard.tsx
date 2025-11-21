import { Ride } from '@/types/ride';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, BadgeCheck, IndianRupee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RideCardProps {
  ride: Ride;
  onViewDetails: (ride: Ride) => void;
}

const RideCard = ({ ride, onViewDetails }: RideCardProps) => {
  const farePerPerson = Math.ceil(ride.totalFare / (ride.seats + 1));
  const formattedDate = new Date(ride.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-base cursor-pointer group" onClick={() => onViewDetails(ride)}>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <h3 className="font-semibold text-base group-hover:text-primary transition-base truncate">
                  {ride.to}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">From {ride.from}</p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1 flex-shrink-0">
              <Users className="h-3 w-3" />
              {ride.seats} {ride.seats === 1 ? 'seat' : 'seats'}
            </Badge>
          </div>

          {/* Date & Time */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{ride.time}</span>
            </div>
          </div>

          {/* Fare */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <div className="flex items-center gap-1 font-semibold text-accent">
                <IndianRupee className="h-4 w-4" />
                <span className="text-lg">{farePerPerson}</span>
                <span className="text-sm font-normal text-muted-foreground">per person</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Save ~₹{ride.totalFare - farePerPerson}</p>
            </div>
            
            <Button size="sm" className="flex-shrink-0">
              Join Ride
            </Button>
          </div>

          {/* Posted By */}
          <div className="flex items-center gap-2 pt-2 text-sm">
            <span className="text-muted-foreground">Posted by</span>
            <span className="font-medium">{ride.postedBy}</span>
            {ride.verified && (
              <BadgeCheck className="h-4 w-4 text-primary" />
            )}
          </div>

          {/* Note */}
          {ride.note && (
            <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
              "{ride.note}"
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RideCard;
