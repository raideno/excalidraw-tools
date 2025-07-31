import { cn } from "@/lib/utils";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Link,
  type BoxProps,
} from "@radix-ui/themes";

export type NavbarProps = BoxProps & {};

export const Navbar: React.FC<NavbarProps> = ({ className, ...props }) => {
  return (
    <Box p={"4"} className={cn("w-full", className)} {...props}>
      <Flex align="center" justify="between">
        <Heading>🛠️ Excalidraw Tools</Heading>
        <Link
          href={__GITHUB_REPOSITORY_URL__}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IconButton className="!cursor-pointer" variant="classic">
            <GitHubLogoIcon />
          </IconButton>
        </Link>
      </Flex>
    </Box>
  );
};
