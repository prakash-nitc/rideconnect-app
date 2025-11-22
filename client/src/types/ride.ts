export interface RideParticipant {
  userId: string;
  name: string;
  joinedAt: string;
}

export interface Ride {
  id: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  totalFare: number;
  postedBy: string;
  note?: string;
  verified: boolean;
  status?: 'upcoming' | 'completed';
  hostId: string;
  participants: RideParticipant[];
}

export interface RideFilter {
  from: string;
  to: string;
  date: string;
  timeSlot: string;
}
