import { createNextRouteHandler } from "@openpanel/nextjs/server";

/**
 * Analytics API Route Handler
 *
 * Proxy between the client-side analytics events and OpenPanel analytics service.
 * Forwards tracking events through the OpenpanelSdk instance configured in services/analytics.ts.
 *
 * @see {@link ../../../services/analytics.ts} for SDK configuration
 */

export const POST = createNextRouteHandler({});
