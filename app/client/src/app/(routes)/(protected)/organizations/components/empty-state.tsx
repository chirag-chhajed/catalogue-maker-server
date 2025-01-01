import Image from "next/image";

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
      <h2 className="text-2xl font-semibold mb-2">No Organizations Yet</h2>
      <p className="text-gray-600 mb-4">
        Create your first organization to get started!
      </p>
    </div>
  );
}
