# CVTrickster

Upload your CV and a job offer URL — get an adapted CV tailored to that specific job.

## Local setup

```bash
npm install
cp .env.local.example .env.local
# add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [Tailwind CSS](https://tailwindcss.com)
- [Claude API](https://docs.anthropic.com) (`claude-sonnet-4-6`)
