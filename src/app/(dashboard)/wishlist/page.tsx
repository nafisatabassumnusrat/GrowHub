'use client';

import { useStore } from '@/components/providers/StoreProvider';
import ProductCard from '@/components/marketplace/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WishlistPage() {
  const { wishlist, products } = useStore();
  
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold font-display text-foreground tracking-tight">Your Wishlist</h2>
          <p className="text-muted-foreground font-medium mt-1">Saved items for later.</p>
        </div>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-background shadow-inset rounded-[32px]">
          <h3 className="text-xl font-bold font-display mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground max-w-md">Browse the marketplace and click the heart icon to save items here.</p>
          <div className="flex gap-4 mt-6">
            <Link href="/marketplace">
              <Button className="shadow-extruded">Browse Farm</Button>
            </Link>
            <Link href="/marketplace/fish">
              <Button variant="secondary" className="shadow-extruded">Browse Fish</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
