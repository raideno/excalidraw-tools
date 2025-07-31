import { Box, Flex, Switch, Text } from "@radix-ui/themes";

export interface SwitchFieldProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const SwitchField: React.FC<SwitchFieldProps> = ({
  label,
  description,
  checked,
  onCheckedChange,
}) => (
  <Box>
    <Flex
      className="w-full"
      direction={"row"}
      align={"center"}
      justify={"between"}
      gap={"2"}
    >
      <Box>
        <Text as="div" size="2" weight="bold">
          {label}
        </Text>
        <Text as="div" size={"1"} weight={"light"}>
          {description}
        </Text>
      </Box>
      <Switch checked={checked} onCheckedChange={onCheckedChange} size="2" />
    </Flex>
  </Box>
);
