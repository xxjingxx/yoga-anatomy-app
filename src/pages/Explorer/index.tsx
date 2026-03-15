import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { useAuth } from '../../context/AuthContext'
import MuscleCard from '../../components/MuscleCard'
import SearchBar from '../../components/SearchBar'
import FilterPanel from '../../components/FilterPanel'
import AuthModal from '../../components/AuthModal'
import type { Muscle, BodyRegion } from '../../types'

const PREMIUM_MUSCLE_IDS = new Set(['adductors', 'erector_spinae'])

export default function Explorer() {
  const {
    filteredMuscles, muscleFilters, selectedMuscle,
    setMuscleSearch, setMuscleRegion, selectMuscle, getPoseById,
  } = useAppStore()
  const { isAuthenticated, isBookmarked, toggleBookmark } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authReason, setAuthReason] = useState('')

  const handleSelectMuscle = (muscle: Muscle) => {
    selectMuscle(selectedMuscle?.id === muscle.id ? null : muscle)
  }

  const handleBookmark = (muscleId: string) => {
    if (!isAuthenticated) {
      setAuthReason('to bookmark muscles')
      setShowAuthModal(true)
      return
    }
    toggleBookmark('muscle', muscleId)
  }

  const isPremiumMuscle = (id: string) => PREMIUM_MUSCLE_IDS.has(id)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
      {/* Sidebar */}
      <aside className="space-y-4">
        <p className="text-xs tracking-widest uppercase text-clay font-mono">Browse Muscles</p>
        <SearchBar
          value={muscleFilters.searchQuery}
          onChange={setMuscleSearch}
          placeholder="Search muscles…"
        />
        <FilterPanel
          activeRegion={muscleFilters.region}
          onRegionChange={(r) => setMuscleRegion(r as BodyRegion | 'All')}
        />
        <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
          {filteredMuscles.length === 0 ? (
            <p className="text-center text-earth/60 py-8 text-sm">No muscles found</p>
          ) : (
            filteredMuscles.map(muscle => {
              const locked = isPremiumMuscle(muscle.id) && !isAuthenticated
              return locked ? (
                <div
                  key={muscle.id}
                  onClick={() => { setAuthReason('to access all muscles'); setShowAuthModal(true) }}
                  className="w-full text-left p-4 rounded-xl border border-sand bg-warm-white cursor-pointer hover:border-clay transition-all opacity-70"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-charcoal">{muscle.name}</span>
                    <span className="text-xs bg-clay/10 text-clay px-2 py-0.5 rounded-full">🔒 Members</span>
                  </div>
                  <p className="text-xs text-earth/50 mt-1">{muscle.area}</p>
                </div>
              ) : (
                <MuscleCard
                  key={muscle.id}
                  muscle={muscle}
                  onClick={handleSelectMuscle}
                  isActive={selectedMuscle?.id === muscle.id}
                />
              )
            })
          )}
        </div>
      </aside>

      {/* Detail Panel */}
      <div>
        {selectedMuscle ? (
          <div>
            <div className="bg-charcoal rounded-t-2xl p-6 text-cream">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs tracking-widest uppercase text-clay/70 font-mono mb-1">
                    {selectedMuscle.area} · {selectedMuscle.region}
                  </p>
                  <h2 className="font-display text-3xl font-normal">{selectedMuscle.name}</h2>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleBookmark(selectedMuscle.id)}
                    className={`p-2 rounded-full transition-all ${
                      isBookmarked(selectedMuscle.id)
                        ? 'bg-clay text-white'
                        : 'bg-white/10 text-cream/60 hover:bg-white/20'
                    }`}
                  >
                    {isBookmarked(selectedMuscle.id) ? '♥' : '♡'}
                  </button>
                  <span className="bg-clay text-white text-xs px-3 py-1 rounded-full font-mono">
                    {selectedMuscle.poseActivations.length} poses
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-warm-white border border-sand border-t-0 rounded-b-2xl p-6 space-y-6">
              <p className="text-earth text-sm leading-relaxed">{selectedMuscle.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-cream rounded-xl p-4">
                  <h4 className="text-xs tracking-widest uppercase text-clay font-mono mb-2">Origin</h4>
                  <ul className="space-y-1">
                    {selectedMuscle.origin.map((o, i) => (
                      <li key={i} className="text-xs text-charcoal/80 flex gap-2">
                        <span className="text-clay mt-0.5 shrink-0">·</span>{o}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-cream rounded-xl p-4">
                  <h4 className="text-xs tracking-widest uppercase text-clay font-mono mb-2">Insertion</h4>
                  <ul className="space-y-1">
                    {selectedMuscle.insertion.map((ins, i) => (
                      <li key={i} className="text-xs text-charcoal/80 flex gap-2">
                        <span className="text-clay mt-0.5 shrink-0">·</span>{ins}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-cream rounded-xl p-4">
                  <h4 className="text-xs tracking-widest uppercase text-clay font-mono mb-2">Actions</h4>
                  <ul className="space-y-1">
                    {selectedMuscle.actions.map((a, i) => (
                      <li key={i} className="text-xs text-charcoal/80 flex gap-2">
                        <span className="text-moss mt-0.5 shrink-0">·</span>{a}
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

              <div>
                <h3 className="text-xs tracking-widest uppercase text-clay font-mono mb-3">Activating Poses</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedMuscle.poseActivations.map(pa => {
                    const pose = getPoseById(pa.poseId)
                    return (
                      <div key={pa.poseId} className={`bg-cream border border-sand rounded-xl p-4 pl-5 border-l-4 ${
                        pa.activation === 'strong' ? 'border-l-clay' :
                        pa.activation === 'moderate' ? 'border-l-sage' : 'border-l-sand'
                      }`}>
                        <div className="font-display font-bold text-charcoal">
                          {pose?.name || pa.poseId.replace(/_/g, ' ')}
                        </div>
                        {pose && <div className="text-xs text-earth italic mb-2">{pose.sanskrit}</div>}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          pa.activation === 'strong' ? 'bg-orange-100 text-clay' :
                          pa.activation === 'moderate' ? 'bg-green-100 text-moss' : 'bg-amber-50 text-earth'
                        }`}>
                          {pa.activation === 'strong' ? '●●● Strong' : pa.activation === 'moderate' ? '●● Moderate' : '● Gentle'}
                        </span>
                        <p className="text-xs text-charcoal/75 leading-relaxed mt-2">{pa.cue}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

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
            {!isAuthenticated && (
              <button
                onClick={() => { setAuthReason('to bookmark muscles and access all content'); setShowAuthModal(true) }}
                className="mt-6 px-5 py-2 bg-clay/10 text-clay rounded-full text-sm hover:bg-clay/20 transition-colors"
              >
                Sign in for full access →
              </button>
            )}
          </div>
        )}
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} reason={authReason} />
    </div>
  )
}
