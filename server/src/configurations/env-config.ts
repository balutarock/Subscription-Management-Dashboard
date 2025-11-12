import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envVarsSchema = z.object({
  NODE_ENV: z.enum(["local", "dev", "test", "production"]),
  PORT: z.string().default("3000").transform(Number).refine(Number.isInteger),
  DATABASE_URL: z.string().min(1),
  CLIENT_URL: z.string().min(1),
  API_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
});

type TEnvVars = z.infer<typeof envVarsSchema>;
let envVars: TEnvVars = {} as TEnvVars;

try {
  envVars = envVarsSchema.parse(process.env);
} catch (error: unknown) {
  if (error instanceof z.ZodError) {
    console.error("❌ Invalid environment variables:", error.issues);
  } else {
    console.error("❌ Invalid environment variables:", error);
  }
  process.exit(1);
}

const envConfig = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  clientUrl: envVars.CLIENT_URL,
  apiUrl: envVars.API_URL,
  jwtSecret: envVars.JWT_SECRET,
};

export default envConfig;
