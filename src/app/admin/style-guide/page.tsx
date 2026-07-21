import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { createMetadata } from "@/lib/seo";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import { PatternField } from "@/components/pattern-field";

export const metadata = createMetadata({
  title: "Style guide",
  path: "/admin/style-guide",
  noIndex: true,
});

const colors = [
  { name: "Cream", token: "bg-cream / text-cream", hex: "#F9F3EF", swatch: "bg-cream border border-charcoal/10" },
  { name: "Cream dark", token: "bg-cream-dark", hex: "#F0E9E3", swatch: "bg-cream-dark" },
  { name: "Charcoal", token: "bg-charcoal / text-charcoal", hex: "#1C1A17", swatch: "bg-charcoal" },
  { name: "Forest (primary)", token: "bg-forest / text-forest", hex: "#345B47", swatch: "bg-forest" },
  { name: "Taupe", token: "bg-taupe / text-taupe", hex: "#C9C2BA", swatch: "bg-taupe" },
  { name: "Rust (accent)", token: "bg-rust / text-rust", hex: "#935B3B", swatch: "bg-rust" },
];

export default async function StyleGuidePage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!session.user.totpEnabled) redirect("/admin/setup-2fa");

  return (
    <div className="max-w-4xl space-y-16">
      <div>
        <h1 className="font-display text-3xl">Style guide</h1>
        <p className="mt-2 text-sm text-muted">
          Living reference of HTML elements, brand tokens, and UI classes used on
          the Credible Creators site. Admin only.
        </p>
      </div>

      <section>
        <h2 className="font-display text-2xl">Brand</h2>
        <img
          src="/brand/credible-wordmark.svg"
          alt="Credible"
          width={253}
          height={50}
          className="mt-4 h-8 w-auto"
        />
        <p className="mt-2 text-xs text-muted">
          class: <code className="bg-cream-dark px-1">font-display text-forest</code>
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl">Colours</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {colors.map((c) => (
            <div key={c.name} className="flex gap-4 border border-charcoal/10 p-3">
              <div className={`h-16 w-16 shrink-0 ${c.swatch}`} />
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-muted">{c.hex}</p>
                <p className="mt-1 text-xs text-muted">{c.token}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Typography</h2>
        <p className="mt-2 text-sm text-muted">
          Display: <strong>Faculty Glyphic</strong> (<code>font-display</code>). Body:{" "}
          <strong>Instrument Sans</strong> (default).
        </p>
        <div className="prose-credible mt-8 border border-charcoal/10 p-6">
          <p className="!mt-0 text-xs uppercase tracking-wide text-muted">
            Wrap editorial content in <code>.prose-credible</code>
          </p>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <h5>Heading 5</h5>
          <h6>Heading 6</h6>
          <p>
            Body paragraph with <strong>strong</strong>, <em>emphasis</em>, and a{" "}
            <a href="#">text link</a>. Use this for long-form insight and case
            study copy.
          </p>
          <ul>
            <li>Unordered list item</li>
            <li>Another list item</li>
          </ul>
          <ol>
            <li>Ordered list item</li>
            <li>Second step</li>
          </ol>
          <blockquote>Blockquote — for pull quotes and highlighted statements.</blockquote>
          <p>
            Inline <code>code</code> sample.
          </p>
          <pre>
            <code>{`pre / code block\nclass: prose-credible > pre`}</code>
          </pre>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Buttons</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="primary">Primary (forest)</Button>
          <Button variant="accent">Accent (rust)</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
        <p className="mt-3 text-xs text-muted">
          Component: <code>Button</code> / <code>ButtonLink</code> from{" "}
          <code>@/components/ui</code>
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl">Form controls</h2>
        <div className="mt-6 max-w-md space-y-4">
          <Field label="Text input" id="sg-input">
            <TextInput id="sg-input" placeholder="Type your email" />
          </Field>
          <Field label="Textarea" id="sg-area">
            <TextArea id="sg-area" placeholder="Message" />
          </Field>
        </div>
        <p className="mt-3 text-xs text-muted">
          Classes via <code>inputClassName</code> and components{" "}
          <code>TextInput</code>, <code>TextArea</code>, <code>Field</code>
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl">Filter chips</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="border border-forest bg-forest px-3 py-1.5 text-sm text-cream">
            Active chip
          </span>
          <span className="border border-charcoal/20 px-3 py-1.5 text-sm">
            Idle chip
          </span>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Pattern field</h2>
        <p className="mt-2 text-sm text-muted">
          Interactive canvas from the waitlist site — component{" "}
          <code>PatternField</code>.
        </p>
        <div className="page relative mt-4 h-56 overflow-hidden border border-charcoal/10 bg-cream">
          <PatternField />
          <div className="relative z-[2] flex h-full items-end p-4">
            <code className="text-xs">&lt;PatternField /&gt;</code>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Motion</h2>
        <div className="mt-4 space-y-2 text-sm">
          <p className="animate-fade-up">
            <code>.animate-fade-up</code>
          </p>
          <p className="animate-fade-in animate-delay-1">
            <code>.animate-fade-in</code> + <code>.animate-delay-1</code>
          </p>
        </div>
      </section>
    </div>
  );
}
