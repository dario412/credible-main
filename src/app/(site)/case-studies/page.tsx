import { redirect } from "next/navigation";

import { PROJECTS_PATH } from "@/lib/case-studies";

export default function CaseStudiesIndexRedirectPage() {
  redirect(PROJECTS_PATH);
}
