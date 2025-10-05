import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { ButtonGroup } from "@heroui/react";
import { MenuIcon } from "./icons/MenuIcon";

export default function DropDownComponent({
  handleUpdatePost,
  onOpen,
  type,
}) {
  return (
    <Dropdown>
      <DropdownTrigger className="rotate-90 ms-auto cursor-pointer">
        <ButtonGroup variant="bordered">
          <MenuIcon className="w-5 h-5" />
        </ButtonGroup>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem
          key="edit"
          textValue={`Edit ${type}`}
          onPress={() => {
            handleUpdatePost && handleUpdatePost();
          }}
        >
          Edit {type}
        </DropdownItem>
        <DropdownItem
          key="delete"
          textValue={`Delete ${type}`}
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
