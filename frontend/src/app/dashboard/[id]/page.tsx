import { Content } from "@/app/dashboard/[id]/Content";

export const metadata = {
  title: "Edit Note",
};

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Content noteId={Number(id)} />;
}
