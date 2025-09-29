import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { ButtonGroup } from "@heroui/react";
export default function DropDownComponent({
  handleUpdatePost,
  onOpen,
  deletedComponent,
  type,
}) {
  return (
    <Dropdown>
      <DropdownTrigger className="rotate-90 ms-auto cursor-pointer">
        <ButtonGroup variant="bordered">
          <i className="fa-solid fa-ellipsis fa-lg"></i>
        </ButtonGroup>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="edit"
          onPress={() => {
            handleUpdatePost && handleUpdatePost(deletedComponent._id);
          }}
        >
          Edit {type}
        </DropdownItem>
        <DropdownItem
          key="delete"
          onPress={onOpen}
          className="text-danger"
          color="danger"
        >
          Delete {type}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
