import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import KegiatanForm from "@/features/admin/KegiatanForm";

export const metadata = { title: "Edit Jadwal Kegiatan" };

async function EditContent({ params }) {
  const { id } = await params;
  return <KegiatanForm editId={id} />;
}

export default function EditKegiatanPage({ params }) {
  return (
    <Suspense fallback={<Loader />}>
      <EditContent params={params} />
    </Suspense>
  );
}

