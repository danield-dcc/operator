import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const navbarRootVariants = tv({
	base: "flex h-14 w-full items-center justify-between border-b border-border px-10",
	variants: {
		variant: {
			default: "",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

const navbarBrandVariants = tv({
	base: "flex items-center",
});

const navbarNavVariants = tv({
	base: "flex items-center gap-6",
});

type NavbarRootVariants = VariantProps<typeof navbarRootVariants>;

type NavbarRootProps = ComponentProps<"header"> & NavbarRootVariants;
type NavbarBrandProps = ComponentProps<"div">;
type NavbarNavProps = ComponentProps<"nav">;

function NavbarRoot({ className, variant, ...props }: NavbarRootProps) {
	return (
		<header className={navbarRootVariants({ variant, className })} {...props} />
	);
}

function NavbarBrand({ className, ...props }: NavbarBrandProps) {
	return <div className={navbarBrandVariants({ className })} {...props} />;
}

function NavbarNav({ className, ...props }: NavbarNavProps) {
	return <nav className={navbarNavVariants({ className })} {...props} />;
}

export {
	NavbarRoot,
	NavbarBrand,
	NavbarNav,
	navbarRootVariants,
	navbarBrandVariants,
	navbarNavVariants,
	type NavbarRootProps,
	type NavbarBrandProps,
	type NavbarNavProps,
};
