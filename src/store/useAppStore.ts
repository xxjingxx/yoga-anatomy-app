import { create } from 'zustand'
import type { Muscle, Pose, MuscleFilters, PoseFilters, BodyRegion, PoseCategory, DifficultyLevel } from '../types'
import { muscles } from '../data/muscles'
import { poses } from '../data/poses'

interface AppState {
  // Data
  muscles: Muscle[]
  poses: Pose[]

  // Selected items
  selectedMuscle: Muscle | null
  selectedPose: Pose | null

  // Filters
  muscleFilters: MuscleFilters
  poseFilters: PoseFilters

  // Computed
  filteredMuscles: Muscle[]
  filteredPoses: Pose[]

  // Actions
  selectMuscle: (muscle: Muscle | null) => void
  selectPose: (pose: Pose | null) => void
  setMuscleSearch: (query: string) => void
  setMuscleRegion: (region: BodyRegion | 'All') => void
  setPoseSearch: (query: string) => void
  setPoseCategory: (category: PoseCategory | 'All') => void
  setPoseLevel: (level: DifficultyLevel | 'All') => void
  getMuscleById: (id: string) => Muscle | undefined
  getPoseById: (id: string) => Pose | undefined
}

const filterMuscles = (muscles: Muscle[], filters: MuscleFilters): Muscle[] => {
  return muscles.filter(m => {
    const matchesRegion = filters.region === 'All' || m.region === filters.region
    const matchesSearch = !filters.searchQuery ||
      m.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      m.area.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      m.actions.some(a => a.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    return matchesRegion && matchesSearch
  })
}

const filterPoses = (poses: Pose[], filters: PoseFilters): Pose[] => {
  return poses.filter(p => {
    const matchesCategory = filters.category === 'All' || p.category === filters.category
    const matchesLevel = filters.level === 'All' || p.level === filters.level
    const matchesSearch = !filters.searchQuery ||
      p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      p.sanskrit.toLowerCase().includes(filters.searchQuery.toLowerCase())
    return matchesCategory && matchesLevel && matchesSearch
  })
}

export const useAppStore = create<AppState>((set, get) => ({
  muscles,
  poses,
  selectedMuscle: null,
  selectedPose: null,
  muscleFilters: { region: 'All', area: 'All', searchQuery: '' },
  poseFilters: { category: 'All', level: 'All', searchQuery: '' },
  filteredMuscles: muscles,
  filteredPoses: poses,

  selectMuscle: (muscle) => set({ selectedMuscle: muscle }),
  selectPose: (pose) => set({ selectedPose: pose }),

  setMuscleSearch: (query) => set(state => {
    const filters = { ...state.muscleFilters, searchQuery: query }
    return { muscleFilters: filters, filteredMuscles: filterMuscles(muscles, filters) }
  }),

  setMuscleRegion: (region) => set(state => {
    const filters = { ...state.muscleFilters, region }
    return { muscleFilters: filters, filteredMuscles: filterMuscles(muscles, filters) }
  }),

  setPoseSearch: (query) => set(state => {
    const filters = { ...state.poseFilters, searchQuery: query }
    return { poseFilters: filters, filteredPoses: filterPoses(poses, filters) }
  }),

  setPoseCategory: (category) => set(state => {
    const filters = { ...state.poseFilters, category }
    return { poseFilters: filters, filteredPoses: filterPoses(poses, filters) }
  }),

  setPoseLevel: (level) => set(state => {
    const filters = { ...state.poseFilters, level }
    return { poseFilters: filters, filteredPoses: filterPoses(poses, filters) }
  }),

  getMuscleById: (id) => get().muscles.find(m => m.id === id),
  getPoseById: (id) => get().poses.find(p => p.id === id),
}))
