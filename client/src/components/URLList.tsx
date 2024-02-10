import { Box, LoadingOverlay, Stack } from "@mantine/core";
import useURLData from "../hooks/useURLData";

export default function URLList() {
  const { urls, isLoading } = useURLData();

  return (
    <Box pos={"relative"}>
      <LoadingOverlay overlayColor="#c5c5c5" visible={isLoading} />
      <Stack>
        {JSON.stringify(urls)}
      </Stack>
    </Box>
  );
}
