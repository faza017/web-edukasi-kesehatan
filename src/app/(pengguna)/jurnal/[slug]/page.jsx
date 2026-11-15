import { Suspense } from "react";
import Loader from "@/components/ui/Loader";
import JurnalDetailView from "@/features/jurnal/JurnalDetailView";

export const metadata = { title: "Detail Jurnal" };

async function Detail({ params }) {
  const { slug } = await params;
  return <JurnalDetailView slug={slug} />;
}

export default function JurnalDetailPage({ params }) {
  return (
    <Suspense fallback={<Loader />}>
      <Detail params={params} />
    </Suspense>
  );
}

