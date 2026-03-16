import { useState, useRef, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [muscleId, setMuscleId] = useState('')
  const [poseId, setPoseId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { muscles, poses, getMuscleById, getPoseById } = useAppStore()

  // Read API key from Vite env
  const apiKey = (import.meta as unknown as { env: Record<string, string> }).env.VITE_ANTHROPIC_API_KEY

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const buildSystemPrompt = () => {
    const muscleList = muscles.map(m =>
      `${m.name} (${m.area}): actions = ${m.actions.join(', ')}`
    ).join('\n')

    const poseList = poses.map(p =>
      `${p.name} / ${p.sanskrit} (${p.category}, ${p.level})`
    ).join('\n')

    return `You are an expert yoga anatomy assistant for teacher training students (YTT).
You help students understand the relationship between muscles and yoga poses.
Your tone is clear, educational, and encouraging — like a knowledgeable teacher.

The app has these muscles:
${muscleList}

The app has these poses:
${poseList}

When generating teaching cues:
- Be specific about the anatomical action
- Include what the student should feel or notice
- Keep cues concise (2-4 sentences max)
- Use accessible language, not overly clinical
- Mention breath connection where relevant`
  }

  const generateCue = async () => {
    if (!muscleId || !poseId) return

    const muscle = getMuscleById(muscleId)
    const pose = getPoseById(poseId)
    if (!muscle || !pose) return

    const userContent = `Generate a teaching cue for activating the ${muscle.name} in ${pose.name} (${pose.sanskrit}).

Context:
- Muscle actions: ${muscle.actions.join(', ')}
- Muscle origin: ${muscle.origin.join(', ')}
- Muscle insertion: ${muscle.insertion.join(', ')}
- Pose category: ${pose.category}
- Pose level: ${pose.level}
${pose.breathCue ? `- Breath cue: ${pose.breathCue}` : ''}

Please provide:
1. A clear teaching cue (what to say to students)
2. What they should feel
3. A common mistake to watch for`

    setLoading(true)
    const newUserMessage: Message = { role: 'user', content: userContent }
    const updatedMessages = [...messages, newUserMessage]
    setMessages(updatedMessages)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: updatedMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData?.error?.message || `HTTP ${response.status}`)
      }

      const data = await response.json()
      const assistantContent = data.content?.[0]?.text || 'Sorry, I could not generate a response.'

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: assistantContent,
      }])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${message}`,
      }])
    } finally {
      setLoading(false)
    }
  }

  // Filter poses to only those that involve the selected muscle
  const relevantPoses = muscleId
    ? poses.filter(p => p.muscleActivations.some(ma => ma.muscleId === muscleId))
    : poses

  const selectedMuscle = getMuscleById(muscleId)
  const selectedPose = getPoseById(poseId)

  return (
    <>
      {/* Floating button — always visible, no auth required */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-charcoal text-cream rotate-45 scale-95'
            : 'bg-clay text-white hover:bg-earth hover:scale-110'
        }`}
        title="AI Teaching Cue Generator"
      >
        {isOpen ? '×' : '✦'}
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-warm-white rounded-2xl shadow-2xl border border-sand flex flex-col overflow-hidden"
          style={{ height: '560px' }}
        >
          {/* Header */}
          <div className="bg-charcoal px-5 py-4 shrink-0">
            <p className="text-xs tracking-widest uppercase text-clay font-mono">AI Assistant</p>
            <h3 className="font-display text-cream text-lg leading-tight">Teaching Cue Generator</h3>
          </div>

          {/* Selectors — always shown at top */}
          {messages.length === 0 && (
            <div className="p-4 border-b border-sand shrink-0 space-y-3">
              <div>
                <label className="text-xs uppercase tracking-wider text-earth/70 mb-1 block">
                  Select Muscle
                </label>
                <select
                  value={muscleId}
                  onChange={e => { setMuscleId(e.target.value); setPoseId('') }}
                  className="w-full px-3 py-2 border border-sand rounded-xl text-sm bg-cream focus:outline-none focus:border-clay"
                >
                  <option value="">Choose a muscle…</option>
                  {muscles.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-earth/70 mb-1 block">
                  Select Pose
                  {muscleId && (
                    <span className="ml-1 text-moss normal-case tracking-normal">
                      — filtered to relevant poses
                    </span>
                  )}
                </label>
                <select
                  value={poseId}
                  onChange={e => setPoseId(e.target.value)}
                  disabled={!muscleId}
                  className="w-full px-3 py-2 border border-sand rounded-xl text-sm bg-cream focus:outline-none focus:border-clay disabled:opacity-50"
                >
                  <option value="">Choose a pose…</option>
                  {relevantPoses.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={generateCue}
                disabled={!muscleId || !poseId || loading}
                className="w-full py-2.5 bg-clay text-white rounded-xl text-sm font-medium hover:bg-earth transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating…
                  </span>
                ) : (
                  `✦ Generate Cue${selectedMuscle && selectedPose
                    ? ` — ${selectedMuscle.name} in ${selectedPose.name}`
                    : ''
                  }`
                )}
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-clay text-white rounded-br-sm'
                    : 'bg-cream border border-sand text-charcoal rounded-bl-sm'
                }`}>
                  {msg.role === 'assistant'
                    ? <div className="whitespace-pre-wrap">{msg.content}</div>
                    : <span className="italic text-white/80 text-xs">
                        {selectedMuscle?.name} in {selectedPose?.name}
                      </span>
                  }
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex justify-start">
                <div className="bg-cream border border-sand rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 bg-clay/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-clay/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-clay/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Generate another cue button */}
          {messages.length > 0 && (
            <div className="border-t border-sand p-3 shrink-0">
              <button
                onClick={() => { setMessages([]); setMuscleId(''); setPoseId('') }}
                className="w-full py-2 text-sm text-clay hover:text-earth border border-clay/30 hover:border-clay rounded-xl transition-colors"
              >
                ← Generate another cue
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
