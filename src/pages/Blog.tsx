import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionHeader from "@/components/SectionHeader";
import { Search, Calendar, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const categories = ["All", "Study Abroad", "Korea Visa", "University Admissions", "Student Tips", "Travel"];

const posts = [
  { id: 1, title: "Top 5 Reasons Nepali Students Choose South Korea", excerpt: "Discover why South Korea has become one of the most popular study destinations for students from Nepal.", category: "Study Abroad", date: "March 10, 2026", featured: true },
  { id: 2, title: "Complete Guide to South Korea Student Visa from Nepal", excerpt: "Everything you need to know about the visa process, required documents, and timeline for Korean student visas.", category: "Korea Visa", date: "March 5, 2026", featured: false },
  { id: 3, title: "How to Write a Strong Statement of Purpose for Korean Universities", excerpt: "Tips and best practices for crafting an SOP that stands out in your university application.", category: "University Admissions", date: "February 28, 2026", featured: false },
  { id: 4, title: "Student Life in Seoul: What to Expect", excerpt: "A comprehensive guide to living, studying, and working in Seoul as an international student.", category: "Student Tips", date: "February 20, 2026", featured: false },
  { id: 5, title: "Affordable Travel Tips for Nepal to Korea Route", excerpt: "How to find the best flight deals and save money on your journey from Nepal to South Korea.", category: "Travel", date: "February 15, 2026", featured: false },
  { id: 6, title: "TOPIK Exam Preparation: Tips for Nepali Students", excerpt: "Strategic preparation tips for the Test of Proficiency in Korean (TOPIK) exam.", category: "Student Tips", date: "February 10, 2026", featured: false },
];

const Blog = () => {
  return (
    <>
      <section className="bg-primary section-padding">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent font-medium text-sm mb-4">Blog & News</span>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-primary-foreground mb-6">
              Latest Updates & Student Resources
            </h1>
            <p className="text-primary-foreground/70 text-lg">
              Stay informed with the latest study abroad news, visa updates, student tips, and travel guidance.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {/* Search & Categories */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button key={c} className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search articles..." className="pl-10" maxLength={100} />
            </div>
          </div>

          {/* Featured Post */}
          {posts.filter(p => p.featured).map((post) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-xl shadow-card overflow-hidden mb-10">
              <div className="h-48 md:h-64 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <span className="text-6xl">📚</span>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{post.category}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                </div>
                <h2 className="font-display font-bold text-xl md:text-2xl mb-3">{post.title}</h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <Button variant="default" size="sm">Read More <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          ))}

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.filter(p => !p.featured).map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.1 }} className="bg-card rounded-xl shadow-card overflow-hidden group">
                <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <span className="text-4xl">📖</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span>{post.category}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-display font-semibold text-base mb-2 group-hover:text-accent transition-colors">{post.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                  <Button variant="link" size="sm" className="px-0">Read More <ArrowRight className="w-3 h-3" /></Button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-10">
            <Button variant="outline" size="lg">Load More Articles</Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
