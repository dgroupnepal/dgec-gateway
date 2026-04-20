import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { User, Shield, Phone, MapPin, Calendar } from "lucide-react";

const PortalProfile = () => {
  const { profile, refreshProfile } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    nationality: "",
    passport_number: "",
    date_of_birth: "",
    address: "",
    emergency_contact: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        nationality: profile.nationality ?? "",
        passport_number: profile.passport_number ?? "",
        date_of_birth: profile.date_of_birth ?? "",
        address: profile.address ?? "",
        emergency_contact: profile.emergency_contact ?? "",
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ ...form, updated_at: new Date().toISOString() })
      .eq("id", profile.id);
    if (error) {
      toast.error("Failed to save profile: " + error.message);
    } else {
      await refreshProfile();
      toast.success("Profile updated successfully!");
    }
    setSaving(false);
  };

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "??";

  return (
    <div className="section-padding">
      <div className="container-custom max-w-3xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-2xl md:text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Keep your information up to date.</p>
        </motion.div>

        {/* Avatar + Role */}
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{profile?.full_name ?? "—"}</p>
              <p className="text-muted-foreground text-sm">{profile?.email}</p>
              <Badge className="mt-1 capitalize" variant="secondary">{profile?.role}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <form onSubmit={handleSave}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="w-4 h-4" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full Name</Label>
                <Input name="full_name" id="full_name" value={form.full_name} onChange={handleChange} placeholder="Ram Sharma" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> Phone
                </Label>
                <Input name="phone" id="phone" value={form.phone} onChange={handleChange} placeholder="+977 98XXXXXXXX" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nationality">Nationality</Label>
                <Input name="nationality" id="nationality" value={form.nationality} onChange={handleChange} placeholder="Nepali" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="passport_number" className="flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Passport Number
                </Label>
                <Input name="passport_number" id="passport_number" value={form.passport_number} onChange={handleChange} placeholder="PA1234567" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date_of_birth" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Date of Birth
                </Label>
                <Input name="date_of_birth" id="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input name="emergency_contact" id="emergency_contact" value={form.emergency_contact} onChange={handleChange} placeholder="+977 98XXXXXXXX" />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <Label htmlFor="address" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Address
                </Label>
                <Input name="address" id="address" value={form.address} onChange={handleChange} placeholder="Kathmandu, Nepal" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-4">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PortalProfile;
