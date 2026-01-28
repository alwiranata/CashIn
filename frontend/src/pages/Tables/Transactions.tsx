import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import TransactionsTable from "../../components/tables/BasicTables/TransactionsTable";

export default function Transactions() {
  return (
    <>
      <PageMeta
        title="React.js Basic Tables Dashboard | NoteFlow - Next.js Admin Dashboard Template"
        description="This is React.js Basic Tables Dashboard page for NoteFlow - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Trsnsactions" />
      <div className="space-y-6">
        <ComponentCard title="Transaction">
          <TransactionsTable />
        </ComponentCard>
      </div>
    </>
  );
}
