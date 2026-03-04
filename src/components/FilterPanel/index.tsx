import type { BodyRegion } from '../../types'

interface Props {
  activeRegion: BodyRegion | 'All'
  onRegionChange: (region: BodyRegion | 'All') => void
}

const regions: (BodyRegion | 'All')[] = ['All', 'Upper Body', 'Core & Spine', 'Lower Body']

const regionEmoji: Record<string, string> = {
  'All': '✦',
  'Upper Body': '💪',
  'Core & Spine': '🌀',
  'Lower Body': '🦵',
}

export default function FilterPanel({ activeRegion, onRegionChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {regions.map(region => (
        <button
          key={region}
          onClick={() => onRegionChange(region)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all duration-150 ${
            activeRegion === region
              ? 'border-moss bg-moss/10 text-moss font-medium'
              : 'border-sand bg-warm-white text-charcoal hover:border-clay hover:bg-sand'
          }`}
        >
          <span>{regionEmoji[region]}</span>
          {region}
        </button>
      ))}
    </div>
  )
}
