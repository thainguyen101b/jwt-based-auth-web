interface EmptyStateProps {
  stateName: string;
}
export const EmptyState = ({ stateName }: EmptyStateProps) => (
  <tr>
    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
      There are no {stateName}. Create a new one!
    </td>
  </tr>
);
