import cn from "classnames";
import NextImage from "next/image";
import { getProduct } from "../query";
import Form from "./form";

type PageProps = {
  params: {
    id: string;
  };
};
const Page = async (props: PageProps) => {
  const product = await getProduct(props.params.id);

  const title = (product.properties["Name"] as any).title[0].plain_text;
  const price = (product.properties["Product Price"] as any).number;
  const productImages = (product.properties["Images"] as any).files;

  return (
    <div className="h-full bg-purple-100">
      <main className="h-full max-w-screen-md mx-auto px-2 py-20">
        <div className="bg-neutral px-8 py-8 bg-neutral-50 h-full rounded-lg">
          <header className="flex mb-6 justify-between items-center">
            <h1 className="text-3xl font-semibold mb-1">Checkout</h1>
          </header>

          <section className="mb-4 flex justify-between">
            <div className="w-1/2">
              <h2 className="text-lg font-medium">{title}</h2>
              <p className="text-sm text-neutral-500">N{price}</p>
            </div>

            <div className="flex space-x-4">
              {productImages.map((image: any) => (
                <NextImage
                  key={image.name}
                  src={image.file.url}
                  alt={title}
                  width={320}
                  height={320}
                  className="object-cover mb-2 rounded-md w-14 h-14"
                />
              ))}
            </div>
          </section>

          <Form productName={title} amount={parseInt(price || "0", 0) * 100} />
        </div>
      </main>
    </div>
  );
};

export default Page;
