# AlternativeOSS

AlternativeOSS is an open-source platform that helps users discover open-source alternatives to popular tools. Our mission is to promote open-source software adoption by making it easier for users to find high-quality alternatives to commercial products.

## 🚀 Features

- **Discover Alternatives**: Find open-source alternatives to popular proprietary software
- **Categories**: Browse alternatives by categories
- **Detailed Comparisons**: Compare features, licenses, and community metrics
- **Submit Projects**: Contribute by submitting new open-source alternatives

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: Postgres with [Neon](https://neon.tech) and [Drizzle ORM](https://orm.drizzle.team/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation
- **URL State Management**: [nuqs](https://github.com/47ng/nuqs)
- **Server Actions**: [zsa-react](https://github.com/seasonedcode/zsa)

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/alternativeoss.git
   cd alternativeoss
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your configuration.

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Database Setup

1. Generate database migrations:
   ```bash
   pnpm db:generate
   ```

2. Apply migrations:
   ```bash
   pnpm db:migrate
   ```

3. (Optional) Start the database studio:
   ```bash
   pnpm db:studio
   ```

## 🧪 Development

### Code Style

We follow strict TypeScript and React best practices:
- Functional components with TypeScript types
- Server Components where possible
- Minimal client-side JavaScript

### Performance Optimization

- Server Components (RSC) for most UI
- Client components wrapped in Suspense with fallbacks
- Image optimization with WebP format

## 📄 License

This project is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE).

## 🌐 Links

- Website: [alternativeoss.com](https://alternativeoss.com)
- GitHub: [github.com/paulboguta/alternativeoss](https://github.com/paulboguta/alternativeoss)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

If you want to contribute and suggest tools to add you can for now:

A) Go to [Submit Form](https://alternativeoss.com/submit)

B) Send me an email at paul.boguta@gmail.com

C) Create an issue, suggesting a tool but providing all required info:

    - github repo
    - name
    - website url
    - your email
    - your name
    - project description (optionally)