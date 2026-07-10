import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type {
  Muscle, Pose, MuscleFilters, PoseFilters,
  BodyRegion, PoseCategory, DifficultyLevel, ActivationLevel,
} from '../types'
import type { Database } from '../lib/database.types'

type MuscleRow = Database['public']['Tables']['muscles']['Row']
type PoseRow = Database['public']['Tables']['poses']['Row']
type ActivationRow = Database['public']['Tables']['muscle_pose_activations']['Row']

interface AppState {
  muscles: Muscle[]
  poses: Pose[]
  isLoading: boolean
  selectedMuscle: Muscle | null
  selectedPose: Pose | null
  muscleFilters: MuscleFilters
  poseFilters: PoseFilters
  filteredMuscles: Muscle[]
  filteredPoses: Pose[]
  loadData: () => Promise<void>
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

const filterMuscles = (muscles: Muscle[], filters: MuscleFilters): Muscle[] =>
  muscles.filter(m => {
    const matchesRegion = filters.region === 'All' || m.region === filters.region
    const matchesSearch = !filters.searchQuery ||
      m.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      m.area.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      m.actions.some(a => a.toLowerCase().includes(filters.searchQuery.toLowerCase()))
    return matchesRegion && matchesSearch
  })

const filterPoses = (poses: Pose[], filters: PoseFilters): Pose[] =>
  poses.filter(p => {
    const matchesCategory = filters.category === 'All' || p.category === filters.category
    const matchesLevel = filters.level === 'All' || p.level === filters.level
    const matchesSearch = !filters.searchQuery ||
      p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      p.sanskrit.toLowerCase().includes(filters.searchQuery.toLowerCase())
    return matchesCategory && matchesLevel && matchesSearch
  })

export const useAppStore = create<AppState>((set, get) => ({
  muscles: [],
  poses: [],
  isLoading: true,
  selectedMuscle: null,
  selectedPose: null,
  muscleFilters: { region: 'All', area: 'All', searchQuery: '' },
  poseFilters: { category: 'All', level: 'All', searchQuery: '' },
  filteredMuscles: [],
  filteredPoses: [],

  loadData: async () => {
    // Cast required: new tables aren't in the generated DB type yet.
    type QueryResult<T> = { data: T[] | null; error: { message: string } | null }
    const [mResult, pResult, aResult] = await Promise.all([
      supabase.from('muscles').select('*') as unknown as Promise<QueryResult<MuscleRow>>,
      supabase.from('poses').select('*') as unknown as Promise<QueryResult<PoseRow>>,
      supabase.from('muscle_pose_activations').select('*') as unknown as Promise<QueryResult<ActivationRow>>,
    ])
    const { data: musclesData, error: mErr } = mResult
    const { data: posesData, error: pErr } = pResult
    const { data: activationsData, error: aErr } = aResult

    if (mErr || pErr || aErr) {
      console.error('[useAppStore] loadData error', mErr ?? pErr ?? aErr)
      set({ isLoading: false })
      return
    }

    // Build muscles map
    const muscleMap = new Map<string, Muscle>()
    for (const row of musclesData ?? []) {
      muscleMap.set(row.id, {
        id: row.id,
        name: row.name,
        latinName: row.latin_name ?? undefined,
        region: row.region as BodyRegion,
        area: row.area,
        origin: row.origin,
        insertion: row.insertion,
        actions: row.actions,
        antagonists: row.antagonists ?? undefined,
        innervation: row.innervation ?? undefined,
        description: row.description,
        teachingTip: row.teaching_tip,
        poseActivations: [],
      })
    }

    // Build poses map
    const poseMap = new Map<string, Pose>()
    for (const row of posesData ?? []) {
      poseMap.set(row.id, {
        id: row.id,
        name: row.name,
        sanskrit: row.sanskrit,
        category: row.category as PoseCategory,
        level: row.level as DifficultyLevel,
        description: row.description,
        breathCue: row.breath_cue ?? undefined,
        contraindications: row.contraindications ?? undefined,
        muscleActivations: [],
      })
    }

    // Attach activations to both sides
    for (const row of activationsData ?? []) {
      if (row.muscle_cue) {
        muscleMap.get(row.muscle_id)?.poseActivations.push({
          poseId: row.pose_id,
          activation: row.activation as ActivationLevel,
          cue: row.muscle_cue,
        })
      }
      if (row.pose_notes) {
        poseMap.get(row.pose_id)?.muscleActivations.push({
          muscleId: row.muscle_id,
          activation: row.activation as ActivationLevel,
          notes: row.pose_notes,
        })
      }
    }

    const muscles = [...muscleMap.values()]
    const poses = [...poseMap.values()]
    const { muscleFilters, poseFilters } = get()

    set({
      muscles,
      poses,
      filteredMuscles: filterMuscles(muscles, muscleFilters),
      filteredPoses: filterPoses(poses, poseFilters),
      isLoading: false,
    })
  },

  selectMuscle: (muscle) => set({ selectedMuscle: muscle }),
  selectPose: (pose) => set({ selectedPose: pose }),

  setMuscleSearch: (query) => set(state => {
    const filters = { ...state.muscleFilters, searchQuery: query }
    return { muscleFilters: filters, filteredMuscles: filterMuscles(state.muscles, filters) }
  }),
  setMuscleRegion: (region) => set(state => {
    const filters = { ...state.muscleFilters, region }
    return { muscleFilters: filters, filteredMuscles: filterMuscles(state.muscles, filters) }
  }),
  setPoseSearch: (query) => set(state => {
    const filters = { ...state.poseFilters, searchQuery: query }
    return { poseFilters: filters, filteredPoses: filterPoses(state.poses, filters) }
  }),
  setPoseCategory: (category) => set(state => {
    const filters = { ...state.poseFilters, category }
    return { poseFilters: filters, filteredPoses: filterPoses(state.poses, filters) }
  }),
  setPoseLevel: (level) => set(state => {
    const filters = { ...state.poseFilters, level }
    return { poseFilters: filters, filteredPoses: filterPoses(state.poses, filters) }
  }),

  getMuscleById: (id) => get().muscles.find(m => m.id === id),
  getPoseById: (id) => get().poses.find(p => p.id === id),
}))
