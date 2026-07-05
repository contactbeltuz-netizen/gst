import React from "react";
import { motion } from "motion/react";
import { FileText, Search, CreditCard, ShieldAlert } from "lucide-react";
import MainLayout from "./MainLayout";
import FaqAccordion from "./FaqAccordion";
import SEO from "./SEO";

export default function Services() {
  const services = [
    {
      title: "GST Registration",
      icon: <FileText className="w-8 h-8 text-blue-400" />,
      desc: "End-to-end support for obtaining your GSTIN. We handle the documentation, application, and follow-ups with the department.",
    },
    {
      title: "GST Return Filing",
      icon: <CreditCard className="w-8 h-8 text-green-400" />,
      desc: "Timely and error-free filing of GSTR-1, GSTR-3B, GSTR-4, and others. Avoid late fees and notices with our automated compliance checks.",
    },
    {
      title: "GST Audit (GSTR-9/9C)",
      icon: <Search className="w-8 h-8 text-amber-400" />,
      desc: "Comprehensive annual audits matching your books with portal data. Identification of gaps and expert remediation strategies.",
    },
    {
      title: "Notice & Dispute Resolution",
      icon: <ShieldAlert className="w-8 h-8 text-red-400" />,
      desc: "Professional representation against department notices. We draft replies and appear for hearings to secure your business interests.",
    }
  ];

  return (
    <MainLayout>
      <SEO 
        title="GST Consulting Services | MyGST Solution" 
        description="Expert GST advisory and processing services for SMEs, Startups, and Large Enterprises. Registration, Audits, Filing, and more."
      />
      <div className="py-24 px-6 max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white leading-[1.1]">
            Our <span className="text-amber-400">Services</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Scalable GST solutions tailored for SMEs, Startups, and Large Enterprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 md:p-10 rounded-3xl backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <div className="mb-6 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-300">
                {service.icon}
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">{service.title}</h2>
              <p className="text-slate-400 leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 bg-white/[0.02] w-full">
        <FaqAccordion />
      </div>
    </MainLayout>
  );
}
