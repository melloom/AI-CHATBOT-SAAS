"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ChevronDown, Building2 } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface Company {
  name: string
  domain?: string
  logo?: string
}

interface CompanyAutocompleteProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  label?: string
  required?: boolean
  className?: string
}

export function CompanyAutocomplete({
  value,
  onValueChange,
  placeholder = "Search for your company...",
  label = "Company Name",
  required = false,
  className
}: CompanyAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const searchCompanies = async (query: string) => {
    if (!query || query.length < 2) {
      setCompanies([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setCompanies(data)
      } else {
        console.error('Failed to fetch companies:', response.statusText)
        // Don't show error to user, just allow manual input
        setCompanies([])
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
      // Don't show error to user, just allow manual input
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Debounce the search
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      searchCompanies(searchTerm)
    }, 300)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchTerm])

  const handleSelect = (company: Company) => {
    onValueChange(company.name)
    setSearchTerm(company.name)
    setOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    onValueChange(newValue)
  }

  return (
    <div className={cn("space-y-2", className || "")}>
      <Label htmlFor="company-autocomplete">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              id="company-autocomplete"
              placeholder={placeholder}
              value={value}
              onChange={handleInputChange}
              onFocus={() => setOpen(true)}
              className="w-full pr-8"
              required={required}
            />
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search companies..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>
                {loading ? "Searching..." : "No companies found. You can type your own company name."}
              </CommandEmpty>
              <CommandGroup>
                {companies.map((company, index) => (
                  <CommandItem
                    key={`${company.name}-${index}`}
                    value={company.name}
                    onSelect={() => handleSelect(company)}
                    className="flex items-center space-x-2"
                  >
                    {company.logo && (
                      <img
                        src={company.logo}
                        alt={`${company.name} logo`}
                        className="h-4 w-4 rounded"
                      />
                    )}
                    <span className="flex-1">{company.name}</span>
                    {company.domain && (
                      <span className="text-xs text-muted-foreground">
                        {company.domain}
                      </span>
                    )}
                    {value === company.name && (
                      <Check className="h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
} 