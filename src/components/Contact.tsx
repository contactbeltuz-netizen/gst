import React from "react";
import { motion } from "motion/react";
import MainLayout from "./MainLayout";
import LeadForm from "./LeadForm";
import SEO from "./SEO";

export default function Contact() {
  return (
    <MainLayout>
      <SEO 
        title="Contact Us | MyGST Solution" 
        description="Ready to streamline your GST compliance? Reach out to our GST experts for a personalized online consultation. Get in touch within 5 minutes."
      />
      <div className="py-24 px-6 max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white leading-[1.1]">
            Contact <span className="text-amber-400">Us</span>
          </h1>
          <p className="text-slate-400 text-lg mb-8 leading-relaxed">
            Ready to streamline your GST compliance? Reach out to our experts for a personalized consultation. Fill out the form and our team will get in touch with you within 5 minutes.
          </p>
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold">@</div>
               <div>
                 <p className="text-white font-bold">Email Support</p>
                 <p className="text-sm text-slate-400">hello@mygstsolution.com</p>
               </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
               <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center font-bold">P</div>
               <div>
                 <p className="text-white font-bold">Call & WhatsApp</p>
                 <p className="text-sm text-slate-400">+91 80173 30398</p>
               </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
               <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center font-bold">A</div>
               <div>
                 <p className="text-white font-bold">Address</p>
                 <p className="text-sm text-slate-400">1, Abdul Hamid Street<br/>Room No. 204C, 2nd Floor<br/>Kolkata: 700069</p>
               </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 w-full max-w-md mx-auto"
        >
          <LeadForm />
        </motion.div>
      </div>
    </MainLayout>
  );
}
