// Floating WhatsApp CTA — uses brand-configured number
import { useBrandStore } from "@/store/useBrandStore";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const phone = useBrandStore((s) => s.whatsapp.replace(/[^0-9]/g, ""));
  const name = useBrandStore((s) => s.name);
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(`Hi ${name}, I'd like to enquire about a piece.`)}`;
  return (
    <a
      href={url} target="_blank" rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-24 left-4 z-30 flex h-12 w-12 items-center justify-center bg-[#25D366] text-white shadow-lg transition hover:scale-105 md:bottom-6"
      style={{ borderRadius: "999px" }}
    >
      <MessageCircle className="h-5 w-5" />
    </a>
  );
}
