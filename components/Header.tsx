import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-brand-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-900 text-white flex items-center justify-center font-serif font-bold text-xl">L</div>
            <span className="font-serif text-2xl tracking-widest font-bold text-brand-900">LUMINA</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          {['Collections', 'New Arrivals', 'Dresses', 'About'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`} 
              className="text-sm uppercase tracking-widest text-brand-600 hover:text-brand-900 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
           <button className="text-brand-900 hover:text-brand-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           </button>
           <button className="text-brand-900 hover:text-brand-600">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
           </button>
        </div>
      </div>
    </header>
  );
};