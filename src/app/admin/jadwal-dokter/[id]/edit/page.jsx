import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import JadwalDokterForm from "@/features/admin/JadwalDokterForm";

export const metadata = { title: "Edit Jadwal Dokter" };

async function EditContent({ params }) {
  const { id } = await params;
  return <JadwalDokterForm editId={id} />;
}

export default function EditJadwalDokterPage({ params }) {
  return (
    <Suspense fallback={<Loader />}>
      <EditContent params={params} />
    </Suspense>
  );
}

