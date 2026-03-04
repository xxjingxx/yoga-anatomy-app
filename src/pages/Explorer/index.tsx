import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import MuscleCard from '../../components/MuscleCard'
import PoseCard from '../../components/PoseCard'
import SearchBar from '../../components/SearchBar'
import FilterPanel from '../../components/FilterPanel'
import type { Muscle, BodyRegion } from '../../types'

export default function Explorer() {
  const {
    filteredMuscles, filteredPoses,
    muscleFilters, selectedMuscle,
    setMuscleSearch, setMuscleRegion, selectMuscle, getPoseById,
  } = useAppStore()

  const [view, setView] = useState<'muscles' | 'poses'>('muscles')

  const handleSelectMuscle = (muscle: Muscle) => {
    selectMuscle(selectedMuscle?.id === muscle.id ? null : muscle)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">

      {/* ── Sidebar ── */}
      <aside className="space-y-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-clay font-mono mb-3">Browse</p>
          <div className="flex gap-2 mb-4">
            {(['muscles', 'poses'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                  view === v ? 'bg-charcoal text-cream' : 'bg-sand text-earth hover:bg-clay/20'
                }`}
              >
                {v === 'muscles' ? '🫁 Muscles' : '🧘 Poses'}
              </button>
            ))}
          </div>
        </div>

        <SearchBar
          value={muscleFilters.searchQuery}
          onChange={setMuscleSearch}
          placeholder={view === 'muscles' ? 'Search muscles…' : 'Search poses…'}
        />

        {view === 'muscles' && (
          <FilterPanel
            activeRegion={muscleFilters.region}
            onRegionChange={(r) => setMuscleRegion(r as BodyRegion | 'All')}
          />
        )}

        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {view === 'muscles' ? (
            filteredMuscles.length === 0 ? (
              <p className="text-center text-earth/60 py-8 text-sm">No muscles found</p>
            ) : (
              filteredMuscles.map(muscle => (
                <MuscleCard
                  key={muscle.id}
                  muscle={muscle}
                  onClick={handleSelectMuscle}
                  isActive={selectedMuscle?.id === muscle.id}
                />
              ))
            )
          ) : (
            filteredPoses.length === 0 ? (
              <p className="text-center text-earth/60 py-8 text-sm">No poses found</p>
            ) : (
              filteredPoses.map(pose => (
                <PoseCard key={pose.id} pose={pose} />
              ))
            )
          )}
        </div>
      </aside>

      {/* ── Detail Panel ── */}
      <div>
        {selectedMuscle ? (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="bg-charcoal rounded-t-2xl p-6 text-cream">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-widest uppercase text-clay/70 font-mono mb-1">
                    {selectedMuscle.area} · {selectedMuscle.region}
                  </p>
                  <h2 className="font-display text-3xl font-normal">{selectedMuscle.name}</h2>
                  {selectedMuscle.latinName && (
                    <p className="text-cream/50 text-sm italic mt-0.5">{selectedMuscle.latinName}</p>
                  )}
                </div>
                <span className="bg-clay text-white text-xs px-3 py-1 rounded-full font-mono shrink-0">
                  {selectedMuscle.poseActivations.length} poses
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="bg-warm-white border border-sand border-t-0 rounded-b-2xl p-6 space-y-6">
              <p className="text-earth text-sm leading-relaxed">{selectedMuscle.description}</p>

              {/* Anatomy Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-cream rounded-xl p-4">
                  <h4 className="text-xs tracking-widest uppercase text-clay font-mono mb-2">Origin</h4>
                  <ul className="space-y-1">
                    {selectedMuscle.origin.map((o, i) => (
                      <li key={i} className="text-xs text-charcoal/80 flex gap-2">
                        <span className="text-clay mt-0.5">·</span>{o}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-cream rounded-xl p-4">
                  <h4 className="text-xs tracking-widest uppercase text-clay font-mono mb-2">Insertion</h4>
                  <ul className="space-y-1">
                    {selectedMuscle.insertion.map((ins, i) => (
                      <li key={i} className="text-xs text-charcoal/80 flex gap-2">
                        <span className="text-clay mt-0.5">·</span>{ins}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-cream rounded-xl p-4">
                  <h4 className="text-xs tracking-widest uppercase text-clay font-mono mb-2">Actions</h4>
                  <ul className="space-y-1">
                    {selectedMuscle.actions.map((a, i) => (
                      <li key={i} className="text-xs text-charcoal/80 flex gap-2">
                        <span className="text-moss mt-0.5">·</span>{a}
                      </li>
                    ))}
                  </ul>
                </div>
                {selectedMuscle.innervation && (
                  <div className="bg-cream rounded-xl p-4">
                    <h4 className="text-xs tracking-widest uppercase text-clay font-mono mb-2">Innervation</h4>
                    <p className="text-xs text-charcoal/80">{selectedMuscle.innervation}</p>
                  </div>
                )}
              </div>

              {/* Poses */}
              <div>
                <h3 className="text-xs tracking-widest uppercase text-clay font-mono mb-3">Activating Poses</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedMuscle.poseActivations.map(pa => {
                    const pose = getPoseById(pa.poseId)
                    if (!pose) return (
                      <div key={pa.poseId} className="bg-cream border border-sand rounded-xl p-4 pl-5 border-l-4 border-l-clay">
                        <div className="font-display font-bold text-charcoal capitalize">{pa.poseId.replace(/_/g, ' ')}</div>
                        <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                          pa.activation === 'strong' ? 'bg-orange-100 text-clay' :
                          pa.activation === 'moderate' ? 'bg-green-100 text-moss' : 'bg-amber-50 text-earth'
                        }`}>
                          {pa.activation === 'strong' ? '●●● Strong' : pa.activation === 'moderate' ? '●● Moderate' : '● Gentle'}
                        </span>
                        <p className="text-xs text-charcoal/75 leading-relaxed mt-2">{pa.cue}</p>
                      </div>
                    )
                    return (
                      <PoseCard
                        key={pa.poseId}
                        pose={pose}
                        activationLevel={pa.activation}
                        cue={pa.cue}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Teaching Tip */}
              <div className="bg-gradient-to-r from-moss/8 to-clay/8 border border-moss/20 rounded-xl p-4">
                <h4 className="font-display text-moss mb-1">🌿 Teaching Tip</h4>
                <p className="text-sm text-charcoal/80 leading-relaxed">{selectedMuscle.teachingTip}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-earth/50">
            <span className="text-6xl mb-4 opacity-30">🧘</span>
            <p className="text-sm">Select a muscle from the sidebar<br/>to explore its anatomy and poses</p>
          </div>
        )}
      </div>
    </div>
  )
}
