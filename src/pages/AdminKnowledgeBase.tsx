import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { getFAQs, saveFAQs } from "@/lib/storage";
import type { FAQEntry } from "@/lib/types";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

const AdminKnowledgeBase = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<FAQEntry[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FAQEntry | null>(null);
  const [form, setForm] = useState({ question: "", answer: "", category: "", keywords: "" });

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/"); return; }
    setFaqs(getFAQs());
  }, [user, navigate]);

  const filtered = faqs.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ question: "", answer: "", category: "", keywords: "" });
    setDialogOpen(true);
  };

  const openEdit = (faq: FAQEntry) => {
    setEditing(faq);
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, keywords: faq.keywords.join(", ") });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const entry: FAQEntry = {
      id: editing?.id || "faq-" + crypto.randomUUID().slice(0, 8),
      question: form.question,
      answer: form.answer,
      category: form.category,
      keywords: form.keywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean),
    };
    let updated: FAQEntry[];
    if (editing) {
      updated = faqs.map((f) => (f.id === editing.id ? entry : f));
    } else {
      updated = [...faqs, entry];
    }
    saveFAQs(updated);
    setFaqs(updated);
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = faqs.filter((f) => f.id !== id);
    saveFAQs(updated);
    setFaqs(updated);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground text-sm">{faqs.length} FAQ entries</p>
          </div>
          <Button onClick={openCreate} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((faq) => (
            <Card key={faq.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{faq.category}</Badge>
                    </div>
                    <p className="font-medium text-sm mb-1">{faq.question}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{faq.answer}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Fees, Exams" />
              </div>
              <div>
                <Label>Question</Label>
                <Input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Enter the question" />
              </div>
              <div>
                <Label>Answer</Label>
                <Textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Enter the answer" rows={4} />
              </div>
              <div>
                <Label>Keywords (comma-separated)</Label>
                <Input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} placeholder="fee, tuition, cost" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={!form.question || !form.answer} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminKnowledgeBase;
