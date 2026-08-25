const { z } = require("zod");

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const upsertSectionSchema = z.object({
  data: z.record(z.string(), z.any()).or(z.array(z.any())),
});

const projectSchema = z.object({
  title: z.string().min(1),
  bodyText: z.string().min(1),
  image: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  links: z
    .array(
      z.object({
        text: z.string().min(1),
        href: z.string().min(1),
      })
    )
    .optional()
    .default([]),
  featured: z.boolean().optional().default(false),
  visible: z.boolean().optional(),
  githubId: z.number().int().optional(),
  githubName: z.string().optional(),
  order: z.number().int().optional().default(0),
});

const projectVisibilitySchema = z.object({
  visible: z.boolean(),
});

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional().default(""),
  excerpt: z.string().min(1),
  body: z.string().optional().default(""),
  date: z.coerce.date().optional().default(() => new Date()),
  tags: z.array(z.string()).optional().default([]),
  showOnHome: z.boolean().optional().default(false),
  published: z.boolean().optional().default(true),
  order: z.number().int().optional().default(0),
});

const postHomepageSchema = z.object({
  showOnHome: z.boolean(),
});

module.exports = {
  loginSchema,
  postHomepageSchema,
  postSchema,
  projectSchema,
  projectVisibilitySchema,
  upsertSectionSchema,
};
