import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TasksTable from "../../components/tables/BasicTables/TasksTable";
import AddTask from "../../components/addTables/AddTask";

export default function Tasks() {
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <>
      <PageMeta title="Task" />
      <PageBreadcrumb pageTitle="Tasks" />

      <div className="space-y-6">
        <ComponentCard title="Task">
          <div className="flex justify-end mb-4">
            <AddTask onSuccess={() => setReloadKey((k) => k + 1)} />
          </div>

          <TasksTable reloadKey={reloadKey} />
        </ComponentCard>
      </div>
    </>
  );
}
