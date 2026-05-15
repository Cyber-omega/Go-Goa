import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../components/AuthProvider';
import { Booking } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Car, MapPin, Users, CheckCircle, Star, Navigation, AlertCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { EnvironmentalWidgets } from '../components/EnvironmentalWidgets';

export const DriverDashboard = () => {
  const { profile, user } = useAuth();
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || profile?.role !== 'driver') return;

    // Listen for pending bookings
    const qPending = query(
      collection(db, 'bookings'),
      where('status', '==', 'pending')
    );

    const unsubscribePending = onSnapshot(qPending, (snapshot) => {
      const b = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      // Filter female-only if driver is male (simplified check)
      const filtered = b.filter(booking => {
        if (booking.isFemaleOnly && !profile.isFemale) return false;
        return true;
      });
      setPendingBookings(filtered);
    });

    // Listen for my active bookings
    const qMy = query(
      collection(db, 'bookings'),
      where('driverId', '==', user.uid),
      where('status', 'in', ['accepted', 'ongoing'])
    );

    const unsubscribeMy = onSnapshot(qMy, (snapshot) => {
      const b = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setMyBookings(b);
    });

    return () => {
      unsubscribePending();
      unsubscribeMy();
    };
  }, [user, profile]);

  const handleAccept = async (bookingId: string) => {
    setLoading(true);
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        driverId: user?.uid,
        driverName: profile?.displayName,
        status: 'accepted',
        acceptedAt: serverTimestamp()
      });
      toast.success("Ride accepted! Head to pickup location.");
    } catch (error) {
      console.error("Accept error:", error);
      toast.error("Failed to accept ride");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleRateCustomer = async (customerId: string, rating: number) => {
    try {
      const userRef = doc(db, 'users', customerId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        const currentRating = data.customerRating || 5;
        const currentCount = data.customerRatingCount || 0;
        const newRating = (currentRating * currentCount + rating) / (currentCount + 1);
        
        await updateDoc(userRef, {
          customerRating: newRating,
          customerRatingCount: currentCount + 1
        });
        toast.success("Customer rated!");
      }
    } catch (error) {
      toast.error("Failed to rate customer");
    }
  };

  return (
    <div className="min-h-screen bg-sand pt-24 pb-12 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-palm/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-sunset/5 rounded-full blur-[100px] pointer-events-none" />

      <header className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4 relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-ocean font-black">Driver Partner</span>
          <h1 className="text-5xl font-black text-ink tracking-tighter leading-none">Driver Console</h1>
          <p className="text-ink/60 font-medium italic mt-2">Connecting Goa, one ride at a time.</p>
        </div>
        <div className="flex items-center gap-3 bg-card/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-palm/10 shadow-xl shadow-palm/5">
          <div className="relative flex items-center justify-center">
            <div className="w-3 h-3 bg-palm rounded-full animate-pulse" />
            <div className="absolute w-5 h-5 border-2 border-palm/20 rounded-full animate-ping" />
          </div>
          <span className="text-base font-black text-ink uppercase tracking-wider">Online • 4.9 <Star className="inline w-3 h-3 fill-sun text-sun ml-1" /></span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-8 relative z-10">
        {/* Available Rides */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
              <div className="bg-ocean/10 p-2 rounded-xl">
                <Navigation className="text-ocean w-5 h-5" />
              </div>
              Available Requests
            </h2>
            <Badge className="bg-primary text-white font-black px-4 py-1 rounded-full">{pendingBookings.length} NEW</Badge>
          </div>

          <div className="grid gap-6">
            <AnimatePresence>
              {pendingBookings.length === 0 ? (
                <div className="text-center py-20 bg-card/50 backdrop-blur-xl rounded-[40px] border-4 border-dashed border-gray-100/50">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="text-gray-300 w-8 h-8" />
                  </div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Waiting for requests...</p>
                </div>
              ) : (
                pendingBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="overflow-hidden border-none shadow-2xl shadow-ink/5 rounded-[32px] bg-card/90 backdrop-blur-xl hover:shadow-primary/10 transition-all border-l-[12px] border-l-ocean">
                      <CardContent className="p-0 flex flex-col md:flex-row">
                        <div className="p-8 flex-1 space-y-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className={`px-4 py-1 rounded-full font-black ${booking.type === 'full' ? 'bg-ocean/10 text-ocean' : 'bg-sun/10 text-sun'}`}>
                                {booking.type.toUpperCase()}
                              </Badge>
                              {booking.isFemaleOnly && (
                                <Badge className="bg-earth/10 text-earth border-none px-4 py-1 rounded-full font-black">FEMALE ONLY</Badge>
                              )}
                            </div>
                            <span className="text-3xl font-black text-ink tracking-tighter">₹{booking.price}</span>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="mt-1 w-3 h-3 rounded-full border-4 border-ocean flex-shrink-0" />
                              <div>
                                <p className="text-[10px] text-ink/30 uppercase font-black tracking-[0.2em]">Pickup Point</p>
                                <p className="font-black text-lg text-ink leading-none mt-1">{booking.origin}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-4">
                              <div className="mt-1 w-3 h-3 rounded-full border-4 border-sun flex-shrink-0" />
                              <div>
                                <p className="text-[10px] text-ink/30 uppercase font-black tracking-[0.2em]">Drop Location</p>
                                <p className="font-black text-lg text-ink leading-none mt-1">{booking.destination}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                            <div className="flex items-center gap-2 text-sm font-bold text-ink/60">
                              <Users className="w-4 h-4 text-ocean" />
                              <span>{booking.occupiedSeats} Seat</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-ink/60">
                              <User className="w-4 h-4 text-sun" />
                              <span>{booking.customerName}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAccept(booking.id)}
                          disabled={loading}
                          className="md:w-40 h-auto rounded-none bg-brand-gradient hover:opacity-90 text-white font-black text-xl tracking-tighter border-none active:scale-95 transition-transform"
                        >
                          ACCEPT
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Active & Completed */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle className="text-green-500 w-5 h-5" />
            My Active Rides
          </h2>
          
          <div className="space-y-4">
            {myBookings.length === 0 ? (
              <p className="text-gray-400 italic text-sm">No active rides assigned to you.</p>
            ) : (
              myBookings.map((booking) => (
                <Card key={booking.id} className="border-l-4 border-l-green-500 shadow-md">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{booking.customerName}</p>
                        <p className="text-xs text-gray-500">{booking.origin} → {booking.destination}</p>
                      </div>
                      <Badge>{booking.status.toUpperCase()}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {booking.status === 'accepted' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(booking.id, 'ongoing')} className="w-full">
                          Start Trip
                        </Button>
                      )}
                      {booking.status === 'ongoing' && (
                        <Button size="sm" onClick={() => handleUpdateStatus(booking.id, 'completed')} className="w-full bg-green-600 hover:bg-green-700">
                          Complete
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="w-full">
                        Navigate
                      </Button>
                    </div>

                    {booking.status === 'completed' && (
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs font-medium">Rate Customer:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className="w-4 h-4 cursor-pointer text-gray-300 hover:text-yellow-400"
                              onClick={() => handleRateCustomer(booking.customerId, s)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-[0.3em] text-palm font-black ml-1">Environmental Sync</Label>
            <EnvironmentalWidgets />
          </div>

          <Card className="bg-palm border-none shadow-2xl shadow-palm/10 rounded-[32px] overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest font-black text-white/70">Earnings Today</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-black text-white">₹2,450</p>
              <p className="text-[10px] text-white/60 mt-2 uppercase tracking-wider font-bold">Keep it up! Goa is busy today.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-ocean border-none shadow-2xl shadow-ocean/10 rounded-[32px] overflow-hidden mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest font-black text-white/70">Active Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-black text-white">3</p>
              <p className="text-[10px] text-white/60 mt-2 uppercase tracking-wider font-bold">Social shuttles in progress</p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};
