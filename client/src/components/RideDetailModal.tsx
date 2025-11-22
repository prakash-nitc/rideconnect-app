import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Ride } from '@/types/ride';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, BadgeCheck, IndianRupee, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

interface RideDetailModalProps {
  ride: Ride | null;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

const RideDetailModal = ({ ride, open, onClose, onUpdated }: RideDetailModalProps) => {
  if (!ride) return null;

  const queryClient = useQueryClient();
  const { user, token } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  const farePerPerson = Math.ceil(ride.totalFare / (ride.seats + 1));
  const savings = ride.totalFare - farePerPerson;
  const seatsRemaining = Math.max(ride.seats - ride.participants.length, 0);
  const isRideFull = seatsRemaining === 0;
  const isHost = user?.id === ride.hostId;
  
  const formattedDate = new Date(ride.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleJoinRide = async () => {
    if (!token) {
      toast.error('Please sign in to join rides.', {
        description: 'Head to the Auth page to create an account or log in.',
      });
      return;
    }

    if (isRideFull || isHost) return;

    setIsJoining(true);
    try {
      await api.joinRide(ride.id, token);
      toast.success('Join request sent!', {
        description: `You're now part of ${ride.postedBy}'s ride.`,
      });
      await queryClient.invalidateQueries({ queryKey: ['rides'] });
      onUpdated?.();
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to join ride right now.';
      toast.error(message);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            Ride to {ride.to}
          </DialogTitle>
          <DialogDescription>Review ride details before joining</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Route */}
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">From</p>
              <p className="font-medium">{ride.from}</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">To</p>
              <p className="font-medium">{ride.to}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-medium">{ride.time}</p>
              </div>
            </div>
          </div>

          {/* Seats */}
          <div className="flex items-center justify-between bg-muted rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Available Seats</span>
            </div>
            <Badge variant="secondary">{seatsRemaining} {seatsRemaining === 1 ? 'seat' : 'seats'} left</Badge>
          </div>

          <Separator />

          {/* Fare Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Fare Breakdown</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Total fare</span>
                <span className="flex items-center">
                  <IndianRupee className="h-3 w-3" />
                  {ride.totalFare}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Split among {ride.seats + 1} people</span>
                <span>÷ {ride.seats + 1}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Your fare</span>
                <span className="flex items-center text-accent">
                  <IndianRupee className="h-4 w-4" />
                  {farePerPerson}
                </span>
              </div>
              <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                <span>You save</span>
                <span className="flex items-center font-medium">
                  ~<IndianRupee className="h-3 w-3" />
                  {savings}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Posted By */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Posted By</h4>
            <div className="flex items-center gap-3 bg-muted rounded-lg p-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                {ride.postedBy.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{ride.postedBy}</p>
                  {ride.verified && (
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Verified NITC Student</p>
              </div>
            </div>
          </div>

          {/* Note */}
          {ride.note && (
            <div className="bg-muted rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Note from rider</p>
              <p className="text-sm italic">"{ride.note}"</p>
            </div>
          )}

          {/* Action Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleJoinRide}
            disabled={isJoining || isRideFull || isHost}
          >
            {isHost
              ? 'You posted this ride'
              : isRideFull
                ? 'Ride is full'
                : isJoining
                  ? 'Joining...'
                  : 'Join Ride'}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Sign in to reserve a seat. Spots remaining: {seatsRemaining}.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RideDetailModal;
