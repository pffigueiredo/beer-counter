import { db } from '../db';
import { beersTable } from '../db/schema';
import { sql } from 'drizzle-orm';
import { type BeerCount } from '../schema';

export const getBeerCount = async (): Promise<BeerCount> => {
  try {
    const result = await db.select({
      count: sql<number>`count(*)::int`
    })
    .from(beersTable)
    .execute();

    return {
      count: result[0].count
    };
  } catch (error) {
    console.error('Failed to get beer count:', error);
    throw error;
  }
};