import React from 'react';

export default function SearchBar({ value, onChange, placeholder, style }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={style}
    />
  );
}
