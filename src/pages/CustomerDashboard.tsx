import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../components/AuthProvider';
import { Booking, BookingType } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Shield, Navigation, Phone, Heart, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { EnvironmentalWidgets } from '../components/EnvironmentalWidgets';

export const CustomerDashboard = () => {
  const { profile, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isFemaleOnly, setIsFemaleOnly] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'bookings'),
      where('customerId', '==', user.uid),
      where('status', 'in', ['pending', 'accepted', 'ongoing'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const b = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(b);
    });

    return () => unsubscribe();
  }, [user]);

  // Real-time GPS tracking
  useEffect(() => {
    let watchId: number;
    if (isTracking && user) {
      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const locRef = doc(db, 'locations', user.uid);
            const { setDoc } = await import('firebase/firestore');
            await setDoc(locRef, {
              userId: user.uid,
              latitude,
              longitude,
              timestamp: serverTimestamp()
            }, { merge: true });
          },
          (error) => console.error("Geolocation error:", error),
          { enableHighAccuracy: true }
        );
      }
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking, user]);

  const handleBook = async (type: BookingType) => {
    if (!origin || !destination) {
      toast.error("Please enter origin and destination");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        customerId: user?.uid,
        customerName: profile?.displayName,
        type,
        status: 'pending',
        origin,
        destination,
        isFemaleOnly: profile?.isFemale ? isFemaleOnly : false,
        timestamp: serverTimestamp(),
        groupMembers: [],
        price: type === 'full' ? 1200 : 300,
        maxSeats: type === 'full' ? 4 : 1,
        occupiedSeats: 1
      });
      toast.success(`${type === 'full' ? 'Car' : 'Shuttle'} booking requested!`);
      setOrigin('');
      setDestination('');
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to book ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand pt-24 pb-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-ocean/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-sun/5 rounded-full blur-[100px] pointer-events-none" />

      <header className="max-w-4xl mx-auto space-y-2 mb-10 relative z-10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-ocean font-black">Customer Portal</span>
        <h1 className="text-5xl font-black text-ink tracking-tighter">Hello, {profile?.displayName}!</h1>
        <p className="text-ink/60 font-medium text-lg italic">Explore Goa's magic today...</p>
      </header>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 relative z-10">
        {/* Booking Form */}
        <Card className="md:col-span-2 border-none shadow-2xl shadow-ink/5 rounded-[40px] bg-card/80 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pt-8 px-8">
            <CardTitle className="flex items-center gap-3 text-ink font-heading text-3xl font-black tracking-tight">
              <div className="bg-ocean/10 p-2 rounded-xl">
                <Navigation className="text-ocean w-6 h-6" />
              </div>
              Book a Ride
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 px-8 pb-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="origin" className="text-xs font-black uppercase tracking-widest text-ink/40 ml-1">Pickup Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-ocean w-5 h-5" />
                  <Input
                    id="origin"
                    placeholder="e.g. Panjim Church"
                    className="pl-12 h-14 rounded-2xl border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 focus:bg-card transition-all text-base font-medium"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination" className="text-xs font-black uppercase tracking-widest text-ink/40 ml-1">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-sun w-5 h-5" />
                  <Input
                    id="destination"
                    placeholder="e.g. Calangute Beach"
                    className="pl-12 h-14 rounded-2xl border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 focus:bg-card transition-all text-base font-medium"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {profile?.isFemale && (
              <div className="flex items-center justify-between p-5 bg-earth/5 rounded-[24px] border border-earth/10">
                <div className="flex items-center gap-4">
                  <div className="bg-earth/10 p-2 rounded-xl">
                    <Shield className="text-earth w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-black text-ink text-lg leading-tight uppercase tracking-tighter">Female Only</p>
                    <p className="text-sm text-ink/50 font-medium">Safe space for women</p>
                  </div>
                </div>
                <Switch checked={isFemaleOnly} onCheckedChange={setIsFemaleOnly} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleBook('full')}
                disabled={loading}
                className={`h-32 flex flex-col gap-3 rounded-[28px] transition-all border-2 ${
                  loading ? 'opacity-50' : 'hover:scale-[1.02] hover:shadow-xl hover:shadow-ocean/10'
                } bg-card border-gray-100 dark:border-white/5 text-ink hover:border-ocean/30 hover:bg-ocean/5`}
              >
                <div className="bg-ocean/10 p-3 rounded-2xl">
                  <Car className="w-6 h-6 text-ocean" />
                </div>
                <div className="text-center">
                  <p className="font-black text-lg leading-none mb-1">Full Car</p>
                  <p className="text-[11px] font-bold text-ink/40 uppercase tracking-widest">Private • ₹1200</p>
                </div>
              </Button>
              <Button
                onClick={() => handleBook('shuttle')}
                disabled={loading}
                className={`h-32 flex flex-col gap-3 rounded-[28px] transition-all border-2 ${
                  loading ? 'opacity-50' : 'hover:scale-[1.02] hover:shadow-xl hover:shadow-palm/10'
                } bg-card border-gray-100 dark:border-white/5 text-ink hover:border-palm/30 hover:bg-palm/5`}
              >
                <div className="bg-palm/10 p-3 rounded-2xl">
                  <Users className="w-6 h-6 text-palm" />
                </div>
                <div className="text-center">
                  <p className="font-black text-lg leading-none mb-1">Shuttle</p>
                  <p className="text-[11px] font-bold text-ink/40 uppercase tracking-widest">Share • ₹300</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Safety & Status */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.3em] text-palm font-black ml-1">Goa Environmental Sync</Label>
            <EnvironmentalWidgets />
          </div>

          <Card className="border-none shadow-2xl shadow-palm/5 rounded-[32px] bg-card overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-palm font-heading">
                <Shield className="w-5 h-5" />
                Safety Center
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-sand rounded-xl">
                <span className="text-xs font-bold text-palm">Live GPS Sync</span>
                <Switch
                  checked={isTracking}
                  onCheckedChange={setIsTracking}
                />
              </div>
              {profile?.emergencyContact ? (
                <div className="p-4 bg-ocean/10 rounded-xl space-y-2 border border-ocean/20">
                  <p className="text-[10px] text-ocean uppercase tracking-widest font-black">Emergency Contact</p>
                  <p className="font-bold text-palm">{profile.emergencyContact.name}</p>
                  <p className="text-xs text-ink/70 flex items-center gap-1 font-medium">
                    <Phone className="w-3 h-3" /> {profile.emergencyContact.phone}
                  </p>
                </div>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full bg-sand text-palm hover:bg-sand/80 font-bold rounded-xl"
                  onClick={() => toast.info("Go to Profile to set emergency contact")}
                >
                  Set Emergency Contact
                </Button>
              )}
              <Button className="w-full h-12 bg-accent-gradient hover:bg-accent-gradient/90 text-white font-black text-[11px] tracking-widest uppercase rounded-xl border-none active:scale-95 transition-transform">
                SOS EMERGENCY
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="text-red-500 w-5 h-5" />
                Meet Friends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Join a shuttle to meet fellow travelers! You can see who's in your shuttle once booked.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Bookings */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Active Rides</h2>
        <div className="grid gap-4">
          <AnimatePresence>
            {bookings.length === 0 ? (
              <p className="text-gray-400 italic">No active rides at the moment.</p>
            ) : (
              bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card className="border-l-4 border-l-palm shadow-2xl shadow-palm/5 bg-card rounded-2xl overflow-hidden">
                    <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge className={booking.status === 'pending' ? 'bg-sun/20 text-ink' : 'bg-ocean/20 text-palm'}>
                            {booking.status.toUpperCase()}
                          </Badge>
                          <span className="text-[10px] font-black uppercase tracking-widest text-ink/40 dark:text-foreground/40">{booking.type}</span>
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-xl text-palm leading-tight">{booking.origin} → {booking.destination}</p>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">Passenger</p>
                              <p className="text-sm font-bold text-ink dark:text-foreground">{booking.customerName}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-ink/40 font-bold">Driver</p>
                              <p className="text-sm font-bold text-ink dark:text-foreground">
                                {booking.driverId ? booking.driverName : 'Searching...'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <p className="text-3xl font-black text-palm">₹{booking.price}</p>
                        {booking.status === 'pending' && (
                          <Button variant="ghost" size="sm" className="text-earth hover:text-earth hover:bg-earth/10 font-bold text-xs">
                            Cancel Request
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};
