-- Muscle anatomical data
CREATE TABLE IF NOT EXISTS muscles (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  latin_name     TEXT,
  region         TEXT NOT NULL,
  area           TEXT NOT NULL,
  origin         TEXT[] NOT NULL DEFAULT '{}',
  insertion      TEXT[] NOT NULL DEFAULT '{}',
  actions        TEXT[] NOT NULL DEFAULT '{}',
  antagonists    TEXT[],
  innervation    TEXT,
  description    TEXT NOT NULL,
  teaching_tip   TEXT NOT NULL
);

-- Yoga pose data
CREATE TABLE IF NOT EXISTS poses (
  id                TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  sanskrit          TEXT NOT NULL,
  category          TEXT NOT NULL,
  level             TEXT NOT NULL,
  description       TEXT NOT NULL,
  breath_cue        TEXT,
  contraindications TEXT[]
);

-- Muscle–pose activation relationships (join table)
-- muscle_cue  = teaching cue written from the muscle's perspective
-- pose_notes  = activation note written from the pose's perspective
CREATE TABLE IF NOT EXISTS muscle_pose_activations (
  muscle_id  TEXT NOT NULL REFERENCES muscles(id) ON DELETE CASCADE,
  pose_id    TEXT NOT NULL REFERENCES poses(id)   ON DELETE CASCADE,
  activation TEXT NOT NULL,
  muscle_cue TEXT,
  pose_notes TEXT,
  PRIMARY KEY (muscle_id, pose_id)
);

-- RLS: content is publicly readable, writable only via service role
ALTER TABLE muscles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE poses                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE muscle_pose_activations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON muscles                FOR SELECT USING (true);
CREATE POLICY "public_read" ON poses                  FOR SELECT USING (true);
CREATE POLICY "public_read" ON muscle_pose_activations FOR SELECT USING (true);
