import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import { INSIGHT_BODIES } from "./insight-bodies";
import { CASE_STUDIES } from "../src/lib/case-studies";
import { caseStudyCardToRow, DEFAULT_HOME_SECTIONS } from "../src/lib/cms";
import { parseInsightBody } from "../src/lib/insight-content";
import {
  DEFAULT_TRUSTED_CLIENTS,
  trustedClientToRow,
} from "../src/lib/trusted-by";

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

  // Client owner account — password set explicitly for Lloyd's access.
  const lloydPasswordHash = await bcrypt.hash("Lloyd123", 12);
  await prisma.user.upsert({
    where: { email: "lloyd@crediblecreators.com" },
    update: {
      name: "Lloyd",
      passwordHash: lloydPasswordHash,
      role: "OWNER",
      active: true,
      totpEnabled: false,
      totpSecret: null,
    },
    create: {
      email: "lloyd@crediblecreators.com",
      name: "Lloyd",
      passwordHash: lloydPasswordHash,
      role: "OWNER",
      active: true,
      totpEnabled: false,
    },
  });

  // Roster experts come from Airtable sync (Admin → Roster).
  // Remove legacy seed speakers so deploys don't resurrect them.
  const removed = await prisma.expert.deleteMany({
    where: { airtableId: null },
  });
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} legacy seed expert(s).`);
  }

  for (const card of CASE_STUDIES) {
    const row = caseStudyCardToRow(card);
    await prisma.caseStudy.upsert({
      where: { slug: row.slug },
      update: row,
      create: row,
    });
  }

  const insights = [
    {
      slug: "why-creator-label-doesnt-fit-b2b",
      title: 'Why the "creator" label doesn\'t fit B2B — and what does',
      excerpt:
        "The Expert Creator vs. influencer taxonomy, and why the difference matters when you're the one writing the brief.",
      body: `B2B buyers do not follow creators the way consumer audiences do. They follow people who have shipped, sold, invested, or operated — and who can still explain what they learned without a script.

The "creator" label collapses that distinction. It puts a founder who publishes weekly next to a lifestyle channel with a discount code. For brands writing briefs, that ambiguity is expensive.

This piece lays out a clearer taxonomy: Expert Creators versus influencers, where each sits in the buying journey, and how to brief them without flattening the work into a one-post sponsorship.`,
      category: "Strategy",
      coverImage: "/images/insights/operator-creator.jpg",
      seoTitle: 'Why the "creator" label doesn\'t fit B2B | Insights',
      seoDescription:
        "Expert Creator vs influencer — and why the difference matters when you're writing the brief.",
      publishedAt: new Date("2026-06-01"),
    },
    {
      slug: "rise-of-the-creator-marketing-manager",
      title: "The rise of the Creator Marketing Manager",
      excerpt:
        "HubSpot, Notion, Ramp and the new in-house role reshaping how B2B works with talent.",
      body: `A new seat is showing up on B2B marketing teams: the Creator Marketing Manager. Not a social generalist. Not a PR coordinator. Someone whose job is to find, brief, and retain the voices buyers already trust.

HubSpot, Notion, Ramp and a growing list of category leaders are building this function from scratch. This piece looks at what the role owns, how it partners with agency talent, and why it changes how briefs get written.`,
      category: "Buyer research",
      coverImage: "/images/insights/expert-economy.jpg",
      seoTitle: "The rise of the Creator Marketing Manager | Insights",
      seoDescription:
        "How HubSpot, Notion and Ramp are reshaping in-house creator marketing.",
      publishedAt: new Date("2026-05-20"),
    },
    {
      slug: "four-tier-revenue-pyramid",
      title: "A four-tier revenue pyramid for expert creators",
      excerpt:
        "Superstar, Marquee, Emerging, High Potential — and what each tier should be earning.",
      body: `Pricing expert creators like influencers leaves money on the table — for both sides. We use a four-tier pyramid: Superstar, Marquee, Emerging, and High Potential.

