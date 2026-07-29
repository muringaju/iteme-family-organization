import ResourceManager from "./ResourceManager.jsx";

const fields = [
  { name: "title", label: "Report Title", required: true },
  { name: "year", label: "Year", required: true },
  { name: "summary", label: "Summary", type: "textarea", required: true },
  { name: "fileUrl", label: "External File URL (PDF link, optional)" },
];

export default function ManageReports() {
  return (
    <ResourceManager
      title="Reports"
      endpoint="/reports"
      fields={fields}
      withImage
      nameField="title"
      columns={[{ name: "year", label: "Year" }]}
    />
  );
}
