import React from 'react';
import { Product } from '../types';
import { Button } from './Button';

interface ProductCardProps {
  product: Product;
  onTryOn: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onTryOn }) => {
  return (
    <div className="group bg-white flex flex-col h-full transition-transform duration-500 hover:-translate-y-1 hover:shadow-xl overflow-hidden border border-brand-100">
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-100">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        
        {/* Quick action overlay - visible on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/50 to-transparent">
          <Button 
            variant="primary" 
            onClick={() => onTryOn(product)}
            className="w-full text-sm py-2 bg-white text-brand-900 hover:bg-brand-50 hover:text-brand-900 border-none shadow-none"
          >
            Try On
          </Button>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-xs uppercase tracking-widest text-brand-500">{product.category}</span>
        </div>
        <h3 className="font-serif text-lg text-brand-900 mb-1">{product.name}</h3>
        <p className="text-sm text-brand-600 line-clamp-2 mb-4 flex-grow">{product.description}</p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-100">
          <span className="font-serif text-xl text-brand-900">${product.price.toFixed(2)}</span>
          <button 
            onClick={() => onTryOn(product)}
            className="text-sm uppercase tracking-wide font-bold text-brand-800 border-b border-transparent hover:border-brand-800 transition-colors"
          >
            Try On
          </button>
        </div>
      </div>
    </div>
  );
};