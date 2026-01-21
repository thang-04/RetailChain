import React from 'react';
import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a262a] py-6 px-8 mt-auto shrink-0 z-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
        
        {/* Copyright */}
        <div className="flex items-center gap-1">
          <span>&copy; {currentYear} RetailHQ Inc.</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">All rights reserved.</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 font-medium">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </div>

        {/* Made with love */}
        <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
          <span>Made with</span>
          <Heart className="size-3.5 text-red-500 fill-red-500 animate-pulse" />
          <span>by RetailChain Team</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
