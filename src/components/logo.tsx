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
      {/* Vector 1 - Base vector, stays in place */}
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
      
      {/* Vector 2 - Extends at 50° angle (60° - 10° to the left) */}
      <div 
        className={cn(
          "absolute top-1 -left-3 w-full h-full transition-all duration-300 ease-out",
          "transform translate-x-[3.5px] -translate-y-[3.0px] group-hover:translate-x-[4.7px] group-hover:-translate-y-[4.0px]"
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
      
      {/* Vector 3 - Extends at 50° angle (60° - 10° to the left) */}
      <div 
        className={cn(
          "absolute top-1 -left-3 w-full h-full transition-all duration-300 ease-out",
          "transform translate-x-[7.0px] -translate-y-[5.9px] group-hover:translate-x-[9.6px] group-hover:-translate-y-[8.0px]"
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
      
      {/* Vector 4 - Extends at 50° angle (60° - 10° to the left) */}
      <div 
        className={cn(
          "absolute top-1 -left-3 w-full h-full transition-all duration-300 ease-out",
          "transform translate-x-[10.6px] -translate-y-[8.9px] group-hover:translate-x-[14.3px] group-hover:-translate-y-[12.0px]"
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
