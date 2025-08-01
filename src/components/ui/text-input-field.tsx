import { Box, Text, TextField } from "@radix-ui/themes";

export interface TextInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const TextInputField: React.FC<TextInputFieldProps> = ({
  label,
  value,
  onChange,
}) => (
  <Box className="w-full">
    <Text as="label" size="2" weight="medium">
      {label}
    </Text>
    <TextField.Root
      type="text"
      value={value.toString()}
      onChange={(e) => onChange(e.target.value)}
      size="2"
    />
  </Box>
);
