import { Client } from "@notionhq/client";
import { env } from "@/libs/env/server";

export const notion = new Client({ auth: env.NOTION_API_SECRET });
