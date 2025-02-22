export type WebsiteConfig = {
  name: string;
  domain: string;
  description: string;
  links: {
    github: string;
  };
};

export const websiteConfig: WebsiteConfig = {
  name: "AlternativeOSS",
  domain: "alternativeoss.com",
  description: "Open Source Software Alternatives Directory",
  links: {
    github: "https://github.com/yourusername/alternativeoss",
  },
};
