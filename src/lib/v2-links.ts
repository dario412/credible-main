export const V2_HOME = "/v2";
export const V2_ABOUT = "/v2-about";
export const V2_WHAT_WE_DO = "/v2-what-we-do";
export const V2_APPLY = "/v2-apply-for-representation";
export const V2_BRIEF = "/v2#brief";

export function toV2Href(href: string) {
  if (href === "#brief" || href.startsWith("#brief")) return V2_BRIEF;

  const path = href.split("#")[0] ?? href;
  if (path === "/" || path === "") return V2_HOME;
  if (path === "/what-we-do") return V2_WHAT_WE_DO;
  if (path === "/about") return V2_ABOUT;
  if (path === "/apply-for-representation") return V2_APPLY;
  if (path === "/contact") return V2_BRIEF;
  return href;
}
