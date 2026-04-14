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
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Aguada_Fort_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/aguada/400/300',
    bestFor: 'History & Panoramic Views'
  },
  {
    id: 'chapora',
    name: 'Chapora Fort',
    description: 'Known as the "Dil Chahta Hai" fort. Steep climb but worth it for the breathtaking view of Vagator Beach.',
    coordinates: [73.73, 15.60],
    type: 'famous',
    category: 'fort',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Aguada_Fort_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/chapora/400/300',
    bestFor: 'Sunset & Vagator Views'
  },
  {
    id: 'reis-magos',
    name: 'Reis Magos Fort',
    description: 'Fully restored and now a cultural center. Very safe, educational, and offers a great view of the Mandovi River.',
    coordinates: [73.81, 15.50],
    type: 'famous',
    category: 'fort',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Aguada_Fort_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/reismagos/400/300',
    bestFor: 'Cultural Education'
  },
  {
    id: 'cabo',
    name: 'Cabo de Rama Fort',
    description: 'A "Hidden Gem" in South Goa. Dramatic cliffs and a white church inside the ruins. Very secluded and romantic.',
    coordinates: [73.92, 15.04],
    type: 'hidden',
    category: 'fort',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Cabo_de_Rama_Fort_Sea_View_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/fort/400/300',
    bestFor: 'Secluded Romance'
  },
  {
    id: 'terekhol',
    name: 'Terekhol Fort',
    description: 'Located on the far northern tip of Goa; accessible via ferry. Now a boutique hotel with heritage charm.',
    coordinates: [73.68, 15.72],
    type: 'hidden',
    category: 'fort',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Aguada_Fort_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/terekhol/400/300',
    bestFor: 'Boutique Heritage Stay'
  },
  {
    id: 'corjuem',
    name: 'Corjuem Fort',
    description: 'An inland river fort. Much smaller and very quiet—perfect for offbeat explorers seeking peace.',
    coordinates: [73.89, 15.60],
    type: 'hidden',
    category: 'fort',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Aguada_Fort_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/corjuem/400/300',
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
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Basilica_of_Bom_Jesus_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/church/400/300',
    bestFor: 'Spiritual & Architecture'
  },
  {
    id: 'se-cathedral',
    name: 'Se Cathedral',
    description: 'One of the largest churches in Asia, famous for its "Golden Bell" and Portuguese-Gothic style.',
    coordinates: [73.91, 15.51],
    type: 'famous',
    category: 'church',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Basilica_of_Bom_Jesus_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/secathedral/400/300',
    bestFor: 'Architectural Marvel'
  },
  {
    id: 'immaculate',
    name: 'Immaculate Conception Church',
    description: 'The famous white zig-zag stairs in the heart of Panaji city. An architectural landmark.',
    coordinates: [73.83, 15.50],
    type: 'famous',
    category: 'church',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Basilica_of_Bom_Jesus_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/panaji/400/300',
    bestFor: 'City Landmark'
  },
  {
    id: 'saligao',
    name: 'Mae De Deus Church',
    description: 'Looks like a white Gothic castle. Breathtaking when lit up at night in Saligao.',
    coordinates: [73.77, 15.55],
    type: 'famous',
    category: 'church',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Basilica_of_Bom_Jesus_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/saligao/400/300',
    bestFor: 'Night Photography'
  },
  {
    id: 'three-kings',
    name: 'Three Kings Chapel',
    description: 'Perched on a hill in Cansaulim. Famous for its haunted legends and 360-degree panoramic views.',
    coordinates: [73.88, 15.36],
    type: 'hidden',
    category: 'church',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Basilica_of_Bom_Jesus_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/threekings/400/300',
    bestFor: 'Haunted Legends & Views'
  },
  {
    id: 'st-anne',
    name: 'Church of St. Anne',
    description: 'A hidden masterpiece of "Indian Baroque" architecture in Talaulim. Truly a hidden gem.',
    coordinates: [73.91, 15.47],
    type: 'hidden',
    category: 'church',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Basilica_of_Bom_Jesus_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/stanne/400/300',
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
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Baga_Beach_Goa_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/joseph/400/300',
    bestFor: 'Craft Feni & Local Vibes'
  },
  {
    id: 'thalassa',
    name: 'Thalassa',
    description: 'Greek vibe with high energy in Siolim. Iconic sunsets, fire shows, and Mediterranean cuisine.',
    coordinates: [73.76, 15.61],
    type: 'famous',
    category: 'nightlife',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Baga_Beach_Goa_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/thalassa/400/300',
    bestFor: 'Sunsets & Fire Shows'
  },
  {
    id: 'soro',
    name: 'Soro - The Village Pub',
    description: 'Rustic industrial vibe in Assagao. Live music, great dance floor, and a favorite local hangout.',
    coordinates: [73.78, 15.59],
    type: 'famous',
    category: 'nightlife',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Baga_Beach_Goa_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/soro/400/300',
    bestFor: 'Live Music & Dancing'
  },
  {
    id: 'lpk',
    name: 'LPK (Love Passion Karma)',
    description: 'Waterfront club in Nerul. Amazing architecture, clay statues, and late-night dancing.',
    coordinates: [73.79, 15.51],
    type: 'famous',
    category: 'nightlife',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Baga_Beach_Goa_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/lpk/400/300',
    bestFor: 'Late-night Dancing'
  },
  {
    id: 'gunpowder',
    name: 'Gunpowder',
    description: 'Chill foodie spot in Assagao. Famous for South Indian cocktails and a unique boutique shop.',
    coordinates: [73.78, 15.58],
    type: 'famous',
    category: 'nightlife',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Baga_Beach_Goa_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/gunpowder/400/300',
    bestFor: 'South Indian Cocktails'
  },
  {
    id: 'lazy-goose',
    name: 'The Lazy Goose',
    description: 'Riverside classy spot in Nerul. Great for groups, sunset drinks, and fresh seafood.',
    coordinates: [73.79, 15.52],
    type: 'famous',
    category: 'nightlife',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Baga_Beach_Goa_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/lazygoose/400/300',
    bestFor: 'Riverside Sunset Drinks'
  },
  {
    id: 'antares',
    name: 'Antares',
    description: 'Beach club in Vagator by Sarah Todd. Stunning views, Australian-Goan fusion, and great vibes.',
    coordinates: [73.73, 15.59],
    type: 'famous',
    category: 'nightlife',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Baga_Beach_Goa_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/antares/400/300',
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
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Dudhsagar_Falls_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/waterfall/400/300',
    bestFor: 'Nature & Trekking'
  },
  {
    id: 'netravali',
    name: 'Netravali Bubbling Lake',
    description: 'A hidden gem where continuous bubbles rise from the lake bed due to natural gas.',
    coordinates: [74.21, 15.08],
    type: 'hidden',
    category: 'nature',
    vrUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Netravali_Wildlife_Sanctuary_Panorama.jpg',
    thumbnail: 'https://picsum.photos/seed/lake/400/300',
    bestFor: 'Natural Phenomena'
  }
];

