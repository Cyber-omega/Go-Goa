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
            await updateDoc(locRef, {
              latitude,
              longitude,
              timestamp: serverTimestamp()
            }).catch(async () => {
              // If doc doesn't exist, set it
              await updateDoc(locRef, {
                userId: user.uid,
                latitude,
                longitude,
                timestamp: serverTimestamp()
              }).catch(async () => {
                // Actually use setDoc if update fails
                const { setDoc } = await import('firebase/firestore');
                await setDoc(locRef, {
                  userId: user.uid,
                  latitude,
                  longitude,
                  timestamp: serverTimestamp()
                });
              });
            });
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
    <div className="min-h-screen bg-sand pt-24 pb-12 px-4">
      <header className="max-w-4xl mx-auto space-y-2 mb-8">
        <span className="text-[11px] uppercase tracking-[0.2em] text-ocean font-bold">Customer Portal</span>
        <h1 className="text-4xl font-black text-palm">Hello, {profile?.displayName}!</h1>
        <p className="text-ink/60 font-medium">Where are you heading in Goa today?</p>
      </header>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Booking Form */}
        <Card className="md:col-span-2 border-none shadow-2xl shadow-palm/5 rounded-[32px] bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-palm font-heading text-2xl">
              <Navigation className="text-palm w-5 h-5" />
              Book a Ride
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Pickup Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <Input
                    id="origin"
                    placeholder="e.g. Panjim Church"
                    className="pl-10 h-11"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <Input
                    id="destination"
                    placeholder="e.g. Calangute Beach"
                    className="pl-10 h-11"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {profile?.isFemale && (
              <div className="flex items-center justify-between p-4 bg-pink-50 rounded-xl border border-pink-100">
                <div className="flex items-center gap-3">
                  <Shield className="text-pink-500 w-5 h-5" />
                  <div>
                    <p className="font-semibold text-pink-900">Female Only Option</p>
                    <p className="text-xs text-pink-700">Only female drivers & passengers</p>
                  </div>
                </div>
                <Switch checked={isFemaleOnly} onCheckedChange={setIsFemaleOnly} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleBook('full')}
                disabled={loading}
                className={`h-28 flex flex-col gap-2 rounded-2xl transition-all border-2 ${
                  loading ? 'opacity-50' : 'hover:scale-[1.02]'
                } bg-white border-gray-100 text-ink hover:border-palm/30 hover:bg-palm/5`}
              >
                <Car className="w-6 h-6 text-palm" />
                <div className="text-center">
                  <p className="font-bold">Full Car</p>
                  <p className="text-[10px] opacity-60">Private ride • ₹1200</p>
                </div>
              </Button>
              <Button
                onClick={() => handleBook('shuttle')}
                disabled={loading}
                className={`h-28 flex flex-col gap-2 rounded-2xl transition-all border-2 ${
                  loading ? 'opacity-50' : 'hover:scale-[1.02]'
                } bg-white border-gray-100 text-ink hover:border-palm/30 hover:bg-palm/5`}
              >
                <Users className="w-6 h-6 text-palm" />
                <div className="text-center">
                  <p className="font-bold">Shuttle</p>
                  <p className="text-[10px] opacity-60">Share & meet • ₹300</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Safety & Status */}
        <div className="space-y-6">
          <Card className="border-none shadow-2xl shadow-palm/5 rounded-[32px] bg-white overflow-hidden">
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
              <Button className="w-full h-12 bg-earth hover:bg-earth/90 text-white font-black text-[11px] tracking-widest uppercase rounded-xl">
                SOS EMERGENCY
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white">
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
                  <Card className="border-l-4 border-l-palm shadow-2xl shadow-palm/5 bg-white dark:bg-card rounded-2xl overflow-hidden">
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
