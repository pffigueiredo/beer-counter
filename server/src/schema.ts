import { z } from 'zod';

// Beer schema for database records
export const beerSchema = z.object({
  id: z.number(),
  name: z.string(),
  created_at: z.coerce.date() // Automatically converts string timestamps to Date objects
});

export type Beer = z.infer<typeof beerSchema>;

// Input schema for creating beers
export const createBeerInputSchema = z.object({
  name: z.string().min(1, "Beer name cannot be empty") // Ensure non-empty name
});

export type CreateBeerInput = z.infer<typeof createBeerInputSchema>;

// Schema for beer count response
export const beerCountSchema = z.object({
  count: z.number().int().nonnegative()
});

export type BeerCount = z.infer<typeof beerCountSchema>;