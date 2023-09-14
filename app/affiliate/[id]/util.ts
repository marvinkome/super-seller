import { notion } from "@/libs/notion";
import { isFullPageOrDatabase } from "@notionhq/client";
import { notFound } from "next/navigation";
import { cache } from "react";

export const getSellerObject = cache(async (id: string) => {
  try {
    const page = await notion.pages.retrieve({
      page_id: id,
    });

    if (!isFullPageOrDatabase(page)) {
      return notFound();
    }

    return page;
  } catch (e) {
    return notFound();
  }
});
