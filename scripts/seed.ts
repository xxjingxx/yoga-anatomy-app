/**
 * Seed script: populates Supabase content tables from the static TypeScript data files.
 *
 * Prerequisites:
 *   1. Apply the migration:  supabase db push
 *   2. Add to .env:          SUPABASE_SERVICE_ROLE_KEY=<your service role key>
 *
 * Run:
 *   npm run seed
 */
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { muscles } from '../src/data/muscles.js'
import { poses } from '../src/data/poses.js'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(url, key)

async function seed() {
  console.log('Seeding muscles…')
  const muscleRows = muscles.map(({ poseActivations: _pa, latinName, teachingTip, antagonists, innervation, ...m }) => ({
    ...m,
    latin_name: latinName ?? null,
    teaching_tip: teachingTip,
    antagonists: antagonists ?? null,
    innervation: innervation ?? null,
  }))
  const { error: mErr } = await supabase.from('muscles').upsert(muscleRows)
  if (mErr) throw new Error(`muscles: ${mErr.message}`)
  console.log(`  ✓ ${muscleRows.length} muscles`)

  console.log('Seeding poses…')
  const poseRows = poses.map(({ muscleActivations: _ma, breathCue, contraindications, ...p }) => ({
    ...p,
    breath_cue: breathCue ?? null,
    contraindications: contraindications ?? null,
  }))
  const { error: pErr } = await supabase.from('poses').upsert(poseRows)
  if (pErr) throw new Error(`poses: ${pErr.message}`)
  console.log(`  ✓ ${poseRows.length} poses`)

  console.log('Seeding activations…')
  // Merge both perspectives into a single join table row per (muscle, pose) pair.
  const activationMap = new Map<string, {
    muscle_id: string
    pose_id: string
    activation: string
    muscle_cue: string | null
    pose_notes: string | null
  }>()

  const poseIdSet = new Set(poses.map(p => p.id))
  const muscleIdSet = new Set(muscles.map(m => m.id))

  for (const muscle of muscles) {
    for (const pa of muscle.poseActivations) {
      if (!poseIdSet.has(pa.poseId)) continue  // skip refs to poses not yet in DB
      const key = `${muscle.id}:${pa.poseId}`
      activationMap.set(key, {
        muscle_id: muscle.id,
        pose_id: pa.poseId,
        activation: pa.activation,
        muscle_cue: pa.cue,
        pose_notes: null,
      })
    }
  }

  for (const pose of poses) {
    for (const ma of pose.muscleActivations) {
      if (!muscleIdSet.has(ma.muscleId)) continue  // skip refs to muscles not yet in DB
      const key = `${ma.muscleId}:${pose.id}`
      const existing = activationMap.get(key)
      if (existing) {
        existing.pose_notes = ma.notes
      } else {
        activationMap.set(key, {
          muscle_id: ma.muscleId,
          pose_id: pose.id,
          activation: ma.activation,
          muscle_cue: null,
          pose_notes: ma.notes,
        })
      }
    }
  }

  const activationRows = [...activationMap.values()]
  const { error: aErr } = await supabase.from('muscle_pose_activations').upsert(activationRows)
  if (aErr) throw new Error(`activations: ${aErr.message}`)
  console.log(`  ✓ ${activationRows.length} activation relationships`)

  console.log('Done.')
}

seed().catch(err => {
  console.error(err.message)
  process.exit(1)
})
