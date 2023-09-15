import crypto from "crypto";
import { headers } from "next/headers";
import { env } from "@/libs/env/server";
import { NextResponse } from "next/server";
import { Pages, notion } from "@/libs/notion";

export async function POST(request: Request) {
  const body = await request.json();

  // validate webhook source
  const headersList = headers();
  const signature = headersList.get("x-paystack-signature");
  const hash = crypto.createHmac("sha512", env.PAYSTACK_SECRET_KEY).update(JSON.stringify(body)).digest("hex");
  if (hash !== signature) {
    return NextResponse.json({ done: true }, { status: 200 });
  }

  switch (body.event) {
    case "charge.success":
      const { reference } = body.data;
      const [, sellerProductId, ...rest] = reference.split("-").reverse();

      await notion.pages.create({
        parent: {
          database_id: Pages.Orders,
        },
        properties: {
          Reference: {
            type: "title",
            title: [
              {
                type: "text",
                text: { content: reference },
              },
            ],
          },
          "Seller-Product": {
            type: "relation",
            relation: [
              {
                id: sellerProductId,
              },
            ],
          },
          Status: {
            type: "select",
            select: {
              name: "Pending",
            },
          },
        },
      });
      break;
    default:
      console.warn("Webhook event not handled", body.event);
      break;
  }

  return NextResponse.json({ done: true }, { status: 200 });
}
