export type WebsiteConfig = {
  version: string;
  name: string;
  domain: string;
  description: string;
  status: "waitlist" | "public";
  links: {
    github: string;
    twitterPawel: string;
  };
};

export const websiteConfig: WebsiteConfig = {
  version: "beta.0.1",
  name: "AlternativeOSS",
  domain: "alternativeoss.com",
  description: "Open Source Software Alternatives Directory",
  status: "waitlist",
  links: {
    github: "https://github.com/yourusername/alternativeoss",
    twitterPawel: "https://x.com/pawelboguta",
  },
};
