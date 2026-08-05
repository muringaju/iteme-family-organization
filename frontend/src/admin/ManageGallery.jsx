import ResourceManager from "./ResourceManager.jsx";
import { ASSET_BASE } from "../api/axios.js";

// =====================================================
// GALLERY FIELDS
// =====================================================

const fields = [
  {
    name: "title",
    label: "Gallery Title",
    required: true,
    placeholder: "e.g. Charity Week 2026",
  },

  {
    name: "description",
    label: "Description",
    type: "textarea",
    rows: 5,
    placeholder:
      "Describe what is happening in this photo...",
  },

  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      "Charity",
      "Education",
      "Students",
      "Community",
      "Events",
      "Volunteers",
      "Training",
      "Other",
    ],
    required: true,
    defaultValue: "Other",
  },

  {
    name: "date",
    label: "Date",
    type: "date",
  },

  {
    name: "visible",
    label: "Visible on Website",
    type: "select",
    options: ["true", "false"],
    defaultValue: "true",
  },
];

// =====================================================
// IMAGE URL HELPER
// =====================================================

function getGalleryImageUrl(image) {
  if (!image) {
    return "";
  }

  // Already a complete URL
  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  // Make sure path starts with /
  const imagePath = image.startsWith("/")
    ? image
    : `/${image}`;

  return `${ASSET_BASE}${imagePath}`;
}

// =====================================================
// MANAGE GALLERY
// =====================================================

export default function ManageGallery() {
  return (
    <ResourceManager
      title="Gallery Management"
      endpoint="/gallery"
      fields={fields}
      withImage={true}
      nameField="title"
      columns={[
        // =================================================
        // IMAGE
        // =================================================

        {
          name: "image",
          label: "Photo",

          render: (item) => {
            const imageUrl =
              getGalleryImageUrl(
                item?.image
              );

            if (!imageUrl) {
              return (
                <div className="flex h-14 w-20 items-center justify-center rounded-xl border border-forest/10 bg-forest/5 text-xs text-ink/40">
                  No Image
                </div>
              );
            }

            return (
              <div className="h-14 w-20 overflow-hidden rounded-xl border border-forest/10 bg-forest/5">
                <img
                  src={imageUrl}
                  alt={
                    item?.title ||
                    "Gallery image"
                  }
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";

                    const parent =
                      event.currentTarget
                        .parentElement;

                    if (parent) {
                      parent.innerHTML =
                        '<div class="flex h-full w-full items-center justify-center text-xs text-ink/40">Image unavailable</div>';
                    }
                  }}
                />
              </div>
            );
          },
        },

        // =================================================
        // CATEGORY
        // =================================================

        {
          name: "category",
          label: "Category",

          render: (item) => {
            const category =
              item?.category ||
              "Other";

            return (
              <span className="inline-flex rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
                {category}
              </span>
            );
          },
        },

        // =================================================
        // DATE
        // =================================================

        {
          name: "date",
          label: "Date",

          render: (item) => {
            if (!item?.date) {
              return "—";
            }

            const date =
              new Date(item.date);

            if (
              Number.isNaN(
                date.getTime()
              )
            ) {
              return "—";
            }

            return date.toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }
            );
          },
        },

        // =================================================
        // VISIBILITY
        // =================================================

        {
          name: "visible",
          label: "Status",

          render: (item) => {
            const isVisible =
              item?.visible === true ||
              item?.visible === "true";

            return (
              <span
                className={
                  isVisible
                    ? "inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                    : "inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500"
                }
              >
                {isVisible
                  ? "Visible"
                  : "Hidden"}
              </span>
            );
          },
        },
      ]}
    />
  );
}

