import { Client, LogLevel } from "@notionhq/client";
import { env } from "@/libs/env/server";

export const Pages = {
  Products: "b13b5414196d435a87383a9dab1f6ef1",
  Sellers: "ff6ae9e82ad54db9872d3a03404bcb66",
  SellerProduct: "",
};

export const notion = new Client({ auth: env.NOTION_API_SECRET, logLevel: LogLevel.ERROR });
