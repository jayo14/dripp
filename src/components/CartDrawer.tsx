import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useStore } from "@/store/useStore";
import { formatNaira } from "@/data/products";
import { Link } from "@tanstack/react-router";

export function CartDrawer() {
  const open = useStore((s) => s.cartOpen);
  const setOpen = useStore((s) => s.setCartOpen);
  const cart = useStore((s) => s.cart);
  const update = useStore((s) => s.updateQuantity);
  const remove = useStore((s) => s.removeFromCart);
  const subtotal = useStore((s) => s.cartSubtotal());

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-foreground/40"
          />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="text-xs uppercase tracking-luxury">Your Bag ({cart.length})</h2>
              <button onClick={() => setOpen(false)} aria-label="Close"><X className="h-5 w-5" /></button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1} />
                <p className="text-sm text-muted-foreground">Your bag is empty.</p>
                <Link to="/shop" onClick={() => setOpen(false)} className="border border-border px-6 py-3 text-xs uppercase tracking-luxury hover:border-foreground">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {cart.map((item) => (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4 border-b border-border py-4">
                      <img src={item.product.images[0]} alt={item.product.name} className="h-28 w-24 object-cover" />
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <p className="text-sm font-light">{item.product.name}</p>
                          <p className="text-sm">{formatNaira(item.product.price * item.quantity)}</p>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{item.color} · {item.size}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-border">
                            <button onClick={() => update(item.productId, item.size, item.color, item.quantity - 1)} className="p-2 hover:bg-muted" aria-label="Decrease">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center text-xs">{item.quantity}</span>
                            <button onClick={() => update(item.productId, item.size, item.color, item.quantity + 1)} className="p-2 hover:bg-muted" aria-label="Increase">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button onClick={() => remove(item.productId, item.size, item.color)} className="text-[11px] uppercase tracking-luxury text-muted-foreground hover:text-foreground">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border px-6 py-5">
                  <div className="flex justify-between text-sm">
                    <span className="uppercase tracking-luxury text-xs">Subtotal</span>
                    <span>{formatNaira(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Shipping & taxes calculated at checkout.</p>
                  <Link to="/checkout" onClick={() => setOpen(false)} className="mt-5 block w-full bg-foreground py-4 text-center text-xs uppercase tracking-luxury text-background hover:bg-foreground/90">
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
