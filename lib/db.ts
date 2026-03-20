import { PrismaClient } from "@prisma/client";
import { getRequestContext } from "@cloudflare/next-on-pages";

let _client: PrismaClient | undefined;

async function getClientAsync(): Promise<PrismaClient> {
  if (_client) return _client;

  // Dynamic imports so pg is NOT evaluated during Next.js edge build sandbox.
  // At Cloudflare Workers runtime, nodejs_compat provides pg's Node.js deps (crypto, net, tls…).
  const [{ Pool }, { PrismaPg }] = await Promise.all([
    import("pg"),
    import("@prisma/adapter-pg"),
  ]);

  let connectionString = process.env.DATABASE_URL!;
  try {
    const { env } = getRequestContext();
    const hyperdrive = (env as Record<string, { connectionString?: string }>).HYPERDRIVE;
    if (hyperdrive?.connectionString) {
      connectionString = hyperdrive.connectionString;
    }
  } catch {
    // Not in Cloudflare context — use DATABASE_URL (local dev)
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  _client = new PrismaClient({ adapter });
  return _client;
}

// Double Proxy:
//   prisma.article.findMany(...)  → outer gets "article" → inner gets "findMany" → async call
//   prisma.$connect()             → outer gets "$connect" → callable proxy is called → async call
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const strProp = String(prop);
    // Prevent prisma from being accidentally treated as a Promise
    if (strProp === "then" || strProp === "catch" || strProp === "finally") return undefined;

    // Callable so prisma.$connect() / prisma.$transaction() work
    const callable = async (...args: unknown[]) => {
      const client = await getClientAsync();
      return (client as any)[strProp](...args);
    };

    // Also chainable so prisma.article.findMany() works
    return new Proxy(callable, {
      get(_fn, method: string | symbol) {
        return async (...args: unknown[]) => {
          const client = await getClientAsync();
          return (client as any)[strProp][String(method)](...args);
        };
      },
    });
  },
});
