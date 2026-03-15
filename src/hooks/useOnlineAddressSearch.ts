import * as React from "react";

export type LocationField = "country" | "state" | "city" | "suburb";

type NominatimAddress = {
  country?: string;
  state?: string;
  region?: string;
  county?: string;
  state_district?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  city_district?: string;
  hamlet?: string;
};

type NominatimResult = {
  place_id: number;
  display_name: string;
  address?: NominatimAddress;
};

type PhotonFeature = {
  properties?: {
    osm_id?: number;
    country?: string;
    state?: string;
    city?: string;
    district?: string;
    county?: string;
    suburb?: string;
    name?: string;
  };
};

type PhotonResponse = {
  features?: PhotonFeature[];
};

export type LocationSuggestion = {
  value: string;
  label: string;
  result: NominatimResult;
};

type AddressKeyMap<TForm> = {
  country: keyof TForm;
  state: keyof TForm;
  city: keyof TForm;
  suburb?: keyof TForm;
};

type UseOnlineAddressSearchArgs<TForm extends object> = {
  form: TForm;
  setForm: React.Dispatch<React.SetStateAction<TForm>>;
  keyMap: AddressKeyMap<TForm>;
};

const LOCATION_API_URL = "https://photon.komoot.io/api";

const getAddressState = (address?: NominatimAddress) =>
  address?.state || address?.region || address?.state_district || address?.county || "";
const getAddressCity = (address?: NominatimAddress) =>
  address?.city || address?.town || address?.village || address?.municipality || "";
const getAddressSuburb = (address?: NominatimAddress) =>
  address?.suburb || address?.neighbourhood || address?.quarter || address?.city_district || address?.hamlet || "";

const normalizePhotonFeature = (feature: PhotonFeature, index: number): LocationSuggestion | null => {
  const properties = feature.properties;
  if (!properties) return null;

  const country = properties.country?.trim() ?? "";
  const state = properties.state?.trim() ?? properties.county?.trim() ?? "";
  const city = properties.city?.trim() ?? properties.district?.trim() ?? "";
  const suburb = properties.suburb?.trim() ?? "";
  const label = [properties.name, city, state, country].filter(Boolean).join(", ");

  if (!label && !country && !state && !city && !suburb) {
    return null;
  }

  return {
    value: String(properties.osm_id ?? index),
    label: label || country || state || city || suburb,
    result: {
      place_id: Number(properties.osm_id ?? index),
      display_name: label || country || state || city || suburb,
      address: {
        country: country || undefined,
        state: state || undefined,
        city: city || undefined,
        suburb: suburb || undefined,
      },
    },
  };
};

