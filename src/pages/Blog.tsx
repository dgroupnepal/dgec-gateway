import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SectionHeader from "@/components/SectionHeader";
import CTASection from "@/components/CTASection";
import {
  Search, Calendar, ArrowRight, Tag, User, BookOpen, Plane,
  FileText, Lightbulb, Award, Globe, GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";

const categoryIcons: Record<string, React.ElementType> = {
  "Visa Updates": FileText,
  "Study Abroad": GraduationCap,
  "Korea D-4-1 / D-2 Guide": Globe,
  "Japan Visa Guide": BookOpen,
  "Travel Tips": Plane,
  "Student Success Stories": Award,
};

const categories = [
  "All",
  "Visa Updates",
  "Study Abroad",
  "Korea D-4-1 / D-2 Guide",
  "Japan Visa Guide",
  "Travel Tips",
  "Student Success Stories",
];

const posts = [
  {
    id: 1,
    title: "Top 5 Reasons Nepali Students Choose South Korea",
    excerpt: "Discover why South Korea has become one of the most popular study destinations for students from Nepal, from affordable tuition to cultural richness.",
    category: "Study Abroad",
    date: "March 10, 2026",
    featured: true,
  },
  {
    id: 2,
    title: "Complete Guide to Korea D-4-1 Visa for Language Students",
    excerpt: "Everything you need to know about the D-4-1 visa process, required documents, and timeline for Korean language study programs.",
    category: "Korea D-4-1 / D-2 Guide",
    date: "March 5, 2026",
    featured: false,
  },
  {
    id: 3,
    title: "Japan Student Visa from Nepal: Step-by-Step Process",
    excerpt: "A detailed walkthrough of the Japan student visa application, from COE to embassy submission.",
    category: "Japan Visa Guide",
    date: "February 28, 2026",
    featured: false,
  },
  {
    id: 4,
    title: "How to Write a Strong SOP for Korean Universities",
    excerpt: "Tips and best practices for crafting a Statement of Purpose that stands out in your university application.",
    category: "Study Abroad",
    date: "February 20, 2026",
    featured: false,
  },
  {
    id: 5,
    title: "Affordable Travel Tips for Nepal to Korea Route",
    excerpt: "How to find the best flight deals and save money on your journey from Nepal to South Korea.",
    category: "Travel Tips",
    date: "February 15, 2026",
    featured: false,
  },
  {
    id: 6,
    title: "TOPIK Exam Preparation: Tips for Nepali Students",
    excerpt: "Strategic preparation tips for the Test of Proficiency in Korean (TOPIK) exam to boost your admission chances.",
    category: "Study Abroad",
    date: "February 10, 2026",
    featured: false,
  },
  {
    id: 7,
    title: "Student Success: Aarav's Journey from Kathmandu to Seoul",
    excerpt: "Read how DGEC helped Aarav secure admission and a scholarship at a top Korean university.",
    category: "Student Success Stories",
    date: "February 5, 2026",
    featured: false,
  },
  {
    id: 8,
    title: "Latest Korea Visa Policy Updates for 2026",
    excerpt: "Stay updated with the latest changes in Korean visa regulations affecting Nepali students and travelers.",
    category: "Visa Updates",
    date: "January 28, 2026",
    featured: false,
  },
  {
    id: 9,
    title: "Korea D-2 Visa: University Degree Programs Guide",
    excerpt: "Everything about the D-2 visa for bachelor's, master's, and doctoral programs in South Korea.",
    category: "Korea D-4-1 / D-2 Guide",
    date: "January 20, 2026",
    featured: false,
  },
];

const POSTS_PER_PAGE = 6;

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
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

  return (
    <>
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
          {/* Search & Category Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-10 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setActiveCategory(c);
                    setVisibleCount(POSTS_PER_PAGE);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === c
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                maxLength={100}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(POSTS_PER_PAGE);
                }}
              />
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl shadow-card overflow-hidden mb-10 group"
            >
              <div className="md:flex">
                <div className="md:w-2/5 h-48 md:h-auto bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <GraduationCap className="w-20 h-20 text-accent/40" />
                </div>
                <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-sm mb-3">
                    <Badge className={getCategoryColor(featuredPost.category)}>
                      {featuredPost.category}
                    </Badge>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-3 h-3" /> {featuredPost.date}
                    </span>
                  </div>
                  <h2 className="font-display font-bold text-xl md:text-2xl mb-3 group-hover:text-accent transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="w-3 h-3" /> DGEC Team
                    </span>
                    <Button variant="default" size="sm">
                      Read More <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Grid */}
          {gridPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post, i) => {
                const CatIcon = categoryIcons[post.category] || Tag;
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i % 3) * 0.1 }}
                    className="bg-card rounded-xl shadow-card overflow-hidden group hover:shadow-elevated transition-shadow"
                  >
                    <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <CatIcon className="w-12 h-12 text-accent/30" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getCategoryColor(post.category) + " text-xs"}>
                          {post.category}
                        </Badge>
                      </div>
                      <h3 className="font-display font-semibold text-base mb-2 group-hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> DGEC Team
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {post.date}
                        </span>
                      </div>
                      <Button variant="link" size="sm" className="px-0 mt-3">
                        Read More <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
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

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-10">
              <Button variant="outline" size="lg" onClick={() => setVisibleCount((c) => c + POSTS_PER_PAGE)}>
                Load More Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
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
