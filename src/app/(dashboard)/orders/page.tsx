'use client';

import { useStore } from '@/components/providers/StoreProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function OrdersPage() {
  const { cart, products, removeFromCart, clearCart } = useStore();
  
  const cartItems = cart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId)!;
    return { ...product, quantity: cartItem.quantity };
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const delivery = cartItems.length > 0 ? 50 : 0; // 50 taka flat rate
  const total = subtotal + delivery;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    toast.success('Order placed successfully! The sellers will contact you soon.');
    clearCart();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold font-display text-foreground tracking-tight">Your Cart</h2>
          <p className="text-muted-foreground font-medium mt-1">Review your items before checkout.</p>
        </div>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.id} className="bg-background shadow-extruded border-none rounded-[24px] overflow-hidden">
                <CardContent className="p-4 flex gap-4 items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.title} className="h-20 w-20 object-cover rounded-xl shadow-sm shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground font-display">{item.title}</h3>
                    <p className="text-xs text-muted-foreground">{item.seller} • {item.location}</p>
                    <div className="mt-2 font-bold">৳{item.price} <span className="text-xs text-muted-foreground font-medium">/{item.unit}</span></div>
                  </div>
                  <div className="flex flex-col items-center gap-2 px-2">
                    <div className="bg-background shadow-inset px-4 py-1.5 rounded-full font-bold">
                      x {item.quantity}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <Card className="bg-background shadow-extruded border-none rounded-[32px] sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl font-display mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm font-medium">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>৳{delivery}</span>
                  </div>
                  <div className="border-t border-slate-200/60 pt-3 flex justify-between font-bold text-lg mt-2">
                    <span>Total</span>
                    <span>৳{total}</span>
                  </div>
                </div>
                <Button className="w-full mt-6 shadow-extruded" onClick={handleCheckout}>
                  Confirm Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-background shadow-inset rounded-[32px]">
          <ShoppingBag className="h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-bold font-display mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground max-w-md">Looks like you haven't added anything to your cart yet.</p>
          <div className="flex gap-4 mt-6">
            <Link href="/marketplace">
              <Button className="shadow-extruded">Start Shopping</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
