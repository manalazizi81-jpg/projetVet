const googleMapsUrl = "https://www.google.com/maps/place/Cabinet+v%C3%A9t%C3%A9rinaire+Atlas+Marrakech/@31.6497529,-8.0108227,17z/data=!4m6!3m5!1s0xdafef730df73fe1:0x2466a5cf74101c7d!8m2!3d31.6497529!4d-8.0082478!16s%2Fg%2F11zfgx76r6";

/** Informations publiques validées par le cabinet. */
export const clinic = {
  name: "Cabinet Vétérinaire Atlas Marrakech",
  googleMapsUrl,
  googleReviewUrl: process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || googleMapsUrl,
  phoneDisplay: "06 62 12 08 78",
  phoneE164: "+212662120878",
  whatsappNumber: "212662120878",
  address: "Près de SINKO, avenue Mouzdalifa, rue Bir Ami, Marrakech 40000",
  services: [
    "Consultation",
    "Hospitalisation",
    "Urgences",
    "Radiologie",
    "Analyses biologiques",
    "Chirurgie",
    "Toilettage",
    "Garde",
    "Dentisterie",
  ],
} as const;

export const clinicWhatsAppUrl = (message?: string) =>
  `https://wa.me/${clinic.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
