import ResourceManager from "./ResourceManager.jsx";

const fields = [
  { name: "title", label: "Campaign Title", required: true },
  { name: "theme", label: "Theme" },
  { name: "startDate", label: "Start Date", type: "date", required: true },
  { name: "endDate", label: "End Date", type: "date", required: true },
  { name: "goalAmount", label: "Goal Amount (RWF)", type: "number", required: true },
  { name: "raisedAmount", label: "Raised So Far (RWF)", type: "number" },
  { name: "status", label: "Status", type: "select", options: ["upcoming", "active", "closed"], required: true },
  { name: "description", label: "Description", type: "textarea", required: true },
];

export default function ManageCharityWeek() {
  return (
    <ResourceManager
      title="Charity Week Campaigns"
      endpoint="/charity-weeks"
      fields={fields}
      withImage
      nameField="title"
      columns={[
        { name: "status", label: "Status" },
        { name: "startDate", label: "Starts" },
        { name: "endDate", label: "Ends" },
      ]}
    />
  );
}
