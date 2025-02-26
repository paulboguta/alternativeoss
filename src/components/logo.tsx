import { OptimizedImage } from "@/components/ui/optimized-image";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div 
      className={cn("relative w-[60px] h-[24px]", className)}
    >
      
      <div 
        className="absolute top-1 -left-3 w-full h-full"
      >
        <OptimizedImage 
          src="/vector-1.svg" 
          alt="Logo part 1" 
          width={37} 
          height={29} 
          className="w-full h-full"
          isIcon
        />
      </div>
      
      
      <div 
        className={cn(
          "absolute top-1 -left-3 w-full h-full transition-all duration-300 ease-out",
          "transform translate-x-[2.5px] -translate-y-[3.8px] group-hover:translate-x-[3.4px] group-hover:-translate-y-[5.1px]"
        )}
      >
        <OptimizedImage 
          src="/vector-2.svg" 
          alt="Logo part 2" 
          width={37} 
          height={29} 
          className="w-full h-full"
          isIcon
        />
      </div>
      
      
      <div 
        className={cn(
          "absolute top-1 -left-3 w-full h-full transition-all duration-300 ease-out",
          "transform translate-x-[5.0px] -translate-y-[7.6px] group-hover:translate-x-[6.8px] group-hover:-translate-y-[10.2px]"
        )}
      >
        <OptimizedImage 
          src="/vector-3.svg" 
          alt="Logo part 3" 
          width={37} 
          height={29} 
          className="w-full h-full"
          isIcon
        />
      </div>
      
      
      <div 
        className={cn(
          "absolute top-1 -left-3 w-full h-full transition-all duration-300 ease-out",
          "transform translate-x-[7.5px] -translate-y-[11.4px] group-hover:translate-x-[10.2px] group-hover:-translate-y-[15.3px]"
        )}
      >
        <OptimizedImage 
          src="/vector-4.svg" 
          alt="Logo part 4" 
          width={37} 
          height={29} 
          className="w-full h-full"
          isIcon
        />
      </div>
    </div>
  );
}
