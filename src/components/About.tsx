import React from "react";
import { motion } from "motion/react";
import MainLayout from "./MainLayout";
import SEO from "./SEO";

export default function About() {
  return (
    <MainLayout>
      <SEO 
        title="About Us | MyGST Solution" 
        description="Learn more about our team of dedicated professionals committed to simplifying GST compliance for SMEs and Large Indian businesses."
      />
      <div className="py-24 px-6 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white leading-[1.1]">
              About <span className="text-amber-400">MyGST Solution</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
              We are a team of dedicated professionals committed to simplifying GST compliance for Indian businesses. 
            </p>
          </div>

          <div className="p-8 md:p-12 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 text-slate-300 leading-relaxed space-y-6">
            <p>
              At <strong>MyGST Solution</strong>, we understand that navigating the complexities of the Goods and Services Tax (GST) can be a daunting task for businesses of all sizes. Founded by industry experts, our mission is to provide accurate, timely, and seamless GST compliance and consultancy.
            </p>
            <p>
              With a technology-first approach and a deep understanding of Indian tax laws, we bridge the gap between regulatory requirements and business operational efficiency. Our dedicated team specializes in comprehensive GST audits, precise return filings, and representing our clients before tax authorities.
            </p>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">Our Vision</h2>
            <p>
              To be the most trusted and technologically advanced GST consultancy in India, empowering businesses to focus on growth rather than compliance burdens.
            </p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
