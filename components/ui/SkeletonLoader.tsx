export function SkeletonLoader() {
  return (
    <div className="animate-pulse">
      <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
      <div className="mb-4 h-4 w-1/2 rounded bg-gray-200"></div>
      <div className="mb-4 h-32 rounded bg-gray-200"></div>
    </div>
  );
}
