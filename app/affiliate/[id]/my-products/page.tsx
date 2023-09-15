import NextImage from "next/image";
import Link from "next/link";
import { notion } from "@/libs/notion";
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
    const sellerProduct = await notion.pages.retrieve({
      page_id: sellerProductId,
    });

    if (!isFullPageOrDatabase(sellerProduct)) continue;

    let product;
    if (sellerProduct.properties["Product"].type === "relation") {
      product = await notion.pages.retrieve({
        page_id: sellerProduct.properties["Product"].relation[0].id,
      });
    }

    if (!product || !isFullPageOrDatabase(product)) continue;

    products.push({
      product,
      sellerProduct,
    });
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
    <main className="h-full max-w-screen-lg mx-auto px-6 py-12 sm:py-20">
      <header className="flex flex-col-reverse sm:flex-row mb-10 justify-between sm:items-center">
        <div>
          <p className="text-base text-neutral-500 sm:mb-1">Hello {name}</p>
          <h1 className="text-3xl font-semibold">My Products</h1>
        </div>

        <Link href={`/affiliate/${props.params.id}`} className="hover:underline text-sm text-neutral-500 mb-2 sm:mb-0">
          See all products
        </Link>
      </header>

      <div className="pb-20 grid gap-6 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        {products.map(({ sellerProduct, product }: any) => {
          const title = product.properties["Name"]["title"][0].plain_text;
          const price = product.properties["Product Price"].number;
          const commision = product.properties["Commision"].number;
          const productImage = product.properties["Images"]["files"][0].file.url;
          const link = sellerProduct.properties.Link.formula.string;

          return (
            <div key={product.id} className="">
              <NextImage src={productImage} alt={title} width={320} height={320} className="w-full object-cover mb-2 rounded-md h-60" />
              <p className="text-lg font-medium">{title}</p>
              <p className="text-neutral-600 text-sm">
                Price: <span className="font-semibold">N{price}</span> (Commision: N{commision})
              </p>
              <Link href={link} className="text-purple-500 text-sm hover:text-purple-700">
                Your affiliate product link
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
