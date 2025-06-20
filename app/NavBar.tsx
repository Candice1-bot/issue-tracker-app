"use client";
import { Skeleton } from "@/app/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { AiFillBug } from "react-icons/ai";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import {
  Avatar,
  Box,
  Container,
  DropdownMenu,
  Flex,
  Text,
} from "@radix-ui/themes";

const NavBar = () => {
  return (
    <nav className="border-b mb-5 py-3 px-5">
      <Container>
        <Flex justify="between">
          <Flex align="center" gap="3">
            <Link href="/">
              <AiFillBug size={30} />
            </Link>
            <NavLinks />
          </Flex>

          <AuthStatus />
        </Flex>
      </Container>
    </nav>
  );
};

const NavLinks = () => {
  const currentPath = usePathname();

  const links = [
    { label: "Dashboard", href: "/" },
    { label: "Issues", href: "/issues/list" },
    { label: "My Issue", href: "/issues/myIssue" },
  ];

  return (
    <ul className="flex space-x-6  border-b-amber-900">
      {links.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={classNames({
              "nav-link": true,
              "!text-zinc-900": item.href === currentPath,
            })}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

const AuthStatus = () => {
  const { status, data: session } = useSession();
  if (status === "loading") return <Skeleton width="3rem" />;
  if (status === "unauthenticated")
    return (
      <Flex gap="3">
        <Link className="nav-link" href="/api/auth/signin">
          Log in
        </Link>
        <Link className="nav-link" href="/signup">
          Sign up
        </Link>
      </Flex>
    );

  return (
    <Box>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger aria-label="User menu">
          <Avatar
            src={
              session?.user?.image ??
              "https://static.thenounproject.com/png/4154905-200.png"
            }
            fallback="?"
            size="2"
            radius="full"
            className="cursor-pointer"
            referrerPolicy="no-referrer"
          />
        </DropdownMenu.Trigger>

        <DropdownMenu.Content>
          <DropdownMenu.Label>
            <Text size="2">{session!.user!.email}</Text>
          </DropdownMenu.Label>

          <DropdownMenu.Item>
            <Link href="/api/auth/signout">Sign Out</Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Box>
  );
};
export default NavBar;
