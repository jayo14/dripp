import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MessageCircle, CreditCard, Loader2, X } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useBrandStore } from "@/store/useBrandStore";
import { useOrderStore, type OrderItem } from "@/store/useOrderStore";
import { formatNaira } from "@/data/products";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({ meta: [{ title: "Checkout — Dripp" }] }),
});

const STEPS = ["Information", "Delivery", "Review"] as const;

function Checkout() {
  const navigate = useNavigate();
  const cart = useStore((s) => s.cart);
  const subtotal = useStore((s) => s.cartSubtotal());
  const clearCart = useStore((s) => s.setCartOpen);
  const brand = useBrandStore();
  const placeOrder = useOrderStore((s) => s.placeOrder);

  const [step, setStep] = useState(0);
  const [info, setInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: brand.deliveryLocations[0] ?? "Lagos",
  });
  const [paymentMode, setPaymentMode] = useState<"whatsapp" | "card">("whatsapp");
  const [placed, setPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  // Dummy payment modal
  const [payModal, setPayModal] = useState(false);
  const [paying, setPaying] = useState(false);
  const [cardInfo, setCardInfo] = useState({ number: "4242 4242 4242 4242", expiry: "12/28", cvv: "123", name: "" });

  const shipping = subtotal > 200000 ? 0 : 5000;
  const total = subtotal + shipping;

  const buildOrderItems = (): OrderItem[] =>
    cart.map((i) => ({
      productId: i.productId,
      name: i.product.name,
      price: i.product.price,
      size: i.size,
      color: i.color,
      quantity: i.quantity,
      image: i.product.images[0],
    }));

  const completeOrder = (method: "whatsapp" | "card") => {
    const order = placeOrder({
      customer: info,
      items: buildOrderItems(),
      subtotal,
      shipping,
      total,
      paymentMethod: method,
    });
    useStore.setState({ cart: [] });
    setPlacedOrderId(order.id);
    setPlaced(true);
  };

  const placeViaWhatsApp = () => {
    const lines = [
      `*New order — ${brand.name}*`,
      "",
      `Customer: ${info.name}`,
      `Phone: ${info.phone}`,
      `Email: ${info.email}`,
      `Deliver to: ${info.address}, ${info.city}`,
      "",
      "*Items:*",
      ...cart.map((i) => `• ${i.product.name} (${i.color}/${i.size}) ×${i.quantity} — ${formatNaira(i.product.price * i.quantity)}`),
      "",
      `Subtotal: ${formatNaira(subtotal)}`,
      `Shipping: ${shipping === 0 ? "Free" : formatNaira(shipping)}`,
      `*Total: ${formatNaira(total)}*`,
    ];
    const url = `https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank");
    completeOrder("whatsapp");
  };

  const handleDummyPay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPayModal(false);
      completeOrder("card");
    }, 2000);
  };

  if (cart.length === 0 && !placed) {
    return (
      <div className="container-luxe py-32 text-center">
        <h1 className="text-3xl font-light">Your bag is empty</h1>
        <Link to="/shop" className="mt-6 inline-block border border-border px-6 py-3 text-xs uppercase tracking-luxury hover:border-foreground">
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (placed) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container-luxe py-20 text-center md:py-32">
        <div className="mx-auto flex h-16 w-16 items-center justify-center bg-foreground text-background">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-light">Order placed!</h1>
        <p className="mt-2 font-mono text-sm text-muted-foreground">
          {placedOrderId}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          {paymentMode === "card"
            ? "Payment successful. We'll send tracking updates to your email."
            : "We've opened WhatsApp to confirm your order. You'll hear back within minutes."}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/tracking"
            search={{ id: placedOrderId ?? undefined } as any}
            className="inline-flex items-center gap-2 bg-foreground px-6 py-3 text-xs uppercase tracking-luxury text-background hover:bg-foreground/90"
          >
            Track Order
          </Link>
          <Link to="/" className="inline-block border border-border px-6 py-3 text-xs uppercase tracking-luxury hover:border-foreground">
            Back to Home
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <div className="container-luxe py-12 md:py-20">
        <h1 className="text-3xl font-light md:text-4xl">Checkout</h1>

        {/* Stepper */}
        <div className="mt-8 flex items-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`flex h-7 w-7 items-center justify-center text-xs ${i <= step ? "bg-foreground text-background" : "border border-border"}`}
              >
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`text-[11px] uppercase tracking-luxury ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                {s}
              </span>
              {i < STEPS.length - 1 && <span className="h-px w-8 bg-border" />}
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {/* Step 0: Information */}
            {step === 0 && (
              <div className="space-y-4">
                <Field label="Full name">
                  <input className={inp} value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} />
                </Field>
                <Field label="Email">
                  <input type="email" className={inp} value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
                </Field>
                <Field label="Phone (WhatsApp)">
                  <input type="tel" className={inp} value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
                </Field>
              </div>
            )}

            {/* Step 1: Delivery */}
            {step === 1 && (
              <div className="space-y-4">
                <Field label="Address">
                  <input className={inp} value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })} />
                </Field>
                <Field label="City">
                  <select className={inp} value={info.city} onChange={(e) => setInfo({ ...info, city: e.target.value })}>
                    {brand.deliveryLocations.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
                <p className="text-xs text-muted-foreground">Delivery 2–5 business days. Free over ₦200,000.</p>
              </div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="border border-border p-6 text-sm">
                  <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Contact</p>
                  <p className="mt-1">{info.name} · {info.email} · {info.phone}</p>
                  <p className="mt-1">{info.address}, {info.city}</p>
                </div>

                {/* Payment method */}
                <div>
                  <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Payment method</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => setPaymentMode("whatsapp")}
                      className={`flex items-center gap-3 border p-4 text-left text-sm transition ${
                        paymentMode === "whatsapp" ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground"
                      }`}
                    >
                      <MessageCircle className="h-5 w-5 shrink-0 text-[#25D366]" />
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <p className="text-xs text-muted-foreground">Pay on delivery via WhatsApp</p>
                      </div>
                    </button>
                    <button
                      onClick={() => setPaymentMode("card")}
                      className={`flex items-center gap-3 border p-4 text-left text-sm transition ${
                        paymentMode === "card" ? "border-foreground bg-foreground/5" : "border-border hover:border-foreground"
                      }`}
                    >
                      <CreditCard className="h-5 w-5 shrink-0 text-foreground" />
                      <div>
                        <p className="font-medium">Card payment</p>
                        <p className="text-xs text-muted-foreground">Pay now with any card</p>
                      </div>
                    </button>
                  </div>
                </div>

                {paymentMode === "whatsapp" && (
                  <p className="text-xs text-muted-foreground">
                    We confirm and process every order via WhatsApp for the most personal service.
                  </p>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between gap-2">
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="border border-border px-6 py-3 text-xs uppercase tracking-luxury hover:border-foreground">
                  Back
                </button>
              )}
              {step < 2 ? (
                <button onClick={() => setStep(step + 1)} className="ml-auto bg-foreground px-8 py-3 text-xs uppercase tracking-luxury text-background hover:bg-foreground/90">
                  Continue
                </button>
              ) : paymentMode === "whatsapp" ? (
                <button onClick={placeViaWhatsApp} className="ml-auto inline-flex items-center gap-2 bg-[#25D366] px-8 py-3 text-xs uppercase tracking-luxury text-white hover:opacity-90">
                  <MessageCircle className="h-4 w-4" /> Place Order via WhatsApp
                </button>
              ) : (
                <button onClick={() => setPayModal(true)} className="ml-auto inline-flex items-center gap-2 bg-foreground px-8 py-3 text-xs uppercase tracking-luxury text-background hover:bg-foreground/90">
                  <CreditCard className="h-4 w-4" /> Pay {formatNaira(total)}
                </button>
              )}
            </div>
          </div>

          {/* Summary */}
          <aside className="border border-border p-6 h-fit">
            <h2 className="text-[11px] uppercase tracking-luxury text-muted-foreground">Order Summary</h2>
            <ul className="mt-4 space-y-3">
              {cart.map((i) => (
                <li key={`${i.productId}-${i.size}-${i.color}`} className="flex gap-3 text-sm">
                  <img src={i.product.images[0]} alt="" className="h-16 w-14 shrink-0 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{i.product.name}</p>
                    <p className="text-xs text-muted-foreground">{i.color} · {i.size} · ×{i.quantity}</p>
                  </div>
                  <p className="whitespace-nowrap">{formatNaira(i.product.price * i.quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
              <Row label="Subtotal" value={formatNaira(subtotal)} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : formatNaira(shipping)} />
              <Row label="Total" value={formatNaira(total)} bold />
            </div>
          </aside>
        </div>
      </div>

      {/* Dummy payment modal */}
      <AnimatePresence>
        {payModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-xl sm:p-8"
            >
              <button onClick={() => !paying && setPayModal(false)} className="absolute right-4 top-4 p-1 text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6 flex items-center gap-3">
                <CreditCard className="h-6 w-6" />
                <h2 className="text-lg font-light">Card payment</h2>
              </div>

              <p className="mb-2 text-xs text-muted-foreground">
                This is a <strong>demo payment</strong>. No real charges will be made.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-luxury text-muted-foreground">Card number</label>
                  <input
                    className={inp}
                    value={cardInfo.number}
                    onChange={(e) => setCardInfo({ ...cardInfo, number: e.target.value })}
                    placeholder="4242 4242 4242 4242"
                    disabled={paying}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-luxury text-muted-foreground">Expiry</label>
                    <input
                      className={inp}
                      value={cardInfo.expiry}
                      onChange={(e) => setCardInfo({ ...cardInfo, expiry: e.target.value })}
                      placeholder="MM/YY"
                      disabled={paying}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] uppercase tracking-luxury text-muted-foreground">CVV</label>
                    <input
                      className={inp}
                      value={cardInfo.cvv}
                      onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                      placeholder="123"
                      disabled={paying}
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-[10px] uppercase tracking-luxury text-muted-foreground">Name on card</label>
                  <input
                    className={inp}
                    value={cardInfo.name}
                    onChange={(e) => setCardInfo({ ...cardInfo, name: e.target.value })}
                    placeholder="John Doe"
                    disabled={paying}
                  />
                </div>

                <button
                  onClick={handleDummyPay}
                  disabled={paying}
                  className="flex w-full items-center justify-center gap-2 bg-foreground px-6 py-3 text-xs uppercase tracking-luxury text-background hover:bg-foreground/90 disabled:opacity-60"
                >
                  {paying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                    </>
                  ) : (
                    <>Pay {formatNaira(total)}</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

const inp = "w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-foreground";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-luxury text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-medium" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
