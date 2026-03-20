import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { getRequestContext } from "@cloudflare/next-on-pages";

let _client: PrismaClient | undefined;

function getClient(): PrismaClient {
  if (_client) return _client;

  let connectionString = process.env.DATABASE_URL!;

  try {
    // In Cloudflare Workers/Pages, use Hyperdrive binding for the connection string.
    // getRequestContext() throws outside of a Cloudflare request — the catch handles that.
    const { env } = getRequestContext();
    const hyperdrive = (env as Record<string, { connectionString?: string }>).HYPERDRIVE;
    if (hyperdrive?.connectionString) {
      connectionString = hyperdrive.connectionString;
    }
  } catch {
    // Not in Cloudflare context — fall back to DATABASE_URL (local dev)
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  _client = new PrismaClient({ adapter });
  return _client;
}

// Proxy ensures getClient() (and therefore getRequestContext()) is only called
// during a request, not at module-init time.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return getClient()[prop as keyof PrismaClient];
  },
});
