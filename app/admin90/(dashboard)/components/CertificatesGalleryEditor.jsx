"use client";

import { useState } from "react";

import FieldInput from "./FieldInput";

const emptyItem = {
  image: "",
  alt: ""
};

const buildLabel = (index, label) => `Certificate #${index + 1} ${label}`;

export default function CertificatesGalleryEditor({ initialItems }) {
  const [items, setItems] = useState(
    Array.isArray(initialItems) && initialItems.length
      ? initialItems
      : [emptyItem]
  );

  const handleAdd = () => {
    setItems((prev) => [...prev, emptyItem]);
  };

  const handleRemove = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
        Certificates
      </p>
      <div className="mt-4 space-y-4">
        {items.map((item, index) => (
          <div
            key={`certificate-${index}`}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/40 p-4 lg:flex-row lg:items-end"
          >
            <div className="flex-1">
              <FieldInput
                name={`field.items.${index}.image`}
                label={buildLabel(index, "Image")}
                defaultValue={item?.image ?? ""}
              />
            </div>
            <div className="flex-1">
              <FieldInput
                name={`field.items.${index}.alt`}
                label={buildLabel(index, "Alt")}
                defaultValue={item?.alt ?? ""}
              />
            </div>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              aria-label={`Remove certificate ${index + 1}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input type="hidden" name="certificateItemsLength" value={items.length} />
      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-slate-300"
        >
          Add new
        </button>
      </div>
    </div>
  );
}
