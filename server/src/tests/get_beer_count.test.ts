import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { beersTable } from '../db/schema';
import { getBeerCount } from '../handlers/get_beer_count';

describe('getBeerCount', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return count of 0 for empty database', async () => {
    const result = await getBeerCount();

    expect(result.count).toEqual(0);
    expect(typeof result.count).toBe('number');
  });

  it('should return count of 1 after inserting one beer', async () => {
    // Insert a test beer
    await db.insert(beersTable)
      .values({ name: 'Test IPA' })
      .execute();

    const result = await getBeerCount();

    expect(result.count).toEqual(1);
    expect(typeof result.count).toBe('number');
  });

  it('should return correct count for multiple beers', async () => {
    // Insert multiple test beers
    await db.insert(beersTable)
      .values([
        { name: 'Craft Lager' },
        { name: 'Hoppy Ale' },
        { name: 'Stout Beer' },
        { name: 'Wheat Beer' },
        { name: 'Pilsner' }
      ])
      .execute();

    const result = await getBeerCount();

    expect(result.count).toEqual(5);
    expect(typeof result.count).toBe('number');
  });

  it('should maintain correct count after adding more beers', async () => {
    // Insert initial beers
    await db.insert(beersTable)
      .values([
        { name: 'First Beer' },
        { name: 'Second Beer' }
      ])
      .execute();

    // Verify initial count
    let result = await getBeerCount();
    expect(result.count).toEqual(2);

    // Add more beers
    await db.insert(beersTable)
      .values([
        { name: 'Third Beer' },
        { name: 'Fourth Beer' },
        { name: 'Fifth Beer' }
      ])
      .execute();

    // Verify updated count
    result = await getBeerCount();
    expect(result.count).toEqual(5);
  });

  it('should return count structure matching BeerCount schema', async () => {
    // Insert some test data
    await db.insert(beersTable)
      .values([
        { name: 'Schema Test Beer 1' },
        { name: 'Schema Test Beer 2' }
      ])
      .execute();

    const result = await getBeerCount();

    // Verify the result structure matches the expected BeerCount type
    expect(result).toHaveProperty('count');
    expect(typeof result.count).toBe('number');
    expect(result.count).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(result.count)).toBe(true);
    expect(result.count).toEqual(2);
  });
});