import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  Loader2,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import api, { ASSET_BASE } from "../api/axios.js";

export default function ResourceManager({
  title = "Records",
  endpoint,
  fields = [],
  withImage = false,
  nameField = "name",
  columns = [],
}) {
  // =====================================================
  // STATE
  // =====================================================

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Notification
  const [successMessage, setSuccessMessage] = useState("");

  // =====================================================
  // GET ID
  // =====================================================

  function getItemId(item) {
    return item?._id || item?.id || "";
  }

  // =====================================================
  // IMAGE URL
  // =====================================================

  function getImageUrl(image) {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("blob:")
    ) {
      return image;
    }

    const cleanImage = image.startsWith("/")
      ? image
      : `/${image}`;

    return `${ASSET_BASE}${cleanImage}`;
  }

  // =====================================================
  // LOAD RECORDS
  // =====================================================

  async function load(showLoader = true) {
    if (!endpoint) {
      setError("No API endpoint was provided.");
      setLoading(false);
      return;
    }

    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const response = await api.get(endpoint);

      let records = [];

      if (Array.isArray(response.data)) {
        records = response.data;
      } else if (Array.isArray(response.data?.data)) {
        records = response.data.data;
      } else if (Array.isArray(response.data?.records)) {
        records = response.data.records;
      } else if (Array.isArray(response.data?.items)) {
        records = response.data.items;
      }

      setItems(records);
      setCurrentPage(1);
    } catch (err) {
      console.error(
        "LOAD ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Could not load records."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  // =====================================================
  // SUCCESS MESSAGE
  // =====================================================

  function showSuccess(message) {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3500);
  }

  // =====================================================
  // OPEN CREATE
  // =====================================================

  function openCreate() {
    const emptyForm = {};

    fields.forEach((field) => {
      emptyForm[field.name] =
        field.defaultValue ?? "";
    });

    setForm(emptyForm);
    setEditing(null);
    setFile(null);
    setPreviewUrl("");
    setError("");
    setModalOpen(true);
  }

  // =====================================================
  // OPEN EDIT
  // =====================================================

  function openEdit(item) {
    const editForm = {};

    fields.forEach((field) => {
      editForm[field.name] =
        item?.[field.name] ?? "";
    });

    setForm(editForm);
    setEditing(item);
    setFile(null);
    setError("");

    if (item?.image) {
      setPreviewUrl(
        getImageUrl(item.image)
      );
    } else {
      setPreviewUrl("");
    }

    setModalOpen(true);
  }

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  function closeModal() {
    if (saving) return;

    if (
      previewUrl &&
      previewUrl.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewUrl);
    }

    setModalOpen(false);
    setEditing(null);
    setForm({});
    setFile(null);
    setPreviewUrl("");
    setError("");
  }

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  function handleChange(e, field) {
    const { value } = e.target;

    setForm((previous) => ({
      ...previous,
      [field.name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  // =====================================================
  // IMAGE CHANGE
  // =====================================================

  function handleFileChange(e) {
    const selectedFile =
      e.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError(
        "Please select a PNG, JPG, JPEG or WEBP image."
      );

      e.target.value = "";
      return;
    }

    if (
      selectedFile.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image must be less than 5MB."
      );

      e.target.value = "";
      return;
    }

    if (
      previewUrl &&
      previewUrl.startsWith("blob:")
    ) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl =
      URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setPreviewUrl(objectUrl);
    setError("");
  }

  // =====================================================
  // VALIDATE
  // =====================================================

  function validateForm() {
    for (const field of fields) {
      if (!field.required) continue;

      const value = form[field.name];

      if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
      ) {
        return `${field.label} is required.`;
      }
    }

    if (
      withImage &&
      !editing &&
      !file
    ) {
      return "Please select an image.";
    }

    return "";
  }

  // =====================================================
  // NORMALIZE VALUE
  // =====================================================

  function normalizeValue(field) {
    let value = form[field.name];

    if (
      field.type === "number" &&
      value !== "" &&
      value !== null &&
      value !== undefined
    ) {
      value = Number(value);
    }

    return value ?? "";
  }

  // =====================================================
  // JSON PAYLOAD
  // =====================================================

  function buildJsonPayload() {
    const payload = {};

    fields.forEach((field) => {
      payload[field.name] =
        normalizeValue(field);
    });

    return payload;
  }

  // =====================================================
  // FORM DATA
  // =====================================================

  function buildFormData() {
    const formData = new FormData();

    fields.forEach((field) => {
      const value =
        normalizeValue(field);

      formData.append(
        field.name,
        String(value)
      );
    });

    if (file instanceof File) {
      formData.append(
        "image",
        file
      );
    }

    return formData;
  }

  // =====================================================
  // ERROR MESSAGE
  // =====================================================

  function getErrorMessage(err) {
    const backendError =
      err.response?.data;

    if (
      backendError?.errors &&
      typeof backendError.errors ===
        "object"
    ) {
      const messages =
        Object.values(
          backendError.errors
        )
          .map(
            (item) =>
              item?.message
          )
          .filter(Boolean);

      if (messages.length) {
        return messages.join(" ");
      }
    }

    return (
      backendError?.message ||
      backendError?.error ||
      err.message ||
      "Could not save record."
    );
  }

  // =====================================================
  // SUBMIT
  // =====================================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (saving) return;

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const isEditing =
        Boolean(editing);

      const itemId =
        getItemId(editing);

      if (
        isEditing &&
        !itemId
      ) {
        throw new Error(
          "Cannot update record: missing record ID."
        );
      }

      let response;

      // =================================================
      // WITH IMAGE
      // =================================================

      if (withImage) {
        const payload =
          buildFormData();

        if (isEditing) {
          response = await api.put(
            `${endpoint}/${itemId}`,
            payload
          );

          const updatedItem =
            response.data?.data ||
            response.data;

          setItems((previous) =>
            previous.map(
              (item) =>
                getItemId(item) ===
                itemId
                  ? updatedItem
                  : item
            )
          );

          showSuccess(
            "Record updated successfully."
          );
        } else {
          response =
            await api.post(
              endpoint,
              payload
            );

          const newItem =
            response.data?.data ||
            response.data;

          setItems((previous) => [
            newItem,
            ...previous,
          ]);

          showSuccess(
            "Record created successfully."
          );
        }
      }

      // =================================================
      // WITHOUT IMAGE
      // =================================================

      else {
        const payload =
          buildJsonPayload();

        if (isEditing) {
          response = await api.put(
            `${endpoint}/${itemId}`,
            payload
          );

          const updatedItem =
            response.data?.data ||
            response.data;

          setItems((previous) =>
            previous.map(
              (item) =>
                getItemId(item) ===
                itemId
                  ? updatedItem
                  : item
            )
          );

          showSuccess(
            "Record updated successfully."
          );
        } else {
          response =
            await api.post(
              endpoint,
              payload
            );

          const newItem =
            response.data?.data ||
            response.data;

          setItems((previous) => [
            newItem,
            ...previous,
          ]);

          showSuccess(
            "Record created successfully."
          );
        }
      }

      closeModal();
    } catch (err) {
      console.error(
        "SAVE ERROR:",
        err.response?.data || err
      );

      setError(
        getErrorMessage(err)
      );
    } finally {
      setSaving(false);
    }
  }

  // =====================================================
  // DELETE
  // =====================================================

  async function handleDelete(item) {
    const itemId =
      getItemId(item);

    if (!itemId) {
      alert(
        "This record does not have a valid ID."
      );
      return;
    }

    const displayName =
      item?.[nameField] ||
      item?.title ||
      "this record";

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${displayName}"?\n\nThis action cannot be undone.`
      );

    if (!confirmed) return;

    try {
      await api.delete(
        `${endpoint}/${itemId}`
      );

      setItems((previous) =>
        previous.filter(
          (record) =>
            getItemId(record) !==
            itemId
        )
      );

      showSuccess(
        "Record deleted successfully."
      );
    } catch (err) {
      console.error(
        "DELETE ERROR:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Could not delete record."
      );
    }
  }

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredItems = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) => {
      return Object.values(item).some(
        (value) => {
          if (
            value === null ||
            value === undefined
          ) {
            return false;
          }

          if (
            typeof value ===
            "object"
          ) {
            return JSON.stringify(
              value
            )
              .toLowerCase()
              .includes(query);
          }

          return String(value)
            .toLowerCase()
            .includes(query);
        }
      );
    });
  }, [items, search]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredItems.length /
        itemsPerPage
    )
  );

  const paginatedItems =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        itemsPerPage;

      return filteredItems.slice(
        start,
        start + itemsPerPage
      );
    }, [
      filteredItems,
      currentPage,
      itemsPerPage,
    ]);

  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // =====================================================
  // PAGE NUMBERS
  // =====================================================

  function getPageNumbers() {
    const pages = [];

    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    let start = Math.max(
      1,
      currentPage - 2
    );

    let end = Math.min(
      totalPages,
      start + maxVisible - 1
    );

    if (
      end - start <
      maxVisible - 1
    ) {
      start =
        end - maxVisible + 1;
    }

    for (
      let i = start;
      i <= end;
      i++
    ) {
      pages.push(i);
    }

    return pages;
  }

  // =====================================================
  // CLEANUP
  // =====================================================

  useEffect(() => {
    return () => {
      if (
        previewUrl &&
        previewUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          previewUrl
        );
      }
    };
  }, [previewUrl]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-5">

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {successMessage && (
        <div className="fixed right-5 top-5 z-[200] flex max-w-sm items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3 shadow-xl">
          <CheckCircle2
            size={20}
            className="shrink-0 text-emerald-600"
          />

          <p className="text-sm font-medium text-emerald-800">
            {successMessage}
          </p>
        </div>
      )}

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-dark">
            {title}
          </h1>

          <p className="mt-1 text-sm text-ink/60">
            {items.length} total record
            {items.length === 1
              ? ""
              : "s"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          <button
            type="button"
            onClick={() => load()}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-forest/15 bg-white px-4 py-2.5 text-sm font-medium text-forest-dark transition hover:bg-forest/5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="btn-primary !py-2.5 text-sm"
          >
            <Plus size={16} />
            Add New
          </button>

        </div>
      </div>

      {/* =================================================
          SEARCH BAR
      ================================================= */}

      <div className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <div className="relative w-full sm:max-w-md">

          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder={`Search ${title.toLowerCase()}...`}
            className="input-field w-full pl-10"
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink/40 hover:bg-forest/10 hover:text-ink"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}

        </div>

        <div className="flex items-center gap-2 text-sm text-ink/60">

          <span>Show</span>

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(
                Number(e.target.value)
              );
              setCurrentPage(1);
            }}
            className="rounded-lg border border-forest/15 bg-white px-2 py-1.5 text-sm outline-none focus:border-forest"
          >
            <option value={5}>
              5
            </option>

            <option value={10}>
              10
            </option>

            <option value={20}>
              20
            </option>

            <option value={50}>
              50
            </option>
          </select>

          <span>per page</span>

        </div>
      </div>

      {/* =================================================
          SEARCH RESULT INFO
      ================================================= */}

      {search && (
        <div className="flex items-center gap-2 text-sm text-ink/60">
          <Search size={15} />

          Showing{" "}
          <span className="font-semibold text-forest-dark">
            {filteredItems.length}
          </span>{" "}
          matching record
          {filteredItems.length ===
          1
            ? ""
            : "s"}
          .
        </div>
      )}

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-forest/10 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[760px] text-left text-sm">

            <thead className="bg-forest/5 text-xs uppercase tracking-wide text-forest-dark/70">

              <tr>

                <th className="px-4 py-3">
                  {nameField
                    ? "Name"
                    : "ID"}
                </th>

                {columns.map(
                  (column) => (
                    <th
                      key={
                        column.name
                      }
                      className="px-4 py-3"
                    >
                      {
                        column.label
                      }
                    </th>
                  )
                )}

                <th className="px-4 py-3 text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-forest/5">

              {/* LOADING */}

              {loading && (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      2
                    }
                    className="px-4 py-12 text-center text-ink/50"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2
                        size={20}
                        className="animate-spin text-forest"
                      />

                      <span>
                        Loading records...
                      </span>
                    </div>
                  </td>
                </tr>
              )}

              {/* ERROR */}

              {!loading &&
                error &&
                items.length === 0 && (
                  <tr>
                    <td
                      colSpan={
                        columns.length +
                        2
                      }
                      className="px-4 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">

                        <AlertCircle
                          size={30}
                          className="text-rust"
                        />

                        <p className="mt-3 text-sm font-medium text-rust">
                          {error}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            load()
                          }
                          className="mt-4 rounded-lg bg-forest px-4 py-2 text-sm text-white transition hover:bg-forest-dark"
                        >
                          Try Again
                        </button>

                      </div>
                    </td>
                  </tr>
                )}

              {/* EMPTY */}

              {!loading &&
                !error &&
                filteredItems.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={
                        columns.length +
                        2
                      }
                      className="px-4 py-12 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-forest/10 text-forest/50">
                          {search ? (
                            <Search
                              size={25}
                            />
                          ) : (
                            <ImageIcon
                              size={25}
                            />
                          )}
                        </div>

                        <p className="mt-3 font-medium text-forest-dark">
                          {search
                            ? "No matching records"
                            : "No records yet"}
                        </p>

                        <p className="mt-1 text-sm text-ink/50">
                          {search
                            ? "Try using a different search term."
                            : 'Click "Add New" to create your first record.'}
                        </p>

                      </div>

                    </td>
                  </tr>
                )}

              {/* RECORDS */}

              {!loading &&
                paginatedItems.map(
                  (item) => {
                    const itemId =
                      getItemId(item);

                    return (
                      <tr
                        key={itemId}
                        className="transition hover:bg-forest/[0.03]"
                      >

                        <td className="max-w-[240px] truncate px-4 py-3 font-medium text-forest-dark">

                          {nameField
                            ? item[
                                nameField
                              ] ||
                              item.title ||
                              "—"
                            : itemId}

                        </td>

                        {columns.map(
                          (column) => (
                            <td
                              key={
                                column.name
                              }
                              className="max-w-[280px] px-4 py-3 text-ink/70"
                            >
                              {column.render
                                ? column.render(
                                    item
                                  )
                                : String(
                                    item[
                                      column
                                        .name
                                    ] ??
                                      "—"
                                  )}
                            </td>
                          )
                        )}

                        <td className="px-4 py-3">

                          <div className="flex justify-end gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                openEdit(
                                  item
                                )
                              }
                              className="rounded-lg p-2 text-forest transition hover:bg-forest/10"
                              aria-label="Edit"
                              title="Edit"
                            >
                              <Pencil
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  item
                                )
                              }
                              className="rounded-lg p-2 text-rust transition hover:bg-rust/10"
                              aria-label="Delete"
                              title="Delete"
                            >
                              <Trash2
                                size={16}
                              />
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

            </tbody>

          </table>

        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading &&
          filteredItems.length >
            0 && (
            <div className="flex flex-col gap-3 border-t border-forest/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-ink/50">

                Showing{" "}

                <span className="font-medium text-ink/70">
                  {Math.min(
                    (currentPage - 1) *
                      itemsPerPage +
                      1,
                    filteredItems.length
                  )}
                </span>

                {" – "}

                <span className="font-medium text-ink/70">
                  {Math.min(
                    currentPage *
                      itemsPerPage,
                    filteredItems.length
                  )}
                </span>

                {" of "}

                <span className="font-medium text-ink/70">
                  {
                    filteredItems.length
                  }
                </span>

              </p>

              <div className="flex items-center gap-1">

                <button
                  type="button"
                  disabled={
                    currentPage ===
                    1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }
                  className="rounded-lg border border-forest/10 p-2 text-forest transition hover:bg-forest/5 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft
                    size={16}
                  />
                </button>

                {getPageNumbers().map(
                  (page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                      className={`min-w-9 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                        currentPage ===
                        page
                          ? "bg-forest text-white"
                          : "text-forest hover:bg-forest/5"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  type="button"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          totalPages,
                          page + 1
                        )
                    )
                  }
                  className="rounded-lg border border-forest/10 p-2 text-forest transition hover:bg-forest/5 disabled:cursor-not-allowed disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight
                    size={16}
                  />
                </button>

              </div>

            </div>
          )}

      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">

          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">

            {/* HEADER */}

            <div className="flex items-start justify-between">

              <div>

                <h2 className="font-display text-xl font-semibold text-forest-dark">
                  {editing
                    ? "Edit Record"
                    : "Add New Record"}
                </h2>

                <p className="mt-1 text-xs text-ink/50">
                  {editing
                    ? "Update the information below."
                    : "Fill in the information below."}
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg p-2 transition hover:bg-forest/10 disabled:opacity-50"
                aria-label="Close"
              >
                <X size={19} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >

              {/* =================================================
                  IMAGE
              ================================================= */}

              {withImage && (
                <div>

                  <label className="label-field">
                    Photo

                    {!editing && (
                      <span className="text-rust">
                        {" "}
                        *
                      </span>
                    )}
                  </label>

                  <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">

                    {/* PREVIEW */}

                    {previewUrl ? (
                      <div className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-forest/10 bg-forest/5">

                        <img
                          src={
                            previewUrl
                          }
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />

                        {file && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                            <span className="text-xs font-medium text-white">
                              New image
                            </span>
                          </div>
                        )}

                      </div>
                    ) : (
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest/40">
                        <ImageIcon
                          size={28}
                        />
                      </div>
                    )}

                    {/* CHOOSE */}

                    <div className="flex-1">

                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-forest/30 px-4 py-3 text-sm text-ink/60 transition hover:border-forest hover:bg-forest/5 sm:justify-start">

                        <ImageIcon
                          size={17}
                        />

                        <span className="max-w-[220px] truncate">
                          {file
                            ? file.name
                            : editing?.image
                            ? "Change image"
                            : "Choose image"}
                        </span>

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/webp"
                          className="hidden"
                          onChange={
                            handleFileChange
                          }
                        />

                      </label>

                      <p className="mt-2 text-xs text-ink/40">
                        PNG, JPG, JPEG or
                        WEBP. Maximum
                        5MB.
                      </p>

                    </div>

                  </div>

                </div>
              )}

              {/* =================================================
                  FIELDS
              ================================================= */}

              {fields.map(
                (field) => (
                  <div
                    key={
                      field.name
                    }
                  >

                    <label className="label-field">

                      {field.label}

                      {field.required && (
                        <span className="text-rust">
                          {" "}
                          *
                        </span>
                      )}

                    </label>

                    {/* TEXTAREA */}

                    {field.type ===
                    "textarea" ? (
                      <textarea
                        rows={
                          field.rows ||
                          4
                        }
                        required={
                          field.required
                        }
                        className="input-field resize-y"
                        placeholder={
                          field.placeholder ||
                          ""
                        }
                        value={
                          form[
                            field.name
                          ] ?? ""
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            field
                          )
                        }
                      />

                    ) : field.type ===
                      "select" ? (

                      /* SELECT */

                      <select
                        required={
                          field.required
                        }
                        className="input-field"
                        value={
                          form[
                            field.name
                          ] ?? ""
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            field
                          )
                        }
                      >

                        <option value="">
                          Select...
                        </option>

                        {(
                          field.options ||
                          []
                        ).map(
                          (
                            option
                          ) => (
                            <option
                              key={
                                option
                              }
                              value={
                                option
                              }
                            >
                              {
                                option
                              }
                            </option>
                          )
                        )}

                      </select>

                    ) : (

                      /* INPUT */

                      <input
                        type={
                          field.type ||
                          "text"
                        }
                        required={
                          field.required
                        }
                        min={
                          field.min
                        }
                        max={
                          field.max
                        }
                        className="input-field"
                        placeholder={
                          field.placeholder ||
                          ""
                        }
                        value={
                          form[
                            field.name
                          ] ?? ""
                        }
                        onChange={(e) =>
                          handleChange(
                            e,
                            field
                          )
                        }
                      />

                    )}

                  </div>
                )
              )}

              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-rust/20 bg-rust/10 px-4 py-3 text-sm leading-6 text-rust">

                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {error}
                  </span>

                </div>
              )}

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="flex flex-col-reverse gap-3 border-t border-forest/10 pt-5 sm:flex-row">

                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={saving}
                  className="btn-secondary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving ? (
                    <span className="flex items-center justify-center gap-2">

                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Saving...

                    </span>
                  ) : editing ? (
                    "Save Changes"
                  ) : (
                    "Create"
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}
