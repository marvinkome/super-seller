import { notion } from "@/libs/notion";
import { isFullPageOrDatabase } from "@notionhq/client";
import { notFound } from "next/navigation";

export async function getProduct(id: string) {
  const sellerProduct = await notion.pages.retrieve({ page_id: id }).catch(() => {
    return undefined;
  });

  if (!sellerProduct || !isFullPageOrDatabase(sellerProduct)) return notFound();

  const productId = (sellerProduct.properties["Product"] as any).relation?.[0]?.id;
  if (!productId) return notFound();

  const product = await notion.pages.retrieve({ page_id: productId }).catch(() => {
    return undefined;
  });
  if (!product || !isFullPageOrDatabase(product)) return notFound();

  return product;
}
