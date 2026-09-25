import { assertTestDatabase } from "./src/lib/db/assertTestDatabase";

assertTestDatabase(process.env.DATABASE_URL);
