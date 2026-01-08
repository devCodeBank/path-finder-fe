import { TextInput, type TextInputProps } from "@components/input/textInput";
import { Autocomplete, styled } from "@mui/material";
import type { AutocompleteInputChangeReason, AutocompleteProps } from "@mui/material/Autocomplete";
import React, { useMemo, useState } from "react";

export interface AutoCompleteProps<TOption> {
  /** Label for the input field */
  label: string;
  /** Options to display */
  options: TOption[];
  /** How to derive the display label from an option */
  getOptionLabel: (option: TOption) => string;
  /** Called when the selection changes */
  onChange: (event: unknown, value: TOption[]) => void;
  /** Equality check between option and selected value */
  isOptionEqualToValue?: (option: TOption, value: TOption) => boolean;
  /** Custom option renderer */
  renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: TOption) => React.ReactNode;
  /** Whether multiple selection is enabled. Defaults to true */
  multiple?: boolean;
  /** Placeholder text to show when no options */
  noOptionsText?: React.ReactNode;
  /** Show popup on focus. Defaults to false */
  openOnFocus?: boolean;
  /** Custom filter options function. Defaults to case-insensitive contains on getOptionLabel */
  filterOptions?: (options: TOption[], state: { inputValue: string }) => TOption[];
  /** Additional props forwarded to MUI Autocomplete */
  autocompleteProps?: Omit<AutocompleteProps<TOption, boolean | undefined, false, false>, "renderInput">;
  /** Placeholder text to show when no options */
  placeholder?: string;
}

const StyledAutocomplete = styled(Autocomplete)`
  .MuiAutocomplete-root {
    & .MuiAutocomplete-inputRoot {
      padding-top: 0;
      padding-bottom: 0;
    }
  }
`;

export function AutoComplete<TOption>(props: AutoCompleteProps<TOption>) {
  const {
    label,
    options,
    getOptionLabel,
    onChange,
    isOptionEqualToValue,
    renderOption,
    multiple = true,
    noOptionsText = "",
    openOnFocus = false,
    filterOptions,
    autocompleteProps,
    placeholder,
  } = props;

  const [open, setOpen] = useState(false);

  const computedFilterOptions = useMemo(() => {
    if (filterOptions) return filterOptions;
    return (opts: TOption[], { inputValue }: { inputValue: string }) =>
      opts.filter((opt) => getOptionLabel(opt).toLowerCase().includes(inputValue.toLowerCase()));
  }, [filterOptions, getOptionLabel]);

  const handleInputChange = (_event: React.SyntheticEvent<Element, Event>, value: string, reason: AutocompleteInputChangeReason) => {
    if (reason === "input") {
      const hasMatches = value.trim().length > 0 && options.some((o) => getOptionLabel(o).toLowerCase().includes(value.toLowerCase()));
      setOpen(hasMatches);
    } else if (reason === "clear" || value.trim() === "") {
      setOpen(false);
    }
    if (autocompleteProps && typeof autocompleteProps.onInputChange === "function") {
      autocompleteProps.onInputChange(_event, value, reason);
    }
  };

  const handleAutocompleteKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const isBackspace = event.key === "Backspace";
    const inputElement = event.currentTarget.querySelector("input") as HTMLInputElement | null;
    const isInputEmpty = !inputElement?.value;

    if (isBackspace && isInputEmpty) {
      event.stopPropagation();
    }
  };

  return (
    <StyledAutocomplete
      multiple={multiple}
      options={options}
      getOptionLabel={getOptionLabel as (option: unknown) => string}
      filterSelectedOptions
      onChange={onChange as unknown as (event: unknown, value: unknown) => void}
      clearIcon={null}
      popupIcon={null}
      noOptionsText={noOptionsText}
      openOnFocus={openOnFocus}
      open={open}
      filterOptions={computedFilterOptions as unknown as typeof computedFilterOptions}
      isOptionEqualToValue={isOptionEqualToValue as unknown as (option: unknown, value: unknown) => boolean}
      onInputChange={handleInputChange}
      renderInput={(params: TextInputProps) => (
        <TextInput
          {...params}
          label={label}
          onKeyDown={handleAutocompleteKeyDown}
          placeholder={placeholder}
          sx={{
            "& .MuiInputBase-root": {
              paddingTop: 0,
              paddingBottom: 0,
            },
          }}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: null,
            },
            inputLabel: { shrink: true },
          }}
        />
      )}
      renderOption={renderOption as unknown as typeof renderOption}
      {...autocompleteProps}
    />
  );
}

export default AutoComplete;
