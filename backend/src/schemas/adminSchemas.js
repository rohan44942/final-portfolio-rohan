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
  order: z.number().int().optional().default(0),
});

module.exports = {
  loginSchema,
  upsertSectionSchema,
  projectSchema,
};
