import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

type Logo = {
  src?: string;
  icon?: React.ComponentType<{ className?: string }>;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div"> & {
  logos: Logo[];
};

export function LogoCloud({ className, logos, ...props }: LogoCloudProps) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black,transparent)]",
        className
      )}
    >
      <InfiniteSlider gap={42} reverse duration={80} durationOnHover={25}>
        {logos.map((logo, index) => {
          if (logo.icon) {
            const IconComponent = logo.icon;
            return (
              <div
                key={`logo-${index}`}
                className="pointer-events-none flex items-center justify-center h-4 md:h-5 text-[#898989]"
              >
                <IconComponent className="h-4 md:h-5 w-auto" />
              </div>
            );
          }
          return (
            <img
              alt={logo.alt}
              className="pointer-events-none h-4 select-none md:h-5 dark:brightness-0 dark:invert"
              height={logo.height || "auto"}
              key={`logo-${logo.alt}`}
              loading="lazy"
              src={logo.src}
              width={logo.width || "auto"}
            />
          );
        })}
      </InfiniteSlider>
    </div>
  );
}
