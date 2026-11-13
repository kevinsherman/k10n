import { getCollection } from "astro:content";
export const review = import.meta.env.REVIEW_DRAFTS === "true";
export const notes = async () =>
  (await getCollection("notes"))
    .filter((n) => !n.data.draft || review)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
