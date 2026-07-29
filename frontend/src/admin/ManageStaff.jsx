import ResourceManager from "./ResourceManager.jsx";

const fields = [
  { name: "name", label: "Full Name", required: true },
  { name: "role", label: "Role / Position", required: true },
  { name: "bio", label: "Short Bio", type: "textarea", required: true },
  { name: "email", label: "Email" },
];

export default function ManageStaff() {
  return (
    <ResourceManager
      title="Staff"
      endpoint="/staff"
      fields={fields}
      withImage
      nameField="name"
      columns={[
        { name: "role", label: "Role" },
        { name: "email", label: "Email" },
      ]}
    />
  );
}
