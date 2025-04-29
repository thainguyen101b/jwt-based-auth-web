import { Button } from "./Button";

interface DeleteModalProps {
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
}
const MODAL_TITLE = "Delete confirm";
const MODAL_DESCRIPTION = "Are you sure delete? This action can't be revert.";

export const DeleteModal = ({
  title = MODAL_TITLE,
  description = MODAL_DESCRIPTION,
  onCancel,
  onConfirm,
}: DeleteModalProps) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <p className="text-gray-500 mb-6">{description}</p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
