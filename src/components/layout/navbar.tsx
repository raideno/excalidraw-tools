import { cn } from "@/lib/utils";

import { GitHubLogoIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import {
  Box,
  Flex,
  Heading,
  IconButton,
  Link,
  type BoxProps,
} from "@radix-ui/themes";

import { MaxWidthBox } from "@/components/layout/max-width-box";
import { useAppTheme } from "@/components/providers/use-app-theme";

export type NavbarProps = BoxProps & {};

export const Navbar: React.FC<NavbarProps> = ({ className, ...props }) => {
  const { appearance, toggleAppearance } = useAppTheme();
  const isDark = appearance === "dark";

  return (
    <Box
      p={{ initial: "3", sm: "4" }}
      className={cn(
        "w-full sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[color-mix(in_oklab,canvas,transparent_40%)] border-b border-[color-mix(in_oklab,canvasText,transparent_92%)]",
        className
      )}
      {...props}
    >
      <MaxWidthBox>
        <Flex align="center" justify="between" gap="3">
          <Heading as="h1" size="4" aria-label="Excalidraw Tools home">
            🛠️ Excalidraw Tools
          </Heading>
          <Flex align="center" gap="2">
            <IconButton
              aria-label={
                isDark ? "Switch to light theme" : "Switch to dark theme"
              }
              className="!cursor-pointer"
              variant="soft"
              onClick={toggleAppearance}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </IconButton>
            <Link
              href={__GITHUB_REPOSITORY_URL__}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub repository"
            >
              <IconButton className="!cursor-pointer" variant="classic">
                <GitHubLogoIcon />
              </IconButton>
            </Link>
          </Flex>
        </Flex>
      </MaxWidthBox>
    </Box>
  );
};
