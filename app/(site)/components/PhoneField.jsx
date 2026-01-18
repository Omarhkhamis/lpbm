"use client";

import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export default function PhoneField({
  value,
  onChange,
  placeholder,
  inputClassName,
  name = "phone",
  defaultCountry = "tr",
  variant = "light",
  autoComplete = "tel",
  onInput
}) {
  const variantClass =
    variant === "dark" ? "phone-field--dark" : "phone-field--light";

  return (
    <PhoneInput
      defaultCountry={defaultCountry}
      value={value}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={`phone-field ${variantClass}`}
      inputClassName={inputClassName}
      inputProps={{ onInput }}
    />
  );
}
