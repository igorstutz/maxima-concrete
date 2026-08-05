import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import Contact from "@/components/sections/home/Contact";
import home from "@/content/pages/home.json";
import posts from "@/content/data/blog-posts.json";
import { formatPostDate, type BlogPost } from "../posts";

const all = posts as BlogPost[];

const contactContent =
  home.sections.find((s) => s.type === "contact")?.content ?? {};

export function generateStaticParams() {
  return all.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = all.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | Maxima Concrete`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}/` },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = all.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="bg-white">
      <section
        className="py-14 md:py-20"
        style={{ background: "linear-gradient(135deg, #041C2D 0%, #0D5D93 100%)" }}
      >
        <Container>
          <div className="max-w-[820px]">
            <Link
              href="/blog/"
              className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              All articles
            </Link>
            <h1 className="text-3xl font-semibold leading-[115%] tracking-[-1.4px] text-white md:text-[44px]">
              {post.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatPostDate(post.date)}
              </span>
              {post.readingMinutes ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingMinutes} min read
                </span>
              ) : null}
              {post.author ? <span>By {post.author}</span> : null}
            </div>
          </div>
        </Container>
      </section>

      <article className="py-12 md:py-16">
        <Container width="narrow">
          {post.image && (
            <div className="gradient-blue mb-10 rounded-2xl p-[3px]">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[13px]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-5">
            {post.body.map((block, i) => {
              if (block.type === "h2")
                return (
                  <h2
                    key={i}
                    className="mt-4 text-xl font-semibold leading-snug tracking-[-0.6px] text-navy md:text-2xl"
                  >
                    {block.text}
                  </h2>
                );
              if (block.type === "ul")
                return (
                  <ul key={i} className="flex flex-col gap-2 pl-5">
                    {block.items.map((item, j) => (
                      <li
                        key={j}
                        className="list-disc text-[15px] leading-relaxed text-[#494948]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              return (
                <p key={i} className="text-[15px] leading-relaxed text-[#494948]">
                  {block.text}
                </p>
              );
            })}
          </div>
        </Container>
      </article>

      <Contact content={contactContent} />
    </div>
  );
}
