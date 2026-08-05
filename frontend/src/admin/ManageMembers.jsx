import ResourceManager from "./ResourceManager.jsx";

const fields = [
  // =========================================================
  // FULL NAME
  // =========================================================
  {
    name: "name",
    label: "Full Name",
    required: true,
    placeholder: "Enter member's full name",
  },

  // =========================================================
  // MEMBERSHIP TYPE
  // =========================================================
  {
    name: "membershipType",
    label: "Membership Type",
    type: "select",
    options: [
      "Volunteer",
      "Community Partner",
      "Donor Member",
      "Board Member",
    ],
    required: true,
  },

  // =========================================================
  // JOINED DATE
  // =========================================================
  {
    name: "joinedDate",
    label: "Joined Date",
    type: "date",
  },

  // =========================================================
  // CONTACT
  // =========================================================
  {
    name: "contact",
    label: "Contact (email or phone)",
    placeholder:
      "+250 7XX XXX XXX or email@example.com",
  },

  // =========================================================
  // REASON FOR JOINING
  // =========================================================
  {
    name: "reason",
    label: "Reason for Joining",
    type: "textarea",
    rows: 5,
    placeholder:
      "Why did this member join ITEME of HOPE FAMILY ORGANIZATION?",
  },
];

// =============================================================
// MANAGE MEMBERS
// =============================================================

export default function ManageMembers() {
  return (
    <div className="space-y-6">

      {/* =====================================================
          PAGE INTRO
      ===================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-forest-dark">
          Members Management
        </h1>

        <p className="mt-1 text-sm text-ink/60">
          Add, edit, view and manage ITEME of HOPE FAMILY
          ORGANIZATION members.
        </p>
      </div>

      {/* =====================================================
          RESOURCE MANAGER
      ===================================================== */}

      <ResourceManager
        title="Manage Members"
        endpoint="/members"
        fields={fields}
        withImage={true}
        nameField="name"

        columns={[
          // ===================================================
          // MEMBERSHIP TYPE
          // ===================================================

          {
            name: "membershipType",
            label: "Membership Type",

            render: (member) => {
              const type =
                member.membershipType;

              if (!type) {
                return (
                  <span className="text-ink/40">
                    —
                  </span>
                );
              }

              return (
                <span className="inline-flex rounded-full bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
                  {type}
                </span>
              );
            },
          },

          // ===================================================
          // JOINED DATE
          // ===================================================

          {
            name: "joinedDate",
            label: "Joined Date",

            render: (member) => {
              if (!member.joinedDate) {
                return (
                  <span className="text-ink/40">
                    —
                  </span>
                );
              }

              const date =
                new Date(
                  member.joinedDate
                );

              if (
                Number.isNaN(
                  date.getTime()
                )
              ) {
                return (
                  <span>
                    {member.joinedDate}
                  </span>
                );
              }

              return (
                <span>
                  {date.toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}
                </span>
              );
            },
          },

          // ===================================================
          // CONTACT
          // ===================================================

          {
            name: "contact",
            label: "Contact",

            render: (member) => {
              if (!member.contact) {
                return (
                  <span className="text-ink/40">
                    —
                  </span>
                );
              }

              return (
                <span className="whitespace-nowrap">
                  {member.contact}
                </span>
              );
            },
          },

          // ===================================================
          // REASON
          // ===================================================

          {
            name: "reason",
            label: "Reason for Joining",

            render: (member) => {
              if (!member.reason) {
                return (
                  <span className="text-ink/40">
                    —
                  </span>
                );
              }

              return (
                <span
                  className="block max-w-[350px] truncate"
                  title={member.reason}
                >
                  {member.reason}
                </span>
              );
            },
          },
        ]}
      />
    </div>
  );
}

