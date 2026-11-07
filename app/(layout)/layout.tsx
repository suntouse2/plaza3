import Footer from "@/components/footer";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import prisma from "@/lib/prisma";

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const games = await prisma.game.findMany({
    where: { isActive: true },
    select: { slug: true, title: true, bannerUrl: true },
    orderBy: [{ isPopular: "desc" }, { title: "asc" }],
  });

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <Header games={games} />
      <Sidebar games={games} />
      <main className="mx-auto w-full min-w-0 max-w-[1320px] flex-1 px-4 pb-16 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
