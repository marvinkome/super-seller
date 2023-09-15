import Link from "next/link";
import Product from "./product";
import { Pages, notion } from "@/libs/notion";

async function getProducts(sellerId: string) {
  const allProducts = await notion.databases.query({
    database_id: Pages.Products,
  });

  const sellerProducts = await notion.databases.query({
    database_id: Pages.SellerProduct,
    filter: {
      property: "Seller",
      relation: {
        contains: sellerId,
      },
    },
  });
  const sellerProductsIds = sellerProducts.results.map((product: any) => product.id);

  const products = allProducts.results.filter((product: any) => {
    const sellers = product.properties.Sellers.relation;
    return !sellers.some((seller: any) => sellerProductsIds.includes(seller.id));
  });

  return products;
}

type PageProps = {
  params: { id: string };
};
export default async function Page({ params }: PageProps) {
  const products = await getProducts(params.id);

  return (
    <main className="h-full max-w-screen-lg mx-auto px-6 py-12 sm:py-20">
      <header className="flex flex-col-reverse sm:flex-row mb-10 justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-semibold sm:mb-1">Available Products</h1>
          <p className="text-neutral-600">See all products available to sell</p>
        </div>

        <Link href={`/affiliate/${params.id}/my-products`} className="hover:underline text-sm text-neutral-500 mb-2 sm:mb-0">
          See my products
        </Link>
      </header>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {products.length === 0 && <p className="text-lg text-neutral-600">No products available</p>}

        {products.map((product: any) => (
          <Product key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
