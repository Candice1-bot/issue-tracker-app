import NextLink from "next/link";
import { Link as ReadixLink } from "@radix-ui/themes";
import { ComponentProps } from "react";

interface Props extends ComponentProps<typeof NextLink> {
  children: string;
}
const Link = ({ href, children, ...props }: Props) => {
  return (
    <ReadixLink asChild>
      <NextLink href={href} {...props}>
        {children}
      </NextLink>
    </ReadixLink>
  );
};

export default Link;
