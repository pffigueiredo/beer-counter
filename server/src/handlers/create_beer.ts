import { db } from '../db';
import { beersTable } from '../db/schema';
import { type CreateBeerInput, type Beer } from '../schema';

export const createBeer = async (input: CreateBeerInput): Promise<Beer> => {
  try {
    // Insert beer record
    const result = await db.insert(beersTable)
      .values({
        name: input.name
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Beer creation failed:', error);
    throw error;
  }
};