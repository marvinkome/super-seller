import NextImage from "next/image";
import { notion } from "@/libs/notion";
import Link from "next/link";

type PageProps = {
  params: { id: string };
};
export default async function Page({ params }: PageProps) {
  const productDb = await notion.databases.query({
    database_id: "b13b5414196d435a87383a9dab1f6ef1",
  });

  return (
    <main className="h-full max-w-screen-lg mx-auto px-6 py-20">
      <header className="flex mb-10 justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold mb-1">All Products</h1>
          <p className="text-neutral-600">See all products available to sell</p>
        </div>

        <Link href={`/affiliate/${params.id}/my-products`} className="hover:underline">
          See my products
        </Link>
      </header>

      <div className="grid gap-4 grid-cols-3">
        {productDb.results.map((product: any) => {
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
