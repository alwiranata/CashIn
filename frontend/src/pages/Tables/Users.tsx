import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AddUser from "../../components/addTables/AddUsers";
import UserTable from "../../components/tables/BasicTables/UsersTable";

export default function User() {
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <>
      <PageMeta title="NoteFlow" />
      <PageBreadcrumb pageTitle="Users" />

      <div className="space-y-6">
        <ComponentCard title="User">
          <div className="flex justify-end mb-4">
            <AddUser onSuccess={() => setReloadKey((k) => k + 1)} />
          </div>

          <UserTable reloadKey={reloadKey} />
        </ComponentCard>
      </div>
    </>
  );
}
