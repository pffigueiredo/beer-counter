import { db } from '../db';
import { beersTable } from '../db/schema';
import { type Beer } from '../schema';

export const getBeers = async (): Promise<Beer[]> => {
  try {
    const results = await db.select()
      .from(beersTable)
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to get beers:', error);
    throw error;
  }
};