import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useBrandStore } from "@/store/useBrandStore";
import { formatNaira } from "@/data/products";

export const Route = createFileRoute("/checkout")({
  component: Checkout,
  head: () => ({ meta: [{ title: "Checkout" }] }),
});

const STEPS = ["Information", "Delivery", "Review"] as const;

function Checkout() {
  const cart = useStore((s) => s.cart);
  const subtotal = useStore((s) => s.cartSubtotal());
  const brand = useBrandStore();
  const [step, setStep] = useState(0);
  const [info, setInfo] = useState({ name: "", email: "", phone: "", address: "", city: brand.deliveryLocations[0] ?? "Lagos" });
  const [placed, setPlaced] = useState(false);

  const shipping = subtotal > 200000 ? 0 : 5000;
  const total = subtotal + shipping;

  const whatsappOrder = () => {
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
    setPlaced(true);
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container-luxe py-32 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center bg-foreground text-background">
          <Check className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-light">Order placed</h1>
        <p className="mt-3 text-sm text-muted-foreground">We've opened WhatsApp to confirm your order with our team. You'll hear back within minutes.</p>
        <Link to="/" className="mt-8 inline-block border border-border px-6 py-3 text-xs uppercase tracking-luxury hover:border-foreground">Back to Home</Link>
      </motion.div>
    );
  }

  return (
    <div className="container-luxe py-12 md:py-20">
      <h1 className="text-3xl font-light md:text-4xl">Checkout</h1>

      {/* Stepper */}
      <div className="mt-8 flex items-center gap-3">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`flex h-7 w-7 items-center justify-center text-xs ${i <= step ? "bg-foreground text-background" : "border border-border"}`}>{i + 1}</div>
            <span className={`text-[11px] uppercase tracking-luxury ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < STEPS.length - 1 && <span className="h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {step === 0 && (
            <div className="space-y-4">
              <Field label="Full name"><input className={inp} value={info.name} onChange={(e) => setInfo({ ...info, name: e.target.value })} /></Field>
              <Field label="Email"><input type="email" className={inp} value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} /></Field>
              <Field label="Phone (WhatsApp)"><input type="tel" className={inp} value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} /></Field>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <Field label="Address"><input className={inp} value={info.address} onChange={(e) => setInfo({ ...info, address: e.target.value })} /></Field>
              <Field label="City">
                <select className={inp} value={info.city} onChange={(e) => setInfo({ ...info, city: e.target.value })}>
                  {brand.deliveryLocations.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <p className="text-xs text-muted-foreground">Delivery 2–5 business days. Free over ₦200,000.</p>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-3 border border-border p-6 text-sm">
              <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Review</p>
              <p>{info.name} · {info.email} · {info.phone}</p>
              <p>{info.address}, {info.city}</p>
              <p className="pt-3 text-xs text-muted-foreground">We confirm and process every order via WhatsApp for the most personal service.</p>
            </div>
          )}

          <div className="flex justify-between gap-2">
            {step > 0 && <button onClick={() => setStep(step - 1)} className="border border-border px-6 py-3 text-xs uppercase tracking-luxury hover:border-foreground">Back</button>}
            {step < 2 ? (
              <button onClick={() => setStep(step + 1)} className="ml-auto bg-foreground px-8 py-3 text-xs uppercase tracking-luxury text-background hover:bg-foreground/90">Continue</button>
            ) : (
              <button onClick={whatsappOrder} className="ml-auto inline-flex items-center gap-2 bg-[#25D366] px-8 py-3 text-xs uppercase tracking-luxury text-white hover:opacity-90">
                <MessageCircle className="h-4 w-4" /> Place Order via WhatsApp
              </button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="border border-border p-6">
          <h2 className="text-[11px] uppercase tracking-luxury text-muted-foreground">Order Summary</h2>
          <ul className="mt-4 space-y-3">
            {cart.map((i) => (
              <li key={`${i.productId}-${i.size}-${i.color}`} className="flex gap-3 text-sm">
                <img src={i.product.images[0]} alt="" className="h-16 w-14 object-cover" />
                <div className="flex-1">
                  <p>{i.product.name}</p>
                  <p className="text-xs text-muted-foreground">{i.color} · {i.size} · ×{i.quantity}</p>
                </div>
                <p>{formatNaira(i.product.price * i.quantity)}</p>
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
  );
}

const inp = "w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-foreground";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1 block text-[10px] uppercase tracking-luxury text-muted-foreground">{label}</span>{children}</label>;
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return <div className={`flex justify-between ${bold ? "font-medium" : ""}`}><span>{label}</span><span>{value}</span></div>;
}
