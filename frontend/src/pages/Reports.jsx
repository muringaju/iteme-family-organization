import { useEffect, useState } from "react";
import {
  FileText,
  Download,
  Printer,
} from "lucide-react";

import api, { ASSET_BASE } from "../api/axios.js";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        const response = await api.get("/reports");

        const data = Array.isArray(response.data)
          ? response.data
          : response.data.reports || [];

        setReports(data);
      } catch (error) {
        console.error("Failed to load reports:", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // =====================================================
  // FILE URL
  // =====================================================

  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return null;

    if (
      fileUrl.startsWith("http://") ||
      fileUrl.startsWith("https://")
    ) {
      return fileUrl;
    }

    return `${ASSET_BASE}${
      fileUrl.startsWith("/") ? "" : "/"
    }${fileUrl}`;
  };

  // =====================================================
  // PRINT REPORT
  // =====================================================

  const printReport = (report) => {
    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=700"
    );

    if (!printWindow) {
      alert(
        "Please allow pop-ups to print the report."
      );
      return;
    }

    const safeTitle = report.title || "Annual Report";
    const safeYear = report.year || "";
    const safeSummary =
      report.summary || "No summary available.";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${safeTitle} - ${safeYear}</title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 50px;
              font-family: Arial, Helvetica, sans-serif;
              color: #172033;
              background: white;
            }

            .document {
              max-width: 850px;
              margin: 0 auto;
            }

            .header {
              text-align: center;
              border-bottom: 3px solid #1d4ed8;
              padding-bottom: 25px;
              margin-bottom: 35px;
            }

            .organization {
              color: #1d4ed8;
              font-size: 14px;
              font-weight: bold;
              letter-spacing: 2px;
              text-transform: uppercase;
              margin-bottom: 12px;
            }

            h1 {
              margin: 0;
              font-size: 30px;
              color: #111827;
            }

            .year {
              margin-top: 10px;
              color: #1d4ed8;
              font-size: 18px;
              font-weight: bold;
            }

            .section-title {
              color: #1d4ed8;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 12px;
            }

            .summary {
              font-size: 15px;
              line-height: 1.8;
              color: #4b5563;
              white-space: pre-line;
            }

            .footer {
              margin-top: 70px;
              padding-top: 20px;
              border-top: 1px solid #d1d5db;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }

            .footer strong {
              color: #1d4ed8;
            }

            @media print {
              body {
                padding: 25px;
              }

              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>

        <body>

          <div class="document">

            <div class="header">

              <div class="organization">
                ITEME OF HOPE FAMILY ORGANIZATION
              </div>

              <h1>
                ${safeTitle}
              </h1>

              <div class="year">
                Annual Report — ${safeYear}
              </div>

            </div>

            <div>

              <div class="section-title">
                Report Summary
              </div>

              <div class="summary">
                ${safeSummary}
              </div>

            </div>

            <div class="footer">

              <strong>
                ITEME OF HOPE FAMILY ORGANIZATION
              </strong>

              <br />

              Restoring Hope • Changing Lives • Building Stronger Communities

              <br /><br />

              Printed on:
              ${new Date().toLocaleDateString()}

            </div>

          </div>

          <script>
            window.onload = function () {
              window.print();

              window.onafterprint = function () {
                window.close();
              };
            };
          </script>

        </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="container-page py-16">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <SectionHeading
        eyebrow="Transparency"
        title="Annual & Financial Reports"
        description="We publish yearly reports covering how donations are spent and the impact on the families we serve."
      />

      {/* =====================================================
          REPORTS
      ====================================================== */}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">

        {/* Loading */}

        {loading && (
          <div className="sm:col-span-2 py-10 text-center">
            <p className="text-sm text-ink/50">
              Loading reports...
            </p>
          </div>
        )}

        {/* Empty */}

        {!loading && reports.length === 0 && (
          <div className="sm:col-span-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">

            <FileText
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 font-semibold text-slate-700">
              No reports published yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Annual and financial reports will appear
              here when published.
            </p>

          </div>
        )}

        {/* Report Cards */}

        {!loading &&
          reports.map((report) => {

            const fileUrl = getFileUrl(
              report.externalFileUrl ||
              report.fileUrl
            );

            return (
              <div
                key={
                  report._id ||
                  report.id
                }
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/10"
              >

                <div className="flex items-start gap-4">

                  {/* Icon */}

                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition">
                    <FileText size={22} />
                  </div>

                  {/* Information */}

                  <div className="min-w-0 flex-1">

                    <h4 className="font-display text-lg font-bold text-slate-900">
                      {report.title}
                    </h4>

                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                      {report.year}
                    </p>

                    {report.summary && (
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {report.summary}
                      </p>
                    )}

                    {/* ACTIONS */}

                    <div className="mt-5 flex flex-wrap gap-2">

                      {/* PRINT */}

                      <button
                        type="button"
                        onClick={() =>
                          printReport(report)
                        }
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
                      >
                        <Printer size={15} />
                        Print Report
                      </button>

                      {/* PDF */}

                      {fileUrl && (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          <Download size={15} />
                          PDF
                        </a>
                      )}

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

      </div>

    </div>
  );
}

