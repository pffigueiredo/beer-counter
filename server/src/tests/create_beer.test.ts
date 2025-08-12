import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { beersTable } from '../db/schema';
import { type CreateBeerInput } from '../schema';
import { createBeer } from '../handlers/create_beer';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateBeerInput = {
  name: 'Test Beer'
};

describe('createBeer', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a beer', async () => {
    const result = await createBeer(testInput);

    // Basic field validation
    expect(result.name).toEqual('Test Beer');
    expect(result.id).toBeDefined();
    expect(typeof result.id).toBe('number');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save beer to database', async () => {
    const result = await createBeer(testInput);

    // Query using proper drizzle syntax
    const beers = await db.select()
      .from(beersTable)
      .where(eq(beersTable.id, result.id))
      .execute();

    expect(beers).toHaveLength(1);
    expect(beers[0].name).toEqual('Test Beer');
    expect(beers[0].id).toEqual(result.id);
    expect(beers[0].created_at).toBeInstanceOf(Date);
  });

  it('should create multiple beers with unique ids', async () => {
    const beer1 = await createBeer({ name: 'First Beer' });
    const beer2 = await createBeer({ name: 'Second Beer' });

    expect(beer1.id).not.toEqual(beer2.id);
    expect(beer1.name).toEqual('First Beer');
    expect(beer2.name).toEqual('Second Beer');

    // Verify both exist in database
    const allBeers = await db.select()
      .from(beersTable)
      .execute();

    expect(allBeers).toHaveLength(2);
    
    const beerNames = allBeers.map(beer => beer.name);
    expect(beerNames).toContain('First Beer');
    expect(beerNames).toContain('Second Beer');
  });

  it('should create beer with empty name when passed to handler directly', async () => {
    // Note: In real usage, empty names would be caught by Zod validation
    // at the API layer before reaching the handler. This test shows that
    // the handler itself accepts whatever input it receives.
    const result = await createBeer({ name: '' });

    expect(result.name).toEqual('');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);

    // Verify it was saved to database
    const savedBeer = await db.select()
      .from(beersTable)
      .where(eq(beersTable.id, result.id))
      .execute();

    expect(savedBeer[0].name).toEqual('');
  });

  it('should handle special characters in beer names', async () => {
    const specialNameInput: CreateBeerInput = {
      name: 'Café Brü & Co\'s "Special" Beer #1'
    };

    const result = await createBeer(specialNameInput);

    expect(result.name).toEqual('Café Brü & Co\'s "Special" Beer #1');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);

    // Verify it was saved correctly
    const savedBeer = await db.select()
      .from(beersTable)
      .where(eq(beersTable.id, result.id))
      .execute();

    expect(savedBeer[0].name).toEqual('Café Brü & Co\'s "Special" Beer #1');
  });
});