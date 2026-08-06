const ADMIN_PHONE = "5492214778280";

export function getWhatsAppHref(message: string) {
  return `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`;
}
