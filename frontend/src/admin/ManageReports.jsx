import ResourceManager from "./ResourceManager.jsx";

const fields = [
  {
    name: "title",
    label: "Report Title",
    type: "text",
    required: true,
    placeholder: "Enter report title",
  },

  {
    name: "year",
    label: "Year",
    type: "number",
    required: true,
    placeholder: "e.g. 2026",
  },

  {
    name: "summary",
    label: "Summary",
    type: "textarea",
    required: true,
    placeholder: "Enter a short summary of the report",
  },

  {
    name: "externalFileUrl",
    label: "External File URL (PDF link, optional)",
    type: "url",
    required: false,
    placeholder: "https://example.com/report.pdf",
  },
];

export default function ManageReports() {
  return (
    <ResourceManager
      title="Reports"
      endpoint="/reports"
      fields={fields}
      withImage={false}
      nameField="title"
      columns={[
        {
          name: "year",
          label: "Year",
        },
      ]}
    />
  );
}

