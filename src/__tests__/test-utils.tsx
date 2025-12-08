import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { SessionProvider } from '@/context/SessionContext';

interface WrapperProps {
  children: React.ReactNode;
}

/**
 * Custom render function that wraps components with necessary providers
 */
function AllProviders({ children }: WrapperProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

/**
 * Render without providers - for testing components in isolation
 */
function renderWithoutProviders(
  ui: ReactElement,
  options?: RenderOptions
) {
  return render(ui, options);
}

// Re-export everything from testing-library
export * from '@testing-library/react';

// Override render
export { customRender as render, renderWithoutProviders };

/**
 * Test data factories
 */
export const createMockProblemProgress = (overrides = {}) => ({
  scenarioId: 'test_problem',
  status: 'investigating' as const,
  startedAt: new Date(),
  currentPhaseId: 'phase_1',
  phasesProgress: [
    {
      phaseId: 'phase_1',
      status: 'active' as const,
      notesWritten: [],
      questionsAsked: [],
    },
  ],
  discoveredConcepts: [],
  reflectionResponses: [],
  investigationNotes: '',
  ...overrides,
});

export const createMockSessionState = (overrides = {}) => ({
  currentProblemId: null,
  problemsProgress: [],
  allDiscoveredConcepts: [],
  conceptMastery: {},
  totalLearningTime: 0,
  sessionStartedAt: null,
  ...overrides,
});

export const createMockTutorMessage = (overrides = {}) => ({
  role: 'tutor' as const,
  content: 'Test message',
  mode: 'socratic' as const,
  timestamp: new Date(),
  ...overrides,
});

/**
 * Wait for async operations
 */
export const waitFor = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock AI response
 */
export const mockSocraticTutorResponse = {
  response: 'That is an interesting thought. Can you tell me more?',
  suggestedConcepts: ['privacy', 'data_collection'],
  followUpQuestions: ['Why do you think that?'],
  mode: 'socratic' as const,
  shouldRevealConcept: false,
  conceptToReveal: undefined,
};
