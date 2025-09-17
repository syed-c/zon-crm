import { supabase } from "@/lib/supabaseClient";

export type ClientRow = {
  id: string;
  name: string;
  website?: string | null;
  email?: string | null;
};

export async function fetchClients(): Promise<ClientRow[]> {
  // Select only columns guaranteed to exist; optional fields will be read if present
  const { data, error } = await supabase
    .from("clients")
    .select("id,name")
    .order("name", { ascending: true });
  if (error || !data) return [];
  return data as ClientRow[];
}

export async function createClient(input: {
  name: string;
  website?: string;
  contactEmail?: string;
}): Promise<string> {
  const payload: Record<string, any> = { name: input.name };
  if (input.website) payload.website = input.website;
  if (input.contactEmail) payload.email = input.contactEmail; // map to 'email' column

  const { data, error } = await supabase
    .from("clients")
    .insert(payload)
    .select("id")
    .single();
  if (error) throw error;
  return data!.id as string;
}


