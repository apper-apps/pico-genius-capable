import React, { useState } from "react"
import Input from "@/components/atoms/Input"
import Button from "@/components/atoms/Button"

const SearchBar = ({ 
  onSearch, 
  placeholder = "Enter keyword...",
  loading = false,
  className = "" 
}) => {
  const [query, setQuery] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim() && onSearch) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-3 ${className}`}>
      <div className="flex-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          icon="Search"
          className="text-lg"
        />
      </div>
      <Button
        type="submit"
        loading={loading}
        disabled={!query.trim() || loading}
        size="large"
        icon="Search"
      >
        Analyze
      </Button>
    </form>
  )
}

export default SearchBar