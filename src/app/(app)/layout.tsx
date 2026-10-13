import { AppNav } from "@/components/app/app-nav";
import { SiteHeader } from "@/components/site-header";

// Signed-in pages with the app navigation. Lesson pages live outside this
// group, so they get neither the header nor the navigation.
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col lg:flex-row">
        <AppNav />
        {/* Room for the fixed bottom bar on mobile. */}
        <div className="flex flex-1 flex-col pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-0">
          {children}
        </div>
      </div>
    </>
  );
}
