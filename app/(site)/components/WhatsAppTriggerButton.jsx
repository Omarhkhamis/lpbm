"use client";

const resolveTarget = (target) => {
  const normalized = String(target || "").trim();
  return normalized || "_blank";
};

export default function WhatsAppTriggerButton({
  href,
  target = "_blank",
  trackingName,
  type = "button",
  className = "",
  children,
  disabled = false,
  onClick,
  ...props
}) {
  const link = String(href || "").trim();
  const hasLink = link && link !== "#";
  const isDisabled = disabled || !hasLink;
  const resolvedTarget = resolveTarget(target);
  const source = String(trackingName || props["data-whatsapp-source"] || "").trim();

  const handleClick = (event) => {
    onClick?.(event);
    if (event.defaultPrevented || isDisabled) return;

    if (resolvedTarget === "_self") {
      window.location.assign(link);
      return;
    }

    window.open(link, resolvedTarget, "noopener,noreferrer");
  };

  return (
    <button
      {...props}
      type={type}
      className={className}
      disabled={isDisabled}
      data-whatsapp-modal="skip"
      data-whatsapp-href={isDisabled ? undefined : link}
      data-whatsapp-target={isDisabled ? undefined : resolvedTarget}
      data-whatsapp-source={isDisabled || !source ? undefined : source}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
