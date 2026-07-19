import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { submitContact } from "@/lib/api/contact";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — Dripp" },
      { name: "description", content: "Visit our Lagos atelier or write to our private clienteling team." },
    ],
  }),
});

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await submitContact({ data: { name, email, message } });
    setLoading(false);
    if (res.ok) {
      setSent(true);
      setName(""); setEmail(""); setSubject(""); setMessage("");
    }
  };

  return (
    <div className="container-luxe py-16 md:py-24">
      <p className="text-[11px] uppercase tracking-luxury text-muted-foreground">Get In Touch</p>
      <h1 className="mt-4 text-4xl font-light md:text-6xl">Contact</h1>

      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-light">Visit the atelier</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md">
            Private appointments available Monday through Saturday. Walk-ins welcome at our flagship.
          </p>
          <div className="mt-8 space-y-5 text-sm">
            <div className="flex gap-4"><MapPin className="h-4 w-4 mt-0.5 text-gold" /><div><p>14 Bourdillon Road</p><p className="text-muted-foreground">Ikoyi, Lagos, Nigeria</p></div></div>
            <div className="flex gap-4"><Mail className="h-4 w-4 mt-0.5 text-gold" /><a href="mailto:hello@dripp.ng">hello@dripp.ng</a></div>
            <div className="flex gap-4"><Phone className="h-4 w-4 mt-0.5 text-gold" /><a href="tel:+2348000000000">+234 800 000 0000</a></div>
          </div>
          <div className="mt-8 aspect-[4/3] w-full bg-muted relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-luxury text-muted-foreground">
              Map · Ikoyi, Lagos
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <h2 className="text-2xl font-light">Write to us</h2>
          <div>
            <label className="text-[11px] uppercase tracking-luxury">Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground" />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-luxury">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground" />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-luxury">Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground" />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-luxury">Message</label>
            <textarea rows={6} required value={message} onChange={(e) => setMessage(e.target.value)} className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground" />
          </div>
          <button type="submit" disabled={loading} className="bg-foreground px-8 py-4 text-xs uppercase tracking-luxury text-background hover:bg-foreground/90 disabled:opacity-50">
            {loading ? "Sending…" : "Send Message"}
          </button>
          {sent && <p className="text-xs text-gold">Thank you. We'll be in touch within 24 hours.</p>}
        </form>
      </div>
    </div>
  );
}
