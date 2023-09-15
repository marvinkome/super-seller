import NextImage from "next/image";
import { notion, Pages } from "@/libs/notion";
import { notFound } from "next/navigation";
import { isFullPageOrDatabase } from "@notionhq/client";
import { getSellerObject } from "../util";

async function getSellerData(sellerId: string) {
  const seller = await getSellerObject(sellerId);

  let name = "";
  if (seller.properties["Name"].type === "title" && seller.properties["Name"].title) {
    name = seller.properties["Name"].title.map((t) => t.plain_text).join("");
  }

  let sellerProductIds: string[] = [];
  if (seller.properties["Seller-Products"].type === "relation") {
    sellerProductIds = (seller.properties["Seller-Products"].relation as any).map((r: any) => r.id);
  }

  let products = [];
  for (let sellerProductId of sellerProductIds) {
    const sellerProductsDb = await notion.pages.retrieve({
      page_id: sellerProductId,
    });

    if (!isFullPageOrDatabase(sellerProductsDb)) continue;

    let product;
    if (sellerProductsDb.properties["Product"].type === "relation") {
      product = await notion.pages.retrieve({
        page_id: sellerProductsDb.properties["Product"].relation[0].id,
      });
    }

    if (!product || !isFullPageOrDatabase(product)) continue;

    products.push(product);
  }

  return {
    name,
    products,
  };
}

type PageProps = {
  params: {
    id: string;
  };
};
export default async function Page(props: PageProps) {
  const { name, products } = await getSellerData(props.params.id);

  return (
    <main className="h-full max-w-screen-lg mx-auto px-6 py-20">
      <header className="mb-10">
        <p className="text-base text-neutral-500 mb-1">Hello {name}</p>
        <h1 className="text-3xl font-semibold">My Products</h1>
      </header>

      <div className="grid gap-4 grid-cols-3">
        {products.map((product: any) => {
          const title = product.properties["Name"]["title"][0].plain_text;
          const price = product.properties["Product Price"].number;
          const commision = product.properties["Commision"].number;
          const productImage = product.properties["Images"]["files"][0].file.url;

          return (
            <div key={product.id} className="">
              <NextImage src={productImage} alt={title} width={320} height={320} className="w-full object-cover mb-2 rounded-md h-60" />
              <p className="text-lg font-medium">{title}</p>
              <p className="text-neutral-600 text-sm">
                Price: <span className="font-semibold">N{price}</span> (Commision: N{commision})
              </p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
