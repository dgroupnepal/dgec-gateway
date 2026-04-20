import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Users, Search, Phone, Mail, Globe, Shield, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const AdminStudents = () => {
  const [students, setStudents] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [appCount, setAppCount] = useState<Record<string, number>>({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let q = supabase.from("profiles").select("*").eq("role", "student").order("created_at", { ascending: false });
      if (search) q = q.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,passport_number.ilike.%${search}%`);
      const { data } = await q;
      if (data) setStudents(data as Profile[]);
      setLoading(false);
    };
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search]);

  const openStudent = async (s: Profile) => {
    setSelected(s);
    const { count } = await supabase.from("applications").select("id", { count: "exact" }).eq("student_id", s.id);
    setAppCount((prev) => ({ ...prev, [s.id]: count ?? 0 }));
  };

  const initials = (name: string | null) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "??";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Students</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage all registered students.</p>
        </div>
        <Badge variant="secondary" className="text-sm">{students.length} students</Badge>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search name, email, passport…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium hidden md:table-cell">Contact</th>
                  <th className="p-4 font-medium hidden lg:table-cell">Passport</th>
                  <th className="p-4 font-medium hidden lg:table-cell">Nationality</th>
                  <th className="p-4 font-medium">Joined</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">Loading…</td></tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-40" />
                      <p className="text-muted-foreground">No students found.</p>
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials(s.full_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{s.full_name ?? "—"}</p>
                            <p className="text-xs text-muted-foreground">{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="text-xs">{s.phone ?? "—"}</p>
                      </td>
                      <td className="p-4 hidden lg:table-cell font-mono text-xs">{s.passport_number ?? "—"}</td>
                      <td className="p-4 hidden lg:table-cell text-xs">{s.nationality ?? "—"}</td>
                      <td className="p-4 text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <Button size="sm" variant="outline" onClick={() => openStudent(s)}>View</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Student detail drawer */}
      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full md:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Student Profile</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">{initials(selected.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selected.full_name ?? "—"}</p>
                  <Badge variant="secondary" className="text-xs capitalize">{selected.role}</Badge>
                </div>
              </div>

              {[
                { icon: Mail,   label: "Email",      value: selected.email },
                { icon: Phone,  label: "Phone",      value: selected.phone },
                { icon: Globe,  label: "Nationality", value: selected.nationality },
                { icon: Shield, label: "Passport",   value: selected.passport_number },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 text-sm">
                  <row.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground w-24">{row.label}</span>
                  <span className="font-medium">{row.value ?? "—"}</span>
                </div>
              ))}

              <div className="pt-3 border-t">
                <p className="text-sm font-medium mb-2">Applications: {appCount[selected.id] ?? "…"}</p>
                <Button asChild size="sm" className="w-full">
                  <Link to={`/admin/pipeline?student=${selected.id}`}>
                    <ExternalLink className="w-3 h-3 mr-2" /> View Applications
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminStudents;
