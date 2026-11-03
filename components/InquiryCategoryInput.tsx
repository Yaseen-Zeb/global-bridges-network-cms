import { useEffect, useState } from "react";
import { Select, Spinner, Text } from "@sanity/ui";
import { set, unset, useClient, type StringInputProps } from "sanity";

interface Category {
  label: string;
  value: string;
}

/**
 * Dropdown of the Inquiry Categories from Contact & Site Settings, so a service's
 * contact link can preselect one in the contact form. Stores the category value.
 */
export function InquiryCategoryInput({ value, onChange, elementProps }: StringInputProps) {
  const client = useClient({ apiVersion: "2024-01-01" });
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    let active = true;
    client
      .fetch<Category[] | null>(`*[_id == "contactInfo"][0].inquiryCategories[]{ label, value }`)
      .then((result) => active && setCategories(result ?? []))
      .catch(() => active && setCategories([]));
    return () => {
      active = false;
    };
  }, [client]);

  if (categories === null) return <Spinner muted />;
  if (categories.length === 0) {
    return (
      <Text size={1} muted>
        No categories yet. Add them in Contact &amp; Site Settings → Inquiry Categories.
      </Text>
    );
  }

  const missing = value && !categories.some((cat) => cat.value === value);

  return (
    <Select
      {...elementProps}
      value={value ?? ""}
      onChange={(event) => {
        const next = event.currentTarget.value;
        onChange(next ? set(next) : unset());
      }}
    >
      <option value="">First category (default)</option>
      {categories.map((cat) => (
        <option key={cat.value} value={cat.value}>
          {cat.label}
        </option>
      ))}
      {missing && <option value={value}>{value} (no longer in the list)</option>}
    </Select>
  );
}
