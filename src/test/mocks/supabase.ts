import { vi } from "vitest";

/**
 * Chainable Supabase client mock. Every PostgREST builder method returns the
 * same object, and awaiting any of them resolves with `{ data: [], error: null }`.
 * Tests can override per-call with `setSupabaseResponse` or by stubbing
 * specific methods on the exported `supabase` mock.
 */

type AnyFn = (...args: unknown[]) => unknown;

let nextResponse: { data: unknown; error: unknown } = { data: [], error: null };
let nextMaybeSingle: { data: unknown; error: unknown } = { data: null, error: null };

export const setSupabaseResponse = (resp: { data: unknown; error?: unknown }) => {
  nextResponse = { data: resp.data, error: resp.error ?? null };
};
export const setSupabaseSingle = (resp: { data: unknown; error?: unknown }) => {
  nextMaybeSingle = { data: resp.data, error: resp.error ?? null };
};
export const resetSupabaseResponses = () => {
  nextResponse = { data: [], error: null };
  nextMaybeSingle = { data: null, error: null };
};

const makeBuilder = () => {
  const builder: Record<string, AnyFn> & PromiseLike<unknown> = {
    select: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    update: vi.fn(() => builder),
    upsert: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    neq: vi.fn(() => builder),
    in: vi.fn(() => builder),
    is: vi.fn(() => builder),
    gt: vi.fn(() => builder),
    gte: vi.fn(() => builder),
    lt: vi.fn(() => builder),
    lte: vi.fn(() => builder),
    like: vi.fn(() => builder),
    ilike: vi.fn(() => builder),
    or: vi.fn(() => builder),
    not: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    range: vi.fn(() => builder),
    match: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve(nextMaybeSingle)),
    maybeSingle: vi.fn(() => Promise.resolve(nextMaybeSingle)),
    throwOnError: vi.fn(() => builder),
    // PromiseLike so `await query` works
    then: (onFulfilled: AnyFn) => Promise.resolve(nextResponse).then(onFulfilled as never),
  } as never;
  return builder;
};

export const supabase = {
  from: vi.fn(() => makeBuilder()),
  rpc: vi.fn(() => Promise.resolve(nextResponse)),
  auth: {
    getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
    signInWithPassword: vi.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null })),
    signInWithOAuth: vi.fn(() => Promise.resolve({ data: null, error: null })),
    signUp: vi.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null })),
    signOut: vi.fn(() => Promise.resolve({ error: null })),
    resetPasswordForEmail: vi.fn(() => Promise.resolve({ data: null, error: null })),
    updateUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
  },
  functions: {
    invoke: vi.fn(() => Promise.resolve({ data: null, error: null })),
  },
  channel: vi.fn(() => {
    const ch: Record<string, AnyFn> = {
      on: vi.fn(() => ch),
      subscribe: vi.fn(() => ch),
      unsubscribe: vi.fn(() => Promise.resolve("ok")),
    };
    return ch;
  }),
  removeChannel: vi.fn(),
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(() => Promise.resolve({ data: { path: "" }, error: null })),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: "" } })),
      remove: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
};

// Install the mock globally for any module that imports the client.
vi.mock("@/integrations/supabase/client", () => ({ supabase }));
