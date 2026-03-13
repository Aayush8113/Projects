import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.warn("ErrorBoundary gracefully caught a 3D Canvas error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-slate-100 dark:bg-slate-800/50 rounded-[3rem] border border-slate-200 dark:border-slate-700/50">
                    <div className="text-center p-8 max-w-sm">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">3D Experience Unavailable</h2>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">Your device graphics or network prevented the WebGL Canvas from loading.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-slate-900 dark:bg-primary-600 hover:bg-slate-800 dark:hover:bg-primary-700 text-white font-bold rounded-xl transition-colors shadow-lg"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
