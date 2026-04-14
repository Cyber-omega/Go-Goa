import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, Phone, User, Heart } from 'lucide-react';
import { toast } from 'sonner';

export const Profile = () => {
  const { profile, user } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isFemale, setIsFemale] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setName(profile.emergencyContact?.name || '');
      setPhone(profile.emergencyContact?.phone || '');
      setIsFemale(profile.isFemale || false);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        isFemale,
        emergencyContact: {
          name,
          phone
        }
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand pt-24 pb-12 px-4">
      <header className="max-w-2xl mx-auto flex items-center gap-6 mb-8">
        <Avatar className="h-24 w-24 border-4 border-white shadow-xl shadow-palm/10">
          <AvatarImage src={user?.photoURL || ''} />
          <AvatarFallback className="text-2xl bg-palm text-white">{user?.displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-ocean font-bold">User Profile</span>
          <h1 className="text-3xl font-black text-palm">{user?.displayName}</h1>
          <p className="text-ink/60 font-medium">{profile?.role.toUpperCase()} • {user?.email}</p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto grid gap-6">
        <Card className="border-none shadow-2xl shadow-palm/5 rounded-[32px] bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-palm font-heading">
              <User className="text-palm w-5 h-5" />
              Personal Preferences
            </CardTitle>
            <CardDescription className="text-ink/60">Customize your experience on GO Goa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-sand rounded-2xl">
              <div className="space-y-0.5">
                <Label className="text-base font-bold text-ink">Female User</Label>
                <p className="text-sm text-ink/60">Enable female-only ride options</p>
              </div>
              <Switch checked={isFemale} onCheckedChange={setIsFemale} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl shadow-palm/5 rounded-[32px] bg-white overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-earth font-heading">
              <Shield className="text-earth w-5 h-5" />
              Emergency Contact
            </CardTitle>
            <CardDescription className="text-ink/60">We'll share your live GPS with this person during rides</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-xs font-bold uppercase tracking-widest text-ocean">Contact Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-ocean w-4 h-4" />
                <Input
                  id="contactName"
                  placeholder="e.g. Mom"
                  className="pl-10 h-12 bg-sand/50 border-none rounded-xl"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="text-xs font-bold uppercase tracking-widest text-ocean">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-ocean w-4 h-4" />
                <Input
                  id="contactPhone"
                  placeholder="+91 98765 43210"
                  className="pl-10 h-12 bg-sand/50 border-none rounded-xl"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full h-14 bg-palm hover:bg-palm/90 text-white font-black text-lg rounded-2xl shadow-xl shadow-palm/10"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};