Each tier has a different mix of keynote, retainer, content series and ambassador work. This playbook breaks down expected ranges and how brands should brief against the pyramid without racing to the bottom on day rate.`,
      category: "Playbook",
      coverImage: "/images/insights/beyond-keynote.jpg",
      seoTitle: "A four-tier revenue pyramid for expert creators | Insights",
      seoDescription:
        "Superstar, Marquee, Emerging, High Potential — and what each tier should earn.",
      publishedAt: new Date("2026-05-08"),
    },
    {
      slug: "superstar-revenue-mix-2025",
      title: "The Superstar revenue mix, 2025",
      excerpt:
        "Speaking still leads. Brand partnerships are catching up faster than we expected.",
      body: `We looked at Superstar-tier creators on the Credible roster and mapped where revenue actually came from in 2025.

Speaking still leads. Brand partnerships are catching up faster than expected. Ambassadorships and advisory retainers are the quiet compounders. This data note is for buyers who want to brief against the real mix, not last year's assumptions.`,
      category: "Data",
      coverImage: "/images/insights/operator-creator.jpg",
      seoTitle: "The Superstar revenue mix, 2025 | Insights",
      seoDescription:
        "Speaking still leads. Brand partnerships are catching up faster than expected.",
      publishedAt: new Date("2026-04-22"),
    },
    {
      slug: "conversation-with-alex-lieberman",
      title: "In conversation with Alex Lieberman",
      excerpt:
        "On saying no, running a media business without a media company, and the discipline of restraint.",
      body: `Alex Lieberman has built one of the clearest founder-facing media brands in B2B without turning it into a studio factory. We sat down with him on saying no, editing for the buyer, and what brands misunderstand when they ask for a "content series."

Restraint is a strategy. This interview is for marketers who want the work to feel editorial — and for creators who are deciding what not to take.`,
      category: "Interviews",
      coverImage: "/images/insights/expert-economy.jpg",
      seoTitle: "In conversation with Alex Lieberman | Insights",
      seoDescription:
        "On saying no, media without a media company, and the discipline of restraint.",
      publishedAt: new Date("2026-04-10"),
    },
    {
      slug: "pr-agencies-best-buyers",
      title: "Why PR agencies are our best buyers, not our competitors",
      excerpt:
        "The taxonomy of who competes with a B2B talent agency, and who's actually a customer.",
      body: `PR agencies often look like competition from a distance. Up close, they are some of our best buyers — because they already understand narrative, timing, and the difference between a quote and a partnership.

This strategy note maps who actually competes with a B2B talent agency, who partners with us, and how to brief when the buyer is an agency sitting between brand and creator.`,
      category: "Strategy",
      coverImage: "/images/insights/beyond-keynote.jpg",
      seoTitle: "Why PR agencies are our best buyers | Insights",
      seoDescription:
        "Who competes with a B2B talent agency — and who's actually a customer.",
      publishedAt: new Date("2026-03-28"),
    },
    {
      slug: "how-to-brief-a-b2b-creator",
      title: "How to brief a B2B creator (properly)",
      excerpt:
        "A working template for creator marketing managers writing their first ambassador brief.",
      body: `Most creator briefs were written for consumer influencers. They ask for posts, not judgement. They specify deliverables before they specify the buyer.

This playbook is a working template for Creator Marketing Managers writing their first ambassador or series brief: audience, commercial goal, creative latitude, measurement, and the questions that save a revision cycle.`,
      category: "Playbook",
      coverImage: "/images/insights/operator-creator.jpg",
      seoTitle: "How to brief a B2B creator (properly) | Insights",
      seoDescription:
        "A working template for writing your first B2B creator ambassador brief.",
      publishedAt: new Date("2026-03-12"),
    },
    {
      slug: "when-to-use-expert-creators-vs-executives",
      title: "When to use expert creators vs. your own executives",
      excerpt:
        "Owned voices and trusted operators solve different problems — mix them on purpose.",
      body: `Executive voices build authority from the inside. Expert creators borrow trust from audiences that already listen. Brands that treat them as interchangeable waste both.

This strategy note maps when to put a founder on stage, when to brief an operator creator, and how to sequence them in a launch without competing for the same attention.`,
      category: "Strategy",
      coverImage: "/images/insights/expert-economy.jpg",
      seoTitle: "Expert creators vs executives | Insights",
      seoDescription:
        "When to use expert creators versus your own executives — and how to mix them.",
      publishedAt: new Date("2026-03-01"),
    },
    {
      slug: "category-narrative-before-the-campaign",
      title: "Build the category narrative before the campaign",
      excerpt:
        "Most briefs jump to formats. The ones that work start with the story the market is missing.",
      body: `Campaigns fail when the market does not share the frame. Expert creators can accelerate distribution, but they cannot invent a category story on a two-week turnaround.

This piece is for brand and agency leads who want narrative work first — and creator briefs that inherit a point of view instead of a punch list.`,
      category: "Strategy",
      coverImage: "/images/insights/beyond-keynote.jpg",
      seoTitle: "Category narrative before the campaign | Insights",
      seoDescription:
        "Why the best creator campaigns start with a category narrative, not a format list.",
      publishedAt: new Date("2026-02-18"),
    },
    {
      slug: "what-b2b-buyers-actually-trust",
      title: "What B2B buyers actually trust online",
      excerpt:
        "Peer proof beats polish. Here is where buyers look before they take a meeting.",
      body: `We interviewed buyers across SaaS, fintech and professional services about where trust is formed before a sales conversation. The pattern is consistent: operators over entertainers, specificity over production value, and repetition over one-off spikes.

This research note is for teams deciding which voices deserve budget — and which formats buyers actually finish.`,
      category: "Buyer research",
      coverImage: "/images/insights/operator-creator.jpg",
      seoTitle: "What B2B buyers actually trust online | Insights",
      seoDescription:
        "Peer proof beats polish — where B2B buyers look before they take a meeting.",
      publishedAt: new Date("2026-02-04"),
    },
    {
      slug: "inside-the-creator-briefing-room",
      title: "Inside the creator briefing room",
      excerpt:
        "How high-performing teams run the first call with talent — and what they never skip.",
      body: `The first briefing call sets the ceiling for the work. Teams that treat it like a kickoff checklist get deliverables. Teams that treat it like a shared diagnosis get judgement.

This buyer-research note captures how strong Creator Marketing Managers run that room: goals, constraints, creative latitude, and the red flags that should stop a brief before it ships.`,
      category: "Buyer research",
      coverImage: "/images/insights/beyond-keynote.jpg",
      seoTitle: "Inside the creator briefing room | Insights",
      seoDescription:
        "How high-performing teams run the first call with B2B talent.",
      publishedAt: new Date("2026-01-22"),
    },
    {
      slug: "pricing-ambassador-retainers",
      title: "Pricing ambassador retainers without racing to the bottom",
      excerpt:
        "A practical frame for multi-month partnerships that protect quality on both sides.",
      body: `Day rates collapse the relationship into a transaction. Retainers can do the same if they are just day rates in a trench coat.

This playbook covers scope, review cadence, exclusivity, and how to price ambassador work so creators stay editorial and brands get compounding distribution.`,
      category: "Playbook",
      coverImage: "/images/insights/expert-economy.jpg",
      seoTitle: "Pricing ambassador retainers | Insights",
      seoDescription:
        "How to price multi-month creator ambassador retainers without racing to the bottom.",
      publishedAt: new Date("2026-01-08"),
    },
    {
      slug: "conversation-with-lenny-rachitsky",
      title: "In conversation with Lenny Rachitsky",
      excerpt:
        "On newsletter craft, guest selection, and why depth still beats frequency.",
      body: `Lenny Rachitsky has built one of the most trusted product audiences in tech by refusing to chase every format. We talked about guest selection, editing for practitioners, and what brands get wrong when they ask for a "Lenny-style" series.

Depth still beats frequency. This interview is for marketers who want signal, and for creators deciding what deserves a slot.`,
      category: "Interviews",
      coverImage: "/images/insights/operator-creator.jpg",
      seoTitle: "In conversation with Lenny Rachitsky | Insights",
      seoDescription:
        "On newsletter craft, guest selection, and why depth still beats frequency.",
      publishedAt: new Date("2025-12-14"),
    },
    {
      slug: "conversation-with-emily-kramer",
      title: "In conversation with Emily Kramer",
      excerpt:
        "Marketing leadership, creator partnerships, and building trust at growth-stage companies.",
      body: `Emily Kramer has shaped how a generation of B2B marketers think about storytelling and growth. We spoke about when creator partnerships belong on a growth roadmap, how to brief for substance, and what she looks for in talent beyond follower counts.

This interview is for CMOs and creator leads who want partnerships that sound like the company — not like a rented audience.`,
      category: "Interviews",
      coverImage: "/images/insights/beyond-keynote.jpg",
      seoTitle: "In conversation with Emily Kramer | Insights",
      seoDescription:
        "Marketing leadership, creator partnerships, and trust at growth-stage companies.",
      publishedAt: new Date("2025-11-28"),
    },
    {
      slug: "format-roi-benchmarks-2025",
      title: "Format ROI benchmarks, 2025",
      excerpt:
        "Keynotes, series, podcasts, and ambassadorships — what moved pipeline last year.",
      body: `Not every format earns the same attention or the same commercial return. We aggregated roster campaigns from 2025 to compare keynotes, multi-part series, podcast takeovers, and ambassador retainers.

This data note is a starting point for budget allocation — not a promise. Use it to pressure-test the mix before the brief is locked.`,
      category: "Data",
      coverImage: "/images/insights/expert-economy.jpg",
      seoTitle: "Format ROI benchmarks, 2025 | Insights",
      seoDescription:
        "Keynotes, series, podcasts, and ambassadorships — what moved pipeline in 2025.",
      publishedAt: new Date("2025-11-10"),
    },
    {
      slug: "audience-overlap-across-expert-tiers",
      title: "Audience overlap across expert tiers",
      excerpt:
        "How much of a Superstar audience already follows Emerging talent — and why it matters.",
      body: `Buying three creators in the same category can look diversified and still reach the same people. We mapped audience overlap across Superstar, Marquee and Emerging tiers on shared topics.

This data note helps buyers build a roster that expands reach instead of echoing it — and shows where Emerging talent punches above its weight.`,
      category: "Data",
      coverImage: "/images/insights/beyond-keynote.jpg",
      seoTitle: "Audience overlap across expert tiers | Insights",
      seoDescription:
        "How much Superstar and Emerging audiences overlap — and why it matters for briefs.",
      publishedAt: new Date("2025-10-26"),
    },
  ];

  for (const insight of insights) {
    const body = INSIGHT_BODIES[insight.slug] ?? insight.body;
    const blocks = parseInsightBody(body).blocks;
    const record = { ...insight, body, blocks };
    await prisma.insight.upsert({
      where: { slug: insight.slug },
      update: record,
      create: record,
    });
  }

  await prisma.pageContent.upsert({
    where: { slug: "home" },
    update: { title: "Home", sections: DEFAULT_HOME_SECTIONS },
    create: {
      slug: "home",
      title: "Home",
      sections: DEFAULT_HOME_SECTIONS,
    },
  });

  const trustedCount = await prisma.trustedClient.count();
  if (trustedCount === 0) {
    await prisma.trustedClient.createMany({
      data: DEFAULT_TRUSTED_CLIENTS.map((client, index) =>
        trustedClientToRow(client, index),
      ),
    });
  }

  // Remove older sample insights that no longer match the client taxonomy
  await prisma.insight.deleteMany({
    where: {
      slug: {
        in: [
          "what-is-the-expert-economy",
          "booking-beyond-the-keynote",
          "rise-of-the-operator-creator",
        ],
      },
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
