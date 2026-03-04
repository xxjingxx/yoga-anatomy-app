import type { Muscle } from '../../types'

interface Props {
  muscle: Muscle
  onClick: (muscle: Muscle) => void
  isActive?: boolean
}

const regionColors: Record<string, string> = {
  'Upper Body': 'bg-blue-50 text-blue-700',
  'Core & Spine': 'bg-amber-50 text-amber-700',
  'Lower Body': 'bg-green-50 text-green-700',
}

export default function MuscleCard({ muscle, onClick, isActive }: Props) {
  return (
    <button
      onClick={() => onClick(muscle)}
      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
        isActive
          ? 'border-moss bg-moss/10 shadow-md'
          : 'border-sand bg-warm-white hover:border-clay hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="font-semibold text-sm text-charcoal leading-tight">{muscle.name}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${regionColors[muscle.region] || 'bg-sand text-earth'}`}>
          {muscle.area}
        </span>
      </div>
      <p className="text-xs text-earth/70 line-clamp-2 leading-relaxed">{muscle.actions.join(' · ')}</p>
      <div className="mt-2 text-xs text-clay/60 font-mono">{muscle.poseActivations.length} poses</div>
    </button>
  )
}
