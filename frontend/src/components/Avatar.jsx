import { ASSET_BASE } from "../api/axios.js";

const PALETTES = [
  ["#1B4332", "#2D6A4F"],
  ["#C1502E", "#DA6B47"],
  ["#4A90A4", "#6FAEC0"],
  ["#E8A33D", "#F2C572"],
];

function hashName(name = "") {
  let h = 0;

  for (let i = 0; i < name.length; i++) {
    h =
      name.charCodeAt(i) +
      ((h << 5) - h);
  }

  return Math.abs(h);
}

function initials(name = "") {
  const parts = name
    .trim()
    .split(" ")
    .filter(Boolean);

  if (parts.length === 0) {
    return "IF";
  }

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

export default function Avatar({
  name = "",
  image,
  size = "md",
  rounded = "rounded-2xl",
}) {
  const sizes = {
    sm: "h-12 w-12 text-sm",
    md: "h-16 w-16 text-lg",
    lg: "h-24 w-24 text-2xl",
    full: "h-full w-full text-4xl",
  };

  // =====================================================
  // IMAGE
  // =====================================================

  if (image) {
    const src =
      image.startsWith("http://") ||
      image.startsWith("https://")
        ? image
        : `${ASSET_BASE}${image.startsWith("/") ? "" : "/"}${image}`;

    return (
      <img
        src={src}
        alt={name || "Profile"}
        className={`${sizes[size]} ${rounded} object-cover`}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    );
  }

  // =====================================================
  // FALLBACK AVATAR
  // =====================================================

  const [from, to] =
    PALETTES[
      hashName(name) % PALETTES.length
    ];

  return (
    <div
      className={`grid ${sizes[size]} ${rounded} place-items-center font-display font-semibold text-ivory`}
      style={{
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {initials(name)}
    </div>
  );
}
