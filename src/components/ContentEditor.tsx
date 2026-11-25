import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImageUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

const IMAGE_KEY = /image|logo|avatarurl|background/i;

export function labelFor(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (m) => m.toUpperCase());
}

/** An empty copy of an item, used when adding a new entry to a list. */
export function blankLike(v: Json): Json {
  if (typeof v === "string") return "";
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  if (Array.isArray(v)) return [];
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blankLike(x)]));
  return "";
}

function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  async function upload(file: File) {
    setBusy(true);
    const path = `${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const { error } = await supabase.storage.from("site-media").upload(path, file, { contentType: file.type });
    setBusy(false);
    if (error) { toast.error(`Upload failed: ${error.message}`); return; }
    onChange(`/api/public/media/${path}`);
    toast.success("Picture uploaded");
  }
  return (
    <div className="flex items-center gap-2">
      {value ? <img src={value} alt="" className="h-12 w-12 shrink-0 rounded border border-border object-cover" /> : <div className="h-12 w-12 shrink-0 rounded border border-dashed border-border" />}
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Picture link" />
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void upload(f); e.target.value = ""; }} />
      <Button type="button" variant="outline" size="icon" disabled={busy} aria-label="Upload picture" onClick={() => ref.current?.click()}><ImageUp /></Button>
    </div>
  );
}

export function Field({ name, value, onChange, template }: { name: string; value: Json; onChange: (v: Json) => void; template?: Json }) {
  if (typeof value === "boolean") {
    return <label className="flex items-center justify-between gap-3 py-1 text-sm"><span>{labelFor(name)}</span><Switch checked={value} onCheckedChange={onChange} /></label>;
  }
  if (typeof value === "number") {
    return <label className="block space-y-1 text-sm"><span className="text-muted-foreground">{labelFor(name)}</span><Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} /></label>;
  }
  if (typeof value === "string" || value === null) {
    const v = value ?? "";
    return (
      <label className="block space-y-1 text-sm">
        <span className="text-muted-foreground">{labelFor(name)}</span>
        {IMAGE_KEY.test(name) ? <ImageField value={v} onChange={onChange} /> : v.length > 70 || /text|intro|bio|blurb|detail|value|quote/i.test(name)
          ? <Textarea value={v} rows={3} onChange={(e) => onChange(e.target.value)} />
          : <Input value={v} onChange={(e) => onChange(e.target.value)} />}
      </label>
    );
  }
  if (Array.isArray(value)) {
    const tpl = value[0] ?? template ?? "";
    const move = (i: number, d: number) => { const n = [...value]; const [x] = n.splice(i, 1); n.splice(i + d, 0, x as Json); onChange(n); };
    return (
      <fieldset className="space-y-2 rounded-md border border-border p-3">
        <legend className="px-1 text-sm font-semibold">{labelFor(name)} <span className="text-muted-foreground">({value.length})</span></legend>
        {value.map((item, i) => (
          <div key={i} className="space-y-2 rounded border border-border/60 bg-background/40 p-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">#{i + 1}</span>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" disabled={i === 0} aria-label="Move up" onClick={() => move(i, -1)}><ArrowUp /></Button>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7" disabled={i === value.length - 1} aria-label="Move down" onClick={() => move(i, 1)}><ArrowDown /></Button>
                <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive" aria-label="Remove" onClick={() => onChange(value.filter((_, j) => j !== i))}><Trash2 /></Button>
              </div>
            </div>
            <Field name={typeof item === "object" ? "" : "Item"} value={item} onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))} />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange([...value, blankLike(tpl)])}><Plus /> Add</Button>
      </fieldset>
    );
  }
  return (
    <div className="space-y-3">
      {Object.entries(value).map(([k, v]) => (
        <Field key={k} name={k} value={v} onChange={(nv) => onChange({ ...value, [k]: nv })} />
      ))}
    </div>
  );
}
