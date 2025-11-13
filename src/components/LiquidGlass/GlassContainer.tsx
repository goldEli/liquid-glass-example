import { CSSProperties, forwardRef, useEffect, useId, useState } from "react";
import { GlassFilter } from "./GlassFilter";

/* ---------- container ---------- */
export const GlassContainer = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    className?: string;
    style?: React.CSSProperties;
    displacementScale?: number;
    blurAmount?: number;
    saturation?: number;
    aberrationIntensity?: number;
    mouseOffset?: { x: number; y: number };
    cornerRadius?: number;
    glassSize?: { width: number; height: number };
    onClick?: () => void;
  }>
>(
  (
    {
      children,
      className = "",
      style,
      displacementScale = 25,
      blurAmount = 12,
      saturation = 180,
      aberrationIntensity = 2,
      cornerRadius = 999,
      glassSize = { width: 270, height: 69 },
      onClick,
    },
    ref
  ) => {
    const filterId = useId();
    const [isFirefox, setIsFirefox] = useState(false);

    useEffect(() => {
      // Only check for Firefox in the browser environment
      if (typeof navigator !== "undefined") {
        setIsFirefox(navigator.userAgent.toLowerCase().includes("firefox"));
      }
    }, []);

    const backdropStyle = {
      filter: isFirefox ? null : `url(#${filterId})`,
      backdropFilter: `blur(${4 + blurAmount * 32}px) saturate(${saturation}%)`,
    };

    return (
      <div
        ref={ref}
        className={`relative ${className} ${
          Boolean(onClick) ? "cursor-pointer" : ""
        }`}
        style={style}
        onClick={onClick}
      >
        <GlassFilter
          id={filterId}
          displacementScale={displacementScale}
          aberrationIntensity={aberrationIntensity}
          width={glassSize.width}
          height={glassSize.height}
        />

        <div
          className="glass"
          style={{
            borderRadius: `${cornerRadius}px`,
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            overflow: "hidden",
            transition: "all 0.2s ease-in-out",
            boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* backdrop layer that gets wiggly */}
          <span
            className="glass__warp"
            style={
              {
                ...backdropStyle,
                position: "absolute",
                inset: "0",
              } as CSSProperties
            }
          />

          {/* user content stays sharp */}
          <div
            className="transition-all duration-150 ease-in-out text-white"
            style={{
              position: "relative",
              zIndex: 1,
              font: "500 20px/1 system-ui",
              textShadow: "0px 2px 12px rgba(0, 0, 0, 0.4)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);

GlassContainer.displayName = "GlassContainer";
