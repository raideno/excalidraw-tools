import { Link } from "react-router-dom";

import { Box, Flex, Heading, Text, Button } from "@radix-ui/themes";

import { MaxWidthBox } from "@/components/layout/max-width-box";

export const NotFoundPage = () => {
  return (
    <MaxWidthBox>
      <Flex
        direction="column"
        align="center"
        justify="center"
        className="min-h-[60vh] text-center"
        gap="4"
      >
        <Box>
          <Heading size="9" mb={"2"}>
            404
          </Heading>
          <Heading size="6" mb={"4"}>
            Page Not Found
          </Heading>
          <Text size="4" color="gray" mb={"6"} as="div" className="!max-w-3xl">
            The page you're looking for doesn't exist. It might have been moved,
            deleted, or you entered the wrong URL.
          </Text>
        </Box>

        <Flex gap="3" align="center">
          <Button asChild variant="classic">
            <Link to="/">Go Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/" onClick={() => window.history.back()}>
              Go Back
            </Link>
          </Button>
        </Flex>
      </Flex>
    </MaxWidthBox>
  );
};
