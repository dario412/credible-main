import Link from "next/link";
import { LinkedinLogo, YoutubeLogo, XLogo, InstagramLogo } from "@phosphor-icons/react/ssr";

import { V2Wordmark } from "@/components/v2/v2-wordmark";
import type { SiteChromeSections, SocialNetwork } from "@/lib/site-chrome";

function SocialGlyph({ network }: { network: SocialNetwork }) {
  const className = "size-[17px]";
  if (network === "linkedin") return <LinkedinLogo className={className} weight="fill" />;
  if (network === "youtube") return <YoutubeLogo className={className} weight="fill" />;
  if (network === "x") return <XLogo className={className} weight="fill" />;
  return <InstagramLogo className={className} weight="fill" />;
}

export function V2Footer({ footer }: { footer: SiteChromeSections["footer"] }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--v2-snow)] pt-16 pb-12">
      <div className="v2-container">
      <div className="overflow-hidden rounded-[20px] bg-[var(--v2-timberline)]">
        <div className="flex flex-col gap-16 px-8 pt-16 md:px-16 lg:flex-row lg:justify-between lg:gap-16">
          <div className="flex max-w-[26rem] flex-col gap-6">
            <V2Wordmark invert className="text-[44px] leading-none" />
            <div className="flex flex-col gap-1">
              {footer.tagline.trim() ? (
                <p className="text-[17px] leading-7 text-[#D6E0DA]">{footer.tagline}</p>
              ) : null}
              {footer.companyLine.trim() ? (
                <p className="text-[17px] leading-7 text-[var(--v2-on-dark-faint)]">
                  {footer.companyLine}
                </p>
              ) : null}
            </div>
            {footer.email.trim() ? (
              <a
                href={`mailto:${footer.email}`}
                className="text-[17px] leading-7 text-[var(--v2-snow)] hover:underline"
              >
                {footer.email}
              </a>
            ) : null}
            {footer.socials.length > 0 ? (
              <div className="flex items-center gap-2.5 pt-2">
                {footer.socials.map((social) => (
                  <a
                    key={social.network}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-[38px] items-center justify-center rounded-[8px] border border-[var(--v2-rule-dark)] text-[var(--v2-on-dark-muted)] transition-colors hover:text-[var(--v2-snow)]"
                  >
                    <SocialGlyph network={social.network} />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-12 pb-4 md:gap-16">
            {footer.columns.map((column) => (
              <div key={column.title} className="flex min-w-[9rem] flex-col gap-[18px]">
                {column.links.map((link) => (
                  <Link
                    key={`${column.title}-${link.href}-${link.label}`}
                    href={link.href}
                    className="text-[16px] leading-[22px] text-[#D6E0DA] transition-colors hover:text-[var(--v2-snow)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden px-8 pt-10 pb-8 md:px-14">
          <img
            src="/brand/credible-wordmark-footer.svg"
            alt=""
            aria-hidden
            width={1278}
            height={254}
            className="relative h-auto w-full select-none brightness-0 invert opacity-[0.07]"
          />
        </div>

        <div className="px-8 pb-11 md:px-16">
          <div className="flex flex-col gap-4 border-t border-[var(--v2-rule-dark)] pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[14px] leading-[18px] text-[var(--v2-on-dark-faint)]">
              © {year} {footer.copyright}
            </p>
            <div className="flex gap-8">
              {footer.legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[14px] leading-[18px] text-[var(--v2-on-dark-muted)] hover:text-[var(--v2-snow)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
