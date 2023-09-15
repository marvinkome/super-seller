"use server";

import { notion, Pages } from "@/libs/notion";

export const addProductToSeller = async ({ sellerId, productId }: { sellerId: string; productId: string }) => {
  const product: any = await notion.pages.retrieve({ page_id: productId });
  const productTitle = product.properties.Name.title[0].plain_text;

  const seller: any = await notion.pages.retrieve({ page_id: sellerId });
  const sellerName = seller.properties.Name.title[0].plain_text;

  console.log({ productTitle, sellerName });

  await notion.pages.create({
    parent: {
      database_id: Pages.SellerProduct,
    },
    properties: {
      Title: {
        type: "title",
        title: [
          {
            type: "text",
            text: { content: `${sellerName} / ${productTitle}` },
          },
        ],
      },
      Seller: {
        type: "relation",
        relation: [
          {
            id: sellerId,
          },
        ],
      },
      Product: {
        type: "relation",
        relation: [
          {
            id: productId,
          },
        ],
      },
    },
  });

  return { done: true };
};
