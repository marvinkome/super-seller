"use client";
import React from "react";
import cn from "classnames";
import { env } from "@/libs/env/client";
import { useRouter, useParams } from "next/navigation";
import { usePaystackPayment } from "react-paystack";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Form = ({ productName, amount }: { productName: string; amount: number }) => {
  const router = useRouter();
  const params = useParams();

  const [error, setError] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  const initializePayment = usePaystackPayment({
    reference: `${productName}-${params.id}-${Date.now()}`,
    email,
    amount,
    publicKey: env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: name,
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: phone,
        },
      ],
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    initializePayment(
      () => {
        router.push(`/${params.id}/success`);
      },
      () => setError("Something went wrong. Please try again")
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center justify-between mb-4 space-x-4">
        <div className="w-1/2">
          <label htmlFor="name" className="text-sm block mb-2 text-neutral-500 font-medium">
            Name
          </label>
          <input
            required
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(
              "w-full py-2 px-3 rounded-md text-md md:text-sm transition-colors ease-in duration-100 focus-within:outline-none",
              "placeholder:text-neutral-300 bg-transparent border border-neutral-400",
              "focus:border-neutral-500"
            )}
          />
        </div>

        <div className="w-1/2">
          <label htmlFor="email" className="text-sm block mb-2 text-neutral-500 font-medium">
            Email
          </label>
          <input
            required
            id="email"
            type="email"
            placeholder="johndoe@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              "w-full py-2 px-3 rounded-md text-md md:text-sm transition-colors ease-in duration-100 focus-within:outline-none",
              "placeholder:text-neutral-300 bg-transparent border border-neutral-400",
              "focus:border-neutral-500"
            )}
          />
        </div>
      </div>

      <div className="w-1/2 mb-4">
        <label htmlFor="phone" className="text-sm block mb-2 text-neutral-500 font-medium">
          Phone
        </label>
        <input
          required
          id="phone"
          type="tel"
          placeholder="0801234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={cn(
            "w-full py-2 px-3 rounded-md text-md md:text-sm transition-colors ease-in duration-100 focus-within:outline-none",
            "placeholder:text-neutral-300 bg-transparent border border-neutral-400",
            "focus:border-neutral-500"
          )}
        />
      </div>

      <button
        type="submit"
        className={cn(
          "ml-auto inline-flex items-center justify-center text-sm dark:font-medium rounded-lg px-4 py-2",
          "bg-neutral-900 text-white",
          "hover:bg-neutral-800 active:bg-neutral-700",
          "disabled:opacity-40 disabled:cursor-not-allowed"
        )}
      >
        Place Order
        {loading && <AiOutlineLoading3Quarters className="animate-spin ml-2" />}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </form>
  );
};

export default Form;
