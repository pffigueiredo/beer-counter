import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

import { createBeerInputSchema } from './schema';
import { createBeer } from './handlers/create_beer';
import { getBeers } from './handlers/get_beers';
import { getBeerCount } from './handlers/get_beer_count';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Create a new beer entry
  createBeer: publicProcedure
    .input(createBeerInputSchema)
    .mutation(({ input }) => createBeer(input)),
  
  // Get all beer entries
  getBeers: publicProcedure
    .query(() => getBeers()),
  
  // Get total count of beers
  getBeerCount: publicProcedure
    .query(() => getBeerCount()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();