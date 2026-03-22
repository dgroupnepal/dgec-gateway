import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CTASection from "@/components/CTASection";
import {
  Search, Calendar, ArrowRight, Tag, User,
  BookOpen, Plane, FileText, Award, Globe, GraduationCap, MessageCircle, Phone, Mail,
} from "lucide-react";
import { blogPosts, blogCategories } from "@/data/blogPosts";

const categoryIcons: Record<string, React.ElementType> = {
  "Visa Updates": FileText,
  "Study Abroad": GraduationCap,
  "Korea D-4-1 / D-2 Guide": Globe,
  "Japan Visa Guide": BookOpen,
  "Travel Tips": Plane,
  "Student Success Stories": Award,
};

const POSTS_PER_PAGE = 6;

const getCategoryColor = (cat: string) => {
  const colors: Record<string, string> = {
    "Visa Updates": "bg-accent/10 text-accent",
    "Study Abroad": "bg-primary/10 text-primary",
    "Korea D-4-1 / D-2 Guide": "bg-blue-100 text-blue-700",
    "Japan Visa Guide": "bg-rose-100 text-rose-700",
    "Travel Tips": "bg-emerald-100 text-emerald-700",
    "Student Success Stories": "bg-amber-100 text-amber-700",
  };
  return colors[cat] || "bg-secondary text-secondary-foreground";
};

const Blog = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const filtered = useMemo(() => {
    return blogPosts.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  const featuredPost = filtered.find((p) => p.featured);
  const gridPosts = filtered.filter((p) => !p.featured).slice(0, visibleCount);
  const hasMore = filtered.filter((p) => !p.featured).length > visibleCount;

  return (
    <>
      <Helmet>
        <title>Blog & Updates - DGEC | Korea Visa, Study Abroad, Japan Visa Guides</title>
        <meta name="description" content="Latest Korea visa updates, study abroad guides, Japan visa process, student success stories, and travel tips from D Group Education Consultancy." />
      </Helmet>

      {/* Hero */}
      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">
              DGEC Blog & Updates
            </span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Latest Visa News, Study Abroad Guides & Student Success Stories
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              Stay informed with the latest Korea visa updates, Japan visa guides, student tips, and travel guidance from DGEC.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Search & Filters */}
              <div className="flex flex-col gap-4 mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    className="pl-10"
                    maxLength={100}
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setVisibleCount(POSTS_PER_PAGE); }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {blogCategories.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setActiveCategory(c); setVisibleCount(POSTS_PER_PAGE); }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        activeCategory === c
                          ? "bg-accent text-accent-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-accent/10"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ad Space Top */}
              <div className="bg-secondary rounded-xl p-3 text-center text-xs text-muted-foreground mb-8 min-h-[90px] flex items-center justify-center border border-dashed border-border">
                Advertisement Space
              </div>

              {/* Featured Post */}
              {featuredPost && (
                <Link to={`/blog/${featuredPost.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-xl shadow-card overflow-hidden mb-8 group"
                  >
                    <div className="md:flex">
                      <div className="md:w-2/5 h-48 md:h-auto bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <GraduationCap className="w-20 h-20 text-accent/40" />
                      </div>
                      <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-sm mb-3">
                          <Badge className={getCategoryColor(featuredPost.category)}>{featuredPost.category}</Badge>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="w-3 h-3" /> {featuredPost.date}
                          </span>
                        </div>
                        <h2 className="font-display font-bold text-xl md:text-2xl mb-3 group-hover:text-accent transition-colors">
                          {featuredPost.title}
                        </h2>
                        <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                        <span className="text-accent font-medium text-sm flex items-center gap-1">
                          Read Full Article <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )}

              {/* Grid */}
              {gridPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {gridPosts.map((post, i) => {
                    const CatIcon = categoryIcons[post.category] || Tag;
                    return (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: (i % 2) * 0.1 }}
                      >
                        <Link to={`/blog/${post.slug}`} className="block bg-card rounded-xl shadow-card overflow-hidden group hover:shadow-elevated transition-shadow h-full">
                          <div className="h-36 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            <CatIcon className="w-10 h-10 text-accent/30" />
                          </div>
                          <div className="p-5">
                            <Badge className={getCategoryColor(post.category) + " text-xs mb-2"}>{post.category}</Badge>
                            <h3 className="font-display font-semibold text-sm mb-2 group-hover:text-accent transition-colors line-clamp-2">{post.title}</h3>
                            <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{post.excerpt}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Search className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-muted-foreground">No articles found. Try a different search or category.</p>
                </div>
              )}

              {hasMore && (
                <div className="text-center mt-10">
                  <Button variant="outline" size="lg" onClick={() => setVisibleCount((c) => c + POSTS_PER_PAGE)}>
                    Load More Articles
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Ad Space */}
              <div className="bg-secondary rounded-xl p-4 text-center text-xs text-muted-foreground min-h-[250px] flex items-center justify-center border border-dashed border-border">
                Advertisement Space
              </div>

              {/* CTA */}
              <div className="bg-accent rounded-xl p-6 text-accent-foreground">
                <h3 className="font-display font-bold text-lg mb-2">Need Visa Help?</h3>
                <p className="text-sm opacity-90 mb-4">Contact DGEC for expert guidance on visa, admission, and travel.</p>
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
                    <button
                      key={cat}
                      onClick={() => { setActiveCategory(cat); setVisibleCount(POSTS_PER_PAGE); }}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors py-1 w-full text-left"
                    >
                      <Tag className="w-3 h-3" /> {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-card rounded-xl shadow-card p-6">
                <h3 className="font-display font-bold text-base mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {blogPosts.slice(0, 5).map((rp) => (
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
                  <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-4 h-4 text-accent" /> +977-01-5927395</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4 text-accent" /> info@dgroup.edu.np</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><MessageCircle className="w-4 h-4 text-accent" /> +977-9868780019</div>
                </div>
              </div>

              {/* Ad Space */}
              <div className="bg-secondary rounded-xl p-4 text-center text-xs text-muted-foreground min-h-[250px] flex items-center justify-center border border-dashed border-border">
                Advertisement Space
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CTASection
        headline="Need Help with Visa or Study Abroad?"
        description="Our expert counselors are ready to guide you. Apply now or upload your documents to get started."
        primaryCta={{ label: "Apply Now", link: "/student-inquiry" }}
        secondaryCta={{ label: "Upload Documents", link: "/documents" }}
      />
    </>
  );
};

export default Blog;
