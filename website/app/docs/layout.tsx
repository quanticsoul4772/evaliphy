import Link from "next/link";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docs = [
    { slug: "introduction", title: "Introduction" },
    { slug: "quick-start", title: "Quick Start" },
    { slug: "configuration", title: "Configuration" },
    { slug: "assertions", title: "Assertions" },
    { slug: "http-client", title: "HTTP Client" },
    { slug: "reporting", title: "Reporting" },
  ];

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 md:px-8">
      <div className="flex flex-col md:flex-row gap-12 py-12">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="sticky top-24 space-y-1">
            <p className="px-3 mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Getting Started
            </p>
            {docs.map((doc) => (
              <Link
                key={doc.slug}
                href={`/docs/${doc.slug}`}
                className="block px-3 py-2 text-sm font-medium rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
              >
                {doc.title}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 min-w-0 max-w-3xl">
          <div className="prose prose-zinc max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
