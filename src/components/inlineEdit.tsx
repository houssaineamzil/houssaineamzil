"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Fields for the live editor: they look exactly like the text they edit, with
// no input box, so the page being edited is the page visitors see.

/**
 * Plain text edited in place. The DOM node owns the text while you type
 * (React never re-renders its children, which would reset the caret); `value`
 * is only written back when it changes from outside. It is read with
 * `textContent`, not `innerText`: innerText applies CSS such as `uppercase`,
 * which would save "HTTPS://…" instead of what was typed.
 */
export const InlineText: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Allow line breaks (blank line = new paragraph). */
  multiline?: boolean;
  className?: string;
}> = ({ value, onChange, placeholder, multiline, className }) => {
  const ref = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el && el.textContent !== value) el.textContent = value;
  }, [value]);

  return (
    // biome-ignore lint/a11y/useSemanticElements: contentEditable is what lets the text edit in place with no input box
    <span
      ref={ref}
      tabIndex={0}
      // "plaintext-only" keeps pasted formatting and <div>s out of the text.
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      role="textbox"
      aria-label={placeholder}
      data-placeholder={placeholder}
      onInput={(e) => onChange(e.currentTarget.textContent ?? "")}
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      className={cn(
        "cursor-text outline-none empty:before:text-neutral-400 empty:before:content-[attr(data-placeholder)] hover:bg-neutral-100 focus:bg-neutral-100",
        multiline && "block whitespace-pre-wrap",
        className,
      )}
    />
  );
};

/** A dropdown that reads as plain text until you click it. */
export const InlineSelect: React.FC<{
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  placeholder: string;
}> = ({ value, options, onChange, placeholder }) => (
  <select
    value={value}
    aria-label={placeholder}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      "-ml-0.5 cursor-pointer appearance-none bg-transparent uppercase outline-none hover:bg-neutral-100 focus:bg-neutral-100",
      !value && "text-neutral-400",
    )}
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);

/**
 * An image or video slot. Empty, it is a dashed box inviting an upload; filled,
 * `children` (the media) shows with a "Replace image" button in the corner.
 */
export const MediaSlot: React.FC<{
  filled: boolean;
  onFile: (file: File) => void;
  label: string;
  accept?: string;
  className?: string;
  children?: React.ReactNode;
}> = ({
  filled,
  onFile,
  label,
  accept = "image/*,video/*",
  className,
  children,
}) => (
  <label
    className={cn(
      "group/slot relative block cursor-pointer overflow-hidden",
      !filled && "border border-dashed border-neutral-400 bg-neutral-200",
      className,
    )}
  >
    {children}
    {filled ? (
      <>
        <span className="absolute inset-0 z-10 bg-black/20 opacity-0 transition-opacity group-hover/slot:opacity-100" />
        <span className="absolute bottom-2 left-2 z-10 bg-white px-2 py-1 text-[11px] text-black uppercase">
          Replace image
        </span>
      </>
    ) : (
      <span className="absolute inset-0 z-10 flex items-center justify-center text-[11px] text-neutral-500 uppercase">
        {label}
      </span>
    )}
    <input
      type="file"
      accept={accept}
      className="sr-only"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) onFile(file);
        e.target.value = "";
      }}
    />
  </label>
);
