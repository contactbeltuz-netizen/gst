import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import nodemailer from "nodemailer";

// Simple state to hold ethereal email credentials to avoid generating them on every request
let testAccount: nodemailer.TestAccount | null = null;
let transporter: nodemailer.Transporter | null = null;

async function setupMailer() {
  if (!transporter) {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Setup ethereal email for testing
      console.log("Setting up test Ethereal email account...");
      testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log("Ethereal test account created successfully.");
    }
  }
  return transporter;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // 301 Redirect Architecture for Legacy URLs
  app.use((req, res, next) => {
    const legacyRedirects: Record<string, string> = {
      "/about-us/": "/",
      "/services/": "/",
      "/contact-us/": "/",
      "/about-us": "/",
      "/services": "/",
      "/contact-us": "/"
    };

    if (legacyRedirects[req.path]) {
      // 301 Moved Permanently preserves SEO link equity
      return res.redirect(301, legacyRedirects[req.path]);
    }
    next();
  });

  // Chatbot API Route
  app.post("/api/chat", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API Key is not set in backend settings." });
      }

      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const { messages, speedConfig } = req.body;
      
      let model = 'gemini-3.5-flash';
      let thinkingConfig: any = undefined;

      if (speedConfig === 'fast') {
        model = 'gemini-3.1-flash-lite';
      } else if (speedConfig === 'deep') {
        model = 'gemini-3.1-pro-preview';
        thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const response = await ai.models.generateContentStream({
        model,
        contents: messages,
        config: {
          systemInstruction: "You are an expert GST consultant representing MyGST Solution. Give extremely smart, small, and point-specific answers. Use concise bullet points where possible. Avoid fluff.",
          thinkingConfig
        }
      });

      for await (const chunk of response) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }
      
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      console.error("Chat API Error:", error);
      res.write(`data: ${JSON.stringify({ error: "Sorry, I am currently unable to process your request." })}\n\n`);
      res.end();
    }
  });

  // Send Email Route (Used by Admin Dashboard for forwarding)
  app.post("/api/send-email", async (req, res) => {
    try {
      const { to, subject, body } = req.body;
      
      const mailer = await setupMailer();
      
      const info = await mailer.sendMail({
        from: '"MyGST System" <noreply@mygstsolution.com>',
        to: to,
        subject: subject,
        text: body,
      });

      console.log(`Email sent: ${info.messageId}`);
      if (testAccount) {
         console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
      
      res.json({ success: true, message: "Email forwarded successfully.", previewUrl: testAccount ? nodemailer.getTestMessageUrl(info) : null });
    } catch (error) {
      console.error("Email API Error:", error);
      res.status(500).json({ error: "Failed to forward email." });
    }
  });

  // Analytics Tracking Route
  app.post("/api/track", (req, res) => {
    try {
      const { event, path, timestamp } = req.body;
      
      // In a real application, you would persist this data to a time-series DB or log stream (e.g. BigQuery, PostgreSQL)
      // For now, we simulate logging to populate tracking data in the backend.
      console.log(`[Analytics Event] ${event.toUpperCase()} | Path: ${path} | Time: ${timestamp}`);
      
      res.status(200).json({ success: true });
    } catch (error) {
       console.error("Analytics Tracking Error:", error);
       res.status(500).json({ error: "Failed to track event" });
    }
  });

  // Mock Lead Database Structure
  const mockLeads = [
    { id: '1', name: "TechVision India", email: "tech@techvision.com", phone: "1234567890", service: "GST Registration", status: "In-Progress", date: "2026-06-20" },
    { id: '2', name: "Rahul Mehta", email: "rahul@example.com", phone: "9876543210", service: "Annual Return", status: "In-Progress", date: "2026-06-19" },
    { id: '3', name: "Acme Exports", email: "contact@acme.com", phone: "5551234567", service: "GST Notice Reply", status: "Converted", date: "2026-06-18" },
    { id: '4', name: "Priya Sharma", email: "p.sharma@example.com", phone: "4445556666", service: "General Inquiry", status: "New", date: "2026-06-20" },
    { id: '5', name: "Vikram Singh", email: "vsingh_logistics@example.com", phone: "3334445555", service: "Advisory", status: "New", date: "2026-06-19" },
  ];

  // API Route to Get Leads
  app.get("/api/leads", (req, res) => {
    res.json(mockLeads);
  });

  // API Route to Update Lead Status
  app.put("/api/leads/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const lead = mockLeads.find(l => l.id === id);
      if (lead) {
         lead.status = status;
         res.json({ success: true, lead });
      } else {
         res.status(404).json({ error: "Lead not found" });
      }
    } catch (e) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Login API Route
  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    // Hardcoded demo credentials
    if (email === "admin@mygstsolution.com" && password === "admin123") {
      return res.json({ token: "admin_token_xyz123", role: "admin", name: "Business Owner" });
    } else if (email === "client@demo.com" && password === "client123") {
      return res.json({ token: "client_token_abc456", role: "client", name: "Demo Client" });
    } else {
      return res.status(401).json({ error: "Invalid email or password." });
    }
  });

  // API Route for Lead Submissions
  app.post("/api/submit-lead", async (req, res) => {
    try {
      const { name, phone, business_type, service, email } = req.body;
      
      // Send an automated notification to the designated consultant
      const mailer = await setupMailer();
      
      const consultantEmails = {
        "Small Business (SME)": "sme-consultant@mygstsolution.com",
        "Mid-Large Enterprise": "enterprise-consultant@mygstsolution.com",
        "Startup": "startup-advisory@mygstsolution.com"
      };
      
      const toEmail = consultantEmails[business_type as keyof typeof consultantEmails] || "sales@mygstsolution.com";
      
      // Save lead to mock database
      mockLeads.unshift({
        id: Date.now().toString(),
        name,
        email: email || toEmail, // use toEmail if lead email is not supplied in simple form
        phone,
        service,
        status: 'New',
        date: new Date().toISOString().split('T')[0]
      });
      
      const info = await mailer.sendMail({
        from: '"MyGST Lead System" <noreply@mygstsolution.com>',
        to: toEmail,
        subject: `New Lead: ${name} - ${service}`,
        text: `A new lead has been submitted via the website.

Details:
- Name: ${name}
- Phone: ${phone}
- Business Type: ${business_type}
- Service Needed: ${service}

Please follow up with this prospect.`,
      });

      console.log(`Lead Notification sent: ${info.messageId}`);
      if (testAccount) {
         console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }

      res.json({ success: true, previewUrl: testAccount ? nodemailer.getTestMessageUrl(info) : null });
    } catch (error) {
      console.error("Lead submission Error:", error);
      res.status(500).json({ error: "Error processing lead submission." });
    }
  });

  // API Route for HSN Tool Lead Submissions
  app.post("/api/submit-hsn-lead", async (req, res) => {
    try {
      const { email, phone, search } = req.body;
      
      const mailer = await setupMailer();
      
      const info = await mailer.sendMail({
        from: '"MyGST Lead System" <noreply@mygstsolution.com>',
        to: "admin@mygstsolution.com",
        subject: `High-Value Lead: HSN Code Finder`,
        text: `A new lead has unlocked the HSN Code Finder.

Details:
- Email: ${email || "Not Provided"}
- Phone: ${phone || "Not Provided"}
- Searched Term: ${search || "None"}

This is considered a high-value lead exploring GST rate compliance.`,
      });

      console.log(`HSN Lead Notification sent: ${info.messageId}`);
      if (testAccount) {
         console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }

      res.json({ success: true, previewUrl: testAccount ? nodemailer.getTestMessageUrl(info) : null });
    } catch (error) {
      console.error("HSN Lead submission Error:", error);
      res.status(500).json({ error: "Error processing lead submission." });
    }
  });

  // API Route for Keywords (Dynamic AI Lead Generation Insights)
  app.get("/api/keywords", async (req, res) => {
    try {
      // If the API key is not present, fallback to simulated data
      if (!process.env.GEMINI_API_KEY) {
        return res.json([
          { keyword: "GST Refund for Export of Services", volume: "High", difficulty: "Medium", trend: "+25%" },
          { keyword: "GSTR-9C Last Date 2024", volume: "Very High", difficulty: "High", trend: "+80%" },
          { keyword: "Input Tax Credit on Electric Vehicles", volume: "Medium", difficulty: "Low", trend: "+15%" },
          { keyword: "GST Notice for Mismatch in GSTR 3B vs 2A", volume: "High", difficulty: "Medium", trend: "+40%" },
        ]);
      }

      // Automatically generate trending SEO keywords relevant to GST and Financial compliance
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are a specialized SEO expert for the Indian GST and compliance market. 
      Generate 4 trending, high-value search keywords related to GST compliance, returns, notices, or refunds.
      Provide realistic estimates. Format the response as a JSON array of objects with these exact keys:
      "keyword" (string), "volume" (string like "High", "Medium", "Low", "Very High"), "difficulty" (string like "Hard", "Medium", "Easy"), "trend" (string like "+10%", "+40%").
      DO NOT output any markdown blocks, backticks, or explanation. ONLY output the raw JSON array.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      if (response.text) {
        // Strip markdown backticks if they leak through
        const cleanJson = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanJson);
        return res.json(data);
      }
    } catch (error) {
      console.error("SEO Keyword Gen API Error:", error);
      return res.json([
        { keyword: "GST Return Filing Error", volume: "High", difficulty: "Medium", trend: "+10%" },
        { keyword: "ASMT-10 Reply Format", volume: "Medium", difficulty: "Hard", trend: "+20%" }
      ]);
    }
  });

  // API Route for Dynamic HSN Search
  app.post("/api/hsn-lookup", async (req, res) => {
    try {
      const { search } = req.body;
      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API Key is not set." });
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are an expert Indian GST consultant. Find the exact HSN or SAC code and GST rate for the following item/service: "${search}".
      Format the response as a JSON array of objects, providing the 1-3 most relevant and specific results. Each object must have these exact keys: "code" (string), "description" (string), "rate" (string).
      Example: [{"code": "18069010", "description": "Chocolate and chocolate products (bars, truffles, boxes)", "rate": "18%"}].
      If you cannot determine it or it's invalid, return an empty array [].
      DO NOT output any markdown blocks or backticks, ONLY raw JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      if (response.text) {
        const cleanJson = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanJson);
        return res.json(data);
      }
      return res.json([]);
    } catch (error) {
      console.error("HSN Lookup API Error:", error);
      res.status(500).json({ error: "Failed to lookup HSN code" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
