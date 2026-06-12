import { Component, ErrorInfo } from 'react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  name?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.name ? ` (${this.props.name})` : ''}]`, error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center p-8 gap-3 text-center">
          <p className="text-earth font-medium">Something went wrong in this section.</p>
          <button
            className="px-4 py-1.5 bg-clay text-white rounded-full text-sm font-medium hover:bg-earth transition-colors"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
