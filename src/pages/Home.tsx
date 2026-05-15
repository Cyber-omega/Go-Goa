import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Car, Shield, Users, MapPin, Heart, ArrowRight, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-sand textured-bg selection:bg-earth selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-6">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=1920&q=90"
            alt="Goa Heritage"
            className="w-full h-full object-cover grayscale-[0.2] brightness-[0.85]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sand via-sand/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-[1px] w-12 bg-palm/40" />
              <Badge className="bg-transparent text-palm border border-palm/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em]">
                Regenerative Tourism
              </Badge>
              <div className="h-[1px] w-12 bg-palm/40" />
            </div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="text-[12vw] md:text-[8vw] editorial-heading text-white leading-none drop-shadow-2xl [-webkit-text-stroke:1px_var(--palm)]"
            >
              The Art of <br />
              <span className="text-earth italic [-webkit-text-stroke:0]">Susegad</span> Travel
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-lg md:text-2xl text-ink/80 max-w-3xl mx-auto font-sans font-light leading-relaxed tracking-tight"
            >
              A premium tourism experience dedicated to sustainable <br className="hidden md:block" /> heritage discovery and conscious community transit.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10"
            >
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                className="h-20 px-12 text-sm bg-brand-gradient text-white font-black rounded-3xl premium-shadow group uppercase tracking-[0.2em] transition-all hover:scale-[1.05] active:scale-95 border-none shadow-ocean/20 shadow-xl"
              >
                Begin Discovery
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
              
              <button 
                onClick={() => navigate('/explore')}
                className="flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-full border border-palm/20 flex items-center justify-center group-hover:bg-palm/5 transition-all">
                  <Compass className="w-6 h-6 text-palm group-hover:rotate-45 transition-transform duration-500" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-palm border-b border-palm/20">Explore Map</span>
              </button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-10 hidden xl:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-palm/60">
          <span>Coordinates: 15.2993° N, 74.1240° E</span>
          <div className="h-[1px] w-12 bg-palm/20" />
          <span>Goa, India</span>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sand/30 -skew-x-12" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10 order-2 lg:order-1">
              <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-earth">Our Philosophy</span>
                <h2 className="text-5xl md:text-7xl editorial-heading text-ink">Modernizing Cultural <br /> <span className="italic">Exploration</span></h2>
              </div>
              <p className="text-xl text-ink/70 font-sans font-light leading-relaxed">
                We believe travel should be as restorative for the destination as it is for the traveler. GO GOA connects you with the heritage of the state through a lens of premium sustainability.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-palm/10 rounded-2xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-palm" />
                  </div>
                  <h3 className="text-lg font-black text-ink uppercase tracking-tight">Eco-Conscious</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">We prioritize electric fleets and carbon-neutral transit options for the coastal ecosystems.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-earth/10 rounded-2xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-earth" />
                  </div>
                  <h3 className="text-lg font-black text-ink uppercase tracking-tight">Community First</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Our platform ensures fair wages and revenue share with local heritage custodians.</p>
                </div>
              </div>
            </div>
            
            <div className="relative order-1 lg:order-2">
              <div className="aspect-[4/5] rounded-[60px] overflow-hidden premium-shadow transform rotate-2">
                <img 
                  src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80" 
                  className="w-full h-full object-cover"
                  alt="Goan Architecture"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agent Promo */}
      <section className="py-32 bg-palm relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.4),transparent_50%)]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 space-y-12">
          <div className="space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.4em] text-sunset">Intelligent Discovery</span>
            <h2 className="text-5xl md:text-8xl editorial-heading text-white">Your AI Heritage <br /> <span className="italic text-sunset">Concierge</span></h2>
          </div>
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl mx-auto font-sans font-light">
            An agentic AI experience that designs unique, sustainable itineraries based on your energy and Goan tide patterns.
          </p>
          <Button
            size="lg"
            className="h-20 px-12 bg-accent-gradient text-white font-black rounded-3xl stacked-shadow glow-terra uppercase tracking-widest text-xs transition-all active:scale-95 border-none"
            onClick={() => navigate('/login')}
          >
            Activate Concierge
          </Button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <Card className="border-none shadow-none bg-transparent p-6 text-center space-y-4 hover:bg-card hover:shadow-2xl hover:shadow-ocean/5 transition-all rounded-[32px] group">
    <div className="mx-auto w-20 h-20 bg-card rounded-3xl shadow-lg shadow-black/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-ink">{title}</h3>
    <p className="text-ink/60 leading-relaxed font-medium">{description}</p>
  </Card>
);