export const Explorer = () => {
  const [selectedLoc, setSelectedLoc] = useState<Location | null>(null);
  const [showVR, setShowVR] = useState(false);
  const [filter, setFilter] = useState<'all' | 'fort' | 'church' | 'nightlife' | 'nature'>('all');
  const panoramaRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  const filteredLocations = filter === 'all' 
    ? LOCATIONS 
    : LOCATIONS.filter(loc => loc.category === filter);

  const getMarkerColor = (category: string) => {
    switch (category) {
      case 'fort': return "#386641";
      case 'church': return "#F2CC8F";
      case 'nightlife': return "#E07A5F";
      case 'nature': return "#81B29A";
      default: return "#386641";
    }
  };

  useEffect(() => {
    if (showVR && selectedLoc) {
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
                showFullscreenCtrl: true
              });
            }, 100);
          } catch (e) {
            console.error("Pannellum init error:", e);
            toast.error("VR Viewer failed to start. Try opening in a new tab.");
          }
        }
      };

      if (!window.pannellum) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
        script.async = true;
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
        
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

  return (
    <div className="min-h-screen bg-sand dark:bg-background pt-24 pb-12 px-4">
      <header className="max-w-7xl mx-auto mb-12 text-center">
        <Badge className="bg-palm/10 text-palm border-none px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          Interactive Goa Guide
        </Badge>
        <h1 className="text-5xl md:text-7xl font-black text-palm tracking-tighter leading-none mb-4">
          EXPLORE <span className="text-ocean">GOA</span>
        </h1>
        <p className="text-ink/60 dark:text-foreground/60 max-w-2xl mx-auto font-medium text-lg">
          Discover famous landmarks and hidden gems through our interactive AR/VR map. 
          Experience Goa before you even get there.
        </p>
      </header>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Map Section */}
        <Card className="lg:col-span-2 border-none shadow-2xl shadow-palm/5 rounded-[40px] bg-white dark:bg-card overflow-hidden h-[600px] relative">
          <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2 max-w-[80%]">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('all')}
              className={`rounded-xl text-[10px] font-black uppercase tracking-widest h-8 ${filter === 'all' ? 'bg-palm' : 'bg-white/90 dark:bg-card/90'}`}
            >
              All
            </Button>
            <Button 
              variant={filter === 'fort' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('fort')}
              className={`rounded-xl text-[10px] font-black uppercase tracking-widest h-8 ${filter === 'fort' ? 'bg-palm' : 'bg-white/90 dark:bg-card/90'}`}
            >
              Forts
            </Button>
            <Button 
              variant={filter === 'church' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('church')}
              className={`rounded-xl text-[10px] font-black uppercase tracking-widest h-8 ${filter === 'church' ? 'bg-sun text-ink' : 'bg-white/90 dark:bg-card/90'}`}
            >
              Churches
            </Button>
            <Button 
              variant={filter === 'nightlife' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('nightlife')}
              className={`rounded-xl text-[10px] font-black uppercase tracking-widest h-8 ${filter === 'nightlife' ? 'bg-earth' : 'bg-white/90 dark:bg-card/90'}`}
            >
              Nightlife
            </Button>
            <Button 
              variant={filter === 'nature' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('nature')}
              className={`rounded-xl text-[10px] font-black uppercase tracking-widest h-8 ${filter === 'nature' ? 'bg-ocean' : 'bg-white/90 dark:bg-card/90'}`}
            >
              Nature
            </Button>
          </div>

          <div className="w-full h-full bg-[#E0E7D8] dark:bg-palm/5">
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
                      fill="rgba(56, 102, 65, 0.1)"
                      stroke="#386641"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "rgba(56, 102, 65, 0.2)", outline: "none" },
                        pressed: { outline: "none" }
                      }}
                    />
                  ))
                }
              </Geographies>

              {filteredLocations.map((loc) => (
                <Marker key={loc.id} coordinates={loc.coordinates}>
                  <motion.g
                    whileHover={{ scale: 1.5 }}
                    onClick={() => setSelectedLoc(loc)}
                    className="cursor-pointer"
                  >
                    <circle
                      r={6}
                      fill={getMarkerColor(loc.category)}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                    <circle
                      r={12}
                      fill={getMarkerColor(loc.category)}
                      className="animate-pulse opacity-20"
                    />
                  </motion.g>
                </Marker>
              ))}
            </ComposableMap>
          </div>
        </Card>

        {/* Info Panel */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {selectedLoc ? (
              <motion.div
                key={selectedLoc.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="border-none shadow-2xl shadow-palm/5 rounded-[32px] bg-white dark:bg-card overflow-hidden">
                  <img 
                    src={selectedLoc.thumbnail} 
                    alt={selectedLoc.name}
                    className="w-full h-48 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 items-start mb-2">
                      <Badge className={selectedLoc.type === 'famous' ? 'bg-palm/10 text-palm' : 'bg-sun/20 text-ink'}>
                        {selectedLoc.type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="border-palm/20 text-palm uppercase text-[10px]">
                        {selectedLoc.category}
                      </Badge>
                      <div className="flex-1" />
                      <Button variant="ghost" size="icon" onClick={() => setSelectedLoc(null)} className="rounded-full h-8 w-8">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-2xl font-black text-palm">{selectedLoc.name}</CardTitle>
                    <CardDescription className="text-ink/60 dark:text-foreground/60 font-medium">
                      {selectedLoc.description}
                    </CardDescription>
                    {selectedLoc.bestFor && (
                      <div className="mt-3 p-3 bg-palm/5 dark:bg-palm/10 rounded-2xl border border-palm/10">
                        <p className="text-[10px] font-black uppercase tracking-widest text-palm mb-1">Best For</p>
                        <p className="text-sm font-bold text-ink dark:text-foreground">{selectedLoc.bestFor}</p>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={() => setShowVR(true)}
                        className="bg-palm hover:bg-palm/90 text-white font-black rounded-2xl h-12 gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        VR TOUR
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => toast.info("AR Mode: Point your camera at a flat surface (Simulated)")}
                        className="border-2 border-palm/20 text-palm hover:bg-palm/5 font-black rounded-2xl h-12 gap-2"
                      >
                        <Box className="w-4 h-4" />
                        AR VIEW
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full text-ocean font-bold gap-2 hover:bg-ocean/5"
                    >
                      <MapPin className="w-4 h-4" />
                      Get Directions
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="border-none shadow-2xl shadow-palm/5 rounded-[32px] bg-white dark:bg-card p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
                <div className="bg-sand dark:bg-palm/10 p-6 rounded-full mb-6">
                  <Compass className="w-12 h-12 text-palm animate-spin-slow" />
                </div>
                <h3 className="text-xl font-black text-palm mb-2">Select a Location</h3>
                <p className="text-ink/60 dark:text-foreground/60 text-sm font-medium">
                  Click on the map markers to explore Goa's most iconic and secret spots.
                </p>
              </Card>
            )}
          </AnimatePresence>

          <Card className="border-none shadow-2xl shadow-palm/5 rounded-[32px] bg-palm text-white p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Star className="w-6 h-6 text-sun fill-sun" />
              </div>
              <div>
                <h4 className="font-black text-lg">Travel Tip</h4>
                <p className="text-xs text-white/70 font-bold uppercase tracking-widest">Local Advice</p>
              </div>
            </div>
            <p className="text-sm font-medium leading-relaxed opacity-90">
              "Hidden gems like Netravali are best visited early in the morning. Use our Shuttle Social to find travel buddies for these remote locations!"
            </p>
          </Card>
        </div>
      </div>

      {/* VR Modal */}
      <AnimatePresence>
        {showVR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          >
            <div className="p-4 flex justify-between items-center bg-black/50 backdrop-blur-md">
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
            <div ref={panoramaRef} className="flex-1 w-full" />
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
