interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, placeholder = 'Search…' }: Props) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-clay text-lg select-none">⌕</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border-2 border-clay/60 rounded-full bg-warm-white
                   font-body text-sm text-charcoal placeholder:text-earth/50
                   focus:outline-none focus:border-moss focus:ring-2 focus:ring-moss/10
                   transition-all duration-200"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-earth/50 hover:text-earth text-lg"
        >×</button>
      )}
    </div>
  )
}
