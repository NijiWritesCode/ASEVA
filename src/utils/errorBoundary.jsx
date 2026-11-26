import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI exception in component tree:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-sand-100">
          <div className="w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center text-red-700">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-obsidian-950 mb-2">
            Something unexpected occurred
          </h2>
          <p className="text-obsidian-700 max-w-md mb-6 text-sm">
            We encountered an unexpected error while rendering this view. Our engineering team has logged the occurrence.
          </p>
          <button
            onClick={this.handleReset}
            className="px-6 py-2.5 bg-obsidian-900 text-gold-400 text-xs font-semibold tracking-widest uppercase hover:bg-obsidian-800 transition-colors"
          >
            Reload Interface
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
