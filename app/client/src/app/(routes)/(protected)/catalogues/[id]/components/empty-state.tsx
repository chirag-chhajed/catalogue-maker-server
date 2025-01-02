import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmptyState({ id }: { id: string }) {
  return (
    <div className="text-center">
      <Image
        src="/266.png?height=200&width=200"
        alt="No organizations"
        width={200}
        height={200}
        className="mx-auto mb-4"
      />
      <h2 className="text-2xl font-semibold mb-2">No Items Yet</h2>
      <p className="text-gray-600 mb-4">
        Add your first item to this catalogue!
      </p>
      <Link href={`/catalogues/${id}/create`}>
        <Button>Add Item</Button>
      </Link>
    </div>
  );
}
