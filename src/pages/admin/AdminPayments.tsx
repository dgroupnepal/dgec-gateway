import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Payment, PaymentStatus } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CreditCard, Plus, Search, CheckCircle2, AlertCircle, Clock, Download } from "lucide-react";

type PaymentWithProfile = Payment & { profiles?: { full_name: string | null; email: string } };

const STATUS_COLORS: Record<PaymentStatus, string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  partial:   "bg-blue-100 text-blue-800",
  paid:      "bg-green-100 text-green-800",
  overdue:   "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-600",
  refunded:  "bg-purple-100 text-purple-800",
};

const AdminPayments = () => {
  const { profile } = useAuth();
  const [payments, setPayments] = useState<PaymentWithProfile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [students, setStudents] = useState<{ id: string; full_name: string | null; email: string }[]>([]);
  const [form, setForm] = useState({
    student_id: "", description: "", amount_npr: "", currency: "NPR", due_date: "", notes: "",
  });
  const [creating, setCreating] = useState(false);

  const load = async () => {
    setLoading(true);
    const q = supabase
      .from("payments")
      .select("*, profiles!student_id(full_name, email)")
      .order("created_at", { ascending: false });
    const { data } = await q;
    let items = (data ?? []) as PaymentWithProfile[];
    if (search) {
      const s = search.toLowerCase();
      items = items.filter((p) =>
        p.invoice_number.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        (p.profiles?.full_name ?? "").toLowerCase().includes(s)
      );
    }
    setPayments(items);
    setLoading(false);
  };

  const loadStudents = async () => {
    const { data } = await supabase.from("profiles").select("id, full_name, email").eq("role", "student");
    if (data) setStudents(data as typeof students);
  };

  useEffect(() => { load(); }, [search]);

  const updatePaymentStatus = async (id: string, status: PaymentStatus) => {
    const { error } = await supabase.from("payments").update({
      status,
      ...(status === "paid" ? { paid_at: new Date().toISOString() } : {}),
    }).eq("id", id);
    if (error) { toast.error("Update failed."); return; }
    setPayments((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
    toast.success("Payment status updated.");
  };

  const createInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.student_id || !form.description || !form.amount_npr) {
      toast.error("Please fill all required fields.");
      return;
    }
    setCreating(true);
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
    const { error } = await supabase.from("payments").insert({
      student_id: form.student_id,
      invoice_number: invoiceNumber,
      description: form.description,
      amount_npr: parseFloat(form.amount_npr),
      currency: form.currency as "NPR" | "USD" | "KRW" | "JPY",
      due_date: form.due_date || null,
      notes: form.notes || null,
      status: "pending",
      created_by: profile?.id,
    });
    if (error) { toast.error("Failed to create invoice."); setCreating(false); return; }

    // Notify student
    const student = students.find((s) => s.id === form.student_id);
    if (student) {
      await supabase.from("notifications").insert({
        user_id: form.student_id,
        type: "payment",
        title: "New Invoice",
        body: `Invoice ${invoiceNumber}: ${form.description} — NPR ${parseFloat(form.amount_npr).toLocaleString()}`,
        action_url: "/portal/payments",
      });
    }

    toast.success(`Invoice ${invoiceNumber} created.`);
    setShowCreate(false);
    setForm({ student_id: "", description: "", amount_npr: "", currency: "NPR", due_date: "", notes: "" });
    setCreating(false);
    await load();
  };

  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount_npr, 0);
  const totalDue = payments.filter((p) => ["pending", "overdue", "partial"].includes(p.status)).reduce((s, p) => s + p.amount_npr, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Payments & Invoices</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Create and manage student invoices.</p>
        </div>
        <Button onClick={() => { loadStudents(); setShowCreate(true); }}>
          <Plus className="w-4 h-4 mr-2" /> New Invoice
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Collected</p>
            <p className="text-2xl font-bold text-green-600 mt-1">NPR {totalRevenue.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Outstanding</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">NPR {totalDue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search invoice, student…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="p-4 font-medium">Invoice</th>
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium hidden md:table-cell">Description</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium hidden md:table-cell">Due</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={7} className="p-4 text-center text-muted-foreground">Loading…</td></tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-40 text-muted-foreground" />
                      <p className="text-muted-foreground">No invoices yet.</p>
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/40">
                      <td className="p-4 font-mono text-xs">{p.invoice_number}</td>
                      <td className="p-4">
                        <p className="font-medium text-xs">{p.profiles?.full_name ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{p.profiles?.email ?? "—"}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell text-xs max-w-[150px] truncate">{p.description}</td>
                      <td className="p-4 font-bold text-sm">NPR {p.amount_npr.toLocaleString()}</td>
                      <td className="p-4 hidden md:table-cell text-xs text-muted-foreground">
                        {p.due_date ? new Date(p.due_date).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status] ?? ""}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {p.status === "pending" && (
                          <Button size="sm" variant="outline" className="text-xs text-green-700 border-green-300 hover:bg-green-50"
                            onClick={() => updatePaymentStatus(p.id, "paid")}>
                            Mark Paid
                          </Button>
                        )}
                        {p.status === "paid" && <span className="text-xs text-green-600">✓ Paid</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Invoice Sheet */}
      <Sheet open={showCreate} onOpenChange={setShowCreate}>
        <SheetContent className="w-full md:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create Invoice</SheetTitle>
          </SheetHeader>
          <form onSubmit={createInvoice} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label>Student *</Label>
              <Select value={form.student_id} onValueChange={(v) => setForm((p) => ({ ...p, student_id: v }))}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.full_name ?? s.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Description *</Label>
              <Input placeholder="Visa processing fee" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Amount (NPR) *</Label>
                <Input type="number" placeholder="5000" value={form.amount_npr} onChange={(e) => setForm((p) => ({ ...p, amount_npr: e.target.value }))} required />
              </div>
              <div className="space-y-1.5">
                <Label>Due Date</Label>
                <Input type="date" value={form.due_date} onChange={(e) => setForm((p) => ({ ...p, due_date: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Notes</Label>
              <Input placeholder="Optional note" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
            </div>
            <Button type="submit" className="w-full" disabled={creating}>
              {creating ? "Creating…" : "Create Invoice"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminPayments;
