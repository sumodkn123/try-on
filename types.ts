export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
}

export interface TryOnSession {
  isOpen: boolean;
  selectedProduct: Product | null;
  userImage: string | null; // Base64 string
  generatedImage: string | null; // Base64 string
  isGenerating: boolean;
  error: string | null;
}