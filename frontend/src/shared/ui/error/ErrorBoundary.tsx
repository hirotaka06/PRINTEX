'use client';

import { Component, ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { Button } from '../button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <Icon icon="solar:danger-triangle-linear" width={64} className="mb-4 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">エラーが発生しました</h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            {this.state.error?.message || '予期しないエラーが発生しました'}
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={this.handleReset}>
              再試行
            </Button>
            <Button variant="primary" onClick={() => window.location.reload()}>
              ページを再読み込み
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
