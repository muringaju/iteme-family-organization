import { useEffect, useState } from "react";
import {
  Trash2,
  Mail,
  MailOpen,
  Loader2,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";

import api from "../api/axios.js";

export default function ManageMessages() {
  // =====================================================
  // STATE
  // =====================================================

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMessage, setSelectedMessage] =
    useState(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  // =====================================================
  // GET MESSAGE ID
  // =====================================================

  function getMessageId(message) {
    return message?._id || message?.id || "";
  }

  // =====================================================
  // LOAD MESSAGES
  // =====================================================

  async function load() {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get("/messages");

      console.log(
        "MESSAGES API RESPONSE:",
        response.data
      );

      /*
       * Support different backend response formats:
       *
       * 1. [ ... ]
       *
       * 2. { data: [ ... ] }
       *
       * 3. { messages: [ ... ] }
       *
       * 4. { items: [ ... ] }
       */
      let records = [];

      if (Array.isArray(response.data)) {
        records = response.data;
      } else if (
        Array.isArray(response.data?.data)
      ) {
        records = response.data.data;
      } else if (
        Array.isArray(response.data?.messages)
      ) {
        records = response.data.messages;
      } else if (
        Array.isArray(response.data?.items)
      ) {
        records = response.data.items;
      }

      setMessages(records);
    } catch (err) {
      console.error(
        "LOAD MESSAGES ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Could not load messages."
      );

      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    load();
  }, []);

  // =====================================================
  // MARK READ / UNREAD
  // =====================================================

  async function markRead(message) {
    const messageId =
      getMessageId(message);

    if (!messageId) {
      setError(
        "Cannot update this message because its ID is missing."
      );
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const response =
        await api.put(
          `/messages/${messageId}`,
          {
            read: !message.read,
          }
        );

      /*
       * Backend may return:
       *
       * { data: updatedMessage }
       *
       * or
       *
       * updatedMessage
       */

      const updatedMessage =
        response.data?.data ||
        response.data?.message ||
        response.data;

      setMessages((previous) =>
        previous.map((item) =>
          getMessageId(item) ===
          messageId
            ? updatedMessage
            : item
        )
      );

      /*
       * Keep selected message updated
       * if the user is viewing it.
       */
      if (
        selectedMessage &&
        getMessageId(selectedMessage) ===
          messageId
      ) {
        setSelectedMessage(
          updatedMessage
        );
      }
    } catch (err) {
      console.error(
        "MARK MESSAGE ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Could not update message."
      );
    } finally {
      setActionLoading(false);
    }
  }

  // =====================================================
  // DELETE MESSAGE
  // =====================================================

  async function remove(message) {
    const messageId =
      getMessageId(message);

    if (!messageId) {
      setError(
        "Cannot delete this message because its ID is missing."
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Delete message from ${
          message.name || "this sender"
        }? This cannot be undone.`
      );

    if (!confirmed) return;

    try {
      setActionLoading(true);
      setError("");

      await api.delete(
        `/messages/${messageId}`
      );

      setMessages((previous) =>
        previous.filter(
          (item) =>
            getMessageId(item) !==
            messageId
        )
      );

      if (
        selectedMessage &&
        getMessageId(selectedMessage) ===
          messageId
      ) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error(
        "DELETE MESSAGE ERROR:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Could not delete message."
      );
    } finally {
      setActionLoading(false);
    }
  }

  // =====================================================
  // OPEN MESSAGE
  // =====================================================

  function openMessage(message) {
    setSelectedMessage(message);

    /*
     * Automatically mark unread message
     * as read when opened.
     */
    if (!message.read) {
      markRead(message);
    }
  }

  // =====================================================
  // FORMAT DATE
  // =====================================================

  function formatDate(date) {
    if (!date) return "Unknown date";

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Unknown date";
    }

    return parsedDate.toLocaleDateString(
      undefined,
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  }

  // =====================================================
  // COUNTS
  // =====================================================

  const unreadCount =
    messages.filter(
      (message) => !message.read
    ).length;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div>
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-forest-dark">
            Messages
          </h1>

          <p className="mt-1 text-sm text-ink/60">
            {messages.length} message
            {messages.length === 1
              ? ""
              : "s"}{" "}
            from the contact form
          </p>
        </div>

        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="btn-secondary flex items-center gap-2 !py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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
      </div>

      {/* =================================================
          SUMMARY
      ================================================= */}

      {!loading &&
        messages.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-xl border border-forest/10 bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-ink/50">
                Total
              </p>

              <p className="mt-1 text-lg font-semibold text-forest-dark">
                {messages.length}
              </p>
            </div>

            <div className="rounded-xl border border-gold/30 bg-gold/5 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-ink/50">
                Unread
              </p>

              <p className="mt-1 text-lg font-semibold text-forest-dark">
                {unreadCount}
              </p>
            </div>

            <div className="rounded-xl border border-forest/10 bg-white px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-ink/50">
                Read
              </p>

              <p className="mt-1 text-lg font-semibold text-forest-dark">
                {messages.length -
                  unreadCount}
              </p>
            </div>
          </div>
        )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-rust/20 bg-rust/10 px-4 py-3 text-sm text-rust">
          <AlertCircle
            size={18}
            className="mt-0.5 shrink-0"
          />

          <span>{error}</span>
        </div>
      )}

      {/* =================================================
          MESSAGE LIST
      ================================================= */}

      <div className="mt-6 space-y-3">
        {/* LOADING */}

        {loading && (
          <div className="card flex items-center justify-center gap-2 p-8 text-sm text-ink/50">
            <Loader2
              size={18}
              className="animate-spin"
            />
            Loading messages...
          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          messages.length === 0 && (
            <div className="card p-10 text-center">
              <Mail
                size={34}
                className="mx-auto text-forest/30"
              />

              <h3 className="mt-3 font-semibold text-forest-dark">
                No messages yet
              </h3>

              <p className="mt-1 text-sm text-ink/50">
                Messages submitted through
                the contact form will appear
                here.
              </p>
            </div>
          )}

        {/* MESSAGES */}

        {!loading &&
          messages.map((message) => {
            const messageId =
              getMessageId(message);

            return (
              <div
                key={messageId}
                className={`card p-5 transition ${
                  !message.read
                    ? "border-gold/50 bg-gold/[0.03]"
                    : ""
                }`}
              >
                {/* TOP */}

                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      openMessage(
                        message
                      )
                    }
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      {!message.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-gold" />
                      )}

                      <p className="truncate font-semibold text-forest-dark">
                        {message.subject ||
                          "No subject"}
                      </p>
                    </div>

                    <p className="mt-1 text-xs text-ink/55">
                      {message.name ||
                        "Unknown sender"}{" "}
                      ·{" "}
                      {message.email ||
                        "No email"}{" "}
                      ·{" "}
                      {formatDate(
                        message.createdAt
                      )}
                    </p>
                  </button>

                  {/* ACTIONS */}

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        markRead(
                          message
                        )
                      }
                      disabled={
                        actionLoading
                      }
                      className="rounded-lg p-2 text-forest transition hover:bg-forest/10 disabled:opacity-50"
                      aria-label={
                        message.read
                          ? "Mark as unread"
                          : "Mark as read"
                      }
                      title={
                        message.read
                          ? "Mark as unread"
                          : "Mark as read"
                      }
                    >
                      {message.read ? (
                        <MailOpen
                          size={16}
                        />
                      ) : (
                        <Mail
                          size={16}
                        />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        remove(
                          message
                        )
                      }
                      disabled={
                        actionLoading
                      }
                      className="rounded-lg p-2 text-rust transition hover:bg-rust/10 disabled:opacity-50"
                      aria-label="Delete"
                      title="Delete"
                    >
                      <Trash2
                        size={16}
                      />
                    </button>
                  </div>
                </div>

                {/* MESSAGE */}

                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink/70">
                  {message.message ||
                    "No message content."}
                </p>

                {/* SENDER INFO */}

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-forest/10 pt-3 text-xs text-ink/50">
                  {message.phone && (
                    <span>
                      Phone:{" "}
                      {message.phone}
                    </span>
                  )}

                  {message.email && (
                    <span>
                      Email:{" "}
                      {message.email}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* =================================================
          MESSAGE DETAILS MODAL
      ================================================= */}

      {selectedMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            {/* HEADER */}

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-forest/60">
                  Contact Message
                </p>

                <h2 className="mt-1 font-display text-xl font-semibold text-forest-dark">
                  {selectedMessage.subject ||
                    "No subject"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedMessage(
                    null
                  )
                }
                className="rounded-lg p-2 transition hover:bg-forest/10"
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </div>

            {/* SENDER */}

            <div className="mt-6 rounded-xl bg-forest/5 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink/45">
                    Name
                  </p>

                  <p className="mt-1 text-sm font-medium text-forest-dark">
                    {selectedMessage.name ||
                      "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wide text-ink/45">
                    Email
                  </p>

                  <p className="mt-1 text-sm font-medium text-forest-dark">
                    {selectedMessage.email ||
                      "—"}
                  </p>
                </div>

                {selectedMessage.phone && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-ink/45">
                      Phone
                    </p>

                    <p className="mt-1 text-sm font-medium text-forest-dark">
                      {
                        selectedMessage.phone
                      }
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-wide text-ink/45">
                    Date
                  </p>

                  <p className="mt-1 text-sm font-medium text-forest-dark">
                    {formatDate(
                      selectedMessage.createdAt
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* MESSAGE CONTENT */}

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">
                Message
              </p>

              <div className="mt-2 rounded-xl border border-forest/10 bg-white p-4">
                <p className="whitespace-pre-wrap text-sm leading-7 text-ink/75">
                  {selectedMessage.message ||
                    "No message content."}
                </p>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-forest/10 pt-5 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  setSelectedMessage(
                    null
                  )
                }
                className="btn-secondary flex-1"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  remove(
                    selectedMessage
                  );
                }}
                disabled={
                  actionLoading
                }
                className="flex-1 rounded-xl bg-rust px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-2">
                  <Trash2 size={16} />
                  Delete Message
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

