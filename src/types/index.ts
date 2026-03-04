export type ActivationLevel = 'strong' | 'moderate' | 'gentle'

export interface PoseActivation {
  poseId: string
  activation: ActivationLevel
  cue: string
}

export interface MuscleActivation {
  muscleId: string
  activation: ActivationLevel
  notes: string
}

export type BodyRegion = 'Upper Body' | 'Core & Spine' | 'Lower Body'

export interface Muscle {
  id: string
  name: string
  latinName?: string
  region: BodyRegion
  area: string
  origin: string[]
  insertion: string[]
  actions: string[]
  antagonists?: string[]
  innervation?: string
  description: string
  teachingTip: string
  poseActivations: PoseActivation[]
}

export type PoseCategory =
  | 'Standing' | 'Seated' | 'Supine' | 'Prone'
  | 'Inversion' | 'Arm Balance' | 'Backbend'
  | 'Forward Fold' | 'Hip Opener' | 'Twist'

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export interface Pose {
  id: string
  name: string
  sanskrit: string
  category: PoseCategory
  level: DifficultyLevel
  description: string
  breathCue?: string
  contraindications?: string[]
  muscleActivations: MuscleActivation[]
}

export interface MuscleFilters {
  region: BodyRegion | 'All'
  area: string | 'All'
  searchQuery: string
}

export interface PoseFilters {
  category: PoseCategory | 'All'
  level: DifficultyLevel | 'All'
  searchQuery: string
}
