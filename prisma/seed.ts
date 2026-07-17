import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "dario@positivestudio.co";
  const password = process.env.ADMIN_PASSWORD ?? "aerodrom";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: "OWNER", active: true },
    create: {
      email,
      name: "Dario Stojanov",
      passwordHash,
      role: "OWNER",
      active: true,
    },
  });

  const experts = [
    {
      slug: "amara-chen",
      name: "Amara Chen",
      title: "Founder & Keynote Speaker",
      shortBio: "Operator-turned-founder advising scale-ups on culture and growth.",
      bio: "Amara Chen has built and exited two technology companies and now advises founders on scaling teams with clarity and conviction. She speaks widely on leadership in the expert economy.",
      categories: ["founder", "speaker"],
      topics: ["leadership", "growth", "culture"],
      featured: true,
    },
    {
      slug: "james-okafor",
      name: "James Okafor",
      title: "Motivational Speaker",
      shortBio: "Stage presence that turns ambition into actionable momentum.",
      bio: "James Okafor is a motivational speaker and coach known for high-energy keynotes on resilience, performance, and personal credibility.",
      categories: ["speaker"],
      topics: ["motivation", "performance"],
      featured: true,
    },
    {
      slug: "sofia-martinez",
      name: "Sofia Martinez",
      title: "Brand Partnerships Strategist",
      shortBio: "Trusted voice connecting brands with credible creators.",
      bio: "Sofia designs brand partnership strategies for operators and media voices, aligning commercial opportunity with authentic storytelling.",
      categories: ["operator", "voice"],
      topics: ["brand", "media", "partnerships"],
      featured: true,
    },
    {
      slug: "noah-bennett",
      name: "Noah Bennett",
      title: "Executive Operator",
      shortBio: "Former COO helping founders install operating cadence.",
      bio: "Noah brings operator discipline to founder-led organisations, focusing on systems, hiring, and decision quality under pressure.",
      categories: ["operator", "founder"],
      topics: ["operations", "hiring"],
      featured: false,
    },
    {
      slug: "lena-weiss",
      name: "Lena Weiss",
      title: "Media Host & Moderator",
      shortBio: "Sharp interviewer and trusted on-stage moderator.",
      bio: "Lena hosts conversations with experts across business and culture, and moderates panels for conferences and brand events.",
      categories: ["voice", "speaker"],
      topics: ["media", "events"],
      featured: false,
    },
    {
      slug: "daniel-park",
      name: "Daniel Park",
      title: "Innovation Keynote",
      shortBio: "Future-of-work perspectives grounded in real product builds.",
      bio: "Daniel Park speaks on innovation, AI adoption, and how expert voices shape the next generation of brands and products.",
      categories: ["speaker", "founder"],
      topics: ["innovation", "ai", "product"],
      featured: false,
    },
  ];

  for (const expert of experts) {
    await prisma.expert.upsert({
      where: { slug: expert.slug },
      update: expert,
      create: {
        ...expert,
        seoTitle: `${expert.name} | Credible Creators`,
        seoDescription: expert.shortBio,
      },
    });
  }

  await prisma.caseStudy.upsert({
    where: { slug: "stage-to-boardroom" },
    update: {},
    create: {
      slug: "stage-to-boardroom",
      title: "From stage to boardroom",
      summary: "How we placed a keynote speaker into a year-long advisory partnership.",
      body: "A global brand needed credibility on stage and substance off it. We paired their flagship event with an ongoing advisory role for one of our founder speakers — turning a single booking into a durable commercial relationship.",
      relatedExperts: ["amara-chen"],
      seoTitle: "From stage to boardroom | Case Study",
      seoDescription: "Placing a keynote speaker into a year-long advisory partnership.",
    },
  });

  await prisma.caseStudy.upsert({
    where: { slug: "creator-led-launch" },
    update: {},
    create: {
      slug: "creator-led-launch",
      title: "Creator-led product launch",
      summary: "Orchestrating a multi-voice launch across media and live events.",
      body: "We assembled a roster of operators and trusted voices to launch a new category product — combining keynotes, podcasts, and branded evenings into one coherent narrative.",
      relatedExperts: ["sofia-martinez", "lena-weiss"],
      seoTitle: "Creator-led product launch | Case Study",
      seoDescription: "A multi-voice launch across media and live events.",
    },
  });

  await prisma.insight.upsert({
    where: { slug: "what-is-the-expert-economy" },
    update: { category: "Perspective" },
    create: {
      slug: "what-is-the-expert-economy",
      title: "What is the expert economy?",
      excerpt: "Founders, operators and trusted voices are becoming the most valuable media.",
      body: "The expert economy is the shift from celebrity attention to credibility. Audiences want people who have built, operated, and earned trust — and brands want those voices in the room. That is where Credible Creators sits.",
      category: "Perspective",
      seoTitle: "What is the expert economy? | Insights",
      seoDescription: "Why founders, operators and trusted voices matter more than ever.",
    },
  });

  await prisma.insight.upsert({
    where: { slug: "booking-beyond-the-keynote" },
    update: { category: "Playbook" },
    create: {
      slug: "booking-beyond-the-keynote",
      title: "Booking beyond the keynote",
      excerpt: "The best partnerships start on stage and continue in the business.",
      body: "A keynote is often the first chapter. Advisories, retainers, and brand partnerships turn a single appearance into lasting value — for both the expert and the organisation that books them.",
      category: "Playbook",
      seoTitle: "Booking beyond the keynote | Insights",
      seoDescription: "How stage bookings unlock longer partnerships.",
    },
  });

  await prisma.insight.upsert({
    where: { slug: "rise-of-the-operator-creator" },
    update: { category: "Trend report" },
    create: {
      slug: "rise-of-the-operator-creator",
      title: "The rise of the operator-creator",
      excerpt: "Why the people building companies are becoming the channels brands want most.",
      body: "Operators who publish are compounding two assets at once: a business and an audience. For brands, that combination beats reach alone — the audience arrives pre-sold on the voice's judgement. This piece looks at how operator-creators are priced, booked and measured in 2026.",
      category: "Trend report",
      seoTitle: "The rise of the operator-creator | Insights",
      seoDescription: "Why operators with audiences are the most valuable channel in B2B.",
    },
  });

  console.log("Seed complete:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
