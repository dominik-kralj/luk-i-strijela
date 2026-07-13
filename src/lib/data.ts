import raw from '../data/luk-i-strijela.json';

export interface Contact {
  phone: string;
  email: string;
}

export interface Social {
  instagram?: string;
  facebook?: string;
}

export interface Opg {
  name: string;
  slug: string;
  tagline: string;
  story: string;
  location: string;
  deliveryArea: string;
  heroImages: string[];
  contact: Contact;
  social?: Social;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  description: string;
  available: boolean;
  growingStory: string;
  processImages: string[];
  stripePriceId: string | null;
}

export interface SiteData {
  opg: Opg;
  products: Product[];
}

const data = raw as SiteData;

export const opg: Opg = data.opg;
export const products: Product[] = data.products;

export const availableProducts: Product[] = products.filter((p) => p.available);

export const categories: string[] = [...new Set(availableProducts.map((p) => p.category))];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

type ImageModule = { default: import('astro').ImageMetadata };

const productImages = import.meta.glob<ImageModule>('../assets/products/*.{svg,jpg,jpeg,png}', {
  eager: true,
});
const photoImages = import.meta.glob<ImageModule>('../assets/photos/*.{svg,jpg,jpeg,png}', {
  eager: true,
});

export function getProductImage(fileName: string) {
  const entry = productImages[`../assets/products/${fileName}`];
  if (!entry) {
    throw new Error(`Product image not found: ${fileName}. Add it to src/assets/products/.`);
  }
  return entry.default;
}

export function getPhotoImage(fileName: string) {
  const entry = photoImages[`../assets/photos/${fileName}`];
  if (!entry) {
    throw new Error(`Photo not found: ${fileName}. Add it to src/assets/photos/.`);
  }
  return entry.default;
}
