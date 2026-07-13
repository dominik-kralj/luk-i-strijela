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
  stripePriceId: string | null;
}

export interface SiteData {
  opg: Opg;
  products: Product[];
}

const data = raw as SiteData;

export const opg: Opg = data.opg;
export const products: Product[] = data.products;

export const categories: string[] = [...new Set(products.map((p) => p.category))];

const productImages = import.meta.glob<{ default: import('astro').ImageMetadata }>(
  '../assets/products/*.svg',
  { eager: true }
);

export function getProductImage(fileName: string) {
  const entry = productImages[`../assets/products/${fileName}`];
  if (!entry) {
    throw new Error(`Product image not found: ${fileName}. Add it to src/assets/products/.`);
  }
  return entry.default;
}
