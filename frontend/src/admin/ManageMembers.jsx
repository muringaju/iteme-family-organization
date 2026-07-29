import ResourceManager from "./ResourceManager.jsx";

const fields = [
  { name: "name", label: "Full Name", required: true },
  { name: "membershipType", label: "Membership Type", type: "select", options: ["Volunteer", "Community Partner", "Donor Member", "Board Member"], required: true },
  { name: "joinedDate", label: "Joined Date", type: "date" },
  { name: "contact", label: "Contact (email or phone)" },
];

export default function ManageMembers() {
  return (
    <ResourceManager
      title="Members"
      endpoint="/members"
      fields={fields}
      withImage
      nameField="name"
      columns={[
        { name: "membershipType", label: "Type" },
        { name: "joinedDate", label: "Joined" },
      ]}
    />
  );
}
