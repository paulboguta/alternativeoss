import { env } from "@/env";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config({ path: ".env" });

const sql = neon(env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
