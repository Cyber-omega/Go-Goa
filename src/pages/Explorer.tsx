import React, { useState, useEffect, useRef } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Box, Eye, X, Info, Compass, Star } from 'lucide-react';
import { toast } from 'sonner';

declare global {
  interface Window {
    pannellum: any;
  }
}

// Simplified Goa GeoJSON
const GOA_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Goa" },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [73.7, 15.8], [74.1, 15.8], [74.3, 15.5], [74.2, 15.0], [74.0, 14.8], [73.7, 14.9], [73.6, 15.3], [73.7, 15.8]
        ]]
      }
    }
  ]
};

interface Location {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  type: 'famous' | 'hidden';
  category: 'fort' | 'church' | 'nightlife' | 'nature';
  vrUrl: string;
  thumbnail: string;
  bestFor?: string;
}

const LOCATIONS: Location[] = [
  // FORTS
  {
    id: 'aguada',
    name: 'Fort Aguada',
    description: 'The most iconic fort in Goa. Features a 4-story lighthouse and a massive cistern. High traffic area with stunning views.',
    coordinates: [73.77, 15.49],
    type: 'famous',
    category: 'fort',
    vrUrl: 'https://pannellum.org/images/banteay-srei.jpg', // Using reliable CORS-enabled sample
    thumbnail: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    bestFor: 'History & Panoramic Views'
  },
  {
    id: 'chapora',
    name: 'Chapora Fort',
    description: 'Known as the "Dil Chahta Hai" fort. Steep climb but worth it for the breathtaking view of Vagator Beach.',
    coordinates: [73.73, 15.60],
    type: 'famous',
    category: 'fort',
    vrUrl: 'https://pannellum.org/images/banteay-srei.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=800&q=80',
    bestFor: 'Sunset & Vagator Views'
  },
  {
    id: 'reis-magos',
    name: 'Reis Magos Fort',
    description: 'Fully restored and now a cultural center. Very safe, educational, and offers a great view of the Mandovi River.',
    coordinates: [73.81, 15.50],
    type: 'famous',
    category: 'fort',
    vrUrl: 'https://pannellum.org/images/banteay-srei.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1590393957416-64669865682c?w=800&q=80',
    bestFor: 'Cultural Education'
  },
  {
    id: 'cabo',
    name: 'Cabo de Rama Fort',
    description: 'A "Hidden Gem" in South Goa. Dramatic cliffs and a white church inside the ruins. Very secluded and romantic.',
    coordinates: [73.92, 15.04],
    type: 'hidden',
    category: 'fort',
    vrUrl: 'https://pannellum.org/images/cerro-toco-0.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1544085311-11a028465b03?w=800&q=80',
    bestFor: 'Secluded Romance'
  },
  {
    id: 'terekhol',
    name: 'Terekhol Fort',
    description: 'Located on the far northern tip of Goa; accessible via ferry. Now a boutique hotel with heritage charm.',
    coordinates: [73.68, 15.72],
    type: 'hidden',
    category: 'fort',
    vrUrl: 'https://pannellum.org/images/banteay-srei.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    bestFor: 'Boutique Heritage Stay'
  },
  {
    id: 'corjuem',
    name: 'Corjuem Fort',
    description: 'An inland river fort. Much smaller and very quiet—perfect for offbeat explorers seeking peace.',
    coordinates: [73.89, 15.60],
    type: 'hidden',
    category: 'fort',
    vrUrl: 'https://pannellum.org/images/banteay-srei.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80',
    bestFor: 'Offbeat Exploration'
  },

  // CHURCHES
  {
    id: 'bom-jesus',
    name: 'Basilica of Bom Jesus',
    description: 'UNESCO World Heritage site in Old Goa. Holds the sacred remains of St. Francis Xavier.',
    coordinates: [73.91, 15.50],
    type: 'famous',
    category: 'church',
    vrUrl: 'https://pannellum.org/images/alma.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
    bestFor: 'Spiritual & Architecture'
  },
  {
    id: 'se-cathedral',
    name: 'Se Cathedral',
    description: 'One of the largest churches in Asia, famous for its "Golden Bell" and Portuguese-Gothic style.',
    coordinates: [73.91, 15.51],
    type: 'famous',
    category: 'church',
    vrUrl: 'https://pannellum.org/images/alma.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1590050801219-490c44403c90?w=800&q=80',
    bestFor: 'Architectural Marvel'
  },
  {
    id: 'immaculate',
    name: 'Immaculate Conception Church',
    description: 'The famous white zig-zag stairs in the heart of Panaji city. An architectural landmark.',
    coordinates: [73.83, 15.50],
    type: 'famous',
    category: 'church',
    vrUrl: 'https://pannellum.org/images/alma.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    bestFor: 'City Landmark'
  },
  {
    id: 'saligao',
    name: 'Mae De Deus Church',
    description: 'Looks like a white Gothic castle. Breathtaking when lit up at night in Saligao.',
    coordinates: [73.77, 15.55],
    type: 'famous',
    category: 'church',
    vrUrl: 'https://pannellum.org/images/alma.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80',
    bestFor: 'Night Photography'
  },
  {
    id: 'three-kings',
    name: 'Three Kings Chapel',
    description: 'Perched on a hill in Cansaulim. Famous for its haunted legends and 360-degree panoramic views.',
    coordinates: [73.88, 15.36],
    type: 'hidden',
    category: 'church',
    vrUrl: 'https://pannellum.org/images/alma.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1590050801219-490c44403c90?w=800&q=80',
    bestFor: 'Haunted Legends & Views'
  },
  {
    id: 'st-anne',
    name: 'Church of St. Anne',
    description: 'A hidden masterpiece of "Indian Baroque" architecture in Talaulim. Truly a hidden gem.',
    coordinates: [73.91, 15.47],
    type: 'hidden',
    category: 'church',
    vrUrl: 'https://pannellum.org/images/alma.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1590050801219-490c44403c90?w=800&q=80',
    bestFor: 'Indian Baroque Art'
  },

  // NIGHTLIFE
  {
    id: 'joseph-bar',
    name: 'Joseph Bar',
    description: 'Old-school Goan vibe in Panjim. Famous for craft feni, local snacks, and a cozy atmosphere.',
    coordinates: [73.83, 15.49],
    type: 'famous',
    category: 'nightlife',
    vrUrl: 'https://pannellum.org/images/jfk.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    bestFor: 'Craft Feni & Local Vibes'
  },
  {
    id: 'thalassa',
    name: 'Thalassa',
    description: 'Greek vibe with high energy in Siolim. Iconic sunsets, fire shows, and Mediterranean cuisine.',
    coordinates: [73.76, 15.61],
    type: 'famous',
    category: 'nightlife',
    vrUrl: 'https://pannellum.org/images/jfk.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    bestFor: 'Sunsets & Fire Shows'
  },
  {
    id: 'soro',
    name: 'Soro - The Village Pub',
    description: 'Rustic industrial vibe in Assagao. Live music, great dance floor, and a favorite local hangout.',
    coordinates: [73.78, 15.59],
    type: 'famous',
    category: 'nightlife',
    vrUrl: 'https://pannellum.org/images/jfk.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    bestFor: 'Live Music & Dancing'
  },
  {
    id: 'lpk',
    name: 'LPK (Love Passion Karma)',
    description: 'Waterfront club in Nerul. Amazing architecture, clay statues, and late-night dancing.',
    coordinates: [73.79, 15.51],
    type: 'famous',
    category: 'nightlife',
    vrUrl: 'https://pannellum.org/images/jfk.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    bestFor: 'Late-night Dancing'
  },
  {
    id: 'gunpowder',
    name: 'Gunpowder',
    description: 'Chill foodie spot in Assagao. Famous for South Indian cocktails and a unique boutique shop.',
    coordinates: [73.78, 15.58],
    type: 'famous',
    category: 'nightlife',
    vrUrl: 'https://pannellum.org/images/jfk.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    bestFor: 'South Indian Cocktails'
  },
  {
    id: 'lazy-goose',
    name: 'The Lazy Goose',
    description: 'Riverside classy spot in Nerul. Great for groups, sunset drinks, and fresh seafood.',
    coordinates: [73.79, 15.52],
    type: 'famous',
    category: 'nightlife',
    vrUrl: 'https://pannellum.org/images/jfk.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    bestFor: 'Riverside Sunset Drinks'
  },
  {
    id: 'antares',
    name: 'Antares',
    description: 'Beach club in Vagator by Sarah Todd. Stunning views, Australian-Goan fusion, and great vibes.',
    coordinates: [73.73, 15.59],
    type: 'famous',
    category: 'nightlife',
    vrUrl: 'https://pannellum.org/images/jfk.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    bestFor: 'Beachfront Dining'
  },

  // NATURE
  {
    id: 'dudhsagar',
    name: 'Dudhsagar Falls',
    description: 'One of India\'s tallest waterfalls, located in the Bhagwan Mahaveer Sanctuary.',
    coordinates: [74.31, 15.31],
    type: 'famous',
    category: 'nature',
    vrUrl: 'https://pannellum.org/images/cerro-toco-0.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1544085311-11a028465b03?w=800&q=80',
    bestFor: 'Nature & Trekking'
  },
  {
    id: 'netravali',
    name: 'Netravali Bubbling Lake',
    description: 'A hidden gem where continuous bubbles rise from the lake bed due to natural gas.',
    coordinates: [74.21, 15.08],
    type: 'hidden',
    category: 'nature',
    vrUrl: 'https://pannellum.org/images/cerro-toco-0.jpg',
    thumbnail: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=800&q=80',
    bestFor: 'Natural Phenomena'
  }
];

