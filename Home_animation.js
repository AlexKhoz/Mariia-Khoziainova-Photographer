const commonTextStyle = {
    fontFamily: "Inter, sans-serif",
    fontSize,
    fontWeight,
    lineHeight: 1.1,
    margin: 0,
    WebkitTransition: "all 0.3s ease", // Safari transition
    transition: "all 0.3s ease",
    WebkitTransform: "translateZ(0)", // Force GPU acceleration
    transform: "translateZ(0)",
    WebkitBackfaceVisibility: "hidden", // Prevent flickering
    WebkitPerspective: "1000", // Better 3D rendering
}

const paragraphStyle = {
    ...commonTextStyle,
    color: isHovered ? "rgba(0,0,0,1)" : "#000",
    WebkitTransition: "color 0.3s ease", // Safari transition
    transition: "color 0.3s ease",
}

            {/* Fullscreen dark overlay */}
            <div
                style={{
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(0,0,0,1)",
                    zIndex: 999,
                    opacity: !isMobile && isHovered ? 1 : 0,
                    pointerEvents: !isMobile && isHovered ? "auto" : "none",
                    WebkitTransition: !isMobile ? "opacity 0.3s ease" : "none", // Safari transition
                    transition: !isMobile ? "opacity 0.3s ease" : "none",
                    WebkitTransform: "translateZ(0)", // Force GPU acceleration
                    transform: "translateZ(0)",
                    WebkitBackfaceVisibility: "hidden", // Prevent flickering
                    WebkitPerspective: "1000", // Better 3D rendering
                }}
            />

            {/* Content wrapper */}
            <div
                style={{
                    position: "relative",
                    zIndex: 1000,
                    ...commonTextStyle,
                    maxWidth: "100%",
                    WebkitOverflowScrolling: "touch", // Smooth scrolling in Safari
                }}
            > 