import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const restaurantRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        address: z.string(),
        osmNodeId: z.string(),
        rating: z.number().min(1).max(5).optional(),
        tags: z.array(z.string()).optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.restaurant.create({
        data: {
          name: input.name,
          address: input.address,
          osmNodeId: input.osmNodeId,
          rating: input.rating,
          notes: input.notes,
          userId: ctx.user.id,
          tags: {
            connectOrCreate: input.tags?.map((tag) => ({
              where: {
                name_userId: {
                  name: tag,
                  userId: ctx.user.id,
                },
              },
              create: {
                name: tag,
                userId: ctx.user.id,
              },
            })),
          },
        },
      });
    }),

  getRecent: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.restaurant.findMany({
      where: {
        userId: ctx.user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 10,
      include: {
        tags: true,
      },
    });
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.findUnique({
        where: { id: input },
        include: { tags: true },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      if (restaurant.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to view this restaurant",
        });
      }

      return restaurant;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        address: z.string(),
        rating: z.number().min(1).max(5).optional(),
        tags: z.array(z.string()),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.findUnique({
        where: { id: input.id },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      if (restaurant.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to update this restaurant",
        });
      }

      return ctx.db.restaurant.update({
        where: { id: input.id },
        data: {
          name: input.name,
          address: input.address,
          rating: input.rating,
          notes: input.notes,
          tags: {
            set: [], // Remove all existing tags
            connectOrCreate: input.tags.map((tag) => ({
              where: {
                name_userId: {
                  name: tag,
                  userId: ctx.user.id,
                },
              },
              create: {
                name: tag,
                userId: ctx.user.id,
              },
            })),
          },
        },
        include: {
          tags: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const restaurant = await ctx.db.restaurant.findUnique({
        where: { id: input },
      });

      if (!restaurant) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Restaurant not found",
        });
      }

      if (restaurant.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not authorized to delete this restaurant",
        });
      }

      return ctx.db.restaurant.delete({
        where: { id: input },
      });
    }),
});
