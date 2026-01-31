import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import UsersTable from "../../components/tables/BasicTables/UsersTable";

export default function Users() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | NoteFlow - Next.js Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <ComponentCard title="User">
          <UsersTable />
        </ComponentCard>
      </div>
    </>
  );
}
