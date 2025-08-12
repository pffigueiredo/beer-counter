import { db } from '../db';
import { beersTable } from '../db/schema';
import { type Beer } from '../schema';

export const getBeers = async (): Promise<Beer[]> => {
  try {
    // Fetch all beers from the database
    const results = await db.select()
      .from(beersTable)
      .execute();

    // The results already have the correct shape, just return them
    return results;
  } catch (error) {
    console.error('Failed to fetch beers:', error);
    throw error;
  }
};