import type { Pose } from '../../types'

interface Props {
  pose: Pose
  onClick?: (pose: Pose) => void
  activationLevel?: 'strong' | 'moderate' | 'gentle'
  cue?: string
}

const levelColors = {
  Beginner: 'bg-green-50 text-green-700',
  Intermediate: 'bg-amber-50 text-amber-700',
  Advanced: 'bg-red-50 text-red-700',
}

const activationConfig = {
  strong: { label: '●●● Strong', className: 'tag-strong' },
  moderate: { label: '●● Moderate', className: 'tag-moderate' },
  gentle: { label: '● Gentle', className: 'tag-gentle' },
}

const activationBorder = {
  strong: 'border-l-clay',
  moderate: 'border-l-sage',
  gentle: 'border-l-sand',
}

export default function PoseCard({ pose, onClick, activationLevel, cue }: Props) {
  const content = (
    <div className={`bg-cream border border-sand rounded-xl p-4 pl-5 border-l-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${activationLevel ? activationBorder[activationLevel] : 'border-l-clay'}`}>
      <div className="flex items-start justify-between gap-2 mb-0.5">
        <span className="font-display font-bold text-charcoal">{pose.name}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${levelColors[pose.level]}`}>
          {pose.level}
        </span>
      </div>
      <div className="text-xs text-earth italic mb-2">{pose.sanskrit}</div>
      {activationLevel && (
        <span className={`${activationConfig[activationLevel].className} mb-2 block w-fit`}>
          {activationConfig[activationLevel].label}
        </span>
      )}
      {cue && <p className="text-xs text-charcoal/75 leading-relaxed">{cue}</p>}
      {!cue && <p className="text-xs text-earth/70 line-clamp-2 leading-relaxed">{pose.description}</p>}
    </div>
  )

  if (onClick) {
    return <button onClick={() => onClick(pose)} className="w-full text-left">{content}</button>
  }
  return content
}
