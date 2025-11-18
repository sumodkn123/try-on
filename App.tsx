import React, { useState } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { TryOnModal } from './components/TryOnModal';
import { Product } from './types';

// Mock Data
const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'The Ethereal Silk Gown',
    price: 295.00,
    category: 'Evening Wear',
    description: 'A floor-length silk chiffon gown with a deep V-neckline and flowing silhouette. Perfect for gala evenings.',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Midnight Velvet Cocktail Dress',
    price: 185.00,
    category: 'Cocktail',
    description: 'Luxurious crushed velvet in midnight blue with a fitted bodice and off-shoulder sleeves.',
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Summer Breeze Linen Maxi',
    price: 145.00,
    category: 'Casual Luxe',
    description: 'Breathable linen blend with intricate embroidery details and a relaxed fit for warm days.',
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Scarlet Satin Slip',
    price: 210.00,
    category: 'Evening Wear',
    description: 'Minimalist 90s inspired slip dress in striking scarlet satin. Bias cut for a perfect drape.',
    imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Floral Chiffon Midi',
    price: 165.00,
    category: 'Daywear',
    description: 'Romantic floral print on lightweight chiffon with ruffled sleeves and a tiered skirt.',
    imageUrl: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Structured Wool Blend Shift',
    price: 225.00,
    category: 'Workwear',
    description: 'Modern architectural lines in a premium wool blend. Features unique asymmetric detailing.',
    imageUrl: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop'
  }
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleTryOn = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Do not clear selectedProduct immediately to avoid layout jump during fade out if implemented
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-brand-200 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop" 
          alt="Hero Fashion" 
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/60 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-xl text-white">
              <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Redefine <br/> <span className="italic font-light">Your Style</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 font-light tracking-wide">
                Experience the future of fashion with our AI-powered virtual try-on technology. See yourself in our latest collection instantly.
              </p>
              <button 
                onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-brand-900 px-8 py-3 uppercase tracking-widest font-bold hover:bg-brand-100 transition-colors"
              >
                Explore Collection
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main id="collection" className="container mx-auto px-4 py-20 flex-grow">
        <div className="text-center mb-16">
          <span className="text-brand-500 uppercase tracking-widest text-sm font-bold">SS24 Collection</span>
          <h2 className="font-serif text-4xl text-brand-900 mt-2">Curated Elegance</h2>
          <div className="w-24 h-1 bg-brand-300 mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
          {PRODUCTS.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onTryOn={handleTryOn}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-brand-900 text-brand-200 py-12 border-t border-brand-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
           <div>
             <h3 className="font-serif text-xl text-white mb-4">LUMINA</h3>
             <p className="text-sm text-brand-400">Elevating everyday fashion through technology and timeless design.</p>
           </div>
           <div>
             <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-4">Shop</h4>
             <ul className="space-y-2 text-sm">
               <li>New Arrivals</li>
               <li>Dresses</li>
               <li>Accessories</li>
             </ul>
           </div>
           <div>
             <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-4">Support</h4>
             <ul className="space-y-2 text-sm">
               <li>FAQ</li>
               <li>Shipping & Returns</li>
               <li>Contact Us</li>
             </ul>
           </div>
           <div>
             <h4 className="text-white uppercase tracking-widest text-xs font-bold mb-4">Connect</h4>
             <div className="flex space-x-4">
                {/* Social placeholders */}
                <div className="w-8 h-8 bg-brand-800 rounded-full"></div>
                <div className="w-8 h-8 bg-brand-800 rounded-full"></div>
                <div className="w-8 h-8 bg-brand-800 rounded-full"></div>
             </div>
           </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-brand-800 text-center text-xs text-brand-500">
          © 2024 Lumina Fashion. All rights reserved. Powered by Google Gemini.
        </div>
      </footer>

      {/* Modal */}
      <TryOnModal 
        isOpen={isModalOpen} 
        product={selectedProduct} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

export default App;