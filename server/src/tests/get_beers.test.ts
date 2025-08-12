import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { beersTable } from '../db/schema';
import { getBeers } from '../handlers/get_beers';

describe('getBeers', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no beers exist', async () => {
    const result = await getBeers();

    expect(result).toEqual([]);
  });

  it('should return all beers from database', async () => {
    // Insert test beers
    await db.insert(beersTable).values([
      { name: 'IPA' },
      { name: 'Stout' },
      { name: 'Lager' }
    ]).execute();

    const result = await getBeers();

    expect(result).toHaveLength(3);
    expect(result[0].name).toEqual('IPA');
    expect(result[1].name).toEqual('Stout');
    expect(result[2].name).toEqual('Lager');

    // Verify all beers have required fields
    result.forEach(beer => {
      expect(beer.id).toBeDefined();
      expect(typeof beer.id).toBe('number');
      expect(beer.name).toBeDefined();
      expect(typeof beer.name).toBe('string');
      expect(beer.created_at).toBeInstanceOf(Date);
    });
  });

  it('should return beers in insertion order', async () => {
    // Insert beers with specific names
    await db.insert(beersTable).values({ name: 'First Beer' }).execute();
    await db.insert(beersTable).values({ name: 'Second Beer' }).execute();
    await db.insert(beersTable).values({ name: 'Third Beer' }).execute();

    const result = await getBeers();

    expect(result).toHaveLength(3);
    expect(result[0].name).toEqual('First Beer');
    expect(result[1].name).toEqual('Second Beer');
    expect(result[2].name).toEqual('Third Beer');

    // Verify IDs are sequential
    expect(result[1].id).toBeGreaterThan(result[0].id);
    expect(result[2].id).toBeGreaterThan(result[1].id);
  });

  it('should return beers with proper timestamp handling', async () => {
    const beforeInsert = new Date();
    
    await db.insert(beersTable).values({ name: 'Test Beer' }).execute();
    
    const afterInsert = new Date();
    const result = await getBeers();

    expect(result).toHaveLength(1);
    const beer = result[0];
    
    // Verify timestamp is within expected range
    expect(beer.created_at).toBeInstanceOf(Date);
    expect(beer.created_at.getTime()).toBeGreaterThanOrEqual(beforeInsert.getTime());
    expect(beer.created_at.getTime()).toBeLessThanOrEqual(afterInsert.getTime());
  });

  it('should handle large number of beers', async () => {
    // Insert many beers
    const beerNames = Array.from({ length: 100 }, (_, i) => `Beer ${i + 1}`);
    const beerValues = beerNames.map(name => ({ name }));
    
    await db.insert(beersTable).values(beerValues).execute();

    const result = await getBeers();

    expect(result).toHaveLength(100);
    expect(result[0].name).toEqual('Beer 1');
    expect(result[99].name).toEqual('Beer 100');

    // Verify all have proper structure
    result.forEach((beer, index) => {
      expect(beer.id).toBeDefined();
      expect(beer.name).toEqual(`Beer ${index + 1}`);
      expect(beer.created_at).toBeInstanceOf(Date);
    });
  });
});