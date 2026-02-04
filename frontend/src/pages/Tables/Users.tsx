import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TransactionsTable from "../../components/tables/BasicTables/TransactionsTable";
import AddUser from "../../components/addTables/AddUsers";

export default function User() {
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <>
      <PageMeta title="User" />
      <PageBreadcrumb pageTitle="Users" />

      <div className="space-y-6">
        <ComponentCard title="Users">
          <div className="flex justify-end mb-4">
            <AddUser onSuccess={() => setReloadKey((k) => k + 1)} />
          </div>

          <TransactionsTable reloadKey={reloadKey} />
        </ComponentCard>
      </div>
    </>
  );
}
