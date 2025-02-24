import { env } from "@/env";
import * as screenshotone from "screenshotone-api-sdk";

const { SCREENSHOTONE_ACCESS_KEY, SCREENSHOTONE_SECRET_KEY } = env;

export const screenshotOneClient = new screenshotone.Client(
  SCREENSHOTONE_ACCESS_KEY,
  SCREENSHOTONE_SECRET_KEY
);
