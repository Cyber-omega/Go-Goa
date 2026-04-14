import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Car, User as UserIcon, Shield } from 'lucide-react';
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
      }
      navigate('/dashboard');
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-none shadow-2xl shadow-palm/5 rounded-[32px] overflow-hidden bg-white">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-palm w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-palm/20">
              <Car className="text-white w-10 h-10" />
            </div>
            <div>
              <CardTitle className="text-4xl font-black text-palm tracking-tighter">GO GOA</CardTitle>
              <CardDescription className="text-ink/60 font-medium mt-2">Join the most social ride network in Goa</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <Label className="text-[11px] uppercase tracking-widest text-ocean font-black">I am a...</Label>
              <RadioGroup
                defaultValue="customer"
                onValueChange={(v) => setRole(v as 'customer' | 'driver')}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="customer" id="customer" className="peer sr-only" />
                  <Label
                    htmlFor="customer"
                    className="flex flex-col items-center justify-between rounded-2xl border-2 border-gray-100 bg-white p-4 hover:bg-palm/5 hover:border-palm/30 peer-data-[state=checked]:border-palm peer-data-[state=checked]:bg-palm/5 cursor-pointer transition-all"
                  >
                    <UserIcon className="mb-3 h-6 w-6 text-palm" />
                    <span className="font-bold text-ink">Customer</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="driver" id="driver" className="peer sr-only" />
                  <Label
                    htmlFor="driver"
                    className="flex flex-col items-center justify-between rounded-2xl border-2 border-gray-100 bg-white p-4 hover:bg-palm/5 hover:border-palm/30 peer-data-[state=checked]:border-palm peer-data-[state=checked]:bg-palm/5 cursor-pointer transition-all"
                  >
                    <Car className="mb-3 h-6 w-6 text-palm" />
                    <span className="font-bold text-ink">Driver</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button
              className="w-full h-14 text-lg bg-palm hover:bg-palm/90 text-white font-black rounded-2xl shadow-xl shadow-palm/10 flex items-center justify-center gap-3"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 brightness-0 invert" referrerPolicy="no-referrer" />
              {loading ? 'Signing in...' : 'Continue with Google'}
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