import { EnvironmentalWidgets } from '@/components/EnvironmentalWidgets';
import { AIItineraryPlanner } from '@/components/AIItineraryPlanner';

export const Explorer = () => {
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(null);
  const [showVR, setShowVR] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const [vrLoading, setVrLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'fort' | 'church' | 'nightlife' | 'nature'>('all');
  const [isSusegad, setIsSusegad] = useState(true);
  const [activeTab, setActiveTab] = useState<'map' | 'itinerary'>('map');
  const panoramaRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const filteredLocations = filter === 'all' 
    ? LOCATIONS 
    : LOCATIONS.filter(loc => loc.category === filter);

  const getMarkerColor = (category: string) => {
    if (isSusegad) return "#E07A5F"; // New Peach Terra Cotta
    switch (category) {
      case 'fort': return "#1F6F78";
      case 'church': return "#F4A261";
      case 'nightlife': return "#2A9D8F";
      case 'nature': return "#FF8A65";
      default: return "#1F6F78";
    }
  };

  useEffect(() => {
    if (showAR) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          toast.error("Camera access denied or not available. AR mode requires a camera.");
          setShowAR(false);
        }
      };
      startCamera();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
         const stream = videoRef.current.srcObject as MediaStream;
         stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [showAR]);

  useEffect(() => {
    if (showVR && selectedLoc) {
      setVrLoading(true);
      const loadPannellum = () => {
        if (window.pannellum && panoramaRef.current) {
          try {
            if (viewerRef.current) {
              viewerRef.current.destroy();
            }
            // Use a small timeout to ensure the container has dimensions
            setTimeout(() => {
              viewerRef.current = window.pannellum.viewer(panoramaRef.current, {
                type: 'equirectangular',
                panorama: selectedLoc.vrUrl,
                autoLoad: true,
                title: selectedLoc.name,
                author: 'GO Goa Explorer',
                hfov: 110,
                vaov: 180,
                haov: 360,
                crossOrigin: 'anonymous',
                showZoomCtrl: true,
                showFullscreenCtrl: true,
                compass: true
              });

              viewerRef.current.on('load', () => {
                setVrLoading(false);
                console.log("Pannellum loaded successfully");
              });

              viewerRef.current.on('error', (err: any) => {
                setVrLoading(false);
                console.error("Pannellum error event:", err);
                toast.error("Failed to load 360 image. CORS or connection issue.");
              });
            }, 200);
          } catch (e) {
            console.error("Pannellum catch error:", e);
            setVrLoading(false);
            toast.error("VR Viewer failed to start.");
          }
        }
      };

      if (!window.pannellum) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.js';
        script.async = true;
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/pannellum/2.5.6/pannellum.css';
        
        document.head.appendChild(link);
        document.body.appendChild(script);

        script.onload = loadPannellum;
      } else {
        loadPannellum();
      }
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [showVR, selectedLoc]);

  const openInNewTab = () => {
    if (selectedLoc) {
      const pannellumUrl = `https://pannellum.org/standalone/pannellum.htm?panorama=${encodeURIComponent(selectedLoc.vrUrl)}&title=${encodeURIComponent(selectedLoc.name)}&author=GO%20Goa%20Explorer&autoLoad=true`;
      window.open(pannellumUrl, '_blank');
    }
  };

  const openDirections = () => {
    if (selectedLoc) {
      const [lng, lat] = selectedLoc.coordinates;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
  };

  return (
    <div className={`min-h-[calc(100vh-80px)] transition-colors duration-1000 textured-bg ${isSusegad ? 'bg-sand' : 'bg-background'} pt-32 pb-24 px-6 overflow-x-hidden flex flex-col`}>
      <header className="max-w-7xl mx-auto mb-16 text-center w-full relative">
        <div 
          className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-card/40 backdrop-blur-3xl border border-palm/10 px-8 py-3 rounded-full stacked-shadow z-10 transition-all hover:scale-105 cursor-pointer group" 
          onClick={() => setIsSusegad(!isSusegad)}
        >
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${!isSusegad ? 'text-palm' : 'text-slate-400'}`}>Efficiency</span>
          <div className={`w-14 h-7 rounded-full p-1 transition-colors relative ${isSusegad ? 'bg-earth/20' : 'bg-palm/20'}`}>
            <motion.div 
              animate={{ x: isSusegad ? 28 : 0 }}
              className={`w-5 h-5 rounded-full shadow-lg flex items-center justify-center ${isSusegad ? 'bg-accent-gradient' : 'bg-brand-gradient'}`}
            >
               {isSusegad ? <div className="w-1.5 h-1.5 bg-white rounded-full glow-terra" /> : <div className="w-1.5 h-1.5 bg-white rounded-full glow-ocean" />}
            </motion.div>
          </div>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors ${isSusegad ? 'text-earth' : 'text-slate-400'}`}>Susegad</span>
        </div>

        <motion.div
           key={isSusegad ? 'susegad' : 'efficiency'}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-4"
        >
          <Badge className="bg-transparent text-earth border border-earth/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.4em]">
            {isSusegad ? 'Cultural Discovery Mode' : 'Rapid Transit Mapping'}
          </Badge>
          <h1 className="text-5xl md:text-8xl editorial-heading text-palm tracking-tight leading-none">
            Exploring <span className={isSusegad ? 'italic text-earth' : 'text-ocean'}>Heritage</span>
          </h1>
          <p className="text-ink/60 max-w-2xl mx-auto font-sans font-light text-xl leading-relaxed">
            {isSusegad 
              ? "Discover the hidden rhythms of Goa. Slow down, breathe, and connect with centuries of Indo-Portuguese history."
              : "Locate essential landmarks and high-traffic hubs with efficiency-first spatial data."
            }
          </p>
        </motion.div>
      </header>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-12 w-full">
        {/* Sidebar Widgets - Environmental */}
        <div className="lg:col-span-1 space-y-8">
           <div className="space-y-2">
             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-palm/40 ml-1">Environmental Sync</h4>
             <EnvironmentalWidgets />
           </div>

           <Card className="border-none premium-shadow rounded-[40px] bg-palm text-white p-10 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="bg-white/10 p-3 rounded-2xl">
                <Star className="w-6 h-6 text-sunset fill-sunset" />
              </div>
              <h4 className="font-black text-lg uppercase tracking-tight italic">Concierge Tip</h4>
            </div>
            <p className="text-base font-sans font-light leading-relaxed text-white/80 italic relative z-10">
              {isSusegad 
                ? "The hidden lake at Netravali is best experienced during the high tide cycles. Use our environmental widget to plan your visit."
                : "Heritage forts are high-visibility zones. We recommend booking a private eco-conveyance for groups over four."
              }
            </p>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-12">
          {/* Tab Switcher */}
          <div className="flex items-center gap-6 border-b border-palm/10 pb-4">
             <button 
               onClick={() => setActiveTab('map')}
               className={`text-sm font-black uppercase tracking-[0.2em] transition-all relative pb-4 ${activeTab === 'map' ? 'text-palm' : 'text-slate-400 hover:text-palm/60'}`}
             >
               Heritage Map
               {activeTab === 'map' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-palm rounded-full" />}
             </button>
             <button 
               onClick={() => setActiveTab('itinerary')}
               className={`text-sm font-black uppercase tracking-[0.2em] transition-all relative pb-4 ${activeTab === 'itinerary' ? 'text-palm' : 'text-slate-400 hover:text-palm/60'}`}
             >
               AI Itinerary Planner
               {activeTab === 'itinerary' && <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-palm rounded-full" />}
             </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 w-full">
            {/* Conditional Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {activeTab === 'map' ? (
                  <motion.div
                    key="map-tab"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="h-full"
                  >
                    <Card className="border-none stacked-shadow rounded-[50px] bg-card overflow-hidden h-[650px] relative">
                      <div className="absolute top-8 left-8 z-10 flex flex-wrap gap-3 max-w-[80%]">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setFilter('all')}
                          className={`rounded-2xl text-[10px] font-black uppercase tracking-widest px-6 h-10 transition-all ${filter === 'all' ? 'bg-palm text-white' : 'bg-card/90 backdrop-blur-md text-palm'}`}
                        >
                          All Pathways
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setFilter('fort')}
                          className={`rounded-2xl text-[10px] font-black uppercase tracking-widest px-6 h-10 transition-all ${filter === 'fort' ? 'bg-palm text-white' : 'bg-card/90 backdrop-blur-md text-palm'}`}
                        >
                          Bastions
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setFilter('church')}
                          className={`rounded-2xl text-[10px] font-black uppercase tracking-widest px-6 h-10 transition-all ${filter === 'church' ? 'bg-earth text-white' : 'bg-card/90 backdrop-blur-md text-earth'}`}
                        >
                          Altars
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setFilter('nature')}
                          className={`rounded-2xl text-[10px] font-black uppercase tracking-widest px-6 h-10 transition-all ${filter === 'nature' ? 'bg-ocean text-white' : 'bg-card/90 backdrop-blur-md text-ocean'}`}
                        >
                          Wilderness
                        </Button>
                      </div>

                      <div className={`w-full h-full transition-colors duration-1000 ${isSusegad ? 'bg-sand' : 'bg-background'}`}>
                        <ComposableMap
                          projection="geoMercator"
                          projectionConfig={{
                            scale: 45000,
                            center: [74.0, 15.3]
                          }}
                          style={{ width: "100%", height: "100%" }}
                        >
                          <Geographies geography={GOA_GEOJSON}>
                            {({ geographies }) =>
                              geographies.map((geo) => (
                                <Geography
                                  key={geo.rsmKey}
                                  geography={geo}
                                  fill={isSusegad ? "rgba(231, 111, 81, 0.03)" : "rgba(10, 95, 110, 0.05)"}
                                  stroke={isSusegad ? "#E76F51" : "#0A5F6E"}
                                  strokeWidth={0.3}
                                  style={{
                                    default: { outline: "none" },
                                    hover: { fill: isSusegad ? "rgba(231, 111, 81, 0.08)" : "rgba(10, 95, 110, 0.1)", outline: "none" },
                                    pressed: { outline: "none" }
                                  }}
                                />
                              ))
                            }
                          </Geographies>

                          {filteredLocations.map((loc) => (
                            <Marker key={loc.id} coordinates={loc.coordinates}>
                              <motion.g
                                whileHover={{ scale: 1.4 }}
                                onClick={() => setSelectedLoc(loc)}
                                className="cursor-pointer"
                              >
                                <circle
                                  r={7}
                                  fill={getMarkerColor(loc.category)}
                                  stroke="#fff"
                                  strokeWidth={3}
                                  className="transition-colors duration-500 shadow-xl"
                                />
                                {isSusegad && (
                                  <circle
                                    r={15}
                                    fill={getMarkerColor(loc.category)}
                                    className="animate-pulse opacity-10"
                                  />
                                )}
                              </motion.g>
                            </Marker>
                          ))}
                        </ComposableMap>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key="itinerary-tab"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full"
                  >
                    <AIItineraryPlanner />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Side Info Panel */}
            <div className="lg:col-span-1">
              <AnimatePresence mode="wait">
                {selectedLoc ? (
                  <motion.div
                    key={selectedLoc.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="border-none premium-shadow rounded-[40px] bg-card overflow-hidden group">
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={selectedLoc.thumbnail} 
                          alt={selectedLoc.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                          <Badge className="bg-white/20 backdrop-blur-md text-white border-white/20 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {selectedLoc.type}
                          </Badge>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em]">{selectedLoc.category}</span>
                        </div>
                      </div>
                      <CardHeader className="pt-8 px-8 pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-[1px] bg-palm/20" />
                          <Button variant="ghost" size="icon" onClick={() => setSelectedLoc(null)} className="rounded-full h-10 w-10 bg-slate-50 dark:bg-white/5">
                            <X className="w-5 h-5 text-palm" />
                          </Button>
                        </div>
                        <CardTitle className="text-4xl editorial-heading text-palm leading-tight italic">{selectedLoc.name}</CardTitle>
                        <p className="text-ink/60 font-sans font-light leading-relaxed text-base pt-4">
                          {selectedLoc.description}
                        </p>
                      </CardHeader>
                      <CardContent className="px-8 pb-10 space-y-6">
                        <div className="flex flex-col gap-3">
                          <Button 
                            onClick={() => setShowVR(true)}
                            className="bg-brand-gradient text-white font-black rounded-2xl h-14 gap-3 uppercase tracking-widest text-[10px] border-none shadow-ocean/20 shadow-lg transition-transform active:scale-95"
                          >
                            <Eye className="w-5 h-5" />
                            Immersive VR Tour
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setShowAR(true)}
                            className="border-2 border-palm/20 text-palm hover:bg-palm/5 font-black rounded-2xl h-14 gap-3 uppercase tracking-widest text-[10px]"
                          >
                            <Box className="w-5 h-5" />
                            AR Heritage View
                          </Button>
                        </div>
                        <button 
                          onClick={openDirections}
                          className="w-full flex items-center justify-center gap-3 text-earth font-black uppercase tracking-widest text-[10px] h-12 border-t border-slate-50 dark:border-white/5 hover:bg-earth/5 rounded-2xl transition-all"
                        >
                          <MapPin className="w-4 h-4" />
                          Get Heritage Path
                        </button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <Card className="border-none premium-shadow rounded-[40px] bg-card p-12 text-center flex flex-col items-center justify-center h-full min-h-[500px]">
                    <div className="bg-sand p-8 rounded-[40px] mb-8 relative">
                      <Compass className="w-16 h-16 text-palm/40 animate-spin-slow" />
                      <div className="absolute inset-0 bg-palm/5 rounded-[40px] animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-black text-palm mb-4 leading-none">Awaiting Selection</h3>
                    <p className="text-ink/60 font-sans font-light leading-relaxed">
                      Select a coordinate on the Goa heritage map to begin your regenerative discovery journey.
                    </p>
                  </Card>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* AR Vision Modal */}
      <AnimatePresence>
        {showAR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black flex flex-col"
          >
             <div className="absolute top-6 left-6 right-6 z-20 flex justify-between items-start pointer-events-none">
              <div className="bg-black/50 backdrop-blur-md p-4 rounded-2xl pointer-events-auto">
                <div className="flex items-center gap-2 mb-1">
                  <Box className="w-5 h-5 text-palm" />
                  <span className="text-white font-black tracking-tighter uppercase text-sm">AR VISION ACTIVE</span>
                </div>
                <h2 className="text-white font-bold text-xl">{selectedLoc?.name}</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowAR(false)}
                className="bg-black/50 backdrop-blur-md text-white hover:bg-white/10 rounded-full h-12 w-12 pointer-events-auto"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover grayscale opacity-60"
            />

            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-white/20 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-1 h-16 bg-white/40 absolute" />
                <div className="w-16 h-1 bg-white/40 absolute" />
              </div>
              
              {/* Simulated AR Points */}
              <motion.div 
                animate={{ 
                  x: [0, 20, -20, 0],
                  y: [0, -20, 20, 0] 
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bg-palm/90 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-2xl flex items-center gap-3"
              >
                <div className="bg-white/20 p-2 rounded-lg">
                  <Info className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white text-[10px] font-black uppercase tracking-widest">{selectedLoc?.category}</p>
                  <p className="text-white font-bold text-sm">1.2 KM AWAY</p>
                </div>
              </motion.div>
            </div>

            <div className="absolute bottom-10 left-0 right-0 p-6 flex flex-col items-center gap-4 pointer-events-none">
              <div className="bg-black/50 backdrop-blur-md p-6 rounded-[32px] max-w-md text-center pointer-events-auto border border-white/10">
                <p className="text-white/80 text-sm font-medium leading-relaxed italic">
                  "Goa's culture is deeply rooted in its landscape. This {selectedLoc?.category} represents centuries of heritage."
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VR Modal */}
      <AnimatePresence>
        {showVR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          >
            <div className="p-4 flex justify-between items-center bg-black/50 backdrop-blur-md relative z-20">
              <div className="flex items-center gap-3">
                <div className="bg-palm p-2 rounded-xl">
                  <Eye className="text-white w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-white font-black text-xl tracking-tighter">{selectedLoc?.name}</h2>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">360° VR Experience</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowVR(false)}
                className="text-white hover:bg-white/10 rounded-full h-12 w-12"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex-1 w-full relative">
              {vrLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10">
                  <div className="w-12 h-12 border-4 border-palm border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-white font-bold animate-pulse uppercase tracking-widest text-xs">Loading Panorama...</p>
                </div>
              )}
              <div ref={panoramaRef} className="w-full h-full" />
            </div>
            <div className="p-6 bg-black/50 backdrop-blur-md text-center flex flex-col md:flex-row items-center justify-center gap-4">
              <p className="text-white/80 text-sm font-medium max-w-2xl">
                Drag to look around. Use your mouse wheel or pinch to zoom. 
                Experience the beauty of Goa in immersive 360 degrees.
              </p>
              <Button 
                onClick={openInNewTab}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl gap-2"
              >
                <Compass className="w-4 h-4" />
                Open in Full Screen
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
