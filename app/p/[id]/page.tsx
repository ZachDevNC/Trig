import { notFound } from "next/navigation";
import { frames, getFrame } from "@/lib/catalog";
import { ProductView } from "./ProductView";

export function generateStaticParams() {
  return frames.map((f) => ({ id: f.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const frame = getFrame(id);
  if (!frame) notFound();
  return <ProductView frame={frame} />;
}
