import { createClient } from "@/lib/supabase/client";

export type LeadPayload = {
  name: string;
  phone: string;
  email: string;
  propertyId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
};

export async function submitLead(payload: LeadPayload) {
  const supabase = createClient();

  if (!supabase) {
    console.info("Supabase env vars are not configured yet.", payload);
    return { ok: true, skipped: true };
  }

  const { error } = await supabase.from("leads").insert({
    name: payload.name,
    phone: payload.phone,
    email: payload.email,
    property_id: payload.propertyId,
    property_name: payload.propertyName,
    check_in: payload.checkIn || null,
    check_out: payload.checkOut || null,
    adults: payload.adults,
    children: payload.children,
    rooms: payload.rooms
  });

  if (error) {
    console.error("Unable to submit lead", error);
    return { ok: false, error };
  }

  return { ok: true };
}
