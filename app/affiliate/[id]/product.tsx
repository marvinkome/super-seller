"use client";
import React from "react";
import NextImage from "next/image";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useParams, useRouter } from "next/navigation";
import { addProductToSeller } from "./action";

const Product = ({ product }: any) => {
  const router = useRouter();
  const params = useParams();
  const [isLoading, startTransition] = React.useTransition();

  const title = product.properties["Name"]["title"][0].plain_text;
  const price = product.properties["Product Price"].number;
  const commision = product.properties["Commision"].number;
  const productImage = product.properties["Images"]["files"][0].file.url;

  const onAddProduct = () => {
    startTransition(() => {
      addProductToSeller({ productId: product.id, sellerId: params.id as string }).then(() => {
        router.refresh();
      });
    });
  };

  return (
    <div key={product.id} className="">
      <NextImage src={productImage} alt={title} width={320} height={320} className="w-full object-cover mb-2 rounded-md h-60" />
      <p className="text-lg font-medium">{title}</p>
      <p className="text-neutral-600 text-sm">
        Price: <span className="font-semibold">N{price}</span> (Commision: N{commision})
      </p>

      <button onClick={onAddProduct} className="mt-1 inline-flex items-center text-neutral-600 font-semibold hover:underline hover:text-neutral-700">
        Add to my product
        {isLoading && <AiOutlineLoading3Quarters className="animate-spin ml-2" />}
      </button>
    </div>
  );
};

export default Product;
