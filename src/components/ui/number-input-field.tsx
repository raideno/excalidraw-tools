import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Box, IconButton, Text, TextField } from "@radix-ui/themes";

export interface NumberInputFieldProps {
  label: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
}

export const NumberInputField: React.FC<NumberInputFieldProps> = ({
  label,
  value,
  min = 1,
  onChange,
  onIncrement,
  onDecrement,
}) => (
  <Box className="w-full">
    <Text as="label" size="2" weight="medium">
      {label}
    </Text>
    <TextField.Root
      type="number"
      value={value.toString()}
      onChange={(e) => onChange(Math.max(min, parseInt(e.target.value) || min))}
      min={min.toString()}
      size="2"
    >
      {onIncrement && (
        <TextField.Slot side="right">
          <IconButton
            className="!cursor-pointer"
            variant={"ghost"}
            size={"1"}
            onClick={onIncrement}
          >
            <PlusIcon />
          </IconButton>
        </TextField.Slot>
      )}
      {onDecrement && (
        <TextField.Slot side="right">
          <IconButton
            className="!cursor-pointer"
            variant={"ghost"}
            size={"1"}
            onClick={onDecrement}
          >
            <MinusIcon />
          </IconButton>
        </TextField.Slot>
      )}
    </TextField.Root>
  </Box>
);
