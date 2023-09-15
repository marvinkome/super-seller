import cn from "classnames";
import Link from "next/link";
import NextImage from "next/image";
import { notion } from "@/libs/notion";
import { isFullPageOrDatabase } from "@notionhq/client";
import { notFound } from "next/navigation";

async function getProduct(params: PageProps["params"]) {
  const sellerProduct = await notion.pages
    .retrieve({
      page_id: params.id,
    })
    .catch(() => {
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

type PageProps = {
  params: {
    id: string;
  };
};
const Page = async (props: PageProps) => {
  const product = await getProduct(props.params);

  const title = (product.properties["Name"] as any).title[0].plain_text;
  const price = (product.properties["Product Price"] as any).number;
  const description = (product.properties["Description"] as any).rich_text.map((r: any) => r.plain_text).join("");
  const productImages = (product.properties["Images"] as any).files;

  return (
    <main className="h-full max-w-screen-md mx-auto px-6 py-20">
      <header className="flex mb-4 justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold mb-1">{title}</h1>
          <p className="text-neutral-600">
            Price: <span className="font-semibold">N{price}</span>
          </p>
        </div>

        <Link
          href="/"
          className={cn(
            "w-auto inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ease-in duration-150",
            "text-neutral-600 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 dark:border dark:border-neutral-700",
            "hover:bg-[#f0f0f0] dark:hover:bg-[#333333] active:bg-neutral-200 dark:active:bg-neutral-700",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:bg-neutral-300"
          )}
        >
          Buy Now
        </Link>
      </header>

      <div className="mb-4">
        <p className="text-neutral-500">{description}</p>
      </div>

      <div className="">
        <h3 className="mb-2 text-lg">Images</h3>

        <div className="grid gap-4 grid-cols-3">
          {productImages.map((image: any) => (
            <NextImage
              key={image.name}
              src={image.file.url}
              alt={title}
              width={320}
              height={320}
              className="w-full object-cover mb-2 rounded-md h-60"
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Page;
