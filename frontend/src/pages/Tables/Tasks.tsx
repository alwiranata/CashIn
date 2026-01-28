import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TasksTable from "../../components/tables/BasicTables/TasksTable";

export default function Tasks() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | NoteFlow - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for NoteFlow - React.js Tailwind CSS Admin Dashboard Template"
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
