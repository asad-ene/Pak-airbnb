"use client";

import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { HostShell } from "@/components/host/HostShell";
import { useHostAuth } from "@/hooks/useHostAuth";
import {
  type HostListing,
  addListing,
  deleteListing,
  getListingsForHost,
  toggleListingStatus,
  updateListing,
} from "@/lib/hostListings";

type FormState = {
  title: string;
  location: string;
  price: string;
  image: string;
  publishImmediately: boolean;
};

const EMPTY_FORM: FormState = {
  title: "",
  location: "",
  price: "",
  image: "",
  publishImmediately: false,
};

export default function HostDashboardPage() {
  const router = useRouter();
  const { host, ready, logout } = useHostAuth();

  const [listings, setListings] = useState<HostListing[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  // Redirect out if not logged in, once we've checked localStorage.
  useEffect(() => {
    if (ready && !host) router.replace("/host/login");
  }, [ready, host, router]);

  // Load this host's listings once we know who they are.
  useEffect(() => {
    if (host) setListings(getListingsForHost(host.id));
  }, [host]);

  function openAddForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setShowForm(true);
  }

  function openEditForm(listing: HostListing) {
    setEditingId(listing.id);
    setForm({
      title: listing.title,
      location: listing.location,
      price: String(listing.price),
      image: listing.image,
      publishImmediately: listing.status === "published",
    });
    setFormError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!host) return;

    const price = Number(form.price);
    if (!form.title.trim()) return setFormError("Give your place a title.");
    if (!form.location.trim()) return setFormError("Add a location.");
    if (!price || price <= 0) return setFormError("Enter a price greater than 0.");

    if (editingId) {
      updateListing(editingId, {
        title: form.title.trim(),
        location: form.location.trim(),
        price,
        image: form.image.trim(),
        status: form.publishImmediately ? "published" : "draft",
      });
    } else {
      addListing(host.id, {
        title: form.title.trim(),
        location: form.location.trim(),
        price,
        image: form.image.trim(),
        publishImmediately: form.publishImmediately,
      });
    }

    setListings(getListingsForHost(host.id));
    closeForm();
  }

  function handleDelete(id: string) {
    if (!host) return;
    deleteListing(id);
    setListings(getListingsForHost(host.id));
  }

  function handleToggleStatus(id: string) {
    if (!host) return;
    toggleListingStatus(id);
    setListings(getListingsForHost(host.id));
  }

  if (!ready || !host) {
    return (
      <HostShell>
        <p className="text-sm text-[#717171]">Loading…</p>
      </HostShell>
    );
  }

  return (
    <HostShell hostName={host.name} onLogout={logout}>
      <Reveal>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold text-[#222] sm:text-3xl">
              Welcome back, {host.name.split(" ")[0]}
            </h1>
            <p className="mt-1 text-sm text-[#717171]">
              Manage the places you've listed.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={openAddForm}
              className="flex items-center gap-1.5 rounded-full bg-[#10b981] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0ea371]"
            >
              <Plus className="h-4 w-4" />
              Add listing
            </button>
          )}
        </div>
      </Reveal>

      {showForm && (
        <Reveal>
          <div className="mt-6 rounded-3xl border border-[#eeeeee] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold text-[#222]">
                {editingId ? "Edit listing" : "Add a listing"}
              </h2>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#717171] transition hover:bg-[#f5f5f5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#222]">Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Cottage in Naran"
                    className="w-full rounded-xl border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#222] outline-none transition focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#222]">Location</label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="Naran, KPK"
                    className="w-full rounded-xl border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#222] outline-none transition focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#222]">
                    Price per night (PKR)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    placeholder="4500"
                    className="w-full rounded-xl border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#222] outline-none transition focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#222]">
                    Photo URL <span className="text-[#717171]">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    placeholder="https://…"
                    className="w-full rounded-xl border border-[#dddddd] px-3.5 py-2.5 text-sm text-[#222] outline-none transition focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-[#222]">
                <input
                  type="checkbox"
                  checked={form.publishImmediately}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, publishImmediately: e.target.checked }))
                  }
                  className="h-4 w-4 rounded border-[#dddddd] text-[#10b981] focus:ring-[#10b981]/30"
                />
                Publish immediately (otherwise saved as a draft)
              </label>

              {formError && (
                <p role="alert" className="text-sm text-red-600">
                  {formError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-[#10b981] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0ea371]"
                >
                  {editingId ? "Save changes" : "Add listing"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-full border border-[#dddddd] px-5 py-2.5 text-sm font-medium text-[#222] transition hover:border-[#222]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Reveal>
      )}

      <div className="mt-8">
        {listings.length === 0 ? (
          <Reveal>
            <div className="rounded-3xl border border-dashed border-[#dddddd] bg-white px-6 py-16 text-center">
              <p className="font-[family-name:var(--font-plus-jakarta)] text-lg font-semibold text-[#222]">
                You haven't listed a place yet
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-sm text-[#717171]">
                Add your first listing to start showing up to guests looking to
                book a stay.
              </p>
              <button
                type="button"
                onClick={openAddForm}
                className="mt-5 rounded-full bg-[#10b981] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0ea371]"
              >
                Add your first listing
              </button>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing, index) => (
              <Reveal key={listing.id} delay={index * 60}>
                <div className="overflow-hidden rounded-2xl border border-[#eeeeee] bg-white shadow-sm">
                  <div className="relative aspect-[4/3] bg-[#eeeeee]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e9e9e9] to-[#dcdcdc]" />
                    {listing.image && (
                      // Plain <img>, not next/image — hosts can paste any URL and
                      // we don't want to require every domain to be allow-listed
                      // in next.config just to preview a draft listing.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                        listing.status === "published"
                          ? "bg-[#10b981] text-white"
                          : "bg-white/95 text-[#717171]"
                      }`}
                    >
                      {listing.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="truncate text-[15px] font-medium text-[#222]">
                      {listing.title}
                    </p>
                    <p className="truncate text-sm text-[#717171]">{listing.location}</p>
                    <p className="mt-1 text-sm font-medium text-[#222]">
                      Rs {listing.price.toLocaleString("en-PK")}{" "}
                      <span className="font-normal text-[#717171]">/ night</span>
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(listing)}
                        aria-label="Edit listing"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dddddd] text-[#222] transition hover:border-[#222]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(listing.id)}
                        aria-label="Delete listing"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dddddd] text-[#222] transition hover:border-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(listing.id)}
                        className="ml-auto rounded-full border border-[#dddddd] px-3 py-1.5 text-xs font-medium text-[#222] transition hover:border-[#222]"
                      >
                        {listing.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </HostShell>
  );
}
