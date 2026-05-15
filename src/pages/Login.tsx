import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Car, User as UserIcon, Shield, Palmtree } from 'lucide-react';
import { motion } from 'motion/react';

export const Login = () => {
  const [role, setRole] = useState<'customer' | 'driver'>('customer');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user profile
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: role,
          isFemale: false, // Default
          rating: 5,
          ratingCount: 0
        });
      } else {
        // Update role if explicitly selected on login page and different
        const userData = userSnap.data();
        if (userData && userData.role !== role) {
          await updateDoc(userRef, { role: role });
        }
      }
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.08] pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-palm rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-earth rounded-full blur-[120px]" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-none shadow-2xl shadow-ink/5 rounded-[40px] overflow-hidden bg-card/80 backdrop-blur-xl">
          <CardHeader className="text-center space-y-4 pt-12">
            <div className="mx-auto w-28 h-28 p-2 bg-card rounded-[32px] shadow-xl shadow-black/5 flex items-center justify-center mb-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-brand-gradient opacity-10 animate-pulse" />
              <Palmtree className="w-16 h-16 text-palm relative z-10 transform group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <CardTitle className="text-5xl font-black text-ink tracking-tighter uppercase leading-none">GO GOA</CardTitle>
              <CardDescription className="text-ink/60 font-semibold mt-3 text-base">Travel the Susegad Way</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pb-12">
            <div className="space-y-4">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-ocean font-black">Identify as</Label>
              <RadioGroup
                defaultValue="customer"
                onValueChange={(v) => setRole(v as 'customer' | 'driver')}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="customer" id="customer" className="peer sr-only" />
                  <Label
                    htmlFor="customer"
                    className="flex flex-col items-center justify-between rounded-3xl border-2 border-gray-100 dark:border-white/5 bg-card p-6 hover:bg-ocean/5 hover:border-ocean/30 peer-data-[state=checked]:border-ocean peer-data-[state=checked]:bg-ocean/5 cursor-pointer transition-all"
                  >
                    <div className="bg-ocean/10 p-3 rounded-2xl mb-3">
                      <UserIcon className="h-6 w-6 text-ocean" />
                    </div>
                    <span className="font-bold text-ink">Customer</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="driver" id="driver" className="peer sr-only" />
                  <Label
                    htmlFor="driver"
                    className="flex flex-col items-center justify-between rounded-3xl border-2 border-gray-100 dark:border-white/5 bg-card p-6 hover:bg-sun/5 hover:border-sun/30 peer-data-[state=checked]:border-sun peer-data-[state=checked]:bg-sun/5 cursor-pointer transition-all"
                  >
                    <div className="bg-sun/10 p-3 rounded-2xl mb-3">
                      <Car className="h-6 w-6 text-sun" />
                    </div>
                    <span className="font-bold text-ink">Driver</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              className="w-full h-16 text-lg bg-brand-gradient text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-transform border-none"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 brightness-0 invert" referrerPolicy="no-referrer" />
              {loading ? 'Entering Goa...' : 'Continue with Google'}
            </Button>

            <p className="text-center text-xs text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
