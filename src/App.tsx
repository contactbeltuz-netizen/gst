/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Home from "./components/Home";
import About from "./components/About";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Dashboard from "./components/Dashboard";
import Blog from "./components/Blog";
import BlogPostSection83 from "./components/BlogPostSection83";
import BlogPostDetail from "./components/BlogPostDetail";
import GSTCalculator from "./components/GSTCalculator";
import HSNCodeFinder from "./components/HSNCodeFinder";
import Chatbot from "./components/Chatbot";
import AnalyticsTracker from "./components/AnalyticsTracker";
import Login from "./components/Login";
import ClientPortal from "./components/ClientPortal";

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPostDetail />} />
          <Route path="/gst-calculator" element={<GSTCalculator />} />
          <Route path="/hsn-code-finder" element={<HSNCodeFinder />} />
          <Route path="/when-does-a-gst-proceeding-begin-clearing-the-fog-around-section-83-and-msme-protection" element={<BlogPostSection83 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/client-portal" element={<ClientPortal />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Chatbot />
      </Router>
    </HelmetProvider>
  );
}
