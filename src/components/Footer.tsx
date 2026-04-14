import React from 'react';

export const Footer = () => {
  return (
    <footer className="py-8 border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Developed By <span className="text-primary font-black tracking-tighter">CipherSquad</span>
        </p>
        <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-widest font-bold">
          © {new Date().getFullYear()} GO Goa • All Rights Reserved
        </p>
      </div>
    </footer>
  );
};
