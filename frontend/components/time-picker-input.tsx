"use client"

import type React from "react"

import { Input } from "@/components/ui/input"

interface TimePickerInputProps {
  id?: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function TimePickerInput({ id, value, onChange, disabled, className }: TimePickerInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
  }

  return (
    <Input
      id={id}
      type="time"
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={className}
      step="900" // 15分単位
    />
  )
}
