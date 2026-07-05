'use client';

import { Product } from '@/lib/mock-data';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useStore } from '@/components/providers/StoreProvider';
import { toast } from 'sonner';

export default function ProductCard({ product }: { product: Product }) {
  const { wishlist, toggleWishlist, addToCart } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product.id, 1);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <Card className="bg-background shadow-extruded border-none rounded-[32px] overflow-hidden flex flex-col hover:-translate-y-2 transition-transform duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src={product.image} 
          alt={product.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-3 right-3 bg-white/50 backdrop-blur-md rounded-full hover:bg-white/80 transition-colors shadow-sm"
          onClick={() => toggleWishlist(product.id)}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
        </Button>
      </div>
      
      <CardHeader className="px-6 py-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg font-display text-foreground leading-tight line-clamp-2">
            {product.title}
          </h3>
        </div>
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium capitalize">
            {product.type}
          </span>
          <span className="mx-2">•</span>
          <span className="flex items-center">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
            {product.rating}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="px-6 py-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">
          Sold by {product.seller}
        </p>
        <div className="mt-3 text-xs font-medium text-slate-500">
          📍 {product.location}
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 pt-2 flex items-center justify-between">
        <div>
          <span className="text-2xl font-extrabold text-foreground tracking-tight">৳{product.price}</span>
          <span className="text-sm text-muted-foreground font-medium">/{product.unit}</span>
        </div>
        <Button 
          size="icon"
          onClick={handleAddToCart}
          className="h-10 w-10 shadow-extruded rounded-full hover:shadow-extruded-hover transition-all"
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
