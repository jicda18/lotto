import { file } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";

const lotteries = defineCollection({
  loader: file("src/data/lotteries.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    logo: z.string().nullable(),
    location: z.string(),
    createdAt: z.preprocess((val) => new Date(val as string), z.date()),
    deletedAt: z.preprocess(
      (val) => (val ? new Date(val as string) : null),
      z.date().nullable()
    ),
    links: z.object({
      self: z.string(),
      games: z.string(),
    }),
  }),
});

const lotteriesDescriptions = defineCollection({
  loader: file("src/data/lotteries-descriptions.json"),
  schema: z.object({
    id: z.string(),
    description: z.string(),
  }),
});

const games = defineCollection({
  loader: file("src/data/games.json"),
  schema: z.object({
    id: z.string(),
    lotteryId: reference("lotteries"),
    name: z.string(),
    slug: z.string(),
    logo: z.string().nullable(),
    resultTime: z.string(),
    resultRenderComponent: z.string(),
    createdAt: z.preprocess((val) => new Date(val as string), z.date()),
    deletedAt: z.preprocess(
      (val) => (val ? new Date(val as string) : null),
      z.date().nullable()
    ),
    links: z.object({
      self: z.string(),
      lottery: z.string(),
      results: z.string(),
    }),
  }),
});

export const collections = { lotteries, lotteriesDescriptions, games };
