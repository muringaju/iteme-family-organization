import { useEffect, useMemo, useState } from "react";
import {
  Trash2,
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCw,
} from "lucide-react";
import api from "../api/axios.js";

export default function ManageDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // GET ID
  // =====================================================

  function getId(donation) {
    return donation?._id || donation?.id;
  }

  // =====================================================
  // LOAD DONATIONS
  // =====================================================

  async function loadDonations() {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/donations");

      const records = Array.isArray(data) ? data : [];

      setDonations(records);
    } catch (err) {
      console.error("LOAD DONATIONS ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Could not load donations."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDonations();
  }, []);

  // =====================================================
  // CHANGE STATUS
  // =====================================================

  async function changeStatus(donation, newStatus) {
    const donationId = getId(donation);

    if (!donationId) {
      alert("Donation ID is missing.");
      return;
    }

    if (donation.status === newStatus) {
      return;
    }

    try {
      setUpdatingId(donationId);
      setError("");

      const { data } = await api.put(
        `/donations/${donationId}`,
        {
          status: newStatus,
        }
      );

      setDonations((prev) =>
        prev.map((item) =>
          getId(item) === donationId
            ? data
            : item
        )
      );
    } catch (err) {
      console.error(
        "CHANGE DONATION STATUS ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Could not update donation status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // =====================================================
  // DELETE
  // =====================================================

  async function removeDonation(donation) {
    const donationId = getId(donation);

    if (!donationId) {
      alert("Donation ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      `Delete donation from ${donation.donorName}?`
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(
        `/donations/${donationId}`
      );

      setDonations((prev) =>
        prev.filter(
          (item) => getId(item) !== donationId
        )
      );
    } catch (err) {
      console.error(
        "DELETE DONATION ERROR:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Could not delete donation."
      );
    }
  }

  // =====================================================
  // STATISTICS
  // =====================================================

  const statistics = useMemo(() => {
    const totalPledged = donations.reduce(
      (sum, donation) =>
        sum + Number(donation.amount || 0),
      0
    );

    const confirmed = donations
      .filter(
        (donation) =>
          donation.status === "confirmed"
      )
      .reduce(
        (sum, donation) =>
          sum + Number(donation.amount || 0),
        0
      );

    const pending = donations
      .filter(
        (donation) =>
          donation.status === "pending"
      )
      .reduce(
        (sum, donation) =>
          sum + Number(donation.amount || 0),
        0
      );

    const rejected = donations
      .filter(
        (donation) =>
          donation.status === "rejected"
      )
      .reduce(
        (sum, donation) =>
          sum + Number(donation.amount || 0),
        0
      );

    return {
      totalPledged,
      confirmed,
      pending,
      rejected,
    };
  }, [donations]);

  // =====================================================
  // STATUS UI
  // =====================================================

  function getStatusStyle(status) {
    if (status === "confirmed") {
      return "bg-forest/10 text-forest border-forest/20";
    }

    if (status === "rejected") {
      return "bg-rust/10 text-rust border-rust/20";
    }

    return "bg-gold/15 text-gold-dark border-gold/20";
  }

  function getStatusIcon(status) {
    if (status === "confirmed") {
      return <CheckCircle2 size={14} />;
    }

    if (status === "rejected") {
      return <XCircle size={14} />;
    }

    return <Clock3 size={14} />;
  }

  function formatMoney(amount) {
    return `${Number(amount || 0).toLocaleString()} RWF`;
  }

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
            Donations
          </h1>

          <p className="mt-1 text-sm text-ink/60">
            Manage donation pledges and payment
            confirmations.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDonations}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-forest/15 bg-white px-4 py-2.5 text-sm font-medium text-forest-dark hover:bg-forest/5 disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={
              loading ? "animate-spin" : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* TOTAL PLEDGED */}

        <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
            Total Pledged
          </p>

          <p className="mt-2 font-mono text-xl font-bold text-forest-dark">
            {formatMoney(
              statistics.totalPledged
            )}
          </p>

          <p className="mt-1 text-xs text-ink/50">
            {donations.length} donation record(s)
          </p>
        </div>

        {/* CONFIRMED */}

        <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2
              size={16}
              className="text-forest"
            />

            <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
              Confirmed
            </p>
          </div>

          <p className="mt-2 font-mono text-xl font-bold text-forest">
            {formatMoney(statistics.confirmed)}
          </p>

          <p className="mt-1 text-xs text-ink/50">
            Confirmed donations
          </p>
        </div>

        {/* PENDING */}

        <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock3
              size={16}
              className="text-gold-dark"
            />

            <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
              Pending
            </p>
          </div>

          <p className="mt-2 font-mono text-xl font-bold text-gold-dark">
            {formatMoney(statistics.pending)}
          </p>

          <p className="mt-1 text-xs text-ink/50">
            Awaiting confirmation
          </p>
        </div>

        {/* REJECTED */}

        <div className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <XCircle
              size={16}
              className="text-rust"
            />

            <p className="text-xs font-medium uppercase tracking-wide text-ink/50">
              Rejected
            </p>
          </div>

          <p className="mt-2 font-mono text-xl font-bold text-rust">
            {formatMoney(statistics.rejected)}
          </p>

          <p className="mt-1 text-xs text-ink/50">
            Rejected donations
          </p>
        </div>
      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mt-5 rounded-xl border border-rust/20 bg-rust/10 px-4 py-3 text-sm text-rust">
          {error}
        </div>
      )}

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-forest/10 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-forest/5 text-xs uppercase tracking-wide text-forest-dark/70">
            <tr>
              <th className="px-4 py-3">
                Donor
              </th>

              <th className="px-4 py-3">
                Amount
              </th>

              <th className="px-4 py-3">
                Method
              </th>

              <th className="px-4 py-3">
                Contact
              </th>

              <th className="px-4 py-3">
                Status
              </th>

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
                  colSpan={6}
                  className="px-4 py-8 text-center text-ink/50"
                >
                  Loading donations...
                </td>
              </tr>
            )}

            {/* EMPTY */}

            {!loading &&
              donations.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-ink/50"
                  >
                    No donations recorded yet.
                  </td>
                </tr>
              )}

            {/* DATA */}

            {!loading &&
              donations.map((donation) => {
                const donationId =
                  getId(donation);

                const isUpdating =
                  updatingId === donationId;

                return (
                  <tr
                    key={donationId}
                    className="hover:bg-forest/[0.03]"
                  >
                    {/* DONOR */}

                    <td className="px-4 py-4">
                      <p className="font-medium text-forest-dark">
                        {donation.donorName ||
                          "Unknown donor"}
                      </p>

                      {donation.note && (
                        <p className="mt-1 max-w-[220px] truncate text-xs text-ink/50">
                          {donation.note}
                        </p>
                      )}
                    </td>

                    {/* AMOUNT */}

                    <td className="px-4 py-4 font-mono font-semibold">
                      {formatMoney(
                        donation.amount
                      )}
                    </td>

                    {/* METHOD */}

                    <td className="px-4 py-4 text-ink/70">
                      {donation.method || "—"}
                    </td>

                    {/* CONTACT */}

                    <td className="px-4 py-4 text-ink/60">
                      <div>
                        {donation.email && (
                          <p>{donation.email}</p>
                        )}

                        {donation.phone && (
                          <p>{donation.phone}</p>
                        )}

                        {!donation.email &&
                          !donation.phone &&
                          "—"}
                      </div>
                    </td>

                    {/* STATUS */}

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getStatusStyle(
                            donation.status
                          )}`}
                        >
                          {getStatusIcon(
                            donation.status
                          )}

                          {donation.status}
                        </span>

                        {isUpdating && (
                          <span className="text-xs text-ink/50">
                            Updating...
                          </span>
                        )}
                      </div>
                    </td>

                    {/* ACTIONS */}

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        {/* STATUS SELECT */}

                        <select
                          value={
                            donation.status ||
                            "pending"
                          }
                          disabled={isUpdating}
                          onChange={(e) =>
                            changeStatus(
                              donation,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-forest/15 bg-white px-2.5 py-2 text-xs font-medium text-forest-dark outline-none focus:border-forest disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Change donation status"
                        >
                          <option value="pending">
                            Pending
                          </option>

                          <option value="confirmed">
                            Confirmed
                          </option>

                          <option value="rejected">
                            Rejected
                          </option>
                        </select>

                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            removeDonation(
                              donation
                            )
                          }
                          className="rounded-lg p-2 text-rust hover:bg-rust/10"
                          aria-label="Delete donation"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}