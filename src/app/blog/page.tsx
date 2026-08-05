import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import Image from "@/components/Image";
import { Container } from "@/components/Container";
import Contact from "@/components/sections/home/Contact";
import home from "@/content/pages/home.json";
import posts from "@/content/data/blog-posts.json";
import { formatPostDate, type BlogPost } from "./posts";

export const metadata: Metadata = {
  title: "Blog | Maxima Concrete",
  description:
    "Practical articles about concrete driveways, patios and outdoor living in Central Ohio — written by the Maxima Concrete team.",
  alternates: { canonical: "/blog/" },
};

const contactContent =
  home.sections.find((s) => s.type === "contact")?.content ?? {};

const all = (posts as BlogPost[])
  .slice()
  .sort((a, b) => b.date.localeCompare(a.date));

export default function Page() {
  const [featured, ...rest] = all;

  return (
    <div className="bg-white">
      {/* Hero */}
      <section
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(135deg, #041C2D 0%, #0D5D93 100%)" }}
      >
        <Container>
          <div className="max-w-[820px]">
            <h1 className="mb-4 text-3xl font-semibold leading-[110%] tracking-[-1.6px] text-white md:text-5xl">
              From the Job Site
            </h1>
            <p className="text-base leading-relaxed text-white/80 md:text-lg">
              Straight answers about concrete, pavers and outdoor living in Central
              Ohio — from the crew that pours it.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-14 md:py-20">
        <Container>
          {all.length === 0 ? (
            <p className="text-[#5A6B7B]">No posts published yet.</p>
          ) : (
            <>
              {/* Destaque */}
              <Link
                href={`/blog/${featured.slug}/`}
                className="group grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10"
              >
                <div className="gradient-blue rounded-2xl p-[3px]">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[13px] bg-surface">
                    {featured.image && (
                      <Image
                        src={featured.image}
                        alt={featured.title}
                        fill
                        sizes="(min-width: 1024px) 560px, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        priority
                      />
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <PostMeta post={featured} />
                  <h2 className="mt-3 text-2xl font-semibold leading-[120%] tracking-[-1px] text-navy md:text-[34px]">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-[#5A6B7B]">
                    {featured.excerpt}
                  </p>
                  <span className="gradient-navy mt-6 inline-flex w-fit items-center gap-2 rounded-[10px] px-6 py-3 text-sm font-medium text-white transition-opacity group-hover:opacity-90">
                    Read the article
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              {/* Demais posts */}
              {rest.length > 0 && (
                <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}/`}
                      className="group flex flex-col"
                    >
                      <div className="gradient-blue rounded-2xl p-[3px]">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[13px] bg-surface">
                          {post.image && (
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <PostMeta post={post} />
                        <h3 className="mt-2 text-lg font-semibold leading-snug text-navy">
                          {post.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#5A6B7B]">
                          {post.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </section>

      <Contact content={contactContent} />
    </div>
  );
}

function PostMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-[#5A6B7B]">
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
    </div>
  );
}
