"use client";

import { useState } from "react";
import { IconLink } from "./icons";

/** Copies the calendar feed address, for Outlook and anything without a one-tap link. */
export default function CopyLink({ url, className }: { url: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("Copy the calendar link:", url);
    }
  };

  return (
    <button type="button" className={className} onClick={copy}>
      <IconLink />
      <span aria-live="polite">{copied ? "Link copied" : "Copy feed link"}</span>
    </button>
  );
}
