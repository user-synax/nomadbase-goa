"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RocketIcon, ArrowRightIcon, PhoneCallIcon, Building2, Briefcase, Globe, Star, Shield, Users, Zap, Target, Award,  } from "lucide-react";
import { LogoCloud } from "@/components/ui/logo-cloud-3";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

export function HeroSection() {
	const [isAboutOpen, setIsAboutOpen] = useState(false);
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (modalRef.current) {
			if (isAboutOpen) {
				gsap.fromTo(modalRef.current, 
					{ opacity: 0, scale: 0.9, filter: "blur(10px)" },
					{ opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.4, ease: "power2.out" }
				);
			} else {
				gsap.to(modalRef.current, 
					{ opacity: 0, scale: 0.9, filter: "blur(10px)", duration: 0.3, ease: "power2.in" }
				);
			}
		}
	}, [isAboutOpen]);

	return (
		<section className="mx-auto w-full max-w-5xl mt-10">
			{/* Top Shades */}
			<div
				aria-hidden="true"
				className="absolute inset-0 isolate hidden overflow-hidden contain-strict lg:block"
			>
				<div className="absolute inset-0 -top-14 isolate -z-10 bg-[radial-gradient(35%_80%_at_49%_0%,rgba(62,207,142,0.08),transparent)] contain-strict" />
			</div>

			{/* X Bold Faded Borders */}
			<div
				aria-hidden="true"
				className="absolute inset-0 mx-auto hidden min-h-screen w-full max-w-5xl lg:block"
			>
				<div className="mask-y-from-80% mask-y-to-100% absolute inset-y-0 left-0 z-10 h-full w-px bg-[#2e2e2e]/15" />
				<div className="mask-y-from-80% mask-y-to-100% absolute inset-y-0 right-0 z-10 h-full w-px bg-[#2e2e2e]/15" />
			</div>

			{/* main content */}

			<div className="relative flex flex-col items-center justify-center gap-5 pt-32 pb-30">
				{/* X Content Faded Borders */}
				<div
					aria-hidden="true"
					className="absolute inset-0 -z-1 size-full overflow-hidden"
				>
					<div className="absolute inset-y-0 left-4 w-px bg-linear-to-b from-transparent via-[#2e2e2e] to-[#2e2e2e] md:left-8" />
					<div className="absolute inset-y-0 right-4 w-px bg-linear-to-b from-transparent via-[#2e2e2e] to-[#2e2e2e] md:right-8" />
					<div className="absolute inset-y-0 left-8 w-px bg-linear-to-b from-transparent via-[#2e2e2e]/50 to-[#2e2e2e]/50 md:left-12" />
					<div className="absolute inset-y-0 right-8 w-px bg-linear-to-b from-transparent via-[#2e2e2e]/50 to-[#2e2e2e]/50 md:right-12" />
				</div>

				<a
					className={cn(
						"group mx-auto flex w-fit items-center gap-3 rounded-full border bg-[#171717] px-3 py-1 shadow",
						"fade-in slide-in-from-bottom-10 animate-in fill-mode-backwards transition-all delay-500 duration-500 ease-out"
					)}
					href="https://github.com/user-synax/nomadbase-goa"
					target="_blank"
					rel="noopener noreferrer"
				>
					<RocketIcon className="size-3 text-[#898989]" />
					<span className="text-xs text-[#fafafa]">Star on GitHub</span>
					<span className="block h-5 border-l border-[#2e2e2e]" />

					<ArrowRightIcon className="size-3 text-[#3ecf8e] duration-150 ease-out group-hover:translate-x-1" />
				</a>

				<h1
					className={cn(
						"fade-in slide-in-from-bottom-10 animate-in text-balance fill-mode-backwards text-center tracking-tight delay-100 duration-500 ease-out",
						"text-[10vw] leading-[1.1]",
						"md:text-[8vw]",
						"lg:text-[7vw]",
						"xl:text-[6vw]",
						"text-shadow-[0_0px_50px_rgba(62,207,142,0.2)]",
						"text-[#fafafa]",
						"font-normal",
						"font-sans"
					)}
				>
					Work From <br /> <span className="text-[#3ecf8e]">Paradise.</span>
				</h1>

				<p className="fade-in slide-in-from-bottom-10 mx-auto max-w-md animate-in fill-mode-backwards text-center text-base text-[#b4b4b4] tracking-wider delay-200 duration-500 ease-out sm:text-lg md:text-sm">
					The definitive hub for digital nomads in Goa. Find co-working spaces, colivings, and a community that gets it.
				</p>

				<div className="fade-in slide-in-from-bottom-10 flex animate-in flex-row flex-wrap items-center justify-center gap-3 fill-mode-backwards pt-2 delay-300 duration-500 ease-out">
					<Dialog open={isAboutOpen} onOpenChange={setIsAboutOpen}>
						<DialogTrigger asChild>
							<Button className="rounded-full text-gray-900 bg-[#3ecf8e] hover:bg-[#3ecf88]/90 hover:cursor-pointer hover:border-[#3ecf88] hover:ring-2 hover:ring-[#3ecf88] focus:ring-2 focus:ring-[#3ecf88] border border-[#3ecf88]" size="lg" variant="secondary">
								About Us
							</Button>
						</DialogTrigger>
						<DialogContent ref={modalRef} className="max-w-2xl bg-[#171717] border-[#2e2e2e] text-[#fafafa]">
							<DialogHeader>
								<DialogTitle className="text-2xl text-[#3ecf8e]">About NomadBase Goa</DialogTitle>
								<DialogDescription className="text-[#b4b4b4]">
									<div className="space-y-4 text-base">
										<p className="text-[#fafafa]">
											NomadBase Goa is the definitive hub for digital nomads seeking the perfect work-life balance in one of India's most vibrant coastal destinations.
										</p>
										<div className="space-y-2">
											<h3 className="text-lg font-semibold text-[#3ecf8e]">Our Mission</h3>
											<p className="text-[#b4b4b4]">
												To connect digital nomads with the best co-working spaces, colivings, and community events in Goa, creating a thriving ecosystem for remote workers.
											</p>
										</div>
										<div className="space-y-2">
											<h3 className="text-lg font-semibold text-[#3ecf8e]">What We Offer</h3>
											<ul className="space-y-1 text-[#b4b4b4] list-disc list-inside">
												<li>Curated list of co-working spaces with high-speed internet</li>
												<li>Coliving recommendations for budget-friendly stays</li>
												<li>Community events and networking opportunities</li>
												<li>Local guides for cafes, restaurants, and activities</li>
												<li>Visa and legal information for remote workers</li>
											</ul>
										</div>
										<div className="space-y-2">
											<h3 className="text-lg font-semibold text-[#3ecf8e]">Why Goa?</h3>
											<p className="text-[#b4b4b4]">
												Goa offers the perfect blend of work-friendly infrastructure, affordable living costs, beautiful beaches, and a vibrant international community. It's fast becoming one of Asia's top destinations for digital nomads.
											</p>
										</div>
									</div>
								</DialogDescription>
							</DialogHeader>
						</DialogContent>
					</Dialog>
					<Button className="rounded-full text-[#fafafa] border-[#fafafa] bg-[#0f0f0f] hover:border-[#fafafa] hover:bg-[#0f0f0f]/90 hover:ring-2 hover:cursor-pointer hover:ring-[#fafafa] focus:ring-2 focus:ring-[#fafafa]" size="lg">
						<Link href={'/signin'}> Get Started </Link>
						<ArrowRightIcon 
						className="size-4 ms-2 text-[#3ecf8e]" data-icon="inline-end" />
					</Button>
				</div>
			</div>
		</section>
	);
}

export function LogosSection() {
	return (
		<section className="relative space-y-4 border-t border-[#242424] pt-6 pb-10">
			<h2 className="text-center font-medium text-lg text-[#898989] tracking-tight md:text-xl" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
				Trusted by <span className="text-[#fafafa]">digital nomads</span>
			</h2>
			<div className="relative z-10 mx-auto max-w-4xl">
				<LogoCloud logos={logos} />
			</div>
		</section>
	);
}

const logos = [
	{
		icon: Building2,
		alt: "Building",
	},
	{
		icon: Briefcase,
		alt: "Business",
	},
	{
		icon: Globe,
		alt: "Global",
	},
	{
		icon: Star,
		alt: "Star",
	},
	{
		icon: Shield,
		alt: "Security",
	},
	{
		icon: Users,
		alt: "Community",
	},
	{
		icon: Zap,
		alt: "Fast",
	},
	{
		icon: Target,
		alt: "Target",
	},
	{
		icon: Award,
		alt: "Award",
	},
];
