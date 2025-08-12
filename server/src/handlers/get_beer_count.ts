import { db } from '../db';
import { beersTable } from '../db/schema';
import { type BeerCount } from '../schema';
import { count } from 'drizzle-orm';

export const getBeerCount = async (): Promise<BeerCount> => {
  try {
    // Count all beer records using drizzle's count function
    const result = await db.select({
      count: count()
    })
    .from(beersTable)
    .execute();

    return {
      count: result[0].count
    };
  } catch (error) {
    console.error('Beer count query failed:', error);
    throw error;
  }
};