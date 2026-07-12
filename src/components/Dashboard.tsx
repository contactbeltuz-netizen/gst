import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { 
  BarChart3, 
  Calculator, 
  ShieldCheck, 
  MessageSquare, 
  TrendingUp, 
  Search, 
  Home, 
  MoreHorizontal, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Send, 
  CheckCircle2, 
  Download, 
  DollarSign,
  Menu,
  X,
  PlusCircle,
  FileText,
  Globe,
  Sparkles,
  SendHorizontal,
  MailCheck,
  AlertCircle,
  Printer,
  BookOpen,
  Trash2,
  Image,
  UploadCloud
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import SEO from "./SEO";
import RegionalSEOStrategy from "./RegionalSEOStrategy";
import KeywordPerformanceTracker from "./KeywordPerformanceTracker";
import { KeywordsSkeleton, BlogLedgerSkeleton } from "./Skeleton";
import GSTComplianceCalendar from "./GSTComplianceCalendar";

interface KeywordData {
  keyword: string;
  volume: string;
  difficulty: string;
  trend: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  status: 'New' | 'In-Progress' | 'Converted';
  date: string;
  payment_status?: 'Paid' | 'Pending' | 'Unpaid';
  revenue_amount?: number;
}

interface Invoice {
  id: string;
  client: string;
  clientEmail?: string;
  service: string;
  amount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  date: string;
}

interface SEOPlannerResult {
  keywords: { keyword: string; volume: string; difficulty: string; intent: string }[];
  outline: string;
}

interface LiveLog {
  id: string;
  time: string;
  event: string;
  badge: string;
  badgeColor: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "traffic" | "seo" | "forms" | "pipeline" | "revenue" | "blog">("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [keywords, setKeywords] = useState<KeywordData[]>([]);
  const [loadingKeywords, setLoadingKeywords] = useState(true);

  // Blog publishing state
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState("GST News");
  const [newBlogExcerpt, setNewBlogExcerpt] = useState("");
  const [newBlogContent, setNewBlogContent] = useState("");
  const [newBlogReadTime, setNewBlogReadTime] = useState("4 min read");
  const [newBlogAuthor, setNewBlogAuthor] = useState("Admin Partner");
  const [newBlogStatus, setNewBlogStatus] = useState<"Published" | "Draft">("Published");
  const [newBlogImageUrl, setNewBlogImageUrl] = useState("");
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [blogSuccess, setBlogSuccess] = useState<string | null>(null);
  const [blogError, setBlogError] = useState<string | null>(null);

  const fetchBlogPosts = async () => {
    try {
      setLoadingBlogs(true);
      const res = await fetch("/api/blogs?includeDrafts=true");
      if (res.ok) {
        const data = await res.json();
        setBlogPosts(data);
      }
    } catch (err) {
      console.error("Failed to fetch blogs in admin:", err);
    } finally {
      setLoadingBlogs(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const handleStartEditBlog = (post: any) => {
    setEditingBlog(post);
    setNewBlogTitle(post.title);
    setNewBlogCategory(post.category || "GST News");
    setNewBlogExcerpt(post.excerpt || "");
    setNewBlogContent(post.content || "");
    setNewBlogReadTime(post.readTime || "4 min read");
    setNewBlogAuthor(post.author || "Admin Partner");
    setNewBlogStatus(post.status || "Published");
    setNewBlogImageUrl(post.imageUrl || "");
  };

  const handleCancelEditBlog = () => {
    setEditingBlog(null);
    setNewBlogTitle("");
    setNewBlogExcerpt("");
    setNewBlogContent("");
    setNewBlogCategory("GST News");
    setNewBlogReadTime("4 min read");
    setNewBlogAuthor("Admin Partner");
    setNewBlogStatus("Published");
    setNewBlogImageUrl("");
  };

  const handleCreateBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogContent) {
      setBlogError("Title and Content are required.");
      return;
    }
    try {
      const url = editingBlog ? `/api/blogs/${editingBlog.id}` : "/api/blogs";
      const method = editingBlog ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newBlogTitle,
          category: newBlogCategory,
          excerpt: newBlogExcerpt,
          content: newBlogContent,
          readTime: newBlogReadTime,
          author: newBlogAuthor,
          status: newBlogStatus,
          imageUrl: newBlogImageUrl
        })
      });
      if (res.ok) {
        setBlogSuccess(editingBlog ? "Blog post updated successfully!" : "Blog post published successfully!");
        handleCancelEditBlog();
        fetchBlogPosts();
        setBlogError(null);
        setTimeout(() => setBlogSuccess(null), 3000);
      } else {
        const errData = await res.json();
        setBlogError(errData.error || "Failed to save blog post.");
      }
    } catch (err) {
      console.error("Failed to save blog in admin:", err);
      setBlogError("Network error: Failed to reach backend.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setBlogError("Image is too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setNewBlogImageUrl(reader.result);
          setBlogError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(true);
  };

  const handleDragLeave = () => {
    setIsDraggingImage(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingImage(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setBlogError("Please upload a valid image file.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setBlogError("Image is too large. Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setNewBlogImageUrl(reader.result);
          setBlogError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTogglePublishStatus = async (post: any) => {
    const targetStatus = post.status === "Draft" ? "Published" : "Draft";
    try {
      const res = await fetch(`/api/blogs/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetStatus })
      });
      if (res.ok) {
        fetchBlogPosts();
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchBlogPosts();
        if (editingBlog?.id === id) {
          handleCancelEditBlog();
        }
      }
    } catch (err) {
      console.error("Failed to delete blog post:", err);
    }
  };

  // Check login role
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: "TechVision India", email: "tech@techvision.com", phone: "9876543210", service: "GST Registration", status: "In-Progress", date: "2026-07-08" },
    { id: '2', name: "Rahul Mehta (Retail)", email: "rahul@example.com", phone: "9123456789", service: "Annual Return", status: "In-Progress", date: "2026-07-09" },
    { id: '3', name: "Acme Exports", email: "contact@acme.com", phone: "8885556660", service: "GST Notice Reply", status: "Converted", date: "2026-07-06" },
    { id: '4', name: "Priya Sharma", email: "p.sharma@example.com", phone: "7774442211", service: "General Inquiry", status: "New", date: "2026-07-10" },
    { id: '5', name: "Vikram Singh", email: "vsingh_logistics@example.com", phone: "9998887776", service: "Advisory", status: "New", date: "2026-07-09" },
    { id: 'nausad', name: "Nausad Hussain", email: "nausad.hussain@gmail.com", phone: "9477542637", service: "GST Return Filing", status: "New", date: "2026-07-11" },
  ]);

  // Form submitter items (with queries)
  const [queries, setQueries] = useState(() => {
    const base = Date.now();
    return [
      { id: 'q5', name: "Nausad Hussain", email: "nausad.hussain@gmail.com", phone: "9477542637", query: "Need assistance with GST return filing. Please contact urgently on WhatsApp.", date: "11-Jul-2026, 09:20 PM", timestamp: base - 15 * 60 * 1000, status: "New", reply: "" },
      { id: 'q1', name: "Priya Sharma", email: "p.sharma@example.com", phone: "7774442211", query: "Can you help reply to our GST ASMT-10 notice regarding a GSTR-3B mismatch?", date: "11-Jul-2026, 10:24 AM", timestamp: base - 10 * 60 * 60 * 1000, status: "New", reply: "" },
      { id: 'q2', name: "Vikram Singh", email: "vsingh_logistics@example.com", phone: "9998887776", query: "We are establishing a multi-state logistics setup. Do we need separate GST registrations?", date: "10-Jul-2026, 04:15 PM", timestamp: base - 28 * 60 * 60 * 1000, status: "New", reply: "" },
      { id: 'q3', name: "Ananya Desai", email: "adesai.consulting@example.com", phone: "8881112223", query: "How long does GSTR-9 refund recovery typically take under Section 83 protective rules?", date: "09-Jul-2026, 11:30 AM", timestamp: base - 53 * 60 * 60 * 1000, status: "Replied", reply: "Hello Ananya, GSTR-9 refunds generally take between 30 to 45 business days once all representation proofs are compiled..." },
      { id: 'q4', name: "Karan Patel", email: "karan.patel.biz@example.com", phone: "9001002003", query: "Looking for an ongoing outsourced GST filing team for our e-commerce startup.", date: "08-Jul-2026, 02:45 PM", timestamp: base - 77 * 60 * 60 * 1000, status: "Forwarded", reply: "" }
    ];
  });

  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Selected query to view or respond to
  const [selectedQueryId, setSelectedQueryId] = useState<string | null>("q1");
  const [draftReply, setDraftReply] = useState("");
  const [isDraftingReply, setIsDraftingReply] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);

  // SEO Planner state
  const [seoTopic, setSeoTopic] = useState("GST audit mismatch guidance for retail SMEs");
  const [seoPlanResult, setSeoPlanResult] = useState<SEOPlannerResult | null>(null);
  const [isPlanningSEO, setIsPlanningSEO] = useState(false);

  // Conversion Revenue Details Settings Modal State
  const [showConversionModal, setShowConversionModal] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<{ id: string; name: string; service: string } | null>(null);
  const [modalRevenue, setModalRevenue] = useState<number>(25000);
  const [modalPaymentStatus, setModalPaymentStatus] = useState<'Paid' | 'Pending' | 'Unpaid'>('Pending');
  const [selectedInvoiceToPrint, setSelectedInvoiceToPrint] = useState<Invoice | null>(null);

  // Invoices state
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [remindState, setRemindState] = useState<{[key: string]: 'idle' | 'sending' | 'sent'}>({});
  const [batchReminding, setBatchReminding] = useState(false);
  const [batchReminderResult, setBatchReminderResult] = useState<string | null>(null);

  // Invoice creator form state
  const [newInvoiceClient, setNewInvoiceClient] = useState("");
  const [newInvoiceService, setNewInvoiceService] = useState("GST Advisory");
  const [newInvoiceAmount, setNewInvoiceAmount] = useState("");
  const [newInvoiceStatus, setNewInvoiceStatus] = useState<'Paid' | 'Unpaid' | 'Overdue'>("Unpaid");

  // Lead creator form state
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadService, setNewLeadService] = useState("GST Registration");

  // Traffic view filter
  const [trafficTimeframe, setTrafficTimeframe] = useState<"Monthly" | "Weekly" | "Daily">("Weekly");

  // Email forwarding notification helper
  const [forwardingState, setForwardingState] = useState<{[key: string]: 'idle' | 'sending' | 'sent'}>({});

  // Live session logs
  const [liveLogs, setLiveLogs] = useState<LiveLog[]>([
    { id: "log-1", time: "10:55:01 AM", event: "User searched HSN Code 1806 ('Chocolate & Rate')", badge: "HSN Lookup", badgeColor: "bg-emerald-500/20 text-emerald-400" },
    { id: "log-2", time: "10:54:33 AM", event: "Chatbot resolved query on 'Blockage of ITC Section 83'", badge: "AI Agent", badgeColor: "bg-indigo-500/20 text-indigo-400" },
    { id: "log-3", time: "10:52:12 AM", event: "User calculated GST (Gross amount ₹12,500) under 18% slab", badge: "GST Calc", badgeColor: "bg-amber-500/20 text-amber-400" },
    { id: "log-4", time: "10:49:55 AM", event: "User visited '/when-does-a-gst-proceeding-begin-clearing-the-fog-around-section-83-and-msme-protection'", badge: "Page View", badgeColor: "bg-blue-500/20 text-blue-400" },
    { id: "log-5", time: "10:48:10 AM", event: "Chatbot initiated conversation with user Contact.beltuz@gmail.com", badge: "AI Agent", badgeColor: "bg-indigo-500/20 text-indigo-400" },
  ]);

  // Generate continuous live traffic log updates for high immersion
  useEffect(() => {
    const events = [
      { event: "User searched HSN Code 8471 ('Automatic Data Processing Machines')", badge: "HSN Lookup", color: "bg-emerald-500/20 text-emerald-400" },
      { event: "User calculated Reverse GST (Base amount ₹45,000) with 28% bracket", badge: "GST Calc", color: "bg-amber-500/20 text-amber-400" },
      { event: "User read blog post on Section 83 and MSME Protection", badge: "Page View", color: "bg-blue-500/20 text-blue-400" },
      { event: "Chatbot answered: 'How do I claim transitional credit under GSTR-3B?'", badge: "AI Agent", color: "bg-indigo-500/20 text-indigo-400" },
      { event: "User opened the Services Page from Kolkata location", badge: "Page View", color: "bg-blue-500/20 text-blue-400" },
      { event: "User searched HSN Code 9983 ('Legal & Accounting Services')", badge: "HSN Lookup", color: "bg-emerald-500/20 text-emerald-400" },
    ];

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      
      const newLog: LiveLog = {
        id: `log-${Date.now()}`,
        time: timeStr,
        event: randomEvent.event,
        badge: randomEvent.badge,
        badgeColor: randomEvent.color
      };

      setLiveLogs(prev => [newLog, ...prev.slice(0, 7)]);
    }, 15000); // add a new realistic log every 15 seconds

    return () => clearInterval(interval);
  }, []);

   const fetchLeadsAndSyncQueries = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLeads(data);
          
          setQueries(prevQueries => {
            const updated = [...prevQueries];
            
            data.forEach((lead: any) => {
              // We check if this lead is already represented in queries
              const alreadyExists = updated.some(q => 
                q.id === lead.id || 
                (lead.phone && q.phone === lead.phone && lead.phone !== "N/A" && lead.phone !== "") ||
                (q.name.toLowerCase() === lead.name.toLowerCase() && q.email.toLowerCase() === lead.email.toLowerCase())
              );
              
              if (!alreadyExists) {
                let queryMsg = `Interested in ${lead.service}. Submitted via Get a Free GST Consultation.`;
                if (lead.service.includes("HSN Lookup")) {
                  queryMsg = `Unlocked the high-value HSN Code Finder tool. Searched for GST compliance rates.`;
                }
                
                const leadDateObj = lead.date ? new Date(lead.date) : new Date();
                const leadTime = isNaN(leadDateObj.getTime()) ? Date.now() : leadDateObj.getTime();
                const formattedDate = new Date(leadTime).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true
                });

                updated.unshift({
                  id: lead.id,
                  name: lead.name,
                  email: lead.email,
                  phone: lead.phone || "N/A",
                  query: queryMsg,
                  date: formattedDate,
                  timestamp: leadTime,
                  status: (lead.status === "Converted" ? "Replied" : lead.status === "In-Progress" ? "Forwarded" : "New") as any,
                  reply: ""
                });
              }
            });
            return updated;
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch leads and sync queries:", err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setInvoices(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
    }
  };

  const handleSendInvoiceReminder = async (invoiceId: string) => {
    setRemindState(prev => ({ ...prev, [invoiceId]: 'sending' }));
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/remind`, {
        method: "POST"
      });
      if (res.ok) {
        setRemindState(prev => ({ ...prev, [invoiceId]: 'sent' }));
        setTimeout(() => {
          setRemindState(prev => ({ ...prev, [invoiceId]: 'idle' }));
        }, 5000);
      } else {
        setRemindState(prev => ({ ...prev, [invoiceId]: 'idle' }));
      }
    } catch (err) {
      console.error("Failed to send reminder:", err);
      setRemindState(prev => ({ ...prev, [invoiceId]: 'idle' }));
    }
  };

  const handleSendBatchReminders = async () => {
    setBatchReminding(true);
    setBatchReminderResult(null);
    try {
      const res = await fetch("/api/invoices/remind-all", {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setBatchReminderResult(data.message || `Dispatched invoice reminders successfully.`);
        setTimeout(() => {
          setBatchReminderResult(null);
        }, 8000);
      } else {
        setBatchReminderResult("Failed to trigger automated reminders.");
      }
    } catch (err) {
      console.error("Failed to send batch reminders:", err);
      setBatchReminderResult("Error connecting to payment reminder queue.");
    } finally {
      setBatchReminding(false);
    }
  };

  // Fetch initial keywords from endpoint
  useEffect(() => {
    fetch("/api/keywords")
      .then((res) => res.json())
      .then((data) => {
        setKeywords(data);
        setLoadingKeywords(false);
      })
      .catch((err) => {
        console.error("Failed to fetch keywords", err);
        setLoadingKeywords(false);
      });

    // Fetch live submitted leads from server and start real-time polling
    fetchLeadsAndSyncQueries();
    fetchInvoices();
    const interval = setInterval(() => {
      fetchLeadsAndSyncQueries();
      fetchInvoices();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Forward lead to department email
  const handleForwardLead = async (email: string, leadId: string) => {
    setForwardingState(prev => ({ ...prev, [leadId]: 'sending' }));
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "advisory@mygstsolution.com",
          subject: `Forwarding Client Query / Lead: ${email}`,
          body: `Hi Team, please handle this lead query of ${email}. Update status in Admin Panel when resolved.`
        })
      });
      if (res.ok) {
        setForwardingState(prev => ({ ...prev, [leadId]: 'sent' }));
        setTimeout(() => {
          setForwardingState(prev => ({ ...prev, [leadId]: 'idle' }));
        }, 3000);
      } else {
        setForwardingState(prev => ({ ...prev, [leadId]: 'idle' }));
      }
    } catch (e) {
      setForwardingState(prev => ({ ...prev, [leadId]: 'idle' }));
    }
  };

  // Generate professional reply with Gemini
  const handleGenerateAIDraft = async (queryText: string, clientName: string, clientEmail: string) => {
    setIsDraftingReply(true);
    try {
      const response = await fetch("/api/ai-draft-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          email: clientEmail,
          query: queryText
        })
      });
      if (response.ok) {
        const data = await response.json();
        setDraftReply(data.draft);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsDraftingReply(false);
    }
  };

  // Generate target keywords outline with Gemini
  const handleGenerateSEOPipeline = async () => {
    if (!seoTopic.trim()) return;
    setIsPlanningSEO(true);
    setSeoPlanResult(null);
    try {
      const response = await fetch("/api/ai-seo-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: seoTopic })
      });
      if (response.ok) {
        const data = await response.json();
        setSeoPlanResult(data);
      }
    } catch (e) {
      console.error("SEO Strategy generation error", e);
    } finally {
      setIsPlanningSEO(false);
    }
  };

  // Trigger simulated query reply send
  const handleSendReply = async (id: string) => {
    setIsSendingReply(true);
    try {
      const q = queries.find(item => item.id === id);
      if (q) {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: q.email,
            subject: `Re: Your Compliance Inquiry with MyGST Solution`,
            body: draftReply
          })
        });
        
        // Update queries state
        setQueries(prev => prev.map(item => 
          item.id === id ? { ...item, status: "Replied", reply: draftReply } : item
        ));
        
        // Show success
        alert(`Success: Reply sent to ${q.email}!`);
      }
    } catch (error) {
      console.error("Failed to send reply email", error);
    } finally {
      setIsSendingReply(false);
    }
  };

  // Lead CRUD & status management
  const handleAddManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadEmail) return;

    try {
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLeadName,
          email: newLeadEmail,
          phone: newLeadPhone || "N/A",
          service: newLeadService,
          business_type: "Small Business (SME)"
        })
      });

      if (response.ok) {
        // Fetch updated leads and sync to queries
        await fetchLeadsAndSyncQueries();
        setNewLeadName("");
        setNewLeadEmail("");
        setNewLeadPhone("");
        alert("New client lead has been registered on the pipeline!");
      } else {
        alert("Failed to submit lead to the server.");
      }
    } catch (err) {
      console.error("Failed to add manual lead:", err);
      alert("Error contacting the server.");
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: 'New' | 'In-Progress' | 'Converted') => {
    // Optimistic UI update
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, status: newStatus } : lead
    ));

    try {
      await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error("Failed to update status on server:", err);
    }
  };

  const handleUpdateLeadFinance = async (id: string, payment_status: 'Paid' | 'Pending' | 'Unpaid', revenue_amount: number) => {
    // Optimistic UI update
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, payment_status, revenue_amount } : lead
    ));

    try {
      await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_status, revenue_amount })
      });
    } catch (err) {
      console.error("Failed to update lead finance on server:", err);
    }
  };

  const initiateConversion = (leadId: string, leadName: string, service: string) => {
    setLeadToConvert({ id: leadId, name: leadName, service });
    setModalRevenue(25000);
    setModalPaymentStatus('Pending');
    setShowConversionModal(true);
  };

  const handleConfirmConversion = async () => {
    if (!leadToConvert) return;
    const { id } = leadToConvert;

    // Optimistic UI update
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { 
        ...lead, 
        status: 'Converted', 
        payment_status: modalPaymentStatus, 
        revenue_amount: modalRevenue 
      } : lead
    ));

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: 'Converted',
          payment_status: modalPaymentStatus,
          revenue_amount: modalRevenue
        })
      });
      if (response.ok) {
        await fetchLeadsAndSyncQueries();
      }
    } catch (err) {
      console.error("Failed to convert lead on server:", err);
    } finally {
      setShowConversionModal(false);
      setLeadToConvert(null);
    }
  };

  // Invoice creator
  const handleAddInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceClient || !newInvoiceAmount) return;

    const tempId = `INV-2026-00${invoices.length + 1}`;
    const newInvoice = {
      id: tempId,
      client: newInvoiceClient,
      service: newInvoiceService,
      amount: parseFloat(newInvoiceAmount),
      status: newInvoiceStatus,
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice)
      });
      if (res.ok) {
        await fetchInvoices();
        setNewInvoiceClient("");
        setNewInvoiceAmount("");
        const completedInvoice = {
          ...newInvoice,
          status: newInvoiceStatus as any
        };
        setSelectedInvoiceToPrint(completedInvoice);
        handleExportInvoicePDF(completedInvoice);
      }
    } catch (err) {
      console.error("Failed to add invoice to backend:", err);
      const fallbackInvoice = newInvoice as any;
      setInvoices([fallbackInvoice, ...invoices]);
      setNewInvoiceClient("");
      setNewInvoiceAmount("");
      setSelectedInvoiceToPrint(fallbackInvoice);
      handleExportInvoicePDF(fallbackInvoice);
    }
  };

  // Export leads to CSV helper
  const handleExportCSV = () => {
    const headers = ["ID,Name,Email,Phone,Service,Status,Date"];
    const csvContent = headers.concat(
      leads.map(l => `"${l.id}","${l.name}","${l.email}","${l.phone || ""}","${l.service}","${l.status}","${l.date}"`)
    ).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `GST_Leads_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export combined revenue and invoice logs to CSV for accounting purposes
  const handleExportRevenueCSV = () => {
    const headers = ["Source,Transaction ID,Client Name,Client Email,Service Rendered,Amount (INR),Payment Status,Date"];
    
    // 1. Custom ledger invoices
    const invoiceRows = invoices.map(inv => {
      const escapedClient = (inv.client || "").replace(/"/g, '""');
      const escapedService = (inv.service || "").replace(/"/g, '""');
      return `"${"Ledger Invoice"}","${inv.id}","${escapedClient}","${inv.clientEmail || ""}","${escapedService}",${inv.amount || 0},"${inv.status || "Unpaid"}","${inv.date || ""}"`;
    });
    
    // 2. Converted retainer contract revenues
    const convertedLeads = leads.filter(l => l.status === "Converted");
    const contractRows = convertedLeads.map(l => {
      const currentVal = l.revenue_amount !== undefined ? l.revenue_amount : 25000;
      const currentStatus = l.payment_status || "Pending";
      const escapedName = (l.name || "").replace(/"/g, '""');
      const escapedService = (l.service || "").replace(/"/g, '""');
      return `"${"Retainer Contract"}","${l.id}","${escapedName}","${l.email || ""}","${escapedService}",${currentVal},"${currentStatus}","${l.date || ""}"`;
    });
    
    const csvContent = headers.concat(invoiceRows, contractRows).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MyGST_Revenue_Accounting_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export a beautifully formatted Invoice as PDF using jsPDF
  const handleExportInvoicePDF = (inv: Invoice) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Draw primary branding header (Deep Navy Blue)
    doc.setFillColor(12, 18, 38); // #0C1226
    doc.rect(0, 0, 210, 38, "F");

    // Title / Logo
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("MyGST Solution", 15, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(180, 187, 204);
    doc.text("Premium Tax Advisory & Compliance Consultants", 15, 24);
    doc.text("GSTIN: 07AAAAA0000A1Z5", 15, 29);

    // Invoice status/label
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("TAX INVOICE", 150, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(180, 187, 204);
    doc.text(`Invoice ID: ${inv.id}`, 150, 24);
    doc.text(`Date: ${inv.date}`, 150, 29);

    // Reset text color to dark charcoal for body content
    doc.setTextColor(30, 41, 59);

    // Address Block (Left: From, Right: Billed To)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("FROM (ISSUER):", 15, 52);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text([
      "MyGST Solution",
      "4th Floor, GST Tower, Connaught Place",
      "New Delhi, Delhi - 110001",
      "support@mygstsolution.com",
      "Tel: +91 11 4987 6543"
    ], 15, 58);

    // Bill To Block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("BILLED TO (RECIPIENT):", 110, 52);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text([
      inv.client,
      inv.clientEmail ? inv.clientEmail : "Taxpayer & Registered Client",
      `Integrated File ID: #${inv.id.split('-').pop()}`,
      "Place of Supply: Delhi (07)"
    ], 110, 58);

    // Remittance info & Payment status
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("REMITTANCE BANK DETAILS:", 15, 94);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text([
      "Bank: HDFC Bank Ltd",
      "A/C: 50200084729103",
      "IFSC: HDFC0000112"
    ], 15, 100);

    // Payment status badge background
    const isPaid = inv.status === "Paid";
    if (isPaid) {
      doc.setFillColor(209, 250, 229); // light green
      doc.setDrawColor(16, 185, 129); // emerald border
      doc.rect(110, 94, 85, 18, "FD");
      doc.setTextColor(6, 95, 70); // deep emerald
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("STATUS: PAID / RECEIPT", 115, 105);
    } else {
      doc.setFillColor(254, 226, 226); // light red
      doc.setDrawColor(239, 68, 68); // red border
      doc.rect(110, 94, 85, 18, "FD");
      doc.setTextColor(153, 27, 27); // deep red
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("STATUS: DUE / AWAITING", 115, 105);
    }

    // Draw Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(15, 124, 180, 8, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("Description of Professional Service", 18, 129);
    doc.text("SAC", 110, 129);
    doc.text("Rate", 130, 129);
    doc.text("Total (INR)", 160, 129);

    // Table Body Row
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(inv.service, 18, 138);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Professional advisory fee for GST compliance", 18, 142);

    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text("998222", 110, 138);
    doc.text("18%", 130, 138);
    doc.text(`INR ${inv.amount.toLocaleString()}`, 160, 138);

    // Horizontal separator line
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 148, 195, 148);

    // Calculations
    const subtotal = inv.amount / 1.18;
    const gstTax = (inv.amount / 1.18) * 0.18;
    const cgst = gstTax / 2;
    const sgst = gstTax / 2;

    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Subtotal (Excl. Tax):", 110, 157);
    doc.setTextColor(30, 41, 59);
    doc.text(`INR ${subtotal.toFixed(2)}`, 160, 157);

    doc.setTextColor(100, 116, 139);
    doc.text("CGST (9%):", 110, 163);
    doc.setTextColor(30, 41, 59);
    doc.text(`INR ${cgst.toFixed(2)}`, 160, 163);

    doc.setTextColor(100, 116, 139);
    doc.text("SGST (9%):", 110, 169);
    doc.setTextColor(30, 41, 59);
    doc.text(`INR ${sgst.toFixed(2)}`, 160, 169);

    doc.setTextColor(100, 116, 139);
    doc.text("Total GST Tax (18%):", 110, 175);
    doc.setTextColor(30, 41, 59);
    doc.text(`INR ${gstTax.toFixed(2)}`, 160, 175);

    // Grand Total Box
    doc.setFillColor(241, 245, 249);
    doc.rect(110, 180, 85, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(12, 18, 38);
    doc.text("Grand Total:", 113, 185);
    doc.text(`INR ${inv.amount.toLocaleString()}`, 160, 185);

    // Terms and Declaration
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text("Declaration & Terms of Service:", 15, 210);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text([
      "1. This is a computer-generated tax invoice and does not require a physical signature.",
      "2. Dues must be cleared within 7 business days from the issue date to avoid legal penalty.",
      "3. All compliance services are bound by general service level agreements (SLA)."
    ], 15, 216);

    // Signature Block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text("For MyGST Solution", 150, 210);
    
    // Draw signature line
    doc.setDrawColor(203, 213, 225);
    doc.line(145, 228, 195, 228);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Authorized Signatory", 150, 233);

    // Footer bar
    doc.setFillColor(12, 18, 38);
    doc.rect(0, 287, 210, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text("MyGST Solution | Confidential Customer Document | Generated Securely on Cloud", 40, 293);

    // Save the PDF
    doc.save(`MyGST_Invoice_${inv.id}.pdf`);
  };

  // Calculated values based on invoices state and converted client pipeline
  const totalLeadRevenue = leads
    .filter(l => l.status === "Converted" && l.payment_status === "Paid")
    .reduce((sum, l) => sum + (l.revenue_amount || 0), 0);

  const pendingLeadRevenue = leads
    .filter(l => l.status === "Converted" && (l.payment_status === "Pending" || l.payment_status === "Unpaid"))
    .reduce((sum, l) => sum + (l.revenue_amount || 0), 0);

  const totalRevenue = invoices
    .filter(i => i.status === "Paid")
    .reduce((sum, i) => sum + i.amount, 0) + totalLeadRevenue;

  const pendingInvoicesAmount = invoices
    .filter(i => i.status === "Unpaid" || i.status === "Overdue")
    .reduce((sum, i) => sum + i.amount, 0) + pendingLeadRevenue;

  // Traffic data helpers
  const monthlyTrafficData = [
    { name: 'Jan', pageviews: 24000, visitors: 11200 },
    { name: 'Feb', pageviews: 29000, visitors: 14500 },
    { name: 'Mar', pageviews: 32000, visitors: 16800 },
    { name: 'Apr', pageviews: 41000, visitors: 22000 },
    { name: 'May', pageviews: 49000, visitors: 26000 },
    { name: 'Jun', pageviews: 62000, visitors: 34000 },
  ];

  const weeklyTrafficData = [
    { name: 'Week 1', pageviews: 12400, visitors: 5800 },
    { name: 'Week 2', pageviews: 14800, visitors: 6900 },
    { name: 'Week 3', pageviews: 16500, visitors: 7800 },
    { name: 'Week 4', pageviews: 18300, visitors: 8900 },
  ];

  const dailyTrafficData = [
    { name: 'Mon', pageviews: 2100, visitors: 980 },
    { name: 'Tue', pageviews: 2400, visitors: 1100 },
    { name: 'Wed', pageviews: 2800, visitors: 1350 },
    { name: 'Thu', pageviews: 2700, visitors: 1290 },
    { name: 'Fri', pageviews: 3100, visitors: 1540 },
    { name: 'Sat', pageviews: 1800, visitors: 820 },
    { name: 'Sun', pageviews: 1500, visitors: 690 },
  ];

  const activeTrafficData = trafficTimeframe === "Monthly" 
    ? monthlyTrafficData 
    : trafficTimeframe === "Daily" 
      ? dailyTrafficData 
      : weeklyTrafficData;

  const sortedQueries = [...queries].sort((a: any, b: any) => {
    const timeA = a.timestamp || 0;
    const timeB = b.timestamp || 0;
    return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
  });

  const currentSelectedQuery = sortedQueries.find(q => q.id === selectedQueryId) || sortedQueries[0] || queries[0];

  return (
    <div className="flex h-screen bg-[#090D1A] text-slate-100 font-sans overflow-hidden relative">
      <SEO 
        title="Corporate Admin Command Center | MyGST Solution" 
        description="Admin panel with AI content planner, CRM tracking, revenue reporting, and real-time user session diagnostics."
      />
      
      {/* Dynamic Background Mesh Grid Glow */}
      <div className="absolute top-[-200px] left-[-150px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-200px] right-[-150px] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none z-0"></div>
      <div className="absolute top-[30%] right-[20%] w-[450px] h-[450px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* SIDEBAR FOR DESKTOP */}
      <aside className="w-72 bg-[#0C1226] border-r border-white/5 flex flex-col hidden lg:flex shrink-0 z-20 relative">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="text-xl font-extrabold flex items-center gap-2.5 text-white tracking-tight">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center font-black text-base text-white shadow-lg shadow-blue-500/20">
              M
            </div>
            <div>
              MyGST <span className="text-blue-400 font-semibold text-xs block tracking-widest uppercase">Solution</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold transition-all w-full text-left cursor-pointer ${
              activeTab === 'overview' 
                ? 'bg-blue-600/15 border border-blue-500/30 text-blue-400 shadow-md' 
                : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            Overview
          </button>
          
          <div className="pt-6 pb-2 px-4">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Reports & Analytics</p>
          </div>

          <button 
            onClick={() => setActiveTab("traffic")}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold transition-all w-full text-left cursor-pointer ${
              activeTab === 'traffic' 
                ? 'bg-blue-600/15 border border-blue-500/30 text-blue-400 shadow-md' 
                : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <BarChart3 className="w-5 h-5 shrink-0" />
            Traffic & Engagement
          </button>

          <button 
            onClick={() => setActiveTab("seo")}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold transition-all w-full text-left cursor-pointer ${
              activeTab === 'seo' 
                ? 'bg-blue-600/15 border border-blue-500/30 text-blue-400 shadow-md' 
                : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Search className="w-5 h-5 shrink-0" />
            SEO & Keywords
          </button>

          <button 
            onClick={() => setActiveTab("forms")}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold transition-all w-full text-left cursor-pointer ${
              activeTab === 'forms' 
                ? 'bg-blue-600/15 border border-blue-500/30 text-blue-400 shadow-md' 
                : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <MessageSquare className="w-5 h-5 shrink-0" />
            Forms & Queries
          </button>

          <button 
            onClick={() => setActiveTab("pipeline")}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold transition-all w-full text-left cursor-pointer ${
              activeTab === 'pipeline' 
                ? 'bg-blue-600/15 border border-blue-500/30 text-blue-400 shadow-md' 
                : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            Lead Management
          </button>

          <button 
            onClick={() => setActiveTab("revenue")}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold transition-all w-full text-left cursor-pointer ${
              activeTab === 'revenue' 
                ? 'bg-blue-600/15 border border-blue-500/30 text-blue-400 shadow-md' 
                : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <DollarSign className="w-5 h-5 shrink-0" />
            Revenue
          </button>

          <button 
            onClick={() => setActiveTab("blog")}
            className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold transition-all w-full text-left cursor-pointer ${
              activeTab === 'blog' 
                ? 'bg-blue-600/15 border border-blue-500/30 text-blue-400 shadow-md' 
                : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <BookOpen className="w-5 h-5 shrink-0" />
            Blogs Management
          </button>
        </nav>
        
        <div className="p-4 border-t border-white/5 bg-[#0A0E21]">
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("name");
              navigate("/login");
            }}
            className="flex items-center justify-center gap-2 p-3.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold rounded-xl transition-all w-full cursor-pointer text-xs uppercase tracking-widest"
          >
            Logout Command
          </button>
        </div>
      </aside>

      {/* MOBILE DRAWER SIDEBAR (SLIDING OUT ON TAP) */}
      <div className={`fixed inset-0 z-50 bg-[#090D1A]/80 backdrop-blur-md transition-all lg:hidden duration-300 ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <aside className={`w-80 bg-[#0C1226] border-r border-white/10 h-full flex flex-col p-6 transition-transform duration-300 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between pb-6 border-b border-white/5 mb-6">
            <span className="text-lg font-black text-white">Admin Command Center</span>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {[
              { id: "overview", label: "Overview", icon: Home },
              { id: "traffic", label: "Traffic & Engagement", icon: BarChart3 },
              { id: "seo", label: "SEO & Keywords", icon: Search },
              { id: "forms", label: "Forms & Queries", icon: MessageSquare },
              { id: "pipeline", label: "Lead Management", icon: CheckCircle2 },
              { id: "revenue", label: "Revenue", icon: DollarSign },
              { id: "blog", label: "Blogs Management", icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold w-full text-left transition-all ${
                    activeTab === tab.id
                      ? "bg-blue-600/15 border border-blue-500/30 text-blue-400"
                      : "hover:bg-white/5 text-slate-400 hover:text-white border border-transparent"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/5 mt-auto">
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("name");
                navigate("/login");
              }}
              className="flex items-center justify-center gap-2 p-3.5 bg-red-500/10 text-red-400 font-bold rounded-xl w-full text-xs uppercase tracking-widest border border-red-500/20"
            >
              Logout Command
            </button>
          </div>
        </aside>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto flex flex-col h-full bg-transparent z-10 relative">
        {/* TOP MOBILE RESPONSIVE NAVIGATION BAR */}
        <header className="lg:hidden p-4 bg-[#0C1226]/90 border-b border-white/5 flex justify-between items-center sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-sm text-white">M</div>
            <span className="text-sm font-bold text-white tracking-wide">MyGST Admin</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>
        </header>

        <div className="p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* GREETING HEADER */}
          <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Admin Panel Command Desk
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Chief Consultant</span>
              </h1>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                You have active incoming leads, and tax advisory files ready for action.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0 items-center">
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Secure Cloud Database Connected
              </span>
              <button 
                onClick={handleExportCSV} 
                className="flex items-center gap-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Generate accounting report for all leads"
              >
                <Download className="w-3.5 h-3.5" />
                Export Leads CSV
              </button>
              <button 
                onClick={handleExportRevenueCSV} 
                className="flex items-center gap-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Generate accounting report for invoices and retainer revenues"
              >
                <Download className="w-3.5 h-3.5" />
                Export Revenue CSV
              </button>
            </div>
          </section>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Dynamic KPI widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                  { title: "Total Active Clients", val: "124", color: "text-blue-400", bg: "bg-blue-500/10" },
                  { title: "New Queries (MTD)", val: "42", color: "text-amber-400", bg: "bg-amber-500/10" },
                  { title: "Avg Resolution", val: "1.4 Days", color: "text-purple-400", bg: "bg-purple-500/10" },
                  { title: "Total Paid Receipts", val: `₹${totalRevenue.toLocaleString()}`, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                ].map((kpi, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">{kpi.title}</p>
                    <p className={`text-3xl font-extrabold ${kpi.color} font-mono`}>{kpi.val}</p>
                  </div>
                ))}
              </div>

              {/* GST Compliance Calendar Widget */}
              <GSTComplianceCalendar />

              {/* Two Column Layout: Activity Logs and Recent Inquiries */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Simulated Live User Activity Stream */}
                <div className="lg:col-span-1 p-6 rounded-2xl bg-[#0C1226] border border-white/5 flex flex-col h-[460px]">
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
                    <div>
                      <h3 className="font-bold text-white text-sm">Live System Logs</h3>
                      <p className="text-slate-400 text-[11px]">Real-time visitor action feeds</p>
                    </div>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 scrollbar-none">
                    {liveLogs.map((log) => (
                      <div key={log.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${log.badgeColor}`}>
                            {log.badge}
                          </span>
                          <span className="text-slate-500 font-mono text-[9px]">{log.time}</span>
                        </div>
                        <p className="text-slate-300 font-medium leading-relaxed">{log.event}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Inquiries List */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-bold text-white text-sm">Recent Consultations & Submissions</h3>
                      <p className="text-slate-400 text-[11px]">Forward queries or generate replies instantly</p>
                    </div>
                    <button onClick={handleExportCSV} className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all">
                      <Download className="w-3.5 h-3.5" />
                      Export Leads
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-white/5 pb-3 font-bold uppercase tracking-wider text-[10px]">
                          <th className="pb-3">Client / Lead</th>
                          <th className="pb-3">Service</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {leads.slice(0, 4).map((item) => (
                          <tr key={item.id} className="hover:bg-white/[0.01]">
                            <td className="py-3">
                              <p className="font-bold text-white">{item.name}</p>
                              <p className="text-[11px] text-slate-400 font-mono">{item.email}</p>
                            </td>
                            <td className="py-3 text-slate-300 font-semibold">{item.service}</td>
                            <td className="py-3">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                item.status === 'Converted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                item.status === 'In-Progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <button 
                                onClick={() => handleForwardLead(item.email, item.id)}
                                disabled={forwardingState[item.id] === 'sending'}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg font-bold text-[11px] transition-all"
                              >
                                {forwardingState[item.id] === 'sending' ? 'Fwd...' : 'Fwd to Advisory'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRAFFIC & ENGAGEMENT */}
          {activeTab === 'traffic' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-white">Website Visitors & Traffic Analyzer</h2>
                  <p className="text-slate-400 text-xs">Monitor organic click paths, calculators retention rate, and live metrics.</p>
                </div>
                
                {/* Timeframe switch */}
                <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
                  {(["Daily", "Weekly", "Monthly"] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setTrafficTimeframe(opt)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        trafficTimeframe === opt 
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Traffic Area Chart and Sources Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Primary Chart */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5 h-[380px] flex flex-col justify-between">
                  <h3 className="font-bold text-white text-sm mb-4">Traffic Performance Summary</h3>
                  <div className="flex-1 w-full min-h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activeTrafficData}>
                        <defs>
                          <linearGradient id="glowviews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <RechartsTooltip contentStyle={{ backgroundColor: '#0C1226', borderColor: '#334155', color: '#f8fafc' }} />
                        <Area type="monotone" dataKey="pageviews" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#glowviews)" />
                        <Area type="monotone" dataKey="visitors" stroke="#10b981" strokeWidth={1} fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Source Chart */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between h-[380px]">
                  <h3 className="font-bold text-white text-sm">Traffic Origination Split</h3>
                  <div className="flex-1 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie 
                          data={[
                            { name: 'Organic Search', value: 55 },
                            { name: 'Direct Links', value: 20 },
                            { name: 'AI Recommendations', value: 15 },
                            { name: 'Advisory Referrals', value: 10 },
                          ]} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={60} 
                          outerRadius={80} 
                          paddingAngle={5} 
                          dataKey="value"
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#f59e0b" />
                          <Cell fill="#10b981" />
                          <Cell fill="#8b5cf6" />
                        </Pie>
                        <RechartsTooltip contentStyle={{ backgroundColor: '#0C1226', borderColor: '#334155' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Organic (55%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Direct (20%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> AI (15%)</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span> Referrals (10%)</span>
                  </div>
                </div>
              </div>

              {/* Engagement Metrics Specific Pages Table */}
              <div className="p-6 rounded-2xl bg-[#0C1226] border border-white/5">
                <h3 className="font-bold text-white text-sm mb-4">Detailed Page Engagement Analytics</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/5 pb-3">
                        <th className="pb-3 font-bold">Target URL Path</th>
                        <th className="pb-3 font-bold">Uniques</th>
                        <th className="pb-3 font-bold">Avg Time On Page</th>
                        <th className="pb-3 font-bold">Bounce Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {[
                        { path: "/", views: "24,500", time: "1m 45s", bounce: "35.2%", status: "Good" },
                        { path: "/hsn-code-finder", views: "18,200", time: "3m 12s", bounce: "21.8%", status: "Excellent" },
                        { path: "/gst-calculator", views: "15,800", time: "2m 55s", bounce: "28.4%", status: "Excellent" },
                        { path: "/blog", views: "9,400", time: "2m 10s", bounce: "48.1%", status: "Fair" },
                      ].map((page, i) => (
                        <tr key={i} className="hover:bg-white/[0.01]">
                          <td className="py-3 font-mono text-blue-400 font-medium">{page.path}</td>
                          <td className="py-3 font-mono text-slate-200">{page.views}</td>
                          <td className="py-3 font-mono text-slate-200">{page.time}</td>
                          <td className="py-3">
                            <span className="text-slate-300 mr-2 font-mono">{page.bounce}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${page.status === 'Excellent' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>{page.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SEO & KEYWORDS */}
          {activeTab === 'seo' && (
            <div className="space-y-8">
              
              {/* Target topic AI generator section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side: SEO Health Gauge & Keyword list */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* SEO audit stats */}
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center">
                    <h3 className="font-bold text-white text-sm mb-4 self-start">SEO Performance Index</h3>
                    <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-8 border-emerald-500/10">
                      <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                        <circle cx="72" cy="72" r="64" fill="transparent" stroke="#10b981" strokeWidth="8" strokeDasharray="402" strokeDashoffset="48" />
                      </svg>
                      <div className="text-center">
                        <span className="text-4xl font-extrabold text-white font-mono">88</span>
                        <span className="block text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">Health</span>
                      </div>
                    </div>
                    <div className="w-full space-y-2 mt-6 text-xs">
                      <div className="flex justify-between text-slate-400"><span>Meta Optimization</span> <span className="text-emerald-400 font-bold">100% compliant</span></div>
                      <div className="flex justify-between text-slate-400"><span>Page Response Speed</span> <span className="text-emerald-400 font-bold">0.85s (Fast)</span></div>
                      <div className="flex justify-between text-slate-400"><span>Mobile Friendly View</span> <span className="text-emerald-400 font-bold">Optimized</span></div>
                    </div>
                  </div>

                  {/* Standard keywords from database */}
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider">Current Search Rankings</h3>
                    {loadingKeywords ? (
                      <KeywordsSkeleton />
                    ) : (
                      <div className="space-y-2 text-xs">
                        {keywords.map((kw, i) => (
                          <div key={i} className="p-3 bg-white/[0.01] border border-white/5 rounded-xl flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-200">{kw.keyword}</p>
                              <span className="text-[10px] text-slate-400">Vol: {kw.volume} | Diff: {kw.difficulty}</span>
                            </div>
                            <span className="text-emerald-400 font-bold font-mono text-[11px] bg-emerald-500/10 px-2 py-1 rounded">
                              {kw.trend}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Content Strategy Lab (Interactive Tool!) */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0C1226] border border-white/10 space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="bg-amber-500/20 p-2 rounded-xl text-amber-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">AI Compliance Keyword & Content Planner</h3>
                      <p className="text-slate-400 text-xs">Utilize server-side Gemini intelligence to build search clusters instantly.</p>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Enter Compliance Topic / Focus Area:</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input 
                        type="text"
                        value={seoTopic}
                        onChange={(e) => setSeoTopic(e.target.value)}
                        className="bg-slate-900 border border-white/10 text-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 flex-1 font-medium"
                        placeholder="e.g. GST on export of services, Section 83 litigation guide"
                      />
                      <button
                        onClick={handleGenerateSEOPipeline}
                        disabled={isPlanningSEO}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        {isPlanningSEO ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Build Strategy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Planner Result Render */}
                  {seoPlanResult && (
                    <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-5 text-xs animate-fade-in">
                      <div>
                        <h4 className="font-bold text-white text-sm mb-3">Generated High-Value Search Terms</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {seoPlanResult.keywords.map((item, idx) => (
                            <div key={idx} className="p-3.5 bg-slate-900/60 border border-white/5 rounded-xl">
                              <p className="font-bold text-white text-xs mb-1.5">{item.keyword}</p>
                              <div className="flex flex-wrap gap-1.5 text-[10px]">
                                <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-black">VOL: {item.volume}</span>
                                <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-black">DIFF: {item.difficulty}</span>
                                <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-black">{item.intent}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-4">
                        <h4 className="font-bold text-white text-sm mb-2">Recommended Article Content Outline</h4>
                        <div className="p-4 bg-slate-900 rounded-xl text-slate-300 leading-relaxed font-mono whitespace-pre-wrap text-[11px]">
                          {seoPlanResult.outline}
                        </div>
                      </div>
                    </div>
                  )}

                  {!seoPlanResult && !isPlanningSEO && (
                    <div className="p-8 text-center bg-white/[0.01] border border-dashed border-white/5 rounded-2xl text-slate-500 text-xs">
                      Enter a topic above and trigger the AI content pipeline. The strategy suggestions will render here.
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Keyword Performance Visualization Tool */}
              <KeywordPerformanceTracker />

              {/* Keep modular Regional SEO Strategy component below */}
              <RegionalSEOStrategy />
            </div>
          )}

          {/* TAB 4: FORMS & QUERIES */}
          {activeTab === 'forms' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side: Submitter Query List */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="p-4 bg-[#0C1226] border border-white/5 rounded-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3 mb-4">
                      <div>
                        <h3 className="font-bold text-white text-sm">Incoming Inquiries</h3>
                        <p className="text-slate-400 text-[11px]">Click to reply or draft with AI</p>
                      </div>
                      
                      {/* Interactive sorting filter for ascending / descending order */}
                      <div className="flex items-center gap-1.5 shrink-0 bg-slate-900 border border-white/5 p-0.5 rounded-lg">
                        <button
                          onClick={() => setSortOrder("desc")}
                          title="Sort descending (newest first)"
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            sortOrder === "desc"
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Newest
                        </button>
                        <button
                          onClick={() => setSortOrder("asc")}
                          title="Sort ascending (oldest first)"
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            sortOrder === "asc"
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          Oldest
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2.5">
                      {sortedQueries.map((q) => (
                        <button
                          key={q.id}
                          onClick={() => {
                            setSelectedQueryId(q.id);
                            setDraftReply(q.reply || "");
                          }}
                          className={`w-full p-3.5 rounded-xl border text-left transition-all block cursor-pointer ${
                            selectedQueryId === q.id 
                              ? "bg-blue-600/10 border-blue-500 text-white" 
                              : "bg-white/[0.02] border-white/5 hover:border-white/10 text-slate-300"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2 mb-1.5">
                            <span className="font-bold text-xs truncate">{q.name}</span>
                            <span className="text-[9px] text-slate-500 font-mono shrink-0">{q.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                            {q.query}
                          </p>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            q.status === 'Replied' ? 'bg-emerald-500/10 text-emerald-400' :
                            q.status === 'Forwarded' ? 'bg-purple-500/10 text-purple-400' :
                            'bg-amber-500/10 text-amber-400'
                          }`}>
                            {q.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side: Message Detail Panel & Draft Reply Composer (Interactive Tool!) */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0C1226] border border-white/10 space-y-6 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-4 mb-4 gap-4">
                      <div>
                        <h4 className="font-extrabold text-white text-base">{currentSelectedQuery.name}</h4>
                        <p className="text-slate-400 text-xs font-mono">{currentSelectedQuery.email} | {currentSelectedQuery.phone}</p>
                      </div>
                      <span className="text-slate-500 text-xs font-mono">{currentSelectedQuery.date}</span>
                    </div>

                    <div className="bg-slate-900/60 p-4 rounded-xl border border-white/5 mb-6">
                      <p className="text-xs text-slate-400 font-bold mb-1.5 uppercase tracking-wide">Client Inquiry Text:</p>
                      <p className="text-slate-200 text-sm leading-relaxed italic">
                        "{currentSelectedQuery.query}"
                      </p>
                    </div>

                    {/* Email composer with AI generation tool */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Advisory Team Reply Composer:</label>
                        <button
                          onClick={() => handleGenerateAIDraft(currentSelectedQuery.query, currentSelectedQuery.name, currentSelectedQuery.email)}
                          disabled={isDraftingReply}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          {isDraftingReply ? "AI Drafting..." : "✨ AI Auto-Draft Reply"}
                        </button>
                      </div>

                      <textarea
                        value={draftReply}
                        onChange={(e) => setDraftReply(e.target.value)}
                        rows={8}
                        className="w-full bg-slate-950 border border-white/10 text-slate-200 text-xs md:text-sm rounded-xl p-4 focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
                        placeholder="Draft your reply mail here, or click the ✨ AI Auto-Draft button above to generate a smart, expert-grade advisory response instantly."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-white/5 mt-6">
                    <button
                      onClick={() => handleForwardLead(currentSelectedQuery.email, currentSelectedQuery.id)}
                      className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Fwd to SME desk
                    </button>
                    <button
                      onClick={() => handleSendReply(currentSelectedQuery.id)}
                      disabled={isSendingReply || !draftReply.trim()}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/40 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25"
                    >
                      <SendHorizontal className="w-4 h-4" />
                      {isSendingReply ? "Sending..." : "Dispatch Email"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LEAD MANAGEMENT (PIPELINE) */}
          {activeTab === 'pipeline' && (
            <div className="space-y-8">
              
              {/* Localized Header Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0C1226] border border-white/5 p-5 rounded-2xl">
                <div>
                  <h2 className="text-base font-bold text-white">Client Lead Lifecycle & CRM</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Register, track, transition, and export active consults in the firm sales pipeline.</p>
                </div>
                <button 
                  onClick={handleExportCSV} 
                  className="flex items-center gap-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                  title="Generate accounting report for all leads"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Leads CSV
                </button>
              </div>

              {/* Kanban Column and adding tool */}
              <div className="flex flex-col xl:flex-row gap-6">
                
                {/* Manual lead adder tool */}
                <div className="xl:w-80 bg-[#0C1226] border border-white/10 rounded-2xl p-6 h-fit space-y-5">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <PlusCircle className="w-5 h-5 text-blue-400 animate-pulse" />
                    <h3 className="font-bold text-white text-sm">Register Client Lead</h3>
                  </div>

                  <form onSubmit={handleAddManualLead} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-400 uppercase tracking-wide">Client Name / Biz Name:</label>
                      <input 
                        type="text" 
                        required
                        value={newLeadName}
                        onChange={(e) => setNewLeadName(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                        placeholder="e.g. Reliance Tech India"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-400 uppercase tracking-wide">Direct Email Address:</label>
                      <input 
                        type="email" 
                        required
                        value={newLeadEmail}
                        onChange={(e) => setNewLeadEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                        placeholder="e.g. tax@reliancetech.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-400 uppercase tracking-wide">Contact Phone Number:</label>
                      <input 
                        type="text" 
                        value={newLeadPhone}
                        onChange={(e) => setNewLeadPhone(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                        placeholder="e.g. 9876543210"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-400 uppercase tracking-wide">Consultation Focus:</label>
                      <select 
                        value={newLeadService}
                        onChange={(e) => setNewLeadService(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="GST Registration">GST Registration Setup</option>
                        <option value="GSTR-9 Annual filing">GSTR-9 Annual Filing</option>
                        <option value="Section 83 Representation">Section 83 Representing</option>
                        <option value="Blocked ITC Recovery">Blocked ITC Recovery</option>
                        <option value="E-Commerce Compliance">E-Commerce Compliance</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10 text-center text-xs uppercase tracking-wider"
                    >
                      Add Client to Pipeline
                    </button>
                  </form>
                </div>

                {/* Interactive Kanban Board */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Column 1: New Leads */}
                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl flex flex-col min-h-[450px]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                      <span className="font-bold text-sm text-slate-200">New Submissions</span>
                      <span className="bg-slate-800 text-slate-300 font-mono font-bold text-xs px-2 py-0.5 rounded border border-slate-700">
                        {leads.filter(l => l.status === "New").length}
                      </span>
                    </div>
                    <div className="space-y-3.5 overflow-y-auto flex-1">
                      {leads.filter(l => l.status === "New").map((lead) => (
                        <div key={lead.id} className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-3 text-xs">
                          <div>
                            <h4 className="font-bold text-white text-sm">{lead.name}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">{lead.service}</p>
                          </div>
                          <div className="space-y-1 text-slate-400 text-[11px] font-mono">
                            <p>{lead.email}</p>
                            <p>{lead.phone}</p>
                          </div>
                          <div className="flex justify-end pt-2 border-t border-white/5 gap-2">
                            <button 
                              onClick={() => handleUpdateLeadStatus(lead.id, "In-Progress")}
                              className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold rounded text-[10px] transition-all"
                            >
                              In Progress →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: In-Progress */}
                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl flex flex-col min-h-[450px]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                      <span className="font-bold text-sm text-slate-200">Advisory Active</span>
                      <span className="bg-slate-800 text-slate-300 font-mono font-bold text-xs px-2 py-0.5 rounded border border-slate-700">
                        {leads.filter(l => l.status === "In-Progress").length}
                      </span>
                    </div>
                    <div className="space-y-3.5 overflow-y-auto flex-1">
                      {leads.filter(l => l.status === "In-Progress").map((lead) => (
                        <div key={lead.id} className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-3 text-xs">
                          <div>
                            <h4 className="font-bold text-white text-sm">{lead.name}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">{lead.service}</p>
                          </div>
                          <div className="space-y-1 text-slate-400 text-[11px] font-mono">
                            <p>{lead.email}</p>
                            <p>{lead.phone}</p>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-white/5 gap-2">
                            <button 
                              onClick={() => handleUpdateLeadStatus(lead.id, "New")}
                              className="px-2 py-1 bg-slate-800 text-slate-400 font-bold rounded text-[10px] transition-all"
                            >
                              ← Back
                            </button>
                            <button 
                              onClick={() => initiateConversion(lead.id, lead.name, lead.service)}
                              className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold rounded text-[10px] transition-all cursor-pointer"
                            >
                              Converted ✓
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Converted */}
                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl flex flex-col min-h-[450px]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                      <span className="font-bold text-sm text-slate-200">Signed Retainers</span>
                      <span className="bg-slate-800 text-slate-300 font-mono font-bold text-xs px-2 py-0.5 rounded border border-slate-700">
                        {leads.filter(l => l.status === "Converted").length}
                      </span>
                    </div>
                    <div className="space-y-3.5 overflow-y-auto flex-1">
                      {leads.filter(l => l.status === "Converted").map((lead) => (
                        <div key={lead.id} className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-3 text-xs">
                          <div>
                            <h4 className="font-bold text-white text-sm">{lead.name}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">{lead.service}</p>
                          </div>
                          <div className="space-y-1 text-slate-400 text-[11px] font-mono">
                            <p>{lead.email}</p>
                            <p>{lead.phone}</p>
                          </div>
                          <div className="flex justify-start pt-2 border-t border-white/5 gap-2">
                            <button 
                              onClick={() => handleUpdateLeadStatus(lead.id, "In-Progress")}
                              className="px-2 py-1 bg-slate-800 text-slate-400 font-bold rounded text-[10px] transition-all"
                            >
                              ← Reopen File
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* TAB 7: BLOGS MANAGEMENT */}
          {activeTab === 'blog' && (
            <div className="space-y-8 animate-fade-in">
              
              {/* Localized Header Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0C1226] border border-white/5 p-5 rounded-2xl">
                <div>
                  <h2 className="text-base font-bold text-white">Compliance Advisory & Blog Editor</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Author legal insights, GST circular clarifications, and corporate compliance advisories.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    Live on Portal
                  </span>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-[#0C1226]/50 border border-white/5 p-5 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Published Articles</p>
                  <p className="text-2xl font-black text-white">{blogPosts.length}</p>
                  <p className="text-[10px] text-emerald-400 mt-1 font-medium">● Updated just now</p>
                </div>
                <div className="bg-[#0C1226]/50 border border-white/5 p-5 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Knowledge Categories</p>
                  <p className="text-2xl font-black text-blue-400">
                    {new Set(blogPosts.map(b => b.category)).size || 0}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Distinct tags and topics</p>
                </div>
                <div className="bg-[#0C1226]/50 border border-white/5 p-5 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Advisory Pageviews</p>
                  <p className="text-2xl font-black text-indigo-400">14,280</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">Simulated organic reach</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-[#0C1226] border border-white/10 rounded-2xl p-6 h-fit space-y-5">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-blue-400" />
                      <h3 className="font-bold text-white text-sm">
                        {editingBlog ? "Edit Advisory" : "Compose New Advisory"}
                      </h3>
                    </div>
                    {editingBlog && (
                      <span className="bg-amber-500/15 text-amber-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                        Editing Mode
                      </span>
                    )}
                  </div>

                  {blogSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-medium">
                      {blogSuccess}
                    </div>
                  )}

                  {blogError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-medium">
                      {blogError}
                    </div>
                  )}

                  <form onSubmit={handleCreateBlogPost} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-400 uppercase tracking-wide">Article Title:</label>
                      <input 
                        type="text" 
                        required
                        value={newBlogTitle}
                        onChange={(e) => setNewBlogTitle(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
                        placeholder="e.g. West Bengal Professional Tax Rules 2026"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-400 uppercase tracking-wide">Category:</label>
                        <select 
                          value={newBlogCategory}
                          onChange={(e) => setNewBlogCategory(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                        >
                          <option value="Legal Insights">Legal Insights</option>
                          <option value="Compliance">Compliance</option>
                          <option value="Tax Audit">Tax Audit</option>
                          <option value="GST News">GST News</option>
                          <option value="MSME Protection">MSME Protection</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-400 uppercase tracking-wide">Read Time:</label>
                        <input 
                          type="text" 
                          required
                          value={newBlogReadTime}
                          onChange={(e) => setNewBlogReadTime(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                          placeholder="e.g. 5 min read"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-400 uppercase tracking-wide">Author Name:</label>
                        <input 
                          type="text" 
                          required
                          value={newBlogAuthor}
                          onChange={(e) => setNewBlogAuthor(e.target.value)}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                          placeholder="e.g. Tax Expert Team"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-400 uppercase tracking-wide">Publishing Status:</label>
                        <select 
                          value={newBlogStatus}
                          onChange={(e) => setNewBlogStatus(e.target.value as "Published" | "Draft")}
                          className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 font-bold text-blue-400"
                        >
                          <option value="Published">🟢 Published (Live)</option>
                          <option value="Draft">🟡 Draft (Review)</option>
                        </select>
                      </div>
                    </div>

                    {/* Featured Article Image Designer */}
                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-300 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
                          <Image className="w-4 h-4 text-blue-400" />
                          Featured Article Image & Designer
                        </label>
                        {newBlogImageUrl && (
                          <button
                            type="button"
                            onClick={() => setNewBlogImageUrl("")}
                            className="text-red-400 hover:text-red-300 text-[10px] font-bold transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" /> Remove Image
                          </button>
                        )}
                      </div>

                      {/* Image Preview / Banner Preview if selected */}
                      {newBlogImageUrl ? (
                        <div className="w-full h-32 rounded-xl overflow-hidden relative border border-white/10 group shadow-lg bg-slate-950">
                          <img
                            src={newBlogImageUrl}
                            alt="Preview banner"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <span className="text-white text-xs font-bold bg-slate-900/80 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">Image Active</span>
                          </div>
                        </div>
                      ) : (
                        /* Drag and Drop Box */
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer ${
                            isDraggingImage
                              ? "border-blue-500 bg-blue-500/10 text-blue-300"
                              : "border-white/10 bg-slate-950/40 text-slate-400 hover:border-white/20 hover:bg-slate-950/60"
                          }`}
                        >
                          <label className="cursor-pointer flex flex-col items-center gap-1.5">
                            <UploadCloud className="w-8 h-8 text-slate-500 hover:text-blue-400 transition-colors" />
                            <span className="text-xs font-semibold text-slate-300">Drag & drop your photo here, or <span className="text-blue-400 underline font-bold">browse</span></span>
                            <span className="text-[10px] text-slate-500">Supports PNG, JPG, GIF up to 2MB</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      )}

                      {/* Presets Selection Grid */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Or choose a professional design preset:</span>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            {
                              name: "Legal",
                              url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80",
                              label: "⚖️ Law"
                            },
                            {
                              name: "Audit",
                              url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
                              label: "📊 Audit"
                            },
                            {
                              name: "Tax",
                              url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
                              label: "🧮 Tax"
                            },
                            {
                              name: "Tech",
                              url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
                              label: "💻 Tech"
                            },
                            {
                              name: "Consult",
                              url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
                              label: "💼 Meet"
                            }
                          ].map((preset) => (
                            <button
                              key={preset.name}
                              type="button"
                              onClick={() => setNewBlogImageUrl(preset.url)}
                              className={`group relative h-11 rounded-lg overflow-hidden border transition-all cursor-pointer ${
                                newBlogImageUrl === preset.url
                                  ? "border-blue-500 ring-2 ring-blue-500/30 shadow-lg"
                                  : "border-white/10 hover:border-white/30"
                              }`}
                            >
                              <img
                                src={preset.url}
                                alt={preset.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover brightness-50 group-hover:brightness-75 transition-all"
                              />
                              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-white uppercase drop-shadow">
                                {preset.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom URL Option */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Or enter a custom photo link:</span>
                        <input
                          type="url"
                          value={newBlogImageUrl.startsWith("data:") ? "" : newBlogImageUrl}
                          onChange={(e) => setNewBlogImageUrl(e.target.value)}
                          className="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-slate-300 focus:outline-none focus:border-blue-500 text-[11px]"
                          placeholder="https://images.unsplash.com/photo-..."
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-400 uppercase tracking-wide">Short Excerpt:</label>
                      <textarea 
                        value={newBlogExcerpt}
                        onChange={(e) => setNewBlogExcerpt(e.target.value)}
                        className="w-full h-16 bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                        placeholder="Brief summary of the article..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-400 uppercase tracking-wide">Article Content (Markdown Supported):</label>
                      <textarea 
                        required
                        value={newBlogContent}
                        onChange={(e) => setNewBlogContent(e.target.value)}
                        className="w-full h-48 bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                        placeholder={`## Subheading\nUse markdown like **bold**, *italic*, lists:\n- Detail 1\n- Detail 2`}
                      />
                    </div>

                    <div className="space-y-2">
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-500/20 text-center text-xs uppercase tracking-wider font-sans"
                      >
                        {editingBlog ? "Save Advisory Changes" : "Post & Publish Advisory"}
                      </button>

                      {editingBlog && (
                        <button
                          type="button"
                          onClick={handleCancelEditBlog}
                          className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl transition-all cursor-pointer text-center text-xs border border-white/10"
                        >
                          Cancel Editing
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Published Blogs Ledger */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0C1226]/50 border border-white/5 space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-sm">Advisory Publications & Drafts Ledger</h3>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">Edit, track, toggle status, or retire knowledge base articles instantly.</p>
                  </div>

                  {loadingBlogs ? (
                    <BlogLedgerSkeleton />
                  ) : blogPosts.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/10 bg-white/5 rounded-2xl">
                      <p className="text-slate-400">No advisory posts found in the ledger. Post one above!</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="text-slate-400 border-b border-white/5 pb-3">
                            <th className="pb-3 font-bold">Article Details</th>
                            <th className="pb-3 font-bold">Category</th>
                            <th className="pb-3 font-bold">Status</th>
                            <th className="pb-3 font-bold">Author</th>
                            <th className="pb-3 font-bold">Date Published</th>
                            <th className="pb-3 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {blogPosts.map((post) => (
                            <tr key={post.id} className="hover:bg-white/[0.01]">
                              <td className="py-3.5 pr-3 font-medium">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 border border-white/10 shrink-0">
                                    <img
                                      src={post.imageUrl || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=100&q=80"}
                                      alt=""
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-white font-bold text-xs sm:text-sm line-clamp-1">{post.title}</p>
                                    <span className="text-[10px] text-slate-400 font-sans block mt-0.5 font-mono">ID: {post.id} • {post.readTime}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 font-medium">
                                <span className="bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                  {post.category}
                                </span>
                              </td>
                              <td className="py-3.5 font-medium">
                                {post.status === "Draft" ? (
                                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-md text-[10px] font-bold">
                                    🟡 Draft
                                  </span>
                                ) : (
                                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded-md text-[10px] font-bold">
                                    🟢 Published
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 text-slate-300 font-semibold">{post.author}</td>
                              <td className="py-3.5 text-slate-400 font-medium">{post.date}</td>
                              <td className="py-3.5 text-right font-medium">
                                <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                  <button
                                    onClick={() => handleTogglePublishStatus(post)}
                                    className={`px-2 py-1 border rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                      post.status === "Draft"
                                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
                                        : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
                                    }`}
                                    title={post.status === "Draft" ? "Publish article" : "Revert to draft"}
                                  >
                                    {post.status === "Draft" ? "Publish" : "Draft"}
                                  </button>
                                  <button
                                    onClick={() => handleStartEditBlog(post)}
                                    className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                                    title="Edit Article Content"
                                  >
                                    Edit
                                  </button>
                                  <Link
                                    to={post.id === "1" ? "/when-does-a-gst-proceeding-begin-clearing-the-fog-around-section-83-and-msme-protection" : `/blog/${post.id}`}
                                    target="_blank"
                                    className="px-2 py-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    View
                                  </Link>
                                  <button
                                    onClick={() => handleDeleteBlogPost(post.id)}
                                    className="p-1 text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/50 rounded-lg transition-all cursor-pointer"
                                    title="Delete/Retire Article"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: REVENUE & INVOICING */}
          {activeTab === 'revenue' && (
            <div className="space-y-8">
              
              {/* Localized Header Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#0C1226] border border-white/5 p-5 rounded-2xl">
                <div>
                  <h2 className="text-base font-bold text-white">Revenue & Invoicing Control Panel</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Manage compliance fees, client contract accounts, and accounting reports.</p>
                </div>
                <button 
                  onClick={handleExportRevenueCSV} 
                  className="flex items-center gap-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                  title="Generate accounting report for all invoices and retainer revenues"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Revenue CSV
                </button>
              </div>

              {/* Financial KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Cleared Retainer Revenue</p>
                    <h3 className="text-3xl font-extrabold text-white font-mono">₹{totalRevenue.toLocaleString()}</h3>
                  </div>
                  <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Receivables (Pending Invoices)</p>
                    <h3 className="text-3xl font-extrabold text-white font-mono">₹{pendingInvoicesAmount.toLocaleString()}</h3>
                  </div>
                  <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                    <FileText className="w-6 h-6 text-amber-400" />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Average Contract Contract Value</p>
                    <h3 className="text-3xl font-extrabold text-white font-mono">₹37,500</h3>
                  </div>
                  <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                </div>

              </div>

              {/* Converted Clients Revenue & Payment Tracking Section */}
              <div className="p-6 rounded-2xl bg-[#0C1226] border border-white/5 space-y-4">
                <div>
                  <h3 className="font-bold text-white text-sm">Converted Clients Contract Revenue & Payment Status</h3>
                  <p className="text-slate-400 text-[11px]">Directly track signed contracts, configure custom deal values, set payment status, and issue official ledger invoice entries.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="text-slate-400 border-b border-white/5 pb-3 font-bold uppercase tracking-wider text-[10px]">
                        <th className="pb-3">Client / Business Name</th>
                        <th className="pb-3">Service Rendered</th>
                        <th className="pb-3">Contract Value (INR)</th>
                        <th className="pb-3">Payment Status</th>
                        <th className="pb-3 text-center">Sync Ledger</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leads.filter(l => l.status === "Converted").map((client) => {
                        const clientInvoices = invoices.filter(inv => inv.client.toLowerCase() === client.name.toLowerCase());
                        const isInvoiced = clientInvoices.length > 0;
                        const currentVal = client.revenue_amount !== undefined ? client.revenue_amount : 25000;
                        const currentStatus = client.payment_status || "Pending";

                        return (
                          <tr key={client.id} className="hover:bg-white/[0.01]">
                            <td className="py-4">
                              <p className="font-bold text-white text-xs sm:text-sm">{client.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{client.email}</p>
                            </td>
                            <td className="py-4 text-slate-300 font-semibold">{client.service}</td>
                            <td className="py-4">
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400 font-mono">₹</span>
                                <input
                                  type="number"
                                  value={currentVal}
                                  onChange={(e) => handleUpdateLeadFinance(client.id, currentStatus, Number(e.target.value))}
                                  className="w-24 bg-slate-900 border border-white/10 rounded-lg p-1.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                                  placeholder="25000"
                                />
                              </div>
                            </td>
                            <td className="py-4">
                              <select
                                value={currentStatus}
                                onChange={(e) => handleUpdateLeadFinance(client.id, e.target.value as any, currentVal)}
                                className={`px-2 py-1.5 rounded-lg text-xs font-bold bg-slate-900 border border-white/10 ${
                                  currentStatus === "Paid" ? "text-emerald-400 border-emerald-500/20" :
                                  currentStatus === "Pending" ? "text-amber-400 border-amber-500/20" :
                                  "text-red-400 border-red-500/20"
                                } focus:outline-none cursor-pointer`}
                              >
                                <option value="Paid" className="text-emerald-400 bg-[#0C1226]">Paid</option>
                                <option value="Pending" className="text-amber-400 bg-[#0C1226]">Pending</option>
                                <option value="Unpaid" className="text-red-400 bg-[#0C1226]">Unpaid</option>
                              </select>
                            </td>
                            <td className="py-4 text-center">
                              {isInvoiced ? (
                                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase">
                                  <CheckCircle2 className="w-2.5 h-2.5" />
                                  Ledger Synced
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[9px] font-black uppercase">
                                  <AlertCircle className="w-2.5 h-2.5" />
                                  Not Synced
                                </div>
                              )}
                            </td>
                            <td className="py-4 text-right">
                              {isInvoiced ? (
                                <div className="flex items-center justify-end gap-2">
                                  <div className="text-slate-400 text-xs font-medium font-mono">
                                    {clientInvoices.map(inv => inv.id).join(", ")}
                                  </div>
                                  {clientInvoices.map(inv => (
                                    <button
                                      key={inv.id}
                                      onClick={() => setSelectedInvoiceToPrint(inv)}
                                      title={`Print Invoice ${inv.id}`}
                                      className="p-1.5 bg-slate-900 border border-white/10 hover:border-blue-500/50 hover:bg-slate-800 text-slate-300 hover:text-blue-400 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 font-bold text-[10px]"
                                    >
                                      <Printer className="w-3 h-3" />
                                      Print
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <button
                                  onClick={async () => {
                                    const tempId = `INV-2026-00${invoices.length + 1}`;
                                    const newInvoice = {
                                      id: tempId,
                                      client: client.name,
                                      service: client.service,
                                      amount: currentVal,
                                      status: currentStatus === "Paid" ? "Paid" : "Unpaid",
                                      date: new Date().toISOString().split('T')[0]
                                    };
                                    try {
                                      const res = await fetch("/api/invoices", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(newInvoice)
                                      });
                                      if (res.ok) {
                                        fetchInvoices(); handleExportInvoicePDF(newInvoice as any);
                                        setSelectedInvoiceToPrint(newInvoice as any);
                                      }
                                    } catch (err) {
                                      console.error("Failed to generate invoice inline:", err);
                                      setInvoices([newInvoice as any, ...invoices]); handleExportInvoicePDF(newInvoice as any);
                                      setSelectedInvoiceToPrint(newInvoice as any);
                                    }
                                  }}
                                  className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 font-bold rounded-lg text-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  Generate & Print
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}

                      {leads.filter(l => l.status === "Converted").length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-slate-500">
                            <p className="font-semibold text-sm">No Converted Clients in the Pipeline Yet</p>
                            <p className="text-xs text-slate-600 mt-1">Change lead statuses to "Converted" in the pipeline view, and they will populate here automatically.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Invoice Generator and Log */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Invoice logger creator tool */}
                <div className="lg:col-span-1 bg-[#0C1226] border border-white/10 rounded-2xl p-6 h-fit space-y-5">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <h3 className="font-bold text-white text-sm">Generate Professional Invoice</h3>
                  </div>

                  <form onSubmit={handleAddInvoice} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-400 uppercase tracking-wide">Select Client:</label>
                      <input 
                        type="text" 
                        required
                        value={newInvoiceClient}
                        onChange={(e) => setNewInvoiceClient(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                        placeholder="e.g. Acme Corp"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-400 uppercase tracking-wide">Professional Service Rendered:</label>
                      <select 
                        value={newInvoiceService}
                        onChange={(e) => setNewInvoiceService(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="GST Registration Setup">GST Registration Setup</option>
                        <option value="GST Monthly Return Filings">GST Monthly Returns</option>
                        <option value="Show-Cause Representation">Show-Cause Representation</option>
                        <option value="Advisory retainer fee">Advisory Retainer Fee</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-400 uppercase tracking-wide">Billable Contract Amount (INR):</label>
                      <input 
                        type="number" 
                        required
                        value={newInvoiceAmount}
                        onChange={(e) => setNewInvoiceAmount(e.target.value)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                        placeholder="e.g. 25000"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-400 uppercase tracking-wide">Invoice Payment Status:</label>
                      <select 
                        value={newInvoiceStatus}
                        onChange={(e) => setNewInvoiceStatus(e.target.value as any)}
                        className="w-full bg-slate-900 border border-white/10 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-blue-500"
                      >
                        <option value="Paid">Paid (Receipt Generated)</option>
                        <option value="Unpaid">Unpaid / Sent</option>
                        <option value="Overdue">Overdue / Arrears</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md text-center text-xs uppercase tracking-wider font-sans"
                    >
                      Generate & Clear Invoice
                    </button>
                  </form>
                </div>

                {/* Invoice Logs */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/5 pb-3">
                    <div>
                      <h3 className="font-bold text-white text-sm">Invoicing Ledger Logs</h3>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">Track and remind clients with unpaid/overdue balances.</p>
                    </div>
                    <button
                      onClick={handleSendBatchReminders}
                      disabled={batchReminding || invoices.filter(i => i.status !== 'Paid').length === 0}
                      className="px-3 py-1.5 bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 border border-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-[10px] font-bold cursor-pointer inline-flex items-center gap-1.5 transition-all"
                    >
                      <Send className={`w-3 h-3 ${batchReminding ? "animate-pulse" : ""}`} />
                      {batchReminding ? "Sending Batch..." : "Batch Remind Outstanding"}
                    </button>
                  </div>

                  {batchReminderResult && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-400 font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{batchReminderResult}</span>
                    </div>
                  )}
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="text-slate-400 border-b border-white/5 pb-3">
                          <th className="pb-3 font-bold">Invoice Reference</th>
                          <th className="pb-3 font-bold">Client Name</th>
                          <th className="pb-3 font-bold">Amount</th>
                          <th className="pb-3 font-bold">Status</th>
                          <th className="pb-3 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {invoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-white/[0.01]">
                            <td className="py-3.5 font-mono text-slate-300 font-bold">{inv.id}</td>
                            <td className="py-3.5 text-white font-semibold">
                              <p>{inv.client}</p>
                              <span className="text-[10px] text-slate-400 font-sans block mt-0.5">{inv.service}</span>
                            </td>
                            <td className="py-3.5 font-mono text-slate-200 font-bold">₹{inv.amount.toLocaleString()}</td>
                            <td className="py-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                inv.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                inv.status === 'Unpaid' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="py-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {inv.status !== 'Paid' && (
                                  <button
                                    onClick={() => handleSendInvoiceReminder(inv.id)}
                                    disabled={remindState[inv.id] === 'sending' || remindState[inv.id] === 'sent'}
                                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg cursor-pointer inline-flex items-center gap-1 transition-all ${
                                      remindState[inv.id] === 'sent' 
                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                        : remindState[inv.id] === 'sending'
                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        : 'bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20'
                                    }`}
                                  >
                                    {remindState[inv.id] === 'sent' ? (
                                      <>
                                        <MailCheck className="w-3 h-3" />
                                        Reminded!
                                      </>
                                    ) : remindState[inv.id] === 'sending' ? (
                                      <>
                                        <Clock className="w-3 h-3 animate-spin" />
                                        Sending...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="w-3 h-3" />
                                        Send Reminder
                                      </>
                                    )}
                                  </button>
                                )}
                                <button
                                  onClick={() => setSelectedInvoiceToPrint(inv)}
                                  className="px-2.5 py-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-bold cursor-pointer inline-flex items-center gap-1 transition-all"
                                >
                                  <Printer className="w-3 h-3" />
                                  View & Print
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* Conversion Revenue Details Settings Modal */}
      {showConversionModal && leadToConvert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-[#0C1226] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-white text-base">Convert Lead to Retainer</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
                <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Client / Business</p>
                <p className="text-white font-bold text-sm">{leadToConvert.name}</p>
                <p className="text-slate-400 text-xs font-mono">{leadToConvert.service}</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Contract Value (INR):</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm">₹</span>
                  <input 
                    type="number" 
                    value={modalRevenue}
                    onChange={(e) => setModalRevenue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                    placeholder="e.g. 25000"
                  />
                </div>
                <p className="text-[10px] text-slate-500">Configure the retainer amount for this client file</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Initial Payment Status:</label>
                <select 
                  value={modalPaymentStatus}
                  onChange={(e) => setModalPaymentStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Pending" className="bg-[#0C1226]">Pending (Invoice issued, awaiting settlement)</option>
                  <option value="Paid" className="bg-[#0C1226]">Paid (Upfront retainer received)</option>
                  <option value="Unpaid" className="bg-[#0C1226]">Unpaid (Awaiting bill generation)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  setShowConversionModal(false);
                  setLeadToConvert(null);
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConversion}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                Confirm & Convert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedInvoiceToPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
          <style>{`
            @media print {
              body {
                background: white !important;
                color: #1e293b !important;
              }
              /* Hide all standard elements of the web app */
              body > * {
                display: none !important;
              }
              /* Display only the printable container */
              #printable-invoice-modal-content, #printable-invoice-modal-content * {
                display: block !important;
              }
              #printable-invoice-modal-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                background: white !important;
                color: black !important;
                padding: 40px !important;
                margin: 0 !important;
                box-shadow: none !important;
                border: none !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}</style>
          
          <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full flex flex-col shadow-2xl relative max-h-[90vh] no-print">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0C1226] rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Print / View Tax Invoice</h3>
              </div>
              <button
                onClick={() => setSelectedInvoiceToPrint(null)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Invoice Scrollable Area */}
            <div className="p-6 overflow-y-auto bg-slate-950/50 flex-1">
              
              {/* Actual Printable Invoice Container */}
              <div 
                id="printable-invoice-modal-content"
                className="bg-white text-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 max-w-xl mx-auto space-y-6 text-xs leading-relaxed"
              >
                {/* Letterhead */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-6">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">MyGST Solution</h2>
                    <p className="text-slate-500 font-medium text-[10px] mt-0.5">Premium Tax Advisory & Compliance Consultants</p>
                    <p className="text-slate-400 text-[9px] mt-2 leading-normal">
                      4th Floor, GST Tower, Connaught Place,<br />
                      New Delhi, Delhi - 110001<br />
                      Email: support@mygstsolution.com | Tel: +91 11 4987 6543
                    </p>
                    <p className="text-blue-600 font-bold font-mono text-[9px] mt-1">GSTIN: 07AAAAA0000A1Z5</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block px-3 py-1 bg-slate-100 rounded text-slate-800 font-black tracking-widest uppercase text-[10px] mb-3">
                      TAX INVOICE
                    </div>
                    <p className="text-slate-400 text-[10px]">Invoice ID</p>
                    <p className="font-bold font-mono text-slate-900 text-sm">{selectedInvoiceToPrint.id}</p>
                    <p className="text-slate-400 text-[10px] mt-2">Date of Issue</p>
                    <p className="font-bold font-mono text-slate-900">{selectedInvoiceToPrint.date}</p>
                  </div>
                </div>

                {/* Bill To & Bill From info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-3 rounded">
                    <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-1">BILLED TO (RECIPIENT)</p>
                    <p className="font-extrabold text-slate-950 text-xs">{selectedInvoiceToPrint.client}</p>
                    <p className="text-slate-500 text-[10px] mt-1 leading-normal font-sans">
                      Taxpayer & Registered Retainer Client<br />
                      Integrated Compliance File ID: #{selectedInvoiceToPrint.id.split('-').pop()}<br />
                      Place of Supply: Delhi (07)
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded flex flex-col justify-between">
                    <div>
                      <p className="text-slate-400 text-[9px] uppercase font-bold tracking-wider mb-1">REMITTANCE BANK DETAILS</p>
                      <p className="font-bold text-slate-900 text-[10px]">HDFC Bank Ltd</p>
                      <p className="font-mono text-slate-600 text-[9px] mt-0.5">A/C: 50200084729103</p>
                      <p className="font-mono text-slate-600 text-[9px]">IFSC: HDFC0000112</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase rounded ${
                        selectedInvoiceToPrint.status === 'Paid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-red-100 text-red-800 border border-red-300'
                      }`}>
                        {selectedInvoiceToPrint.status === 'Paid' ? 'PAID / RECEIPT' : 'DUE / AWAITING PAYMENT'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Services Table */}
                <table className="w-full text-left border-collapse mt-4">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[9px] bg-slate-50">
                      <th className="py-2 px-3">Description of Professional Service</th>
                      <th className="py-2 px-3 text-right">SAC Code</th>
                      <th className="py-2 px-3 text-right">Taxable Value</th>
                      <th className="py-2 px-3 text-right">GST Rate</th>
                      <th className="py-2 px-3 text-right">Total (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {selectedInvoiceToPrint.service}
                        <p className="text-[9px] text-slate-400 font-normal mt-0.5">Professional fee for GST, filings, and legal representation services</p>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">998222</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700">
                        ₹{(selectedInvoiceToPrint.amount / 1.18).toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">18%</td>
                      <td className="py-3 px-3 text-right font-bold font-mono text-slate-900">
                        ₹{selectedInvoiceToPrint.amount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* GST Breakdown & Totals */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="text-[10px] text-slate-500 space-y-1">
                    <p className="font-bold text-slate-700 text-[10px] mb-1">Tax Breakdown:</p>
                    <p className="flex justify-between font-mono">
                      <span>• Central GST (CGST 9%):</span>
                      <span className="font-bold text-slate-800">₹{((selectedInvoiceToPrint.amount / 1.18) * 0.09).toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between font-mono">
                      <span>• State GST (SGST 9%):</span>
                      <span className="font-bold text-slate-800">₹{((selectedInvoiceToPrint.amount / 1.18) * 0.09).toFixed(2)}</span>
                    </p>
                    <p className="flex justify-between border-t border-dashed border-slate-200 pt-1 font-mono font-bold text-slate-800">
                      <span>Total GST Tax Liability:</span>
                      <span>₹{((selectedInvoiceToPrint.amount / 1.18) * 0.18).toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <div className="w-full text-right space-y-1">
                      <p className="flex justify-between text-slate-500 text-[10px]">
                        <span>Subtotal (Excl. Tax):</span>
                        <span className="font-mono text-slate-700">₹{(selectedInvoiceToPrint.amount / 1.18).toFixed(2)}</span>
                      </p>
                      <p className="flex justify-between text-slate-500 text-[10px]">
                        <span>Tax Amount (18%):</span>
                        <span className="font-mono text-slate-700">₹{((selectedInvoiceToPrint.amount / 1.18) * 0.18).toFixed(2)}</span>
                      </p>
                      <div className="flex justify-between text-slate-900 font-extrabold text-sm border-t-2 border-slate-200 pt-1.5">
                        <span>Grand Total:</span>
                        <span className="font-mono text-blue-600">₹{selectedInvoiceToPrint.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer notes & signatures */}
                <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 items-end">
                  <div className="space-y-1 text-slate-400 text-[9px] leading-normal">
                    <p className="font-bold text-slate-600">Declaration & Terms:</p>
                    <p>This is a computer-generated tax invoice and does not require a physical signature unless requested.</p>
                    <p>Please clear unpaid dues within 7 business days of issue date to avoid compliance service disruption.</p>
                  </div>
                  <div className="text-right space-y-4">
                    <div className="h-8"></div>
                    <div className="border-t border-slate-300 pt-1 inline-block text-right">
                      <p className="font-bold text-slate-800 text-[10px]">For MyGST Solution</p>
                      <p className="text-slate-500 text-[8px] uppercase tracking-wider font-mono">Authorized Signatory</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-white/5 bg-[#0C1226] rounded-b-2xl">
              <button
                onClick={() => setSelectedInvoiceToPrint(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => handleExportInvoicePDF(selectedInvoiceToPrint)}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 cursor-pointer inline-flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Download Official PDF
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-500 hover:to-indigo-400 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 cursor-pointer inline-flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
