"use client";

import { useState } from "react";
import { Library, Search, BookOpen, Scale, FileText, ExternalLink, Bookmark, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const statutes = [
  {
    id: 1,
    title: "Constitution of the Federal Republic of Nigeria 1999 (as amended)",
    category: "Constitutional Law",
    year: "1999",
    sections: 320,
    lastAccessed: "2 days ago",
    bookmarked: true
  },
  {
    id: 2,
    title: "Criminal Code Act",
    category: "Criminal Law",
    year: "1916",
    sections: 545,
    lastAccessed: "1 week ago",
    bookmarked: false
  },
  {
    id: 3,
    title: "Evidence Act 2011",
    category: "Law of Evidence",
    year: "2011",
    sections: 259,
    lastAccessed: "3 days ago",
    bookmarked: true
  },
  {
    id: 4,
    title: "Companies and Allied Matters Act (CAMA) 2020",
    category: "Company Law",
    year: "2020",
    sections: 870,
    lastAccessed: "Never",
    bookmarked: false
  },
  {
    id: 5,
    title: "Land Use Act 1978",
    category: "Land Law",
    year: "1978",
    sections: 47,
    lastAccessed: "2 weeks ago",
    bookmarked: false
  },
  {
    id: 6,
    title: "Marriage Act",
    category: "Family Law",
    year: "1914",
    sections: 66,
    lastAccessed: "Never",
    bookmarked: false
  },
  {
    id: 7,
    title: "Sale of Goods Act",
    category: "Commercial Law",
    year: "1893",
    sections: 62,
    lastAccessed: "1 month ago",
    bookmarked: false
  },
  {
    id: 8,
    title: "Administration of Criminal Justice Act (ACJA) 2015",
    category: "Criminal Procedure",
    year: "2015",
    sections: 495,
    lastAccessed: "Never",
    bookmarked: false
  }
];

const categories = ["All Categories", "Constitutional Law", "Criminal Law", "Law of Evidence", "Company Law", "Land Law", "Family Law", "Commercial Law", "Criminal Procedure"];

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredStatutes = statutes.filter((statute) => {
    const matchesSearch = statute.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || statute.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Statute Library</h1>
          <p className="text-muted-foreground text-sm mt-1">Access Nigerian laws, acts, and legal references</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Scale size={16} />
          <span>{statutes.length} statutes available</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search statutes, acts, or laws..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Quick Access - Bookmarked */}
      {statutes.some(s => s.bookmarked) && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Bookmarked</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {statutes.filter(s => s.bookmarked).map((statute, index) => (
              <motion.div
                key={statute.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 border-brand/20 bg-brand/5 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-brand text-white">
                      <Bookmark size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm mb-1 leading-tight">{statute.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{statute.category}</span>
                        <span>•</span>
                        <span>{statute.sections} sections</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* All Statutes */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">All Statutes</h2>
        <div className="grid gap-4">
          {filteredStatutes.length === 0 ? (
            <div className="text-center py-12">
              <Library className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No statutes found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredStatutes.map((statute, index) => (
              <motion.div
                key={statute.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 md:p-6 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Icon */}
                    <div className="p-3 rounded-xl bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                      <BookOpen size={24} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-brand">{statute.category}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">Year {statute.year}</span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-brand transition-colors">
                        {statute.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText size={12} /> {statute.sections} sections
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {statute.lastAccessed}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <Button variant="ghost" size="sm" className="text-brand hover:text-brand-dim">
                      Read <ExternalLink size={16} className="ml-1" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
