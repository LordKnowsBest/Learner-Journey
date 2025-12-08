import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SocraticChat } from './socratic-chat';

// Mock the AI tutor flow
vi.mock('@/ai/flows/ai-tutor-assistance', () => ({
  askSocraticTutor: vi.fn().mockResolvedValue({
    response: 'That is an interesting thought. Can you tell me more?',
    suggestedConcepts: ['privacy'],
    followUpQuestions: ['Why do you think that?'],
    mode: 'socratic',
    shouldRevealConcept: false,
    conceptToReveal: undefined,
  }),
}));

import { askSocraticTutor } from '@/ai/flows/ai-tutor-assistance';

describe('SocraticChat', () => {
  const defaultProps = {
    problemId: 'school_ai_tutor',
    phaseId: 'phase_1_understand',
    discoveredConcepts: [] as string[],
    onConceptDiscover: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render initial greeting message', () => {
    render(<SocraticChat {...defaultProps} />);

    expect(screen.getByText(/Hi! I'm here to help you think through this problem/i)).toBeInTheDocument();
  });

  it('should render AI Guide title', () => {
    render(<SocraticChat {...defaultProps} />);

    expect(screen.getByText('AI Guide')).toBeInTheDocument();
  });

  it('should render input field', () => {
    render(<SocraticChat {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Share your thoughts or ask a question/i);
    expect(input).toBeInTheDocument();
  });

  it('should render send button', () => {
    render(<SocraticChat {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('should disable send button when input is empty', () => {
    render(<SocraticChat {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should enable send button when input has text', async () => {
    const user = userEvent.setup();
    render(<SocraticChat {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Share your thoughts or ask a question/i);
    await user.type(input, 'Hello');

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should send message when button is clicked', async () => {
    const user = userEvent.setup();
    render(<SocraticChat {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Share your thoughts or ask a question/i);
    await user.type(input, 'I have a question about privacy');

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      expect(askSocraticTutor).toHaveBeenCalledWith(
        expect.objectContaining({
          problemId: 'school_ai_tutor',
          phaseId: 'phase_1_understand',
          studentMessage: 'I have a question about privacy',
        })
      );
    });
  });

  it('should send message when Enter is pressed', async () => {
    const user = userEvent.setup();
    render(<SocraticChat {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Share your thoughts or ask a question/i);
    await user.type(input, 'Testing enter key{Enter}');

    await waitFor(() => {
      expect(askSocraticTutor).toHaveBeenCalled();
    });
  });

  it('should display user message after sending', async () => {
    const user = userEvent.setup();
    render(<SocraticChat {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Share your thoughts or ask a question/i);
    await user.type(input, 'My test message');
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText('My test message')).toBeInTheDocument();
    });
  });

  it('should display tutor response after API call', async () => {
    const user = userEvent.setup();
    render(<SocraticChat {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Share your thoughts or ask a question/i);
    await user.type(input, 'Hello tutor');
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/That is an interesting thought/)).toBeInTheDocument();
    });
  });

  it('should clear input after sending message', async () => {
    const user = userEvent.setup();
    render(<SocraticChat {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Share your thoughts or ask a question/i) as HTMLInputElement;
    await user.type(input, 'Test message');
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('should handle concept discovery when AI suggests revealing', async () => {
    const mockOnConceptDiscover = vi.fn();
    vi.mocked(askSocraticTutor).mockResolvedValueOnce({
      response: 'Great thinking!',
      suggestedConcepts: [],
      followUpQuestions: [],
      mode: 'socratic',
      shouldRevealConcept: true,
      conceptToReveal: 'privacy',
    });

    const user = userEvent.setup();
    render(
      <SocraticChat {...defaultProps} onConceptDiscover={mockOnConceptDiscover} />
    );

    const input = screen.getByPlaceholderText(/Share your thoughts or ask a question/i);
    await user.type(input, 'What about privacy?');
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockOnConceptDiscover).toHaveBeenCalledWith('privacy');
    });
  });

  it('should show error message when API fails', async () => {
    vi.mocked(askSocraticTutor).mockRejectedValueOnce(new Error('API Error'));

    const user = userEvent.setup();
    render(<SocraticChat {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Share your thoughts or ask a question/i);
    await user.type(input, 'Test message');
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByText(/I had trouble processing that/)).toBeInTheDocument();
    });
  });

  it('should track stuck count for help phrases', async () => {
    const user = userEvent.setup();
    render(<SocraticChat {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Share your thoughts or ask a question/i);

    // First "help" message
    await user.type(input, "I don't know what to do");
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(askSocraticTutor).toHaveBeenCalledWith(
        expect.objectContaining({
          stuckCount: 1,
        })
      );
    });
  });

  it('should pass conversation history to API', async () => {
    const user = userEvent.setup();
    render(<SocraticChat {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Share your thoughts or ask a question/i);

    // Send first message
    await user.type(input, 'First message');
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(askSocraticTutor).toHaveBeenCalled();
    });

    // Clear and send second message
    await user.type(input, 'Second message');
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      // Check that the second call includes conversation history
      const calls = vi.mocked(askSocraticTutor).mock.calls;
      expect(calls.length).toBeGreaterThan(1);
      const lastCall = calls[calls.length - 1][0];
      expect(lastCall.conversationHistory.length).toBeGreaterThan(0);
    });
  });

  it('should pass discovered concepts to API', async () => {
    const user = userEvent.setup();
    render(
      <SocraticChat
        {...defaultProps}
        discoveredConcepts={['privacy', 'data_collection']}
      />
    );

    const input = screen.getByPlaceholderText(/Share your thoughts or ask a question/i);
    await user.type(input, 'Test message');
    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(askSocraticTutor).toHaveBeenCalledWith(
        expect.objectContaining({
          discoveredConcepts: ['privacy', 'data_collection'],
        })
      );
    });
  });

  it('should render mode badge for tutor messages', async () => {
    const user = userEvent.setup();
    render(<SocraticChat {...defaultProps} />);

    // The initial message should have a badge
    expect(screen.getByText('Questioning')).toBeInTheDocument();
  });

  it('should show loading state while waiting for response', async () => {
    // Create a promise that won't resolve immediately
    let resolvePromise: (value: unknown) => void;
    const delayedPromise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    vi.mocked(askSocraticTutor).mockReturnValueOnce(delayedPromise as never);

    const user = userEvent.setup();
    render(<SocraticChat {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Share your thoughts or ask a question/i);
    await user.type(input, 'Test');
    await user.click(screen.getByRole('button'));

    // Check that input is disabled during loading
    await waitFor(() => {
      expect(input).toBeDisabled();
    });

    // Resolve the promise
    resolvePromise!({
      response: 'Done',
      suggestedConcepts: [],
      followUpQuestions: [],
      mode: 'socratic',
      shouldRevealConcept: false,
    });

    await waitFor(() => {
      expect(input).not.toBeDisabled();
    });
  });

  it('should not send empty message', async () => {
    const user = userEvent.setup();
    render(<SocraticChat {...defaultProps} />);

    const input = screen.getByPlaceholderText(/Share your thoughts or ask a question/i);
    await user.type(input, '   '); // Only whitespace
    await user.click(screen.getByRole('button'));

    expect(askSocraticTutor).not.toHaveBeenCalled();
  });

  it('should render helper text', () => {
    render(<SocraticChat {...defaultProps} />);

    expect(screen.getByText(/The guide will ask questions to help you think/)).toBeInTheDocument();
  });
});
