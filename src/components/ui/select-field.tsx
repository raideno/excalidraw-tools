import { Box, Select, Text } from "@radix-ui/themes";

export interface SelectFieldProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  options,
  onChange,
}) => (
  <Box className="w-full">
    <Text as="div" size="2" weight="medium">
      {label}
    </Text>
    <Select.Root
      value={value.toString()}
      onValueChange={(value) => onChange(value)}
      size="2"
    >
      <Select.Trigger className="!w-full">
        {options.find((option) => option.value === value)!.label}
      </Select.Trigger>
      <Select.Content>
        {options.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  </Box>
);
