import { env } from "@/env";

import { OpenPanelComponent } from "@openpanel/nextjs";

export default function Analytics() {
  if (env.NODE_ENV === "development") return null;

  return (
    <OpenPanelComponent
      apiUrl="/api/op"
      clientId={env.OPEN_PANEL_CLIENT_ID!}
      trackScreenViews={true}
      trackAttributes={true}
      trackOutgoingLinks={true}
    />
  );
}
