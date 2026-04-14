import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../components/AuthProvider';
import { Booking } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, MapPin, Users, CheckCircle, Star, Navigation, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

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
    <div className="min-h-screen bg-sand pt-24 pb-12 px-4">
      <header className="max-w-5xl mx-auto flex items-center justify-between mb-10">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-[0.2em] text-ocean font-bold">Driver Partner</span>
          <h1 className="text-4xl font-black text-palm">Driver Console</h1>
          <p className="text-ink/60 font-medium">Manage your rides and earn in Goa</p>
        </div>
        <div className="flex items-center gap-2 bg-palm/10 px-4 py-2 rounded-full border border-palm/20">
          <div className="w-2 h-2 bg-palm rounded-full animate-pulse" />
          <span className="text-sm font-bold text-palm">Online • 4.9★</span>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Available Rides */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading text-palm font-bold flex items-center gap-2">
              <Navigation className="text-palm w-5 h-5" />
              Available Requests
            </h2>
            <Badge className="bg-ocean/20 text-palm border-none">{pendingBookings.length} New</Badge>
          </div>

          <div className="grid gap-4">
            <AnimatePresence>
              {pendingBookings.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <AlertCircle className="mx-auto text-gray-300 w-12 h-12 mb-3" />
                  <p className="text-gray-400">No pending requests right now.</p>
                </div>
              ) : (
                pendingBookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className="overflow-hidden border-none shadow-2xl shadow-palm/5 rounded-[24px] bg-white hover:shadow-xl transition-shadow">
                      <CardContent className="p-0 flex flex-col md:flex-row">
                        <div className="p-6 flex-1 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={booking.type === 'full' ? 'bg-ocean/20 text-palm' : 'bg-sun/20 text-ink'}>
                                {booking.type.toUpperCase()}
                              </Badge>
                              {booking.isFemaleOnly && (
                                <Badge className="bg-earth/10 text-earth border-earth/20">FEMALE ONLY</Badge>
                              )}
                            </div>
                            <span className="text-2xl font-black text-palm">₹{booking.price}</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="mt-1 w-2 h-2 rounded-full bg-green-500" />
                              <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Pickup</p>
                                <p className="font-semibold">{booking.origin}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="mt-1 w-2 h-2 rounded-full bg-red-500" />
                              <div>
                                <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Drop</p>
                                <p className="font-semibold">{booking.destination}</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Users className="w-4 h-4" />
                              <span>{booking.occupiedSeats} Passenger</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span>Customer: {booking.customerName}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleAccept(booking.id)}
                          disabled={loading}
                          className="md:w-32 h-auto rounded-none bg-palm hover:bg-palm/90 text-white font-black text-lg tracking-tighter"
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
