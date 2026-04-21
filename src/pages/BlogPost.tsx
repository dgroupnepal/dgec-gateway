import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, User, ArrowLeft, ArrowRight, Phone, Mail,
  MessageCircle, Tag,
} from "lucide-react";
import { getBlogPostBySlug, getRecentPosts, getRelatedPosts, blogCategories } from "@/data/blogPosts";
import CTASection from "@/components/CTASection";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const recentPosts = getRecentPosts(post.id, 5);
  const relatedPosts = getRelatedPosts(post.id, post.category, 3);

  return (
    <>
      <Helmet>
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <meta name="keywords" content={post.keywords.join(", ")} />
      </Helmet>

      {/* Hero */}
      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <Link to="/blog" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <Badge className="bg-accent/20 text-accent mb-4">{post.category}</Badge>
            <h1 className="font-display font-bold text-2xl md:text-4xl text-primary-foreground mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-primary-foreground/60 text-sm">
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Article */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 prose prose-neutral max-w-none
                prose-headings:font-display prose-headings:text-foreground
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-li:text-muted-foreground
                prose-strong:text-foreground
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-table:text-sm prose-th:bg-secondary prose-th:p-3 prose-td:p-3 prose-td:border"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
            />

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Ad Space */}
              <div className="bg-secondary rounded-xl p-4 text-center text-xs text-muted-foreground min-h-[250px] flex items-center justify-center border border-dashed border-border">
                Advertisement Space
              </div>

              {/* CTA */}
              <div className="bg-accent rounded-xl p-6 text-accent-foreground">
                <h3 className="font-display font-bold text-lg mb-2">Need Help with Your Visa?</h3>
                <p className="text-sm opacity-90 mb-4">DGEC experts are ready to guide you through the process.</p>
                <div className="space-y-2">
                  <Button variant="secondary" className="w-full" asChild>
                    <Link to="/student-inquiry">Apply Now</Link>
                  </Button>
                  <Button variant="outline" className="w-full border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10" asChild>
                    <a href="https://wa.me/9779868780019" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Us
                    </a>
                  </Button>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-card rounded-xl shadow-card p-6">
                <h3 className="font-display font-bold text-base mb-4">Categories</h3>
                <div className="space-y-2">
                  {blogCategories.filter((c) => c !== "All").map((cat) => (
                    <Link
                      key={cat}
                      to={`/blog?category=${encodeURIComponent(cat)}`}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors py-1"
                    >
                      <Tag className="w-3 h-3" /> {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-card rounded-xl shadow-card p-6">
                <h3 className="font-display font-bold text-base mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {recentPosts.map((rp) => (
                    <Link key={rp.id} to={`/blog/${rp.slug}`} className="block group">
                      <p className="text-sm font-medium group-hover:text-accent transition-colors line-clamp-2">{rp.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{rp.date}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-card rounded-xl shadow-card p-6">
                <h3 className="font-display font-bold text-base mb-4">Contact DGEC</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4 text-accent" /> +977-01-5927395
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4 text-accent" /> info@dgroupeducation.com
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="w-4 h-4 text-accent" /> +977-9868780019
                  </div>
                </div>
              </div>

              {/* Ad Space */}
              <div className="bg-secondary rounded-xl p-4 text-center text-xs text-muted-foreground min-h-[250px] flex items-center justify-center border border-dashed border-border">
                Advertisement Space
              </div>
            </aside>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display font-bold text-xl mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} to={`/blog/${rp.slug}`} className="bg-card rounded-xl shadow-card overflow-hidden group hover:shadow-elevated transition-shadow">
                    <div className="h-32 bg-gradient-to-br from-primary/10 to-accent/10" />
                    <div className="p-5">
                      <Badge className="bg-accent/10 text-accent text-xs mb-2">{rp.category}</Badge>
                      <h3 className="font-display font-semibold text-sm group-hover:text-accent transition-colors line-clamp-2">{rp.title}</h3>
                      <p className="text-xs text-muted-foreground mt-2">{rp.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CTASection
        headline="Need Expert Guidance for Your Study Abroad Journey?"
        description="DGEC provides complete support — from consultation to visa approval. Contact us today."
        primaryCta={{ label: "Apply Now", link: "/student-inquiry" }}
        secondaryCta={{ label: "Upload Documents", link: "/documents" }}
      />
    </>
  );
};

/** Simple markdown-to-HTML converter for blog content */
function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^\| (.+) \|$/gm, (match) => {
      const cells = match.split('|').filter(Boolean).map((c) => c.trim());
      const isHeader = cells.some((c) => /^-+$/.test(c));
      if (isHeader) return '';
      const tag = match.includes('---') ? 'th' : 'td';
      return `<tr>${cells.map((c) => `<${tag}>${c}</${tag}>`).join('')}</tr>`;
    })
    .replace(/((<tr>.*<\/tr>\n?)+)/g, '<table class="w-full border-collapse">$1</table>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/((<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/^(?!<[hultd])((?!<).+)$/gm, '<p>$1</p>')
    .replace(/<p>\s*<\/p>/g, '')
    .replace(/\n{2,}/g, '\n');
}

export default BlogPost;
