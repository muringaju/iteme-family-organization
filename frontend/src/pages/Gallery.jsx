// =====================================================
// ITEME OF HOPE FAMILY ORGANIZATION
// PUBLIC GALLERY PAGE
// =====================================================

import { useEffect, useState } from "react";
import {
  Image as ImageIcon,
  Loader2,
  CalendarDays,
  X,
} from "lucide-react";

import api, { ASSET_BASE } from "../api/axios.js";

// =====================================================
// GALLERY PAGE
// =====================================================

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Selected image for large preview
  const [selectedItem, setSelectedItem] = useState(null);

  // =====================================================
  // IMAGE URL
  // =====================================================

  function getImageUrl(image) {
    if (!image) return "";

    // Cloudinary / external image
    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    // Local backend image
    const cleanImage = image.startsWith("/")
      ? image
      : `/${image}`;

    return `${ASSET_BASE}${cleanImage}`;
  }

  // =====================================================
  // LOAD PUBLIC GALLERY
  // =====================================================

  useEffect(() => {
    let mounted = true;

    async function loadGallery() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/gallery/visible"
        );

        if (!mounted) return;

        /*
          Backend returns:

          {
            success: true,
            data: [...]
          }
        */

        let records = [];

        if (Array.isArray(response.data)) {
          records = response.data;
        } else if (
          Array.isArray(response.data?.data)
        ) {
          records = response.data.data;
        } else if (
          Array.isArray(response.data?.gallery)
        ) {
          records = response.data.gallery;
        }

        setGallery(records);
      } catch (err) {
        console.error(
          "PUBLIC GALLERY ERROR:",
          err.response?.data || err
        );

        if (!mounted) return;

        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to load our gallery. Please try again."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadGallery();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  function formatDate(date) {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="min-h-screen bg-[#f8fafc]">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-[#07182B] py-20 sm:py-24">

        {/* Decorative circles */}

        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#F4C542]/10" />

        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[#F4A340]/10" />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#F4C542] backdrop-blur-sm">
            <ImageIcon size={32} />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-[#F4C542]">
            ITEME of HOPE FAMILY ORGANIZATION
          </p>

          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Moments of Hope
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
            Discover the people, activities, events and
            moments that make our mission possible.
            Every picture represents a story of hope,
            compassion and positive change.
          </p>

        </div>
      </section>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section className="py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* SECTION TITLE */}

          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#F4A340]">
                Our Activities
              </p>

              <h2 className="mt-2 font-display text-3xl font-bold text-[#07182B] sm:text-4xl">
                Gallery
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                See some of the activities and moments
                from ITEME of HOPE FAMILY ORGANIZATION.
              </p>
            </div>

            {!loading && !error && gallery.length > 0 && (
              <div className="rounded-full bg-[#07182B]/5 px-4 py-2 text-sm font-medium text-[#07182B]">
                {gallery.length}{" "}
                {gallery.length === 1
                  ? "photo"
                  : "photos"}
              </div>
            )}

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">

              <div className="flex flex-col items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#07182B]/5">
                  <Loader2
                    size={27}
                    className="animate-spin text-[#07182B]"
                  />
                </div>

                <p className="text-sm text-gray-500">
                  Loading gallery...
                </p>

              </div>

            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && (
            <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500">
                <ImageIcon size={25} />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-red-700">
                Gallery unavailable
              </h3>

              <p className="mt-2 text-sm leading-6 text-red-600/80">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-5 rounded-xl bg-[#07182B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0d2945]"
              >
                Try Again
              </button>

            </div>
          )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading &&
            !error &&
            gallery.length === 0 && (
              <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-[#07182B]/5 text-[#07182B]/40">
                  <ImageIcon size={38} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-[#07182B]">
                  No photos available yet
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  We are preparing photos from our
                  activities. Please check back soon.
                </p>

              </div>
            )}

          {/* =================================================
              GALLERY GRID
          ================================================= */}

          {!loading &&
            !error &&
            gallery.length > 0 && (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

                {gallery.map((item) => {
                  const imageUrl =
                    getImageUrl(item.image);

                  const itemId =
                    item._id ||
                    item.id ||
                    item.title;

                  return (
                    <article
                      key={itemId}
                      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >

                      {/* IMAGE */}

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedItem(item)
                        }
                        className="relative block aspect-[4/3] w-full overflow-hidden bg-gray-100 text-left"
                        aria-label={`View ${
                          item.title ||
                          "gallery image"
                        }`}
                      >

                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={
                              item.title ||
                              "ITEME of HOPE activity"
                            }
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display =
                                "none";

                              const parent =
                                e.currentTarget
                                  .parentElement;

                              if (parent) {
                                parent.classList.add(
                                  "flex",
                                  "items-center",
                                  "justify-center"
                                );
                              }
                            }}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-300">
                            <ImageIcon size={50} />
                          </div>
                        )}

                        {/* DARK HOVER OVERLAY */}

                        <div className="absolute inset-0 flex items-center justify-center bg-[#07182B]/0 transition duration-300 group-hover:bg-[#07182B]/45">

                          <span className="translate-y-3 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#07182B] opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            View Photo
                          </span>

                        </div>

                        {/* CATEGORY */}

                        {item.category && (
                          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-[#07182B] shadow-md backdrop-blur-sm">
                            {item.category}
                          </span>
                        )}

                      </button>

                      {/* CONTENT */}

                      <div className="p-5">

                        <h3 className="line-clamp-2 text-lg font-bold text-[#07182B]">
                          {item.title ||
                            "Untitled Gallery"}
                        </h3>

                        {item.description && (
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">
                            {item.description}
                          </p>
                        )}

                        {item.date && (
                          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-400">

                            <CalendarDays size={14} />

                            <span>
                              {formatDate(
                                item.date
                              )}
                            </span>

                          </div>
                        )}

                      </div>

                    </article>
                  );
                })}

              </div>
            )}

        </div>
      </section>

      {/* =================================================
          CALL TO ACTION
      ================================================= */}

      <section className="border-t border-gray-200 bg-white py-16">

        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">

          <h2 className="font-display text-3xl font-bold text-[#07182B] sm:text-4xl">
            Be Part of the Story
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Every act of kindness creates another moment
            of hope. Join ITEME of HOPE FAMILY
            ORGANIZATION and help us make a difference
            in the lives of vulnerable children and
            families.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href="/donate"
              className="inline-flex items-center justify-center rounded-xl bg-[#F4A340] px-6 py-3 text-sm font-bold text-[#07182B] shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Support Our Mission
            </a>

            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-[#07182B]/15 bg-white px-6 py-3 text-sm font-bold text-[#07182B] transition hover:bg-[#07182B]/5"
            >
              Contact Us
            </a>

          </div>

        </div>
      </section>

      {/* =================================================
          IMAGE LIGHTBOX
      ================================================= */}

      {selectedItem && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#07182B]/90 p-4 backdrop-blur-sm"
          onClick={() =>
            setSelectedItem(null)
          }
        >

          {/* CLOSE */}

          <button
            type="button"
            onClick={() =>
              setSelectedItem(null)
            }
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close image"
          >
            <X size={24} />
          </button>

          {/* IMAGE CONTAINER */}

          <div
            className="max-h-[92vh] w-full max-w-5xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="overflow-hidden rounded-2xl bg-black shadow-2xl">

              {selectedItem.image ? (
                <img
                  src={getImageUrl(
                    selectedItem.image
                  )}
                  alt={
                    selectedItem.title ||
                    "Gallery image"
                  }
                  className="max-h-[75vh] w-full object-contain"
                />
              ) : (
                <div className="flex h-96 items-center justify-center text-white/40">
                  <ImageIcon size={60} />
                </div>
              )}

            </div>

            {/* LIGHTBOX INFORMATION */}

            <div className="mt-4 rounded-2xl bg-white p-5">

              <div className="flex flex-wrap items-start justify-between gap-3">

                <div>

                  <h3 className="text-xl font-bold text-[#07182B]">
                    {selectedItem.title ||
                      "Gallery"}
                  </h3>

                  {selectedItem.description && (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                      {
                        selectedItem.description
                      }
                    </p>
                  )}

                </div>

                {selectedItem.category && (
                  <span className="rounded-full bg-[#07182B]/5 px-3 py-1.5 text-xs font-bold text-[#07182B]">
                    {selectedItem.category}
                  </span>
                )}

              </div>

              {selectedItem.date && (
                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                  <CalendarDays size={14} />
                  {formatDate(
                    selectedItem.date
                  )}
                </div>
              )}

            </div>

          </div>

        </div>
      )}

    </main>
  );
}