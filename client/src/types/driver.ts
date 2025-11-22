export interface Driver {
  id: string;
  name: string;
  rating: number;
  totalRides: number;
  vehicleType: 'Auto' | 'Sedan' | 'SUV' | 'Hatchback';
  vehicleNumber: string;
  experience: string;
  phone: string;
  languages: string[];
  isVerified: boolean;
  pricePerKm: number;
  availability: 'Available' | 'Busy' | 'Offline';
  routes: string[];
  image?: string;
}
