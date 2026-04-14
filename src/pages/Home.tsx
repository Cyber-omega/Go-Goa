import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Car, Shield, Users, MapPin, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sand">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=80"
            alt="Goa Beach"
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <Badge className="bg-ocean/20 text-palm border-none px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              Ride Sharing Reimagined for Goa
            </Badge>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-palm leading-none">
              GO <span className="text-ocean">GOA</span>
            </h1>
            <p className="text-xl md:text-2xl text-ink max-w-2xl mx-auto font-medium">
              The safest, most social way to travel across the sunshine state. 
              Book a car, join a shuttle, or meet new friends.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="h-16 px-10 text-lg bg-palm hover:bg-palm/90 rounded-2xl shadow-xl shadow-palm/10 group"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-16 px-10 text-lg border-2 border-gray-200 hover:bg-gray-50 rounded-2xl"
            >
              Learn More
            </Button>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-gray-300 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Why Choose GO Goa?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Built for the unique travel culture of Goa, focusing on safety and community.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="w-8 h-8 text-blue-500" />}
              title="Shuttle & Meet"
              description="Don't travel alone. Join a shuttle, split the cost, and meet fellow travelers heading to the same beach."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-pink-500" />}
              title="Safety First"
              description="Female-only ride options and real-time GPS tracking shared with your emergency contacts."
            />
            <FeatureCard
              icon={<MapPin className="w-8 h-8 text-orange-500" />}
              title="Local Drivers"
              description="Verified local drivers who know every hidden gem and shortcut in Goa."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="border-none shadow-none bg-transparent p-6 text-center space-y-4 hover:bg-white hover:shadow-xl transition-all rounded-3xl group">
    <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{description}</p>
  </Card>
);
