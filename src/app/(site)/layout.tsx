import { SiteHeader } from "@/components/site-header";

// Landing and onboarding pages: header only, no app navigation.
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
