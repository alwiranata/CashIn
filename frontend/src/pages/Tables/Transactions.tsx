import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TransactionsTable from "../../components/tables/BasicTables/TransactionsTable";
import AddTransaction from "../../components/addTables/AddTransaction";

export default function Tasks() {
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <>
      <PageMeta title="Task" />
      <PageBreadcrumb pageTitle="Tasks" />

      <div className="space-y-6">
        <ComponentCard title="Task">
          <div className="flex justify-end mb-4">
            <AddTransaction onSuccess={() => setReloadKey((k) => k + 1)} />
          </div>

          <TransactionsTable reloadKey={reloadKey} />
        </ComponentCard>
      </div>
    </>
  );
}
