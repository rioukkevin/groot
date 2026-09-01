import type { CollectionConfig } from "payload";

/**
 * Admin accounts. There is no public route into this: `create` is restricted
 * to existing admins and the first user is made by the seed script, so the
 * usual "first visitor becomes owner" hole is closed.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 60 * 60 * 2,
    // Lock the account after repeated failures rather than letting a
    // dictionary run indefinitely.
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    useAPIKey: false,
    depth: 0,
    cookies: {
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
  admin: { useAsTitle: "email", defaultColumns: ["email", "name", "updatedAt"] },
  access: {
    // Nobody self-registers; an admin creates the next admin.
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "totpSecret",
      type: "text",
      admin: { readOnly: true, description: "Set during 2FA enrolment." },
      access: { read: () => false, update: () => false },
    },
    {
      name: "totpEnabled",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Require a one-time code at login." },
    },
  ],
};