export function useOnlineAddressSearch<TForm extends object>({
  form,
  setForm,
  keyMap,
}: UseOnlineAddressSearchArgs<TForm>) {
  const [errors, setErrors] = React.useState<Record<LocationField, string>>({
    country: "",
    state: "",
    city: "",
    suburb: "",
  });
  const [loading, setLoading] = React.useState<Record<LocationField, boolean>>({
    country: false,
    state: false,
    city: false,
    suburb: false,
  });
  const [suggestions, setSuggestions] = React.useState<Record<LocationField, LocationSuggestion[]>>({
    country: [],
    state: [],
    city: [],
    suburb: [],
  });
  const abortRef = React.useRef<Record<LocationField, AbortController | null>>({
    country: null,
    state: null,
    city: null,
    suburb: null,
  });

  React.useEffect(() => {
    const controllers = abortRef.current;
    return () => {
      (Object.keys(controllers) as LocationField[]).forEach((field) => controllers[field]?.abort());
    };
  }, []);

  const applyResult = React.useCallback(
    (field: LocationField, result: NominatimResult, fallbackValue = "") => {
      const address = result.address;
      if (!address) return;

      const nextCountry = address.country ?? "";
      const nextState = getAddressState(address);
      const nextCity = getAddressCity(address);
      const nextSuburb = getAddressSuburb(address);

      setForm((prev) => {
        const next = { ...prev };
        next[keyMap.country] = (field === "country" ? nextCountry || fallbackValue : nextCountry || prev[keyMap.country]) as TForm[keyof TForm];
        next[keyMap.state] = (field === "country" ? "" : field === "state" ? nextState || fallbackValue : nextState || prev[keyMap.state]) as TForm[keyof TForm];
        next[keyMap.city] = (field === "country" || field === "state" ? "" : nextCity || (field === "city" ? fallbackValue : prev[keyMap.city])) as TForm[keyof TForm];

        if (keyMap.suburb) {
          next[keyMap.suburb] = (
            field === "country" || field === "state" || field === "city"
              ? ""
              : nextSuburb || fallbackValue || prev[keyMap.suburb]
          ) as TForm[keyof TForm];
        }

        return next;
      });
    },
    [keyMap, setForm]
  );

  const fetchSuggestions = React.useCallback(
    async (field: LocationField, rawValue: string): Promise<LocationSuggestion[]> => {
      const trimmedValue = rawValue.trim();
      if (!trimmedValue) {
        setSuggestions((prev) => ({ ...prev, [field]: [] }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
        return [];
      }

      abortRef.current[field]?.abort();
      const controller = new AbortController();
      abortRef.current[field] = controller;
      setErrors((prev) => ({ ...prev, [field]: "" }));
      setLoading((prev) => ({ ...prev, [field]: true }));

      const getString = (key: keyof TForm) => String(form[key] ?? "").trim();
      const queryParts =
        field === "country"
          ? [trimmedValue]
          : field === "state"
            ? [trimmedValue, getString(keyMap.country)]
            : field === "city"
              ? [trimmedValue, getString(keyMap.state), getString(keyMap.country)]
              : [trimmedValue, getString(keyMap.city), getString(keyMap.state), getString(keyMap.country)];

      try {
        const params = new URLSearchParams({
          q: queryParts.filter(Boolean).join(", "),
          limit: "8",
        });

        const response = await fetch(`${LOCATION_API_URL}?${params.toString()}`, {
          method: "GET",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Location lookup failed with status ${response.status}`);
        }

        const payload = (await response.json()) as PhotonResponse;
        const extracted = (payload.features ?? [])
          .map(normalizePhotonFeature)
          .filter((item): item is LocationSuggestion => Boolean(item));

        const filtered = extracted.filter((suggestion) => {
          const address = suggestion.result.address;
          if (!address) return false;
          if (field === "country") return Boolean(address.country);
          if (field === "state") return Boolean(getAddressState(address));
          if (field === "city") return Boolean(getAddressCity(address));
          return Boolean(getAddressSuburb(address));
        });

        const nextSuggestions = filtered.map((suggestion) => ({
          value: suggestion.value,
          label:
            field === "country"
              ? suggestion.result.address?.country || suggestion.result.display_name
              : suggestion.label,
          result: suggestion.result,
        }));

        setSuggestions((prev) => ({ ...prev, [field]: nextSuggestions }));
        return nextSuggestions;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return [];
        }
        setSuggestions((prev) => ({ ...prev, [field]: [] }));
        setErrors((prev) => ({ ...prev, [field]: "Unable to load online data." }));
        return [];
      } finally {
        setLoading((prev) => ({ ...prev, [field]: false }));
        if (abortRef.current[field] === controller) {
          abortRef.current[field] = null;
        }
      }
    },
    [form, keyMap, setForm]
  );

  const handleInputChange = React.useCallback(
    (field: LocationField) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setForm((prev) => {
        const next = { ...prev };
        if (!value) {
          if (field === "country") {
            next[keyMap.country] = "" as TForm[keyof TForm];
            next[keyMap.state] = "" as TForm[keyof TForm];
            next[keyMap.city] = "" as TForm[keyof TForm];
            if (keyMap.suburb) next[keyMap.suburb] = "" as TForm[keyof TForm];
            return next;
          }
          if (field === "state") {
            next[keyMap.state] = "" as TForm[keyof TForm];
            next[keyMap.city] = "" as TForm[keyof TForm];
            if (keyMap.suburb) next[keyMap.suburb] = "" as TForm[keyof TForm];
            return next;
          }
          if (field === "city") {
            next[keyMap.city] = "" as TForm[keyof TForm];
            if (keyMap.suburb) next[keyMap.suburb] = "" as TForm[keyof TForm];
            return next;
          }
          if (keyMap.suburb) next[keyMap.suburb] = "" as TForm[keyof TForm];
          return next;
        }

        const targetKey =
          field === "country" ? keyMap.country : field === "state" ? keyMap.state : field === "city" ? keyMap.city : keyMap.suburb;
        if (targetKey) {
          next[targetKey] = value as TForm[keyof TForm];
        }
        return next;
      });

      setErrors((prev) => ({ ...prev, [field]: "" }));

      if (!value.trim()) {
        abortRef.current[field]?.abort();
        setLoading((prev) => ({ ...prev, [field]: false }));
        setSuggestions((prev) => ({ ...prev, [field]: [] }));
        return;
      }

      void fetchSuggestions(field, value);
    },
    [fetchSuggestions, keyMap, setForm]
  );

  const handleSearch = React.useCallback(
    (field: LocationField) => async (rawValue: string) => {
      const nextSuggestions = await fetchSuggestions(field, rawValue);
      const firstSuggestion = nextSuggestions[0];
      if (firstSuggestion) {
        applyResult(field, firstSuggestion.result, rawValue.trim());
      }
    },
    [applyResult, fetchSuggestions]
  );

  const handleSuggestionSelect = React.useCallback(
    (field: LocationField) => (value: string) => {
      const selected = suggestions[field].find((suggestion) => suggestion.value === value);
      if (!selected) return;
      setErrors((prev) => ({ ...prev, [field]: "" }));
      applyResult(field, selected.result);
    },
    [applyResult, suggestions]
  );

  return {
    errors,
    loading,
    suggestions,
    handleInputChange,
    handleSearch,
    handleSuggestionSelect,
  };
}

