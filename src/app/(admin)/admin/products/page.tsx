"use client";
import { useMemo, useState } from "react";
import { getAllProducts, getCategories, upsertProduct, deleteProduct } from "@/lib/db";
import type { Product } from "@/lib/types";
import { formatINR } from "@/lib/site";
import { toast } from "@/store/ui";

const empty: Product = {
  id: "", name: "", slug: "", sku: "", brand: "Alpha Signature", category_id: "c-mens",
  price: 0, mrp: 0, stock: 0, description: "", specs: {}, images: [],
  badges: [], variants: [], status: "draft", rating: 4.5, reviews_count: 0,
  created_at: ""
};

export default function AdminProducts() {
  const [gen, setGen] = useState(0);
  const [editing, setEditing] = useState<Product | null>(null);
  const [view, setView] = useState<"list" | "edit">("list");
  const categories = getCategories();
  const products = useMemo(() => getAllProducts(), [gen]);

  const startEdit = (p: Product | null) => {
    setEditing(p ? { ...p, specs: { ...p.specs }, variants: [...(p.variants || [])], images: [...(p.images || [])], badges: [...(p.badges || [])] } : { ...empty, id: "", created_at: new Date().toISOString() });
    setView("edit");
  };

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.slug.trim()) { toast("Name and slug required"); return; }
    if (!editing.id) editing.id = "p-" + Date.now().toString(36);
    upsertProduct(editing);
    toast("Product saved ✓");
    setView("list");
    setGen((g) => g + 1);
  };

  const del = (id: string) => {
    if (!confirm("Delete this product permanently? This cannot be undone.")) return;
    deleteProduct(id);
    setGen((g) => g + 1);
    toast("Product deleted");
  };

  if (view === "edit") return <EditForm p={editing!} setP={setEditing} onSave={save} onCancel={() => setView("list")} categories={categories} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-navy">Products</h1>
          <p className="text-navy/50 text-sm">{products.length} products</p>
        </div>
        <button onClick={() => startEdit(null)} className="btn-gold px-5 py-2.5 rounded-full font-semibold text-sm">+ Add Product</button>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-navy/5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-navy/50 text-left border-b border-navy/10"><th className="py-2 font-medium">Product</th><th className="py-2 font-medium">Category</th><th className="py-2 font-medium">Price</th><th className="py-2 font-medium">Stock</th><th className="py-2 font-medium">Status</th><th className="py-2 font-medium text-right">Actions</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-navy/5">
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-navy/5 shrink-0">{p.images[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : null}</div>
                    <div><div className="font-medium text-navy">{p.name}</div><div className="text-xs text-navy/40">{p.sku}</div></div>
                  </div>
                </td>
                <td className="py-3 text-navy/70">{categories.find((c) => c.id === p.category_id)?.name || "—"}</td>
                <td className="py-3 font-medium">{formatINR(p.price)}</td>
                <td className="py-3"><span className={`${p.stock <= 8 ? "text-red-500 font-bold" : "text-navy"}`}>{p.stock}</span></td>
                <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${p.status === "published" ? "bg-emerald/10 text-emerald" : "bg-navy/5 text-navy"}`}>{p.status}</span></td>
                <td className="py-3 text-right whitespace-nowrap">
                  <button onClick={() => startEdit(p)} className="text-gold-700 text-xs font-medium mr-3 hover:underline">Edit</button>
                  <button onClick={() => del(p.id)} className="text-red-500 text-xs font-medium hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EditForm({ p, setP, onSave, onCancel, categories }: { p: Product; setP: (p: Product) => void; onSave: () => void; onCancel: () => void; categories: any[] }) {
  const up = (patch: Partial<Product>) => setP({ ...p, ...patch });
  const [imgInput, setImgInput] = useState("");
  const [specKey, setSpecKey] = useState(""); const [specVal, setSpecVal] = useState("");
  const [varType, setVarType] = useState(""); const [varVal, setVarVal] = useState(""); const [varStock, setVarStock] = useState(0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-navy">{p.id ? "Edit Product" : "Add Product"}</h1>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-5 py-2.5 rounded-full border border-navy/15 text-navy text-sm">Cancel</button>
          <button onClick={onSave} className="btn-gold px-5 py-2.5 rounded-full font-semibold text-sm">Save Product</button>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-navy/5 grid md:grid-cols-2 gap-4">
        <label className="text-xs text-navy/60">Name<input value={p.name} onChange={(e) => up({ name: e.target.value })} className="input-premium mt-1" /></label>
        <label className="text-xs text-navy/60">Slug<input value={p.slug} onChange={(e) => up({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") })} className="input-premium mt-1" /></label>
        <label className="text-xs text-navy/60">SKU<input value={p.sku} onChange={(e) => up({ sku: e.target.value })} className="input-premium mt-1" /></label>
        <label className="text-xs text-navy/60">Brand<input value={p.brand} onChange={(e) => up({ brand: e.target.value })} className="input-premium mt-1" /></label>
        <label className="text-xs text-navy/60">Category
          <select value={p.category_id} onChange={(e) => up({ category_id: e.target.value })} className="input-premium mt-1">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="text-xs text-navy/60">Status
          <select value={p.status} onChange={(e) => up({ status: e.target.value as any })} className="input-premium mt-1">
            <option value="draft">Draft (hidden)</option><option value="published">Published</option>
          </select>
        </label>
        <label className="text-xs text-navy/60">Price (₹)<input type="number" value={p.price} onChange={(e) => up({ price: +e.target.value })} className="input-premium mt-1" /></label>
        <label className="text-xs text-navy/60">MRP (₹)<input type="number" value={p.mrp} onChange={(e) => up({ mrp: +e.target.value })} className="input-premium mt-1" /></label>
        <label className="text-xs text-navy/60">Stock<input type="number" value={p.stock} onChange={(e) => up({ stock: +e.target.value })} className="input-premium mt-1" /></label>
        <label className="text-xs text-navy/60">Badges (comma separated)<input defaultValue={p.badges.join(", ")} onBlur={(e) => up({ badges: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} className="input-premium mt-1" /></label>
        <div className="md:col-span-2">
          <label className="text-xs text-navy/60">Description<textarea value={p.description} onChange={(e) => up({ description: e.target.value })} className="input-premium mt-1 min-h-[80px]" /></label>
        </div>

        {/* images */}
        <div className="md:col-span-2">
          <div className="text-xs text-navy/60 mb-2">Product Images (paste image URLs)</div>
          <div className="flex flex-wrap gap-3 mb-2">
            {p.images.map((img, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-navy/10">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button onClick={() => up({ images: p.images.filter((_, j) => j !== i) })} className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 rounded-bl">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={imgInput} onChange={(e) => setImgInput(e.target.value)} placeholder="/images/products/….jpg or http url" className="input-premium flex-1 text-xs" />
            <button onClick={() => { if (imgInput) { up({ images: [...p.images, imgInput] }); setImgInput(""); } }} className="btn-gold px-4 rounded-full text-sm">Add</button>
          </div>
        </div>

        {/* specs */}
        <div className="md:col-span-2">
          <div className="text-xs text-navy/60 mb-2">Specifications</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {Object.entries(p.specs).map(([k, v]) => (
              <span key={k} className="text-xs bg-navy/5 rounded-full px-3 py-1">{k}: {v} <button onClick={() => { const s = { ...p.specs }; delete s[k]; up({ specs: s }); }} className="text-red-400">✕</button></span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={specKey} onChange={(e) => setSpecKey(e.target.value)} placeholder="Key (e.g. Movement)" className="input-premium flex-1 text-xs" />
            <input value={specVal} onChange={(e) => setSpecVal(e.target.value)} placeholder="Value" className="input-premium flex-1 text-xs" />
            <button onClick={() => { if (specKey && specVal) { up({ specs: { ...p.specs, [specKey]: specVal } }); setSpecKey(""); setSpecVal(""); } }} className="btn-gold px-4 rounded-full text-sm">Add</button>
          </div>
        </div>

        {/* variants */}
        <div className="md:col-span-2">
          <div className="text-xs text-navy/60 mb-2">Variants (type, value, stock)</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {p.variants.map((v, i) => (
              <span key={i} className="text-xs bg-navy/5 rounded-full px-3 py-1">{v.variant_type}: {v.value} ({v.stock}) <button onClick={() => up({ variants: p.variants.filter((_, j) => j !== i) })} className="text-red-400">✕</button></span>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <input value={varType} onChange={(e) => setVarType(e.target.value)} placeholder="Type (Strap/Lens/Color)" className="input-premium flex-1 text-xs min-w-40" />
            <input value={varVal} onChange={(e) => setVarVal(e.target.value)} placeholder="Value" className="input-premium flex-1 text-xs min-w-32" />
            <input type="number" value={varStock} onChange={(e) => setVarStock(+e.target.value)} placeholder="Stock" className="input-premium w-24 text-xs" />
            <button onClick={() => { if (varType && varVal) { up({ variants: [...p.variants, { variant_type: varType, value: varVal, stock: varStock }] }); setVarType(""); setVarVal(""); setVarStock(0); } }} className="btn-gold px-4 rounded-full text-sm">Add</button>
          </div>
        </div>

        <label className="text-xs text-navy/60 md:col-span-2">SEO Title<input defaultValue={p.seo_title} onBlur={(e) => up({ seo_title: e.target.value })} className="input-premium mt-1" /></label>
        <label className="text-xs text-navy/60 md:col-span-2">SEO Description<textarea defaultValue={p.seo_description} onBlur={(e) => up({ seo_description: e.target.value })} className="input-premium mt-1 min-h-[60px]" /></label>
      </div>
    </div>
  );
}
