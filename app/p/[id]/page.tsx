import { notFound } from "next/navigation";
import { getProduct, products } from "@/lib/catalog";
import { ProductView } from "./ProductView";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();
  return <ProductView product={product} />;
}
