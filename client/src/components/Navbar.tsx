import {
  Header,
  Group,
  Title,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconBrandGithubFilled,
  IconMoonStars,
  IconSun,
} from "@tabler/icons-react";

export default function Navbar() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Header height={60} px="md" mb={30}>
      <Group position="apart" sx={{ height: "100%" }}>
        <Group sx={{ height: "100%" }}>
          <Title size={"h3"}>URL Shortener</Title>
          <ActionIcon
            aria-label="github"
            component="a"
            href="https://github.com/jatinkumar-me/blog-app"
            target="_blank"
          >
            <IconBrandGithubFilled />
          </ActionIcon>
          <ActionIcon onClick={() => toggleColorScheme()}>
            {isDark ? <IconSun /> : <IconMoonStars />}
          </ActionIcon>
        </Group>
      </Group>
    </Header>
  );
}
