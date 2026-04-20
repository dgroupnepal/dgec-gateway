import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Payment, PaymentStatus } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, Clock, AlertCircle, Download } from "lucide-react";
import { supabase as sb } from "@/integrations/supabase/client";

const statusConfig: Record<PaymentStatus, { label: string; className: string; icon: React.ElementType }> = {
  pending:   { label: "Pending",   className: "bg-yellow-100 text-yellow-800", icon: Clock },
  partial:   { label: "Partial",   className: "bg-blue-100 text-blue-800",     icon: Clock },
  paid:      { label: "Paid",      className: "bg-green-100 text-green-800",   icon: CheckCircle2 },
  overdue:   { label: "Overdue",   className: "bg-red-100 text-red-800",       icon: AlertCircle },
  cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-600",     icon: Clock },
  refunded:  { label: "Refunded",  className: "bg-purple-100 text-purple-800", icon: CheckCircle2 },
};

const PortalPayments = () => {
  const { profile } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from("payments")
      .select("*")
      .eq("student_id", profile.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setPayments(data as Payment[]);
        setLoading(false);
      });
  }, [profile]);

  const total = payments.reduce((sum, p) => sum + p.amount_npr, 0);
  const paid = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount_npr, 0);
  const due = payments.filter((p) => ["pending", "partial", "overdue"].includes(p.status)).reduce((sum, p) => sum + p.amount_npr, 0);

  const handleDownloadReceipt = async (p: Payment) => {
    if (!p.receipt_path) return;
    const { data } = await supabase.storage.from("documents").createSignedUrl(p.receipt_path, 60);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Payments & Invoices</h1>
          <p className="text-muted-foreground mt-1">Track your payment history with DGEC.</p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Invoiced", value: total, color: "text-foreground" },
            { label: "Amount Paid",    value: paid,  color: "text-green-600" },
            { label: "Amount Due",     value: due,   color: "text-orange-600" },
          ].map((item) => (
            <Card key={item.label}>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={`font-bold text-xl mt-1 ${item.color}`}>
                  NPR {item.value.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Invoice History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-muted rounded animate-pulse" />)}
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p>No invoices yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground border-b">
                      <th className="pb-2 font-medium">Invoice #</th>
                      <th className="pb-2 font-medium">Description</th>
                      <th className="pb-2 font-medium">Amount</th>
                      <th className="pb-2 font-medium">Due Date</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {payments.map((p) => {
                      const cfg = statusConfig[p.status] ?? statusConfig.pending;
                      const StatusIcon = cfg.icon;
                      return (
                        <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-muted/40">
                          <td className="py-3 font-mono text-xs text-muted-foreground">{p.invoice_number}</td>
                          <td className="py-3 font-medium max-w-[180px] truncate">{p.description}</td>
                          <td className="py-3 font-bold">NPR {p.amount_npr.toLocaleString()}</td>
                          <td className="py-3 text-muted-foreground">
                            {p.due_date ? new Date(p.due_date).toLocaleDateString() : "—"}
                          </td>
                          <td className="py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 w-fit ${cfg.className}`}>
                              <StatusIcon className="w-3 h-3" /> {cfg.label}
                            </span>
                          </td>
                          <td className="py-3">
                            {p.receipt_path && (
                              <Button size="sm" variant="ghost" onClick={() => handleDownloadReceipt(p)}>
                                <Download className="w-3 h-3 mr-1" /> Receipt
                              </Button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">Payment Methods Accepted</p>
            <p>Bank Transfer · eSewa · Khalti · Cash (DGEC Office)</p>
            <p className="mt-2 text-xs text-blue-600">
              After payment, send the receipt to{" "}
              <a href="mailto:info@dgroup.edu.np" className="underline">info@dgroup.edu.np</a> or
              WhatsApp us. Your receipt will be updated within 24 hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PortalPayments;
