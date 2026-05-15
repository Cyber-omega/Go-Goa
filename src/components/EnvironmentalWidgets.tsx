import React from 'react';
import { motion } from 'motion/react';
import { Waves, CloudRain, Wind, ThermometerSun } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const EnvironmentalWidgets = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-2 gap-4">
        {/* Tide Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-morphic border-none p-5 relative overflow-hidden group cursor-pointer h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ocean to-transparent opacity-50" />
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-ocean">High Tide</span>
                <Waves className="w-4 h-4 text-ocean animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-heading italic text-ink">14:45</p>
                <p className="text-[10px] font-medium text-ink/40">+1.8m Elevation</p>
              </div>
              <div className="pt-2">
                <div className="w-full h-1 bg-ink/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-1/2 h-full bg-ocean/30 blur-sm"
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Climate Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-morphic border-none p-5 relative overflow-hidden group cursor-pointer h-full">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sun to-transparent opacity-50" />
            <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sun">Coastal Breeze</span>
                <Wind className="w-4 h-4 text-sun" />
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-heading italic text-ink">28°C</p>
                <p className="text-[10px] font-medium text-ink/40">Partial Cloud • NW 12km/h</p>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-2 h-2 rounded-full bg-sun/20 border border-sun/30" />
                  ))}
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-sun/60">Air Quality: Optimal</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Sustianability Pulse */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-teal border-none p-4 flex items-center justify-between gap-4 overflow-hidden relative">
          <div className="absolute inset-0 bg-palm/5 animate-pulse" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-palm/10 flex items-center justify-center">
              <ThermometerSun className="w-5 h-5 text-palm" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-palm">Solar Radiation</p>
              <p className="text-sm font-bold text-ink">Moderate • UVA 4.2</p>
            </div>
          </div>
          <div className="text-right relative z-10">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-palm/60 block mb-1">Impact level</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`w-1 h-3 rounded-full ${i <= 3 ? 'bg-palm' : 'bg-palm/20'}`} />
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
