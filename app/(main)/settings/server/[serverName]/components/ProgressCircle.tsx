export const ProgressCircle = ({ record }: { record?: unknown }) => {
  if (record) {
    console.log('Record values:', record);
  }

  return (
    <div className="py-1">
      <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
    </div>
  );
};
