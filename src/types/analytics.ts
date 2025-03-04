export type AdMetadata = {
  placement: Placement;
  adName: string;
  adVersion: string;
};

export type Placement =
  | 'header-link'
  | 'header-ad'
  | 'toolbar'
  | 'sidebar'
  | 'projects'
  | 'alternatives';

export type Ad = {
  name: string;
  version: string; // A/B Testing A | B | C | D
};

export type AnalyticsEvents = {
  'visit-advertising': { placement: string }; // for tracking visits to the advertising page
  'advertising-get-started': { placement: string }; // for tracking clicks on the get started button
  'click-ad': { placement: string; adName: string; adVersion: string }; // for tracking actual ad clicks
};
