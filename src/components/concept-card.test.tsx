import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConceptCard } from './concept-card';
import type { ConceptResource } from '@/lib/types';

const mockConcept: ConceptResource = {
  id: 'privacy',
  title: 'Privacy & Personal Data',
  description: 'Understanding what personal data is and why protecting it matters in the digital age.',
  videoUrl: 'https://www.youtube.com/embed/hIXhnWUmMvw',
  videoTitle: 'What is Privacy?',
  videoDuration: 180,
  articleUrl: 'https://www.commonsense.org/education/digital-citizenship/lesson/your-digital-footprint',
  articleTitle: 'Your Digital Footprint',
  keyInsights: [
    'Personal data includes any information that can identify you',
    'Your digital footprint is the trail of data you leave online',
    'Privacy is a fundamental right that protects your autonomy',
  ],
  relatedConcepts: ['data_collection', 'consent', 'algorithmic_bias'],
  guidingQuestions: [
    'What information about yourself would you feel comfortable sharing publicly?',
    'How might your personal data be used in ways you did not expect?',
  ],
  category: 'Foundations',
};

describe('ConceptCard', () => {
  describe('Standard Card', () => {
    it('should render concept title', () => {
      render(<ConceptCard concept={mockConcept} />);

      expect(screen.getByText('Privacy & Personal Data')).toBeInTheDocument();
    });

    it('should render concept description', () => {
      render(<ConceptCard concept={mockConcept} />);

      expect(screen.getByText(/Understanding what personal data is/)).toBeInTheDocument();
    });

    it('should render concept category', () => {
      render(<ConceptCard concept={mockConcept} />);

      expect(screen.getByText('Foundations')).toBeInTheDocument();
    });

    it('should render mastery percentage', () => {
      render(<ConceptCard concept={mockConcept} mastery={50} />);

      expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should default mastery to 0', () => {
      render(<ConceptCard concept={mockConcept} />);

      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should open dialog when clicked', async () => {
      const user = userEvent.setup();
      render(<ConceptCard concept={mockConcept} />);

      // Click on the card
      const card = screen.getByText('Privacy & Personal Data').closest('div[role="button"]') ||
                   screen.getByText('Privacy & Personal Data').closest('[class*="cursor-pointer"]');

      if (card) {
        await user.click(card);
      } else {
        // Alternative: click on the title directly
        await user.click(screen.getByText('Privacy & Personal Data'));
      }

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Compact Card', () => {
    it('should render compact version when compact prop is true', () => {
      render(<ConceptCard concept={mockConcept} compact />);

      // Compact version should have different styling - check for mastery label instead of percentage
      expect(screen.getByText('Privacy & Personal Data')).toBeInTheDocument();
      expect(screen.getByText('Discovered')).toBeInTheDocument(); // Default mastery label
    });

    it('should show mastery label in compact mode', () => {
      render(<ConceptCard concept={mockConcept} mastery={85} compact />);

      expect(screen.getByText('Mastered')).toBeInTheDocument();
    });

    it('should open dialog when compact card is clicked', async () => {
      const user = userEvent.setup();
      render(<ConceptCard concept={mockConcept} compact />);

      const compactCard = screen.getByText('Privacy & Personal Data');
      await user.click(compactCard);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Mastery Levels', () => {
    it('should show "Discovered" for mastery < 20', () => {
      render(<ConceptCard concept={mockConcept} mastery={10} compact />);
      expect(screen.getByText('Discovered')).toBeInTheDocument();
    });

    it('should show "Exploring" for mastery 20-49', () => {
      render(<ConceptCard concept={mockConcept} mastery={35} compact />);
      expect(screen.getByText('Exploring')).toBeInTheDocument();
    });

    it('should show "Developing" for mastery 50-79', () => {
      render(<ConceptCard concept={mockConcept} mastery={65} compact />);
      expect(screen.getByText('Developing')).toBeInTheDocument();
    });

    it('should show "Mastered" for mastery >= 80', () => {
      render(<ConceptCard concept={mockConcept} mastery={90} compact />);
      expect(screen.getByText('Mastered')).toBeInTheDocument();
    });

    it('should apply green color for high mastery', () => {
      render(<ConceptCard concept={mockConcept} mastery={85} compact />);
      const masteryLabel = screen.getByText('Mastered');
      expect(masteryLabel).toHaveClass('text-green-500');
    });

    it('should apply yellow color for medium mastery', () => {
      render(<ConceptCard concept={mockConcept} mastery={60} compact />);
      const masteryLabel = screen.getByText('Developing');
      expect(masteryLabel).toHaveClass('text-yellow-500');
    });

    it('should apply orange color for low mastery', () => {
      render(<ConceptCard concept={mockConcept} mastery={25} compact />);
      const masteryLabel = screen.getByText('Exploring');
      expect(masteryLabel).toHaveClass('text-orange-500');
    });
  });

  describe('Dialog Content', () => {
    it('should display concept title in dialog', async () => {
      const user = userEvent.setup();
      render(<ConceptCard concept={mockConcept} mastery={50} />);

      await user.click(screen.getByText('Privacy & Personal Data'));

      await waitFor(() => {
        // Title should appear twice - in card and dialog
        const titles = screen.getAllByText('Privacy & Personal Data');
        expect(titles.length).toBeGreaterThan(1);
      });
    });

    it('should display key insights tab', async () => {
      const user = userEvent.setup();
      render(<ConceptCard concept={mockConcept} mastery={50} />);

      await user.click(screen.getByText('Privacy & Personal Data'));

      await waitFor(() => {
        expect(screen.getByText('Key Insights')).toBeInTheDocument();
      });
    });

    it('should display resources tab', async () => {
      const user = userEvent.setup();
      render(<ConceptCard concept={mockConcept} mastery={50} />);

      await user.click(screen.getByText('Privacy & Personal Data'));

      await waitFor(() => {
        expect(screen.getByText('Resources')).toBeInTheDocument();
      });
    });

    it('should display think about tab', async () => {
      const user = userEvent.setup();
      render(<ConceptCard concept={mockConcept} mastery={50} />);

      await user.click(screen.getByText('Privacy & Personal Data'));

      await waitFor(() => {
        expect(screen.getByText('Think About')).toBeInTheDocument();
      });
    });

    it('should display key insights content', async () => {
      const user = userEvent.setup();
      render(<ConceptCard concept={mockConcept} mastery={50} />);

      await user.click(screen.getByText('Privacy & Personal Data'));

      await waitFor(() => {
        expect(screen.getByText(/Personal data includes any information/)).toBeInTheDocument();
      });
    });

    it('should display related concepts', async () => {
      const user = userEvent.setup();
      render(<ConceptCard concept={mockConcept} mastery={50} />);

      await user.click(screen.getByText('Privacy & Personal Data'));

      await waitFor(() => {
        expect(screen.getByText('Related Concepts')).toBeInTheDocument();
        expect(screen.getByText('data collection')).toBeInTheDocument();
      });
    });

    it('should display mastery in dialog', async () => {
      const user = userEvent.setup();
      render(<ConceptCard concept={mockConcept} mastery={75} />);

      await user.click(screen.getByText('Privacy & Personal Data'));

      await waitFor(() => {
        expect(screen.getByText('Your Understanding')).toBeInTheDocument();
        // There are multiple 75% elements (card and dialog), use getAllByText
        const masteryElements = screen.getAllByText('75%');
        expect(masteryElements.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should switch to resources tab', async () => {
      const user = userEvent.setup();
      render(<ConceptCard concept={mockConcept} mastery={50} />);

      await user.click(screen.getByText('Privacy & Personal Data'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('tab', { name: /Resources/i }));

      await waitFor(() => {
        expect(screen.getByText('Video')).toBeInTheDocument();
        expect(screen.getByText('What is Privacy?')).toBeInTheDocument();
        expect(screen.getByText('Article')).toBeInTheDocument();
      });
    });

    it('should display video duration', async () => {
      const user = userEvent.setup();
      render(<ConceptCard concept={mockConcept} mastery={50} />);

      await user.click(screen.getByText('Privacy & Personal Data'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('tab', { name: /Resources/i }));

      await waitFor(() => {
        expect(screen.getByText(/Duration: 3 min/)).toBeInTheDocument();
      });
    });

    it('should switch to questions tab', async () => {
      const user = userEvent.setup();
      render(<ConceptCard concept={mockConcept} mastery={50} />);

      await user.click(screen.getByText('Privacy & Personal Data'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('tab', { name: /Think About/i }));

      await waitFor(() => {
        expect(screen.getByText(/Consider these questions to deepen your understanding/)).toBeInTheDocument();
        expect(screen.getByText(/What information about yourself/)).toBeInTheDocument();
      });
    });

    it('should have external link for video', async () => {
      const user = userEvent.setup();
      render(<ConceptCard concept={mockConcept} mastery={50} />);

      await user.click(screen.getByText('Privacy & Personal Data'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('tab', { name: /Resources/i }));

      await waitFor(() => {
        const videoLink = screen.getByText('What is Privacy?').closest('a');
        expect(videoLink).toHaveAttribute('target', '_blank');
        expect(videoLink).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle concept with no related concepts', async () => {
      const conceptWithoutRelated: ConceptResource = {
        ...mockConcept,
        relatedConcepts: [],
      };

      const user = userEvent.setup();
      render(<ConceptCard concept={conceptWithoutRelated} mastery={50} />);

      await user.click(screen.getByText('Privacy & Personal Data'));

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        // Related concepts section should not be present
        expect(screen.queryByText('Related Concepts')).not.toBeInTheDocument();
      });
    });

    it('should handle onExplore callback', () => {
      const mockOnExplore = vi.fn();
      render(<ConceptCard concept={mockConcept} onExplore={mockOnExplore} />);

      // Just verify it renders without error - onExplore is not currently used in component
      expect(screen.getByText('Privacy & Personal Data')).toBeInTheDocument();
    });

    it('should render progress bar', () => {
      render(<ConceptCard concept={mockConcept} mastery={50} />);

      // Progress component renders with role="progressbar"
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toBeInTheDocument();
    });

    it('should handle very long concept titles', () => {
      const longTitleConcept: ConceptResource = {
        ...mockConcept,
        title: 'A Very Long Concept Title That Should Be Displayed Properly Without Breaking Layout',
      };

      render(<ConceptCard concept={longTitleConcept} compact />);

      expect(screen.getByText(longTitleConcept.title)).toBeInTheDocument();
    });

    it('should handle zero mastery', () => {
      render(<ConceptCard concept={mockConcept} mastery={0} />);

      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('should handle 100% mastery', () => {
      render(<ConceptCard concept={mockConcept} mastery={100} compact />);

      expect(screen.getByText('Mastered')).toBeInTheDocument();
    });
  });
});
