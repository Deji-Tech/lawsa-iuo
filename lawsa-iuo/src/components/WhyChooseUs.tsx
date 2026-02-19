"use client";

import { motion } from "framer-motion";
import { Smartphone, CheckCircle2, BarChart3 } from "lucide-react";

const features = [
  {
    icon: <Smartphone size={28} />,
    title: "Accessible",
    description: "You can visit our website at anytime, and on your preferred device.",
  },
  {
    icon: <CheckCircle2 size={28} />,
    title: "Quality",
    description: "Notes were compiled using the most current and authoritative sources.",
  },
  {
    icon: <BarChart3 size={28} />,
    title: "Comprehensive",
    description: "Easy to understand notes, with the use of legalese only when necessary.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-slate-50 dark:bg-slate-900 py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-serif text-3xl text-foreground sm:text-4xl md:text-5xl">
            Why Choose Us?
          </h2>
          <p className="mx-auto max-w-lg text-base text-muted-foreground">
            Access to diverse areas of law all from a single repository.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl bg-background p-6 sm:p-8"
            >
              <div className="mb-5 text-foreground">
                {feature.icon}
              </div>
              <h3 className="mb-2 font-serif text-xl text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
