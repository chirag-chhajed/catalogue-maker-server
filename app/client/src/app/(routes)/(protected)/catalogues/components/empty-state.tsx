import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmptyState() {
  return (
    <div className="text-center">
      <Image
        src="/266.png?height=200&width=200"
        alt="No organizations"
        width={200}
        height={200}
        className="mx-auto mb-4"
      />
      <h2 className="text-2xl font-semibold mb-2">No Catalogues Yet</h2>
      <p className="text-gray-600 mb-4">
        Create your first organization to get started!
      </p>
      <Link href="/catalogues/create">
        <Button>Create Catalogue</Button>
      </Link>
    </div>
  );
}
