import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Car } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const PostRide = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    from: 'NIT Calicut',
    to: '',
    date: '',
    time: '',
    seats: '2',
    totalFare: '600',
    note: '',
  });
  const [destinationChoice, setDestinationChoice] = useState('');

  const destinations = [
    'Kozhikode Railway Station',
    'Calicut Airport',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.to || !formData.date || !formData.time) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!token) {
      toast.error('Please sign in to post a ride.');
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createRide(
        {
          from: formData.from,
          to: formData.to,
          date: formData.date,
          time: formData.time,
          seats: Number(formData.seats),
          totalFare: Number(formData.totalFare),
          note: formData.note || undefined,
        },
        token,
      );
      toast.success('Ride posted successfully!', {
        description: "Your ride is now visible to other students. You'll be notified when someone joins.",
      });
      await queryClient.invalidateQueries({ queryKey: ['rides'] });
      navigate('/rides');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to post ride right now.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Car className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Post a Ride</h1>
          <p className="text-muted-foreground">Share your ride and split costs with fellow students</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Ride Details</CardTitle>
            <CardDescription>
              Fill in the details of your upcoming ride. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* From */}
              <div className="space-y-2">
                <Label htmlFor="from">From *</Label>
                <Input
                  id="from"
                  value={formData.from}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* To */}
              <div className="space-y-2">
                <Label htmlFor="to">To *</Label>
                <Select
                  value={destinationChoice}
                  onValueChange={(value) => {
                    setDestinationChoice(value);
                    setFormData({ ...formData, to: value === 'Other' ? '' : value });
                  }}
                >
                  <SelectTrigger id="to">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((dest) => (
                      <SelectItem key={dest} value={dest}>
                        {dest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom destination if "Other" selected */}
              {destinationChoice === 'Other' && (
                <div className="space-y-2">
                  <Label htmlFor="customTo">Enter Destination *</Label>
                  <Input
                    id="customTo"
                    placeholder="e.g., Kozhikode City Center"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  />
                </div>
              )}

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              {/* Seats & Fare */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seats">Available Seats *</Label>
                  <Select value={formData.seats} onValueChange={(value) => setFormData({ ...formData, seats: value })}>
                    <SelectTrigger id="seats">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'seat' : 'seats'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalFare">Total Fare (₹) *</Label>
                  <Input
                    id="totalFare"
                    type="number"
                    value={formData.totalFare}
                    onChange={(e) => setFormData({ ...formData, totalFare: e.target.value })}
                    min="100"
                    step="50"
                  />
                </div>
              </div>

              {/* Fare Preview */}
              {formData.seats && formData.totalFare && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Estimated fare per person</p>
                  <p className="text-2xl font-bold text-accent">
                    ₹{Math.ceil(Number(formData.totalFare) / (Number(formData.seats) + 1))}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total ₹{formData.totalFare} split among {Number(formData.seats) + 1} people (including you)
                  </p>
                </div>
              )}

              {/* Note */}
              <div className="space-y-2">
                <Label htmlFor="note">Additional Note (Optional)</Label>
                <Textarea
                  id="note"
                  placeholder="e.g., I have 2 large bags, or Flexible with departure time"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Add any relevant information for potential co-riders
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? 'Posting...' : 'Post Ride'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/rides')}
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                You must be signed in to share a ride. Need an account? Create one from the Auth page in seconds.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostRide;
