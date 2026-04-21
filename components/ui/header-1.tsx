'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { createPortal } from 'react-dom';

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	const links = [
		{
			label: 'Spaces',
			href: '/spaces',
		},
		{
			label: 'Community',
			href: '/community',
		},
		{
			label: 'Assistant',
			href: '/assistant',
		},
	];

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn('sticky top-0 z-50 w-full border-b border-transparent', {
				'bg-[#171717]/95 supports-[backdrop-filter]:bg-[#171717]/50 border-[#242424] backdrop-blur-lg':
					scrolled,
			})}
		>
			<nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
				<div className="hover:bg-accent rounded-md p-2">
					<a href="/" className="text-[18px] font-medium text-[#3ecf8e]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
						NomadBase.goa
					</a>
				</div>
				<div className="hidden items-center gap-2 md:flex">
					{links.map((link) => (
						<a key={link.label} className="text-[14px] font-medium text-[#fafafa] hover:text-[#3ecf8e]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }} href={link.href}>
							{link.label}
						</a>
					))}
					<Button variant="outline" className="text-[#fafafa] border-[#2e2e2e]">Sign In</Button>
					<Button className="text-[#fafafa] bg-[#3ecf8e] hover:bg-[#3ecf8e]/90">Get Started</Button>
				</div>
				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden text-[#fafafa] border-[#2e2e2e]"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
				>
					<MenuToggleIcon open={open} className="size-5" duration={300} />
				</Button>
			</nav>
			<MobileMenu open={open} className="flex flex-col justify-between gap-2">
				<div className="grid gap-y-2">
					{links.map((link) => (
						<a
							key={link.label}
							className="text-[18px] font-medium text-[#fafafa] hover:text-[#3ecf8e]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
							href={link.href}
						>
							{link.label}
						</a>
					))}
				</div>
				<div className="flex flex-col gap-2">
					<Button variant="outline" className="w-full bg-transparent text-[#fafafa] border-[#2e2e2e]">
						Sign In
					</Button>
					<Button className="w-full text-[#fafafa] bg-[#3ecf8e] hover:bg-[#3ecf8e]/90">Get Started</Button>
				</div>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<'div'> & {
	open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	if (!open || typeof window === 'undefined') return null;

	return createPortal(
		<div
			id="mobile-menu"
			className={cn(
				'bg-[#171717]/95 supports-[backdrop-filter]:bg-[#171717]/50 backdrop-blur-lg',
				'fixed top-14 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden border-y border-[#242424] md:hidden',
			)}
		>
			<div
				data-slot={open ? 'open' : 'closed'}
				className={cn(
					'data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out',
					'size-full p-4',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}
