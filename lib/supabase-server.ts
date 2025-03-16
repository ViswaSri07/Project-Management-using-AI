import { createServerComponentClient as createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export function createServerComponentClient() {
  return createServerClient({ cookies })
}

