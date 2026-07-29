import ResourceManager from "./ResourceManager.jsx";

const fields = [
  { name: "fullName", label: "Full Name", required: true },
  { name: "age", label: "Age", type: "number", required: true },
  { name: "grade", label: "Grade / Class", required: true },
  { name: "district", label: "District", required: true },
  { name: "story", label: "Story / Background", type: "textarea", required: true },
  { name: "feeNeeded", label: "School Fee Needed (RWF)", type: "number", required: true },
  { name: "amountRaised", label: "Amount Raised So Far (RWF)", type: "number" },
  { name: "status", label: "Status", type: "select", options: ["urgent", "sponsored"] },
];

export default function ManageChildren() {
  return (
    <ResourceManager
      title="Vulnerable Students"
      endpoint="/children"
      fields={fields}
      withImage
      nameField="fullName"
      columns={[
        { name: "district", label: "District" },
        { name: "feeNeeded", label: "Fee Needed", render: (i) => Number(i.feeNeeded || 0).toLocaleString() },
        { name: "amountRaised", label: "Raised", render: (i) => Number(i.amountRaised || 0).toLocaleString() },
      ]}
    />
  );
}
