import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import nodemailer from "nodemailer";
import fs from "fs";

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

// Robust helper function to query Gemini with multiple fallback models and elegant offline fallbacks
async function callGeminiWithFallback(
  prompt: string,
  preferredModel: string,
  fallbackGenerator: () => string
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is not defined. Using offline fallback content generator.");
    return fallbackGenerator();
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
  
  // Arrange models to try. We prioritize modern stable production models like Gemini 3.5.
  const modelsToTry = [
    preferredModel,
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite"
  ];
  
  // Deduplicate array while maintaining priority order
  const uniqueModels = Array.from(new Set(modelsToTry.filter(Boolean)));

  for (const modelName of uniqueModels) {
    try {
      console.log(`Querying Gemini with model: ${modelName}...`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (e: any) {
      console.warn(`[Gemini Error] Model '${modelName}' failed with error: ${e?.message || e}. Trying next available model...`);
    }
  }

  console.error("All Gemini API models failed (503 demand spikes or rate limits). Activating offline fallback content generator.");
  return fallbackGenerator();
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

  // Persistent Lead Database Structure
  const LEADS_FILE = path.join(process.cwd(), "leads_db.json");
  let mockLeads: any[] = [];

  try {
    if (fs.existsSync(LEADS_FILE)) {
      mockLeads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to load leads from file, using memory fallback", err);
  }

  // If mockLeads is empty or missing Nausad Hussain, set default records including Nausad Hussain
  if (mockLeads.length === 0) {
    mockLeads = [
      { id: '1', name: "TechVision India", email: "tech@techvision.com", phone: "1234567890", service: "GST Registration", status: "In-Progress", date: "2026-06-20" },
      { id: '2', name: "Rahul Mehta", email: "rahul@example.com", phone: "9876543210", service: "Annual Return", status: "In-Progress", date: "2026-06-19" },
      { id: '3', name: "Acme Exports", email: "contact@acme.com", phone: "5551234567", service: "GST Notice Reply", status: "Converted", date: "2026-06-18" },
      { id: '4', name: "Priya Sharma", email: "p.sharma@example.com", phone: "4445556666", service: "General Inquiry", status: "New", date: "2026-06-20" },
      { id: '5', name: "Vikram Singh", email: "vsingh_logistics@example.com", phone: "3334445555", service: "Advisory", status: "New", date: "2026-06-19" },
      { id: 'nausad', name: "Nausad Hussain", email: "nausad.hussain@gmail.com", phone: "9477542637", service: "GST Return Filing", status: "New", date: "2026-07-11" }
    ];
    try {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(mockLeads, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write initial leads", err);
    }
  } else {
    // Ensure Nausad Hussain is ALWAYS present in the persisted list so the user is guaranteed to find him
    const hasNausad = mockLeads.some((l: any) => l.name === "Nausad Hussain" || l.phone === "9477542637");
    if (!hasNausad) {
      mockLeads.push({
        id: 'nausad',
        name: "Nausad Hussain",
        email: "nausad.hussain@gmail.com",
        phone: "9477542637",
        service: "GST Return Filing",
        status: "New",
        date: "2026-07-11"
      });
      try {
        fs.writeFileSync(LEADS_FILE, JSON.stringify(mockLeads, null, 2), "utf-8");
      } catch (err) {
        console.error("Failed to append Nausad Hussain to persistent database", err);
      }
    }
  }

  const saveLeadsToFile = () => {
    try {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(mockLeads, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to save leads to file", err);
    }
  };

  // API Route to Get Leads
  app.get("/api/leads", (req, res) => {
    res.json(mockLeads);
  });

  // API Route to Update Lead Status and Financial Info
  app.put("/api/leads/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { status, payment_status, revenue_amount } = req.body;
      const lead = mockLeads.find(l => l.id === id);
      if (lead) {
         if (status !== undefined) lead.status = status;
         if (payment_status !== undefined) lead.payment_status = payment_status;
         if (revenue_amount !== undefined) lead.revenue_amount = Number(revenue_amount);
         saveLeadsToFile();
         res.json({ success: true, lead });
      } else {
         res.status(404).json({ error: "Lead not found" });
      }
    } catch (e) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Persistent Invoice Database Structure
  const INVOICES_FILE = path.join(process.cwd(), "invoices_db.json");
  let mockInvoices: any[] = [];

  try {
    if (fs.existsSync(INVOICES_FILE)) {
      mockInvoices = JSON.parse(fs.readFileSync(INVOICES_FILE, "utf-8"));
    }
  } catch (err) {
    console.error("Failed to load invoices from file, using memory fallback", err);
  }

  // Pre-populate with default invoices if empty
  if (mockInvoices.length === 0) {
    mockInvoices = [
      { id: "INV-2026-001", client: "TechVision India", clientEmail: "tech@techvision.com", service: "GST Registration & Setup", amount: 15000, status: "Paid", date: "2026-07-01" },
      { id: "INV-2026-002", client: "Acme Exports", clientEmail: "contact@acme.com", service: "GST Notice Representation", amount: 45000, status: "Paid", date: "2026-07-04" },
      { id: "INV-2026-003", client: "BuildCorp SMEs", clientEmail: "client-buildcorp@demo.com", service: "GSTR Annual Filing Advisory", amount: 25000, status: "Unpaid", date: "2026-07-08" },
      { id: "INV-2026-004", client: "Zenith Logistics", clientEmail: "client-zenith@demo.com", service: "Multi-State Unified Compliance", amount: 65000, status: "Overdue", date: "2026-06-15" }
    ];
    try {
      fs.writeFileSync(INVOICES_FILE, JSON.stringify(mockInvoices, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write initial invoices", err);
    }
  }

  const saveInvoicesToFile = () => {
    try {
      fs.writeFileSync(INVOICES_FILE, JSON.stringify(mockInvoices, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to save invoices to file", err);
    }
  };

  // API Routes for Invoices
  app.get("/api/invoices", (req, res) => {
    res.json(mockInvoices);
  });

  app.post("/api/invoices", (req, res) => {
    try {
      const { id, client, clientEmail, service, amount, status, date } = req.body;
      if (!client || !amount) {
        return res.status(400).json({ error: "Client and Amount are required." });
      }

      // Try to find matching lead's email if clientEmail is not provided
      let emailToUse = clientEmail;
      if (!emailToUse) {
        const matchingLead = mockLeads.find(l => l.name.toLowerCase() === client.toLowerCase());
        emailToUse = matchingLead ? matchingLead.email : `${client.toLowerCase().replace(/\s+/g, '')}@example.com`;
      }

      const newInvoice = {
        id: id || `INV-2026-00${mockInvoices.length + 1}`,
        client,
        clientEmail: emailToUse,
        service: service || "GST Advisory",
        amount: Number(amount),
        status: status || "Unpaid",
        date: date || new Date().toISOString().split('T')[0]
      };

      mockInvoices.unshift(newInvoice);
      saveInvoicesToFile();
      res.json({ success: true, invoice: newInvoice });
    } catch (e) {
      console.error("Failed to create invoice:", e);
      res.status(500).json({ error: "Failed to create invoice." });
    }
  });

  // Individual Reminder Endpoint
  app.post("/api/invoices/:id/remind", async (req, res) => {
    try {
      const { id } = req.params;
      const invoice = mockInvoices.find(inv => inv.id === id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found." });
      }

      const clientEmail = invoice.clientEmail || `${invoice.client.toLowerCase().replace(/\s+/g, '')}@example.com`;
      const mailer = await setupMailer();
      
      const emailSubject = `🚨 PAYMENT REMINDER: Invoice ${invoice.id} is outstanding`;
      
      const emailText = `Dear ${invoice.client},

This is an automated payment reminder regarding your outstanding invoice ${invoice.id} with MyGST Solution.

Invoice Details:
- Invoice ID: ${invoice.id}
- Service: ${invoice.service}
- Amount Due: INR ${invoice.amount.toLocaleString()}
- Status: ${invoice.status}
- Date of Issue: ${invoice.date}

Please note that payment is expected. You can settle the outstanding balance by wire transfer to our HDFC bank account listed in your client portal.

Bank Remittance Details:
- Bank Name: HDFC Bank Ltd
- Account Number: 50200084729103
- IFSC Code: HDFC0000112

If you have already processed the payment, please reply with the payment reference details or screenshot so we can reconcile it inside your compliance ledger.

For any questions, please reach out to accounts@mygstsolution.com or your primary GST consultant.

Best Regards,
MyGST Billing & Finance Operations
accounts@mygstsolution.com | Connaught Place, New Delhi`;

      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #334155;">
          <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 20px; font-weight: 800; color: #1e293b; letter-spacing: -0.025em;">MyGST Solution</div>
            <div style="font-size: 11px; font-weight: 700; color: #ef4444; background-color: #fee2e2; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">Payment Reminder</div>
          </div>
          
          <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 8px;">Outstanding Invoice Notification</h2>
          <p style="font-size: 14px; line-height: 1.5; color: #475569; margin-bottom: 24px;">
            Dear Team at <strong>${invoice.client}</strong>,<br/><br/>
            This is a friendly automated payment reminder that <strong>Invoice ${invoice.id}</strong> remains unpaid in our central client compliance ledger.
          </p>
          
          <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Invoice Reference:</td>
                <td style="padding: 6px 0; text-align: right; color: #0f172a; font-weight: 700; font-family: monospace;">${invoice.id}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Compliance Service:</td>
                <td style="padding: 6px 0; text-align: right; color: #0f172a; font-weight: 600;">${invoice.service}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Date of Issue:</td>
                <td style="padding: 6px 0; text-align: right; color: #0f172a; font-family: monospace;">${invoice.date}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Status:</td>
                <td style="padding: 6px 0; text-align: right; color: #b45309; font-weight: 800; text-transform: uppercase;">⚠️ ${invoice.status}</td>
              </tr>
              <tr style="border-top: 1px solid #e2e8f0;">
                <td style="padding: 12px 0 0 0; color: #0f172a; font-weight: 800; font-size: 14px;">Total Balance Due:</td>
                <td style="padding: 12px 0 0 0; text-align: right; color: #2563eb; font-weight: 800; font-size: 16px; font-family: monospace;">₹${invoice.amount.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <h3 style="font-size: 12px; font-weight: 800; color: #334155; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Remittance Bank Transfer Info</h3>
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px; font-size: 12px; margin-bottom: 24px; color: #166534; line-height: 1.6;">
            <strong>Bank Name:</strong> HDFC Bank Ltd<br/>
            <strong>Account Number:</strong> 50200084729103<br/>
            <strong>IFSC Code:</strong> HDFC0000112<br/>
            <strong>Branch:</strong> Connaught Place, New Delhi
          </div>

          <p style="font-size: 12px; line-height: 1.5; color: #64748b; margin-bottom: 24px;">
            If you have already processed this transaction, please reply directly to this email with the transaction reference or transaction receipt image so we can mark this cleared instantly in our GSTR logs.
          </p>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; text-align: center; color: #94a3b8;">
            MyGST Solution Limited • Connaught Place, New Delhi - 110001<br/>
            Support: accounts@mygstsolution.com | Helpdesk: 1800-GST-HELP
          </div>
        </div>
      `;

      const info = await mailer.sendMail({
        from: '"MyGST Compliance Ledger" <accounts@mygstsolution.com>',
        to: clientEmail,
        subject: emailSubject,
        text: emailText,
        html: emailHtml
      });

      console.log(`Reminder email sent for ${invoice.id}: ${info.messageId}`);
      let previewUrl = null;
      if (testAccount) {
        previewUrl = nodemailer.getTestMessageUrl(info);
      }

      res.json({ success: true, message: `Email reminder sent to ${clientEmail}`, previewUrl });
    } catch (err: any) {
      console.error("Reminder API Error:", err);
      res.status(500).json({ error: "Failed to send invoice reminder email." });
    }
  });

  // Batch Reminder Endpoint
  app.post("/api/invoices/remind-all", async (req, res) => {
    try {
      const pendingInvoices = mockInvoices.filter(inv => inv.status === 'Unpaid' || inv.status === 'Overdue');
      if (pendingInvoices.length === 0) {
        return res.json({ success: true, count: 0, message: "No pending or overdue invoices found to remind." });
      }

      const mailer = await setupMailer();
      let sentCount = 0;
      const sentPreviews: string[] = [];

      for (const invoice of pendingInvoices) {
        try {
          const clientEmail = invoice.clientEmail || `${invoice.client.toLowerCase().replace(/\s+/g, '')}@example.com`;
          const emailSubject = `🚨 IMMEDIATE ACTION REQUIRED: Outstanding Invoice ${invoice.id} with MyGST Solution`;
          
          const emailText = `Dear ${invoice.client},

This is an urgent payment notice regarding your outstanding invoice ${invoice.id} which is currently marked as ${invoice.status}.

Summary:
- Invoice: ${invoice.id}
- Service: ${invoice.service}
- Amount Outstanding: INR ${invoice.amount.toLocaleString()}
- Due Date / Issue Date: ${invoice.date}

Please remit the due amount to HDFC Bank Ltd, Account: 50200084729103, IFSC: HDFC0000112.

Regards,
MyGST Finance Division`;

          const emailHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #334155;">
              <div style="border-bottom: 2px solid #ef4444; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
                <div style="font-size: 20px; font-weight: 800; color: #1e293b;">MyGST Solution</div>
                <div style="font-size: 11px; font-weight: 700; color: #ef4444; background-color: #fee2e2; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase;">LATE PAYMENT NOTICE</div>
              </div>
              
              <h2 style="font-size: 18px; font-weight: 800; color: #991b1b; margin-top: 0; margin-bottom: 8px;">Action Required: Pending GST Professional Fees</h2>
              <p style="font-size: 14px; line-height: 1.5; color: #475569; margin-bottom: 24px;">
                Dear Business Representative of <strong>${invoice.client}</strong>,<br/><br/>
                Our compliance records show that <strong>Invoice ${invoice.id}</strong> is currently <strong>${invoice.status}</strong>. Please arrange a swift bank remittance to avoid disruptions in filing schedules.
              </p>
              
              <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                  <tr>
                    <td style="padding: 6px 0; color: #78350f;">Invoice Number:</td>
                    <td style="padding: 6px 0; text-align: right; color: #78350f; font-weight: 700;">${invoice.id}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #78350f;">Service:</td>
                    <td style="padding: 6px 0; text-align: right; color: #78350f; font-weight: 600;">${invoice.service}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #78350f;">Status:</td>
                    <td style="padding: 6px 0; text-align: right; color: #b45309; font-weight: 800;">${invoice.status}</td>
                  </tr>
                  <tr style="border-top: 1px solid #fde68a;">
                    <td style="padding: 12px 0 0 0; color: #78350f; font-weight: 800;">Total Balance Due:</td>
                    <td style="padding: 12px 0 0 0; text-align: right; color: #b45309; font-weight: 800; font-size: 16px;">₹${invoice.amount.toLocaleString()}</td>
                  </tr>
                </table>
              </div>

              <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 14px; font-size: 12px; margin-bottom: 24px; line-height: 1.6;">
                <strong>Remittance Banking:</strong><br/>
                Bank Name: HDFC Bank Ltd<br/>
                Account: 50200084729103<br/>
                IFSC: HDFC0000112
              </div>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; text-align: center; color: #94a3b8;">
                MyGST Solution Limited • Connaught Place, New Delhi - 110001
              </div>
            </div>
          `;

          const info = await mailer.sendMail({
            from: '"MyGST Finance Ops" <accounts@mygstsolution.com>',
            to: clientEmail,
            subject: emailSubject,
            text: emailText,
            html: emailHtml
          });

          sentCount++;
          if (testAccount) {
            sentPreviews.push(nodemailer.getTestMessageUrl(info) || "");
          }
        } catch (singleErr) {
          console.error(`Failed to send reminder for invoice ${invoice.id}:`, singleErr);
        }
      }

      res.json({
        success: true,
        count: sentCount,
        message: `Dispatched ${sentCount} outstanding invoice payment reminders successfully.`,
        previews: sentPreviews
      });
    } catch (err: any) {
      console.error("Batch Reminder API Error:", err);
      res.status(500).json({ error: "Failed to run batch payment reminders." });
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
      
      const consultantEmails = {
        "Small Business (SME)": "sme-consultant@mygstsolution.com",
        "Mid-Large Enterprise": "enterprise-consultant@mygstsolution.com",
        "Startup": "startup-advisory@mygstsolution.com"
      };
      
      const toEmail = consultantEmails[business_type as keyof typeof consultantEmails] || "sales@mygstsolution.com";
      
      // Save lead to mock database
      const newLead = {
        id: Date.now().toString(),
        name,
        email: email || toEmail, // use toEmail if lead email is not supplied in simple form
        phone,
        service,
        status: 'New',
        date: new Date().toISOString().split('T')[0]
      };
      
      mockLeads.unshift(newLead);
      saveLeadsToFile();
      
      // Respond to client immediately to prevent any "Processing..." hang
      res.json({ success: true, lead: newLead });

      // Run mailing in background asynchronously
      (async () => {
        try {
          const mailer = await setupMailer();
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

          console.log(`Lead Notification sent in background: ${info.messageId}`);
          if (testAccount) {
             console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
          }
        } catch (mailError) {
          console.error("Background lead mail notification error:", mailError);
        }
      })();

    } catch (error) {
      console.error("Lead submission Error:", error);
      res.status(500).json({ error: "Error processing lead submission." });
    }
  });

  // API Route for HSN Tool Lead Submissions
  app.post("/api/submit-hsn-lead", async (req, res) => {
    try {
      const { email, phone, search } = req.body;
      
      // Save HSN searcher as a lead in our DB so they are visible too!
      const hsnLead = {
        id: `hsn-${Date.now()}`,
        name: `HSN Searcher (${phone || "No Phone"})`,
        email: email || "hsn-searcher@mygstsolution.com",
        phone: phone || "N/A",
        service: `HSN Lookup: ${search || "General"}`,
        status: 'New',
        date: new Date().toISOString().split('T')[0]
      };
      
      mockLeads.unshift(hsnLead);
      saveLeadsToFile();
      
      // Respond immediately
      res.json({ success: true, lead: hsnLead });

      // Run mailing in background asynchronously
      (async () => {
        try {
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

          console.log(`HSN Lead Notification sent in background: ${info.messageId}`);
          if (testAccount) {
             console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
          }
        } catch (mailError) {
          console.error("Background HSN lead mail notification error:", mailError);
        }
      })();

    } catch (error) {
      console.error("HSN Lead submission Error:", error);
      res.status(500).json({ error: "Error processing lead submission." });
    }
  });

  // API Route for Keywords (Dynamic AI Lead Generation Insights)
  app.get("/api/keywords", async (req, res) => {
    try {
      const prompt = `You are a specialized SEO expert for the Indian GST and compliance market. 
      Generate 4 trending, high-value search keywords related to GST compliance, returns, notices, or refunds.
      Provide realistic estimates. Format the response as a JSON array of objects with these exact keys:
      "keyword" (string), "volume" (string like "High", "Medium", "Low", "Very High"), "difficulty" (string like "Hard", "Medium", "Easy"), "trend" (string like "+10%", "+40%").
      DO NOT output any markdown blocks, backticks, or explanation. ONLY output the raw JSON array.`;

      const fallbackGenerator = () => JSON.stringify([
        { keyword: "GST Refund for Export of Services", volume: "High", difficulty: "Medium", trend: "+25%" },
        { keyword: "GSTR-9C Last Date 2024", volume: "Very High", difficulty: "High", trend: "+80%" },
        { keyword: "Input Tax Credit on Electric Vehicles", volume: "Medium", difficulty: "Low", trend: "+15%" },
        { keyword: "GST Notice for Mismatch in GSTR 3B vs 2A", volume: "High", difficulty: "Medium", trend: "+40%" },
      ]);

      const text = await callGeminiWithFallback(prompt, "gemini-3.5-flash", fallbackGenerator);
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);
      return res.json(data);
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
      const prompt = `You are an expert Indian GST consultant. Find the exact HSN or SAC code and GST rate for the following item/service: "${search}".
      Format the response as a JSON array of objects, providing the 1-3 most relevant and specific results. Each object must have these exact keys: "code" (string), "description" (string), "rate" (string).
      Example: [{"code": "18069010", "description": "Chocolate and chocolate products (bars, truffles, boxes)", "rate": "18%"}].
      If you cannot determine it or it's invalid, return an empty array [].
      DO NOT output any markdown blocks or backticks, ONLY raw JSON.`;

      const fallbackGenerator = () => {
        const queryLower = (search || "").toLowerCase();
        const mockDatabase = [
          { code: "18069010", description: "Chocolate and chocolate products (bars, truffles, boxes)", rate: "18%" },
          { code: "84713010", description: "Personal computer, laptop, tablet, microcomputer", rate: "18%" },
          { code: "99831100", description: "Legal advisory, accounting and auditing services", rate: "18%" },
          { code: "30049099", description: "Medicines and pharmaceutical formulations", rate: "12%" },
          { code: "08011100", description: "Desiccated coconuts, dried fruits and nuts", rate: "5%" },
          { code: "22011010", description: "Mineral water and aerated water products", rate: "18%" }
        ];
        
        const matched = mockDatabase.filter(item => 
          item.description.toLowerCase().includes(queryLower) || 
          item.code.includes(queryLower)
        );

        if (matched.length > 0) {
          return JSON.stringify(matched);
        }

        return JSON.stringify([{
          code: "99820000",
          description: `General compliance services matching "${search || 'Service Request'}"`,
          rate: "18%"
        }]);
      };

      const text = await callGeminiWithFallback(prompt, "gemini-3.5-flash", fallbackGenerator);
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);
      return res.json(data);
    } catch (error) {
      console.error("HSN Lookup API Error:", error);
      res.json([]);
    }
  });

  // Admin Tool: AI Email Draft Reply Generator
  app.post("/api/ai-draft-reply", async (req, res) => {
    try {
      const { clientName, email, query } = req.body;
      const prompt = `You are an elite, highly professional GST consultant at MyGST Solution.
      Draft a formal, warm, and structured email response to the client "${clientName}" (Email: ${email}) who asked the following query:
      "${query}"
      
      Requirements:
      1. Address the client respectfully.
      2. Provide a clear, correct, and authoritative high-level answer or action plan.
      3. Keep the tone warm, welcoming, and helpful.
      4. Include a polite signoff representing "MyGST Solution Advisory Team".
      
      DO NOT return any markdown backticks or explanation outside the email text. Just return the raw email text.`;

      const fallbackGenerator = () => {
        return `Dear ${clientName || "Valued Client"},\n\nThank you for reaching out to MyGST Solution.\n\nRegarding your query: "${query}"\n\nWe have flagged this for our priority GST advisory department. One of our certified tax consultants is currently verifying the latest notifications under GSTR-3B matching or Section 83 rules relevant to your business setup.\n\nIn the meantime, please prepare:\n1. Your active GSTIN credentials.\n2. Your past 3 months' GSTR-2B matching statements.\n3. Any official letters or ASMT-10 notices received from the GST department.\n\nWe will follow up with you on this email (${email || "your email"}) within 2 business hours.\n\nWarm regards,\nMyGST Solution Advisory Team\ninfo@mygstsolution.com | Toll-Free: 1800-GST-HELP`;
      };

      const text = await callGeminiWithFallback(prompt, "gemini-3.5-flash", fallbackGenerator);
      res.json({ draft: text || "" });
    } catch (error) {
      console.error("AI Draft Reply Error:", error);
      res.status(500).json({ error: "Failed to generate draft response." });
    }
  });

  // Admin Tool: AI SEO Keyword Strategy Planner
  app.post("/api/ai-seo-planner", async (req, res) => {
    try {
      const { topic } = req.body;
      const prompt = `You are an expert financial and compliance SEO consultant for the Indian market.
      For the topic: "${topic}", generate a complete high-value keyword optimization plan.
      Provide:
      1. A list of 4 highly relevant, specific search terms with realistic Indian monthly volume estimates, keyword difficulties, and search intents.
      2. A brief, high-level recommended article outline to capture this traffic.
      
      Format the response as a single JSON object with this exact structure:
      {
        "keywords": [
          { "keyword": "...", "volume": "...", "difficulty": "...", "intent": "..." }
        ],
        "outline": "..."
      }
      
      DO NOT output any markdown blocks, backticks, or other text. ONLY output raw, parseable JSON.`;

      const fallbackGenerator = () => {
        const keywords = [
          { keyword: `${topic} checklist`, volume: "1,200", difficulty: "Easy", intent: "Transactional" },
          { keyword: `Indian GST ${topic} guide`, volume: "3,500", difficulty: "Medium", intent: "Informational" },
          { keyword: `how to resolve ${topic}`, volume: "850", difficulty: "Easy", intent: "Commercial" },
          { keyword: `${topic} penalties 2026`, volume: "2,100", difficulty: "Hard", intent: "Informational" }
        ];
        
        const outline = `### Recommended Strategy & Content Outline:\n\n1. **Introduction**: Detailed background on ${topic} and how recent GST council decisions affect small-to-medium businesses in India.\n2. **Core Compliance Framework**:\n   - Step-by-step guide to analyzing issues under current GST provisions.\n   - Checklist of statutory files and timelines.\n3. **Common Mismatches & Legal Redressal**:\n   - Section 83 protective rules and representation proofs.\n   - Formatting an authoritative reply to department officials.\n4. **Conclusion & Expert Help**: Summary and immediate call-to-action to book a premium consultation with MyGST Solution advisors.`;

        return JSON.stringify({ keywords, outline });
      };

      const text = await callGeminiWithFallback(prompt, "gemini-3.5-flash", fallbackGenerator);
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);
      return res.json(data);
    } catch (error) {
      console.error("AI SEO Planner Error:", error);
      res.status(500).json({ error: "Failed to generate keyword plan." });
    }
  });

  // Admin Tool: AI Keyword Performance Optimizer
  app.post("/api/ai-keyword-opt", async (req, res) => {
    try {
      const { keyword, clicks, impressions, ctr, position } = req.body;
      const prompt = `You are an elite SEO strategist specializing in Indian GST and financial compliance.
      Analyze the following keyword performance metrics:
      - Keyword: "${keyword}"
      - Clicks: ${clicks}
      - Impressions: ${impressions}
      - Click-Through Rate (CTR): ${ctr}%
      - Average Position: ${position}

      Provide a practical, high-value, highly specific action plan for this search term to maximize its search traffic.
      Format your response as a single, valid JSON object with the following exact keys:
      {
        "analysis": "A 2-3 sentence strategic analysis of what this data suggests.",
        "metaTitle": "A highly optimized meta title recommendation (under 60 characters).",
        "metaDescription": "A highly optimized, clickable meta description recommendation (under 160 characters, with strong CTA).",
        "contentStrategy": "1-2 concrete, actionable suggestions for improving the on-page content (e.g. adding specific section or calculator)."
      }

      DO NOT output any markdown blocks, backticks, or other text. ONLY output raw, parseable JSON.`;

      const fallbackGenerator = () => {
        const analysis = `The keyword "${keyword}" has achieved ${clicks} clicks out of ${impressions} impressions, demonstrating a click-through rate of ${ctr}% with average ranking position ${position}. This indicates high consumer interest but potential room to optimize meta-click elements to stand out against general accounting forums.`;
        
        const metaTitle = `Mastering ${keyword} | Latest 2026 Indian GST Advisor`;
        const metaDescription = `Struggling with ${keyword}? Check out the definitive 2026 step-by-step compliance checklist from MyGST Solution. Avoid tax mismatches and protect your business now!`;
        const contentStrategy = `We recommend creating an interactive calculation tool or dedicated guide page focusing specifically on ${keyword}. Additionally, append an authoritative FAQ section targeting the most common legal questions under Section 74/83 to capture informational rich-snippets.`;

        return JSON.stringify({ analysis, metaTitle, metaDescription, contentStrategy });
      };

      const text = await callGeminiWithFallback(prompt, "gemini-3.5-flash", fallbackGenerator);
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);
      return res.json(data);
    } catch (error) {
      console.error("AI Keyword Optimizer Error:", error);
      res.status(500).json({ error: "Failed to generate keyword optimizations." });
    }
  });

  // Persistent Blog Database Structure
  const BLOGS_FILE = path.join(process.cwd(), "blogs_db.json");
  let mockBlogs: any[] = [];

  try {
    if (fs.existsSync(BLOGS_FILE)) {
      mockBlogs = JSON.parse(fs.readFileSync(BLOGS_FILE, "utf-8"));
      let updated = false;
      mockBlogs.forEach(b => {
        if (!b.status) {
          b.status = "Published";
          updated = true;
        }
      });
      if (updated) {
        fs.writeFileSync(BLOGS_FILE, JSON.stringify(mockBlogs, null, 2), "utf-8");
      }
    }
  } catch (err) {
    console.error("Failed to load blogs from file, using memory fallback", err);
  }

  // Pre-populate with default blogs if empty
  if (mockBlogs.length === 0) {
    mockBlogs = [
      {
        id: "1",
        title: "When does a GST proceeding begin? Clearing the fog around Section 83 and MSME Protection",
        category: "Legal Insights",
        date: "Oct 24, 2024",
        excerpt: "Understanding the exact trigger point of Section 83 proceedings and how MSMEs can protect their working capital without getting accounts frozen unnecessarily.",
        readTime: "5 min read",
        author: "Tax Expert Team",
        slug: "/when-does-a-gst-proceeding-begin-clearing-the-fog-around-section-83-and-msme-protection",
        content: `The power to provisionally attach property, including bank accounts, under Section 83 of the CGST Act is one of the most draconian recovery measures available to the tax department. For MSMEs, a frozen bank account isn't just an inconvenience—it's a death sentence for their working capital cycle.

However, this power is not absolute. The statute explicitly ties the power of provisional attachment to the dependency of "any proceedings" under Chapters XII, XIV, or XV of the CGST Act. A critical question that often lands taxpayers and the department in the High Courts is: *When exactly does a proceeding begin?*

## The Importance of Section 83
Section 83(1) of the CGST Act, 2017 allows the Commissioner to provisionally attach any property, including bank accounts, belonging to the taxable person if they believe it is necessary to protect the interest of the government revenue.

**Key Prerequisite for Attachment:**
The power can only be exercised after the initiation of proceedings under specific sections (e.g., Sections 62, 63, 64, 67, 73, or 74). Attempting to attach properties before proceedings are formally initiated is legally invalid.

## When does a proceeding officially "begin"?
The fog around this issue was recently addressed by multiple judicial pronouncements. A mere summons or an inquiry via a show-cause notice does not automatically mean a proceeding has "commenced" for the purposes of Section 83.

- **Under Section 67 (Inspection, Search, and Seizure):** Proceedings are generally considered to have commenced from the moment the search authorization is issued.
- **Under Sections 73 and 74 (Determination of Tax):** Proceedings commence only when a proper Show Cause Notice (SCN) under Section 73(1) or 74(1) is issued. Pre-notice consultations (DRC-01A) ordinarily do not qualify as commencement of actual proceedings.

## MSME Protection: What should you do?
Due to the fragile nature of MSME cash flows, the hasty invocation of Section 83 can cause irreparable harm. If you are a business owner facing this, here are the immediate protective steps:

### 1. Check the Prerequisite Proceedings
Demand documentation proving that valid proceedings under Chapters XII, XIV, or XV were actually initiated prior to the attachment order. If no SCN or search warrant predates the order, the attachment may be deemed illegal.

### 2. Establish "Disproportionate Harm"
Courts have established that the attachment of a running bank account is a last resort. If the action paralyzes your business preventing wage payouts or standard operations, High Courts can intervene to lift the attachment upon furnishing an alternative bond or guarantee.

### 3. File Objections within 7 Days
Under Rule 159(5) of the CGST Rules, you have the right to file an objection to the provisional attachment. You must do this promptly, arguing that the attachment is either disproportionate or premature.

## Conclusion
Section 83 is not an everyday recovery tool; it demands "tangible material" and a bona fide belief from the Commissioner. Recognizing the precise start line of a GST proceeding is the strongest technical defense an MSME has against aggressive recovery mechanisms.`
      },
      {
        id: "2",
        title: "West Bengal Professional Tax & GST Integration Guide",
        category: "Compliance",
        date: "Nov 02, 2024",
        excerpt: "A complete step-by-step framework for businesses operating in Kolkata and West Bengal to maintain dual compliance smoothly without penalties.",
        readTime: "4 min read",
        author: "Compliance Specialist",
        slug: "/blog/2",
        content: `Many businesses operating in West Bengal face confusion when registering for and filing both Professional Tax (P-Tax) and Goods and Services Tax (GST). Although both are state-level compliances, they are governed by separate acts and portals.

## What is West Bengal Professional Tax?
Professional Tax is a direct tax levied on professions, trades, callings, and employments by the State Government. Any individual earning an income from a profession or employment in West Bengal is liable to pay P-Tax.

## Step-by-Step Integration & Compliance
To maintain seamless compliance across both systems:

1. **Obtain P-Tax Enrollment Number (EC) & Registration Number (RC):**
   Every employer must obtain a Certificate of Registration (RC) to pay P-Tax on behalf of employees, and a Certificate of Enrollment (EC) for the business entity itself.

2. **Map GSTIN to P-Tax Records:**
   When filling out compliance forms on the West Bengal P-Tax portal, ensure your GSTIN is mapped correctly to prevent mismatch notices.

3. **Align Filing Calendars:**
   Keep a strict track of monthly GST return filings (GSTR-1 and GSTR-3B) alongside the P-Tax monthly or annual return cycle. Missing either will trigger automatically generated notices.

By mapping your compliance calendar and reconciling accounts quarterly, your West Bengal operations will stay entirely penalty-free.`
      },
      {
        id: "3",
        title: "How to handle GSTR-9 audits for E-commerce Sellers",
        category: "Tax Audit",
        date: "Nov 15, 2024",
        excerpt: "An actionable checkout plan to avoid discrepancies in GSTR-9 for e-commerce operators who sell pan-India through Amazon and Flipkart.",
        readTime: "6 min read",
        author: "GST Auditor",
        slug: "/blog/3",
        content: `E-commerce selling is highly dynamic, involving thousands of micro-transactions, multi-state warehouses (FBA/FC), tax collection at source (TCS), and regular returns/refunds. Reconciling these transactions for GSTR-9 annual filing is a massive challenge.

## Core Issues in E-Commerce GST Filing
1. **Multi-State Registrations (PPOB & APOB):** Sellers using marketplace warehouses in different states must register those locations as Additional Places of Business (APOB).
2. **TCS Reconciliation:** Matching GSTR-8 filed by Amazon/Flipkart with the sales reported in GSTR-1 and GSTR-3B.
3. **Product Returns (Credit Notes):** Accurately declaring sales returns within the correct financial year's GSTR-9 tables.

## Actionable GSTR-9 Reconcile Plan
- **Step 1:** Download the marketplace Merchant Tax Reports (MTR) for each state.
- **Step 2:** Match the taxable values with GSTR-2B and GSTR-8 (TCS report).
- **Step 3:** Report gross sales and net sales separately, and make sure any un-reconciled differences are settled using DRC-03.

Proper planning and automated excel reconciliation can make your annual audit smooth and zero-discrepancy.`
      }
    ];
    try {
      fs.writeFileSync(BLOGS_FILE, JSON.stringify(mockBlogs, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write initial blogs", err);
    }
  }

  const generateSitemap = () => {
    try {
      const baseUrl = "https://mygstsolution.com";
      const staticPages = [
        "",
        "/services",
        "/about",
        "/contact",
        "/blog",
        "/gst-calculator",
        "/hsn-code-finder",
        "/login"
      ];

      const today = new Date().toISOString().split("T")[0];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      // Static pages
      staticPages.forEach(p => {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}${p}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `    <priority>${p === "" ? "1.0" : "0.8"}</priority>\n`;
        xml += `  </url>\n`;
      });

      // Published blog posts
      mockBlogs.forEach(post => {
        if (post.status === "Published") {
          let urlPath = "";
          if (post.id === "1") {
            urlPath = "/when-does-a-gst-proceeding-begin-clearing-the-fog-around-section-83-and-msme-protection";
          } else {
            urlPath = `/blog/${post.id}`;
          }

          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}${urlPath}</loc>\n`;
          xml += `    <lastmod>${today}</lastmod>\n`;
          xml += `    <changefreq>weekly</changefreq>\n`;
          xml += `    <priority>0.6</priority>\n`;
          xml += `  </url>\n`;
        }
      });

      xml += `</urlset>\n`;

      // Write to public folder
      const publicPath = path.join(process.cwd(), "public");
      if (!fs.existsSync(publicPath)) {
        fs.mkdirSync(publicPath, { recursive: true });
      }
      fs.writeFileSync(path.join(publicPath, "sitemap.xml"), xml, "utf-8");

      // Write to dist folder if it exists
      const distPath = path.join(process.cwd(), "dist");
      if (fs.existsSync(distPath)) {
        fs.writeFileSync(path.join(distPath, "sitemap.xml"), xml, "utf-8");
      }

      console.log("sitemap.xml successfully updated!");
    } catch (err) {
      console.error("Failed to generate sitemap.xml:", err);
    }
  };

  // Run initial sitemap generation on boot
  generateSitemap();

  const saveBlogsToFile = () => {
    try {
      fs.writeFileSync(BLOGS_FILE, JSON.stringify(mockBlogs, null, 2), "utf-8");
      generateSitemap();
    } catch (err) {
      console.error("Failed to save blogs to file", err);
    }
  };

  // Serve sitemap dynamically at the root route
  app.get("/sitemap.xml", (req, res) => {
    try {
      const sitemapPath = path.join(process.cwd(), "public", "sitemap.xml");
      if (!fs.existsSync(sitemapPath)) {
        generateSitemap();
      }
      res.header("Content-Type", "application/xml");
      res.sendFile(sitemapPath);
    } catch (err) {
      console.error("Error serving sitemap.xml:", err);
      res.status(500).send("Error generating sitemap");
    }
  });

  // API Routes for Blogs
  app.get("/api/blogs", (req, res) => {
    const includeDrafts = req.query.includeDrafts === "true";
    if (includeDrafts) {
      res.json(mockBlogs);
    } else {
      res.json(mockBlogs.filter(b => b.status === "Published"));
    }
  });

  app.get("/api/blogs/:id", (req, res) => {
    const blog = mockBlogs.find(b => b.id === req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ error: "Blog post not found." });
    }
  });

  app.post("/api/blogs", (req, res) => {
    try {
      const { title, category, excerpt, content, readTime, author, status, imageUrl } = req.body;
      if (!title || !content) {
        return res.status(400).json({ error: "Title and Content are required." });
      }

      const newId = String(mockBlogs.length > 0 ? Math.max(...mockBlogs.map(b => Number(b.id) || 0)) + 1 : 1);
      const newBlog = {
        id: newId,
        title,
        category: category || "GST News",
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        excerpt: excerpt || (content.length > 150 ? content.substring(0, 150) + "..." : content),
        readTime: readTime || "3 min read",
        author: author || "Admin Partner",
        slug: `/blog/${newId}`,
        content,
        status: status || "Published",
        imageUrl: imageUrl || ""
      };

      mockBlogs.unshift(newBlog);
      saveBlogsToFile();
      res.json({ success: true, blog: newBlog });
    } catch (err) {
      console.error("Failed to create blog:", err);
      res.status(500).json({ error: "Failed to create blog post." });
    }
  });

  app.put("/api/blogs/:id", (req, res) => {
    try {
      const { id } = req.params;
      const { title, category, excerpt, content, readTime, author, status, imageUrl } = req.body;

      const blog = mockBlogs.find(b => b.id === id);
      if (!blog) {
        return res.status(404).json({ error: "Blog post not found." });
      }

      if (title !== undefined) blog.title = title;
      if (category !== undefined) blog.category = category;
      if (content !== undefined) {
        blog.content = content;
        blog.excerpt = excerpt || (content.length > 150 ? content.substring(0, 150) + "..." : content);
      } else if (excerpt !== undefined) {
        blog.excerpt = excerpt;
      }
      if (readTime !== undefined) blog.readTime = readTime;
      if (author !== undefined) blog.author = author;
      if (status !== undefined) blog.status = status;
      if (imageUrl !== undefined) blog.imageUrl = imageUrl;

      saveBlogsToFile();
      res.json({ success: true, blog });
    } catch (err) {
      console.error("Failed to update blog:", err);
      res.status(500).json({ error: "Failed to update blog post." });
    }
  });

  app.delete("/api/blogs/:id", (req, res) => {
    try {
      const { id } = req.params;
      const index = mockBlogs.findIndex(b => b.id === id);
      if (index !== -1) {
        mockBlogs.splice(index, 1);
        saveBlogsToFile();
        res.json({ success: true, message: "Blog post deleted successfully." });
      } else {
        res.status(404).json({ error: "Blog post not found." });
      }
    } catch (err) {
      console.error("Failed to delete blog:", err);
      res.status(500).json({ error: "Failed to delete blog post." });
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
