import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
export default function DeleteModalComponent({
  isOpen,
  onOpenChange,
  isDeleting,
  handleDelete,
  deletedComponent,
  type,
}) {
  
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Delete Confirmation
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete this {type}? This
                action cannot be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" variant="ghost" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                variant="shadow"
                isLoading={isDeleting}
                loadingText="Deleting..."
                isDisabled={isDeleting}
                onPress={() => {
                  handleDelete(deletedComponent._id, onClose);
                }}
              >
                Delete
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
