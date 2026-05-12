import { notFound } from 'next/navigation';
import ProductPage from '@/components/ProductPage';

interface Variant {
  id: number;
  baseVariantId: number;
  color: string;
  size: string;
  price: number;
  sku: string;
}

interface Product {
  id: number;
  name: string;
  thumbnail: string;
  colors: Record<string, { image: string; variantId: number; images: string[] }>;
  sizes: string[];
  variants: Variant[];
}

async function getProducts(): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://loadoutlab.com';
  const res = await fetch(`${baseUrl}/api/products`, { next: { revalidate: 300 } });
  const data = await res.json();
  return data.products || [];
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({
    slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  }));
}

export default async function ShopProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProducts();
  const product = products.find(
    (p) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  );
  if (!product) notFound();
  return <ProductPage product={product} />;
}
