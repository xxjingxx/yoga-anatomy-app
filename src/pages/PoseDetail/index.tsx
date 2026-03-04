import { useAppStore } from '../../store/useAppStore'
import PoseCard from '../../components/PoseCard'
import SearchBar from '../../components/SearchBar'

const categories = ['All', 'Standing', 'Seated', 'Supine', 'Prone', 'Inversion', 'Arm Balance', 'Backbend', 'Forward Fold', 'Hip Opener', 'Twist'] as const
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'] as const

export default function PosesPage() {
  const { filteredPoses, poseFilters, setPoseSearch, setPoseCategory, setPoseLevel, getMuscleById } = useAppStore()
  const [selectedPoseId, setSelectedPoseId] = useAppStore(s => [s.selectedPose?.id, s.selectPose])

  const selectedPose = useAppStore(s => s.selectedPose)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
      <aside className="space-y-4">
        <p className="text-xs tracking-widest uppercase text-clay font-mono">All Poses</p>
        <SearchBar value={poseFilters.searchQuery} onChange={setPoseSearch} placeholder="Search poses…" />

        {/* Category filter */}
        <div>
          <p className="text-xs text-earth/60 mb-2 uppercase tracking-wider">Category</p>
          <div className="flex flex-wrap gap-1.5">
            {categories.map(c => (
              <button key={c} onClick={() => setPoseCategory(c as any)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                  poseFilters.category === c
                    ? 'border-moss bg-moss/10 text-moss font-medium'
                    : 'border-sand bg-warm-white text-earth hover:border-clay'
                }`}>{c}</button>
            ))}
          </div>
        </div>

        {/* Level filter */}
        <div>
          <p className="text-xs text-earth/60 mb-2 uppercase tracking-wider">Level</p>
          <div className="flex gap-1.5">
            {levels.map(l => (
              <button key={l} onClick={() => setPoseLevel(l as any)}
                className={`flex-1 py-1.5 rounded-xl text-xs border transition-colors ${
                  poseFilters.level === l
                    ? 'border-clay bg-clay text-white font-medium'
                    : 'border-sand bg-warm-white text-earth hover:border-clay'
                }`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
          {filteredPoses.map(pose => (
            <button key={pose.id} onClick={() => setSelectedPoseId(pose)} className="w-full text-left">
              <div className={`p-3 rounded-xl border transition-all ${
                selectedPose?.id === pose.id
                  ? 'border-moss bg-moss/10'
                  : 'border-sand bg-warm-white hover:border-clay'
              }`}>
                <div className="font-semibold text-sm">{pose.name}</div>
                <div className="text-xs text-earth italic">{pose.sanskrit}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <div>
        {selectedPose ? (
          <div className="animate-fade-in">
            <div className="bg-charcoal rounded-t-2xl p-6 text-cream">
              <p className="text-xs tracking-widest uppercase text-clay/70 font-mono mb-1">
                {selectedPose.category} · {selectedPose.level}
              </p>
              <h2 className="font-display text-3xl font-normal">{selectedPose.name}</h2>
              <p className="text-cream/50 italic mt-0.5">{selectedPose.sanskrit}</p>
            </div>
            <div className="bg-warm-white border border-sand border-t-0 rounded-b-2xl p-6 space-y-5">
              <p className="text-earth text-sm leading-relaxed">{selectedPose.description}</p>

              {selectedPose.breathCue && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <h4 className="text-xs uppercase tracking-widest text-blue-600 font-mono mb-1">Breath Cue</h4>
                  <p className="text-sm text-blue-900/80">{selectedPose.breathCue}</p>
                </div>
              )}

              {selectedPose.contraindications && selectedPose.contraindications.length > 0 && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <h4 className="text-xs uppercase tracking-widest text-red-500 font-mono mb-1">Contraindications</h4>
                  <p className="text-sm text-red-900/70">{selectedPose.contraindications.join(' · ')}</p>
                </div>
              )}

              <div>
                <h3 className="text-xs tracking-widest uppercase text-clay font-mono mb-3">Muscles Activated</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedPose.muscleActivations.map(ma => {
                    const muscle = getMuscleById(ma.muscleId)
                    return (
                      <div key={ma.muscleId} className="bg-cream border border-sand rounded-xl p-4">
                        <div className="font-semibold text-sm text-charcoal">
                          {muscle?.name || ma.muscleId.replace(/_/g, ' ')}
                        </div>
                        {muscle && <div className="text-xs text-earth/60 mb-2">{muscle.area}</div>}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          ma.activation === 'strong' ? 'bg-orange-100 text-clay' :
                          ma.activation === 'moderate' ? 'bg-green-100 text-moss' : 'bg-amber-50 text-earth'
                        }`}>
                          {ma.activation === 'strong' ? '●●● Strong' : ma.activation === 'moderate' ? '●● Moderate' : '● Gentle'}
                        </span>
                        <p className="text-xs text-charcoal/70 mt-2 leading-relaxed">{ma.notes}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-earth/50">
            <span className="text-6xl mb-4 opacity-30">🌿</span>
            <p className="text-sm">Select a pose to see its muscles,<br/>breath cues, and contraindications</p>
          </div>
        )}
      </div>
    </div>
  )
}
