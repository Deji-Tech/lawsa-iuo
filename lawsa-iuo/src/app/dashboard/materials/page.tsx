"use client";

import { useState } from "react";
import { BookOpen, Search, Filter, FileText, Clock, ChevronRight, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const materials = [
  {
    id: 1,
    title: "Legal Methods I - Complete Notes",
    course: "LAW 101",
    level: "100L",
    type: "PDF",
    size: "2.4 MB",
    lastUpdated: "2024-01-15",
    progress: 75,
    locked: false
  },
  {
    id: 2,
    title: "Constitutional Law I - Lecture Notes",
    course: "LAW 201",
    level: "200L",
    type: "PDF",
    size: "3.1 MB",
    lastUpdated: "2024-01-10",
    progress: 45,
    locked: false
  },
  {
    id: 3,
    title: "Law of Contract I - Case Summaries",
    course: "LAW 203",
    level: "200L",
    type: "PDF",
    size: "1.8 MB",
    lastUpdated: "2024-01-08",
    progress: 20,
    locked: false
  },
  {
    id: 4,
    title: "Criminal Law I - Complete Module",
    course: "LAW 301",
    level: "300L",
    type: "PDF",
    size: "4.2 MB",
    lastUpdated: "2024-01-12",
    progress: 0,
    locked: true
  },
  {
    id: 5,
    title: "Law of Torts I - Lecture Slides",
    course: "LAW 303",
    level: "300L",
    type: "PPT",
    size: "5.6 MB",
    lastUpdated: "2024-01-05",
    progress: 0,
    locked: true
  },
  {
    id: 6,
    title: "Commercial Law I - Study Guide",
    course: "LAW 305",
    level: "300L",
    type: "PDF",
    size: "2.9 MB",
    lastUpdated: "2024-01-03",
    progress: 0,
    locked: true
  }
];

const levels = ["All Levels", "100L", "200L", "300L", "400L", "500L"];
const types = ["All Types", "PDF", "PPT", "Video"];

export default function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedType, setSelectedType] = useState("All Types");

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === "All Levels" || material.level === selectedLevel;
    const matchesType = selectedType === "All Types" || material.type === selectedType;
    return matchesSearch && matchesLevel && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">My Materials</h1>
          <p className="text-muted-foreground text-sm mt-1">Access all your lecture notes, slides, and study materials</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen size={16} />
          <span>{materials.length} materials available</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {levels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          >
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Materials Grid */}
      <div className="grid gap-4">
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No materials found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredMaterials.map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 md:p-6 hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-xl ${material.locked ? 'bg-muted text-muted-foreground' : 'bg-brand/10 text-brand'}`}>
                    {material.locked ? <Lock size={24} /> : <FileText size={24} />}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-brand">{material.course}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{material.level}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{material.type}</span>
                    </div>
                    <h3 className={`font-semibold mb-1 ${material.locked ? 'text-muted-foreground' : 'text-foreground'}`}>
                      {material.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> Updated {material.lastUpdated}
                      </span>
                      <span>{material.size}</span>
                    </div>
                  </div>

                  {/* Progress or Action */}
                  <div className="flex items-center gap-4">
                    {!material.locked && (
                      <div className="hidden md:block w-24">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{material.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand rounded-full transition-all"
                            style={{ width: `${material.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <Button 
                      variant={material.locked ? "outline" : "default"}
                      size="sm"
                      className={material.locked ? "" : "bg-brand hover:bg-brand-dim"}
                    >
                      {material.locked ? "Unlock" : "Continue"} <ChevronRight size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
