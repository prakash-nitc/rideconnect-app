import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 font-bold text-lg text-primary">
              <Car className="h-5 w-5" />
              <span>RideConnect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Campus ride-sharing made simple, safe, and affordable.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm mb-1">Quick Links</h3>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-base">
              About Us
            </Link>
            <Link to="/rides" className="text-sm text-muted-foreground hover:text-primary transition-base">
              Browse Rides
            </Link>
            <Link to="/post-ride" className="text-sm text-muted-foreground hover:text-primary transition-base">
              Post a Ride
            </Link>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm mb-1">Information</h3>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-base">
              Contact
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-base">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-base">
              Terms of Service
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RideConnect. Built for NIT Calicut students.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
