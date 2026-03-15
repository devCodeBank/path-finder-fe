import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, X } from "lucide-react";

type FloatingLabelInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  required?: boolean;
  floatLabel?: boolean;
};

const baseInputClass =
  "h-[36px] w-full rounded-[4px] border border-[#CCCCCC80] bg-white px-3 text-[13px] text-[#333333] hover:border-[#666666] focus:border-[#333333] focus:outline-none disabled:text-[#333333] disabled:border-[#DDDDDD] disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-[#EAEAEA]/25";

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ id, label, required, floatLabel: _floatLabel, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-[13px] font-medium text-[#333333]/70 pointer-events-none">
            {label}
            {required && <span className="text-[#333333]/70"> *</span>}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(baseInputClass, className)}
          {...props}
        />
      </div>
    );
  }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

export interface SelectProps {
  label?: string;
  options: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  maxVisibleOptions?: number;
  floatLabel?: boolean;
  hideChevron?: boolean;
}

export interface FloatingLabelSelectHandle {
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export interface SearchableSelectProps extends SelectProps {
  searchPlaceholder?: string;
  noOptionsText?: string;
  clearAriaLabel?: string;
}

type SearchCommitInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onSearch"> & {
  label?: string;
  required?: boolean;
  clearAriaLabel?: string;
  onSearch?: (value: string) => void;
  errorMessage?: string;
  isLoading?: boolean;
  suggestions?: { value: string; label: string }[];
  noOptionsText?: string;
  onSuggestionSelect?: (value: string) => void;
};

const FloatingLabelSelect = React.forwardRef<FloatingLabelSelectHandle, SelectProps>(({
  label,
  options,
  id,
  value,
  onValueChange,
  disabled,
  placeholder,
  className,
  required,
  hideChevron = false,
}: SelectProps, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({});
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLUListElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  React.useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDropdownStyle({
        position: "fixed",
        left: rect.left,
        top: rect.bottom + 4,
        width: rect.width,
        zIndex: 2400,
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption?.label ?? "";
  const openDropdown = () => {
    if (disabled) return;
    setIsOpen(true);
  };
  const closeDropdown = () => setIsOpen(false);
  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  React.useImperativeHandle(ref, () => ({
    open: openDropdown,
    close: closeDropdown,
    toggle: toggleDropdown,
  }));

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-[#333333]/70 pointer-events-none">
          {label}
          {required && <span className="text-[#333333]/70"> *</span>}
        </label>
      )}
      <div className="relative" ref={wrapperRef}>
        <button
          id={id}
          type="button"
          ref={triggerRef}
          className={cn(
            baseInputClass,
            "flex items-center justify-between text-left",
            hideChevron ? "pr-3" : "pr-8",
            disabled && "cursor-not-allowed",
            className
          )}
          onClick={() => {
            toggleDropdown();
          }}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={cn(!displayValue && placeholder ? "text-[#9E9E9E]" : "")}>
            {displayValue || placeholder || ""}
          </span>
        </button>
        {!hideChevron && (
          <ChevronDown
            className={cn(
              "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]",
              disabled && "text-[#9E9E9E]"
            )}
          />
        )}
        {isOpen && !disabled && typeof document !== "undefined" &&
          createPortal(
            <ul
              ref={listRef}
              role="listbox"
              style={dropdownStyle}
              className="max-h-56 overflow-y-auto rounded-[4px] border border-[#CCCCCC80] bg-white py-1 text-[13px] text-[#333333] shadow-[0px_6px_16px_0px_#0000001A]"
            >
              {placeholder && (
                <li
                  role="option"
                  aria-selected={!value}
                  className={cn(
                    "cursor-pointer px-3 py-2 text-[#9E9E9E] hover:bg-[#F3F4F6]",
                    !value && "bg-[#F3F4F6]"
                  )}
                  onClick={() => {
                    onValueChange?.("");
                    setIsOpen(false);
                  }}
                >
                  {placeholder}
                </li>
              )}
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "cursor-pointer px-3 py-2 hover:bg-[#F3F4F6]",
                      isSelected && "bg-[#F3F4F6]"
                    )}
                    onClick={() => {
                      onValueChange?.(option.value);
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </li>
                );
              })}
            </ul>,
            document.body
          )}
      </div>
    </div>
  );
});

FloatingLabelSelect.displayName = "FloatingLabelSelect";

