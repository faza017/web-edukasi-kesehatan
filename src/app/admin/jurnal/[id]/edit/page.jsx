import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import JurnalForm from "@/features/admin/JurnalForm";

export const metadata = { title: "Edit Jurnal Kesehatan" };

async function EditContent({ params }) {
  const { id } = await params;
  return <JurnalForm editId={id} />;
}

export default function EditJurnalPage({ params }) {
  return (
    <Suspense fallback={<Loader />}>
      <EditContent params={params} />
    </Suspense>
  );
}

