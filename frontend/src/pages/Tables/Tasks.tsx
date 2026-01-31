import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TasksTable from "../../components/tables/BasicTables/TasksTable";

export default function Tasks() {
  return (
    <>
      <PageMeta
        title="Task"
      />
      <PageBreadcrumb pageTitle="Tasks" />
      <div className="space-y-6">
        <ComponentCard title="Task">
          <TasksTable />
        </ComponentCard>
      </div>
    </>
  );
}