const SearchableFloatingLabelSelect = React.forwardRef<FloatingLabelSelectHandle, SearchableSelectProps>(({
  label,
  options,
  id,
  value,
  onValueChange,
  disabled,
  placeholder,
  className,
  required,
  hideChevron = false,
  searchPlaceholder = "Search...",
  noOptionsText = "No options found",
  clearAriaLabel = "Clear selected option",
}: SearchableSelectProps, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({});
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const searchRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (wrapperRef.current?.contains(target)) return;
      if (listRef.current?.contains(target)) return;
      setIsOpen(false);
      setSearchTerm("");
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  React.useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDropdownStyle({
        position: "fixed",
        left: rect.left,
        top: rect.bottom + 4,
        width: rect.width,
        zIndex: 2400,
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => searchRef.current?.focus());
  }, [isOpen]);

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption?.label ?? "";
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredOptions = normalizedSearch
    ? options.filter((option) => option.label.toLowerCase().includes(normalizedSearch))
    : options;

  const openDropdown = () => {
    if (disabled) return;
    setIsOpen(true);
  };
  const closeDropdown = () => {
    setIsOpen(false);
    setSearchTerm("");
  };
  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      if (prev) {
        setSearchTerm("");
      }
      return !prev;
    });
  };

  React.useImperativeHandle(ref, () => ({
    open: openDropdown,
    close: closeDropdown,
    toggle: toggleDropdown,
  }));

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-[#333333]/70 pointer-events-none">
          {label}
          {required && <span className="text-[#333333]/70"> *</span>}
        </label>
      )}
      <div className="relative" ref={wrapperRef}>
        <button
          id={id}
          type="button"
          ref={triggerRef}
          className={cn(
            baseInputClass,
            "flex items-center justify-between text-left",
            hideChevron ? "pr-3" : value ? "pr-8" : "pr-8",
            disabled && "cursor-not-allowed",
            className
          )}
          onClick={toggleDropdown}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className={cn(!displayValue && placeholder ? "text-[#9E9E9E]" : "")}>
            {displayValue || placeholder || ""}
          </span>
        </button>

        {value && !disabled && (
          <button
            type="button"
            aria-label={clearAriaLabel}
            className="absolute right-8 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
            onClick={(event) => {
              event.stopPropagation();
              onValueChange?.("");
              setSearchTerm("");
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {!hideChevron && (
          <ChevronDown
            className={cn(
              "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666666]",
              disabled && "text-[#9E9E9E]"
            )}
          />
        )}

        {isOpen && !disabled && typeof document !== "undefined" &&
          createPortal(
            <div
              ref={listRef}
              style={dropdownStyle}
              className="overflow-hidden rounded-[4px] border border-[#CCCCCC80] bg-white text-[13px] text-[#333333] shadow-[0px_6px_16px_0px_#0000001A]"
            >
              <div className="border-b border-[#EEEEEE] p-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      const nextOption = filteredOptions[0];
                      if (!nextOption) return;
                      onValueChange?.(nextOption.value);
                      closeDropdown();
                    }}
                    placeholder={searchPlaceholder}
                    className="h-[34px] w-full rounded-[4px] border border-[#CCCCCC80] bg-white pl-9 pr-3 text-[13px] text-[#333333] outline-none focus:border-[#333333]"
                  />
                </div>
              </div>
              <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
                {placeholder && (
                  <li
                    role="option"
                    aria-selected={!value}
                    className={cn(
                      "cursor-pointer px-3 py-2 text-[#9E9E9E] hover:bg-[#F3F4F6]",
                      !value && !searchTerm && "bg-[#F3F4F6]"
                    )}
                    onClick={() => {
                      onValueChange?.("");
                      closeDropdown();
                    }}
                  >
                    {placeholder}
                  </li>
                )}
                {filteredOptions.length === 0 && (
                  <li className="px-3 py-2 text-[#9E9E9E]">{noOptionsText}</li>
                )}
                {filteredOptions.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        "cursor-pointer px-3 py-2 hover:bg-[#F3F4F6]",
                        isSelected && "bg-[#F3F4F6]"
                      )}
                      onClick={() => {
                        onValueChange?.(option.value);
                        closeDropdown();
                      }}
                    >
                      {option.label}
                    </li>
                  );
                })}
              </ul>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
});

SearchableFloatingLabelSelect.displayName = "SearchableFloatingLabelSelect";

const SearchCommitFloatingLabelInput = React.forwardRef<HTMLInputElement, SearchCommitInputProps>(
  (
    {
      id,
      label,
      required,
      className,
      clearAriaLabel = "Clear input",
      onSearch,
      errorMessage,
      isLoading = false,
      suggestions = [],
      noOptionsText = "No Results Found",
      onSuggestionSelect,
      value,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasValue = typeof value === "string" ? value.length > 0 : Boolean(value);
    const [isOpen, setIsOpen] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      if (!isOpen) return;
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (wrapperRef.current?.contains(target)) return;
        setIsOpen(false);
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-[13px] font-medium text-[#333333]/70 pointer-events-none">
            {label}
            {required && <span className="text-[#333333]/70"> *</span>}
          </label>
        )}
        <div className="relative" ref={wrapperRef}>
          <input
            ref={ref}
            id={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={() => setIsOpen(true)}
            onKeyDown={(event) => {
              props.onKeyDown?.(event);
              if (event.defaultPrevented || event.key !== "Enter") return;
              event.preventDefault();
              if (suggestions[0]) {
                onSuggestionSelect?.(suggestions[0].value);
                setIsOpen(false);
                return;
              }
              onSearch?.(String(value ?? "").trim());
            }}
            className={cn(baseInputClass, "pl-9", hasValue ? "pr-9" : "", className)}
            {...props}
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666666]" />
          {hasValue && !disabled && !isLoading && (
            <button
              type="button"
              aria-label={clearAriaLabel}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
              onClick={() => {
                onChange?.({
                  target: { value: "" },
                } as React.ChangeEvent<HTMLInputElement>);
                setIsOpen(true);
              }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {isLoading && (
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-[#666666]">
              Loading...
            </span>
          )}
          {isOpen && !disabled && (
            <div className="absolute left-0 top-[calc(100%+2px)] z-[2400] max-h-64 w-full overflow-y-auto rounded-[4px] border border-[#CCCCCC80] bg-white py-1 text-[13px] text-[#333333] shadow-[0px_6px_16px_0px_#0000001A]">
              {isLoading ? (
                <div className="px-3 py-2 text-[#666666]">Loading...</div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <button
                    key={suggestion.value}
                    type="button"
                    className="block w-full px-3 py-2 text-left hover:bg-[#F3F4F6]"
                    onClick={() => {
                      onSuggestionSelect?.(suggestion.value);
                      setIsOpen(false);
                    }}
                  >
                    {suggestion.label}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-[#333333]">{noOptionsText}</div>
              )}
            </div>
          )}
        </div>

      </div>
    );
  }
);

SearchCommitFloatingLabelInput.displayName = "SearchCommitFloatingLabelInput";

export { FloatingLabelInput, FloatingLabelSelect, SearchableFloatingLabelSelect, SearchCommitFloatingLabelInput };
