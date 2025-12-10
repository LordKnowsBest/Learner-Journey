# Comprehensive Educational Tooltip Implementation Plan

## Current State Analysis

### Tooltip Definitions Created: 90 definitions
Located in `src/lib/ethical-design-tooltips.ts`

### Components Already Using EducationalTooltip: 5 files
1. `src/components/gamification/xp-hud.tsx` - XP, streaks, levels
2. `src/components/header.tsx` - Navigation items
3. `src/components/mode-toggle.tsx` - Theme switcher
4. `src/hooks/useEducationalTooltips.ts` - Helper hook
5. `src/components/ui/educational-tooltip.tsx` - Base component

### Tooltip Layer System
- **User Layer**: End-user friendly explanations
- **Educator Layer**: Pedagogical rationale
- **Designer Layer**: Ethical design principles with references
- **Developer Layer**: Technical implementation details
- **Academic Mode**: Displays citations in IEEE format

---

## Implementation Phases

### Phase 1: Teacher Dashboard (Priority: HIGH)
**Files to modify:**
| File | Tooltips to Add | Status |
|------|-----------------|--------|
| `src/app/teacher/page.tsx` | Dashboard overview, tab navigation | Pending |
| `src/components/dashboard/metric-card.tsx` | Active today, time on task, concepts mastered, avg mastery | Pending |
| `src/components/dashboard/alert-banner.tsx` | Critical/warning/monitor alerts, intervention prompts | Pending |
| `src/components/dashboard/student-pill.tsx` | Student status, learning signal score | Pending |
| `src/components/dashboard/tabs/individual-progress-tab.tsx` | Search, filter, export, progress table | Pending |
| `src/components/dashboard/tabs/learning-paths-tab.tsx` | Curriculum velocity, pacing alerts, content insights | Pending |
| `src/components/dashboard/tabs/reports-tab.tsx` | Report generation, standards alignment, export CSV | Pending |

**Tooltip IDs to use:**
- `teacher_dashboard_overview`
- `metric_active_today`, `metric_time_on_task`, `metric_concepts_mastered`, `metric_avg_mastery`
- `intervention_alert`, `alert_critical`, `alert_warning`
- `student_roster`, `student_status_pill`, `learning_signal_score`
- `tab_class_overview`, `tab_individual_progress`, `tab_learning_paths`, `tab_reports`
- `report_standards_alignment`, `report_export_csv`
- `pacing_alert`, `content_insights`

---

### Phase 2: Problems Page (Priority: HIGH)
**Files to modify:**
| File | Tooltips to Add | Status |
|------|-----------------|--------|
| `src/app/problems/page.tsx` | Replace basic tooltips with EducationalTooltip | Pending |

**Current state:** Has basic tooltips, needs upgrade to EducationalTooltip system

**Tooltip IDs to use:**
- `problem_difficulty_beginner`, `problem_difficulty_intermediate`, `problem_difficulty_advanced`
- `problem_estimated_time`
- `problem_stakeholders`
- `problem_tags`
- `problem_start_investigation`
- `concepts_discovered_count`

---

### Phase 3: Concept Map / Graph Page (Priority: HIGH)
**Files to modify:**
| File | Tooltips to Add | Status |
|------|-----------------|--------|
| `src/app/graph/page.tsx` | Concept map overview, progress, navigation | Pending |
| `src/components/concept-card.tsx` | Discovered/locked states, mastery progress, related concepts | Pending |

**Tooltip IDs to use:**
- `concept_map_overview`
- `concept_discovered`, `concept_locked`
- `concept_mastery_progress`
- `concept_connections`
- `concept_relationship_builds_on`, `concept_relationship_contrasts`
- `multiple_pathways`
- `mastery_levels`

---

### Phase 4: Journey Summary Page (Priority: MEDIUM)
**Files to modify:**
| File | Tooltips to Add | Status |
|------|-----------------|--------|
| `src/app/journey-summary/page.tsx` | Stats cards, progress, next steps | Pending |

**Tooltip IDs to use:**
- `journey_overview`
- `stat_problems_solved`, `stat_concepts_discovered`, `stat_average_mastery`, `stat_connections_made`
- `whats_next_section`
- `start_fresh_button`

---

### Phase 5: Settings Page (Priority: MEDIUM)
**Files to modify:**
| File | Tooltips to Add | Status |
|------|-----------------|--------|
| `src/app/settings/page.tsx` | LLM router, API providers, task routing, privacy | Pending |

**Tooltip IDs to use:**
- `settings_llm_router`
- `settings_api_providers`
- `settings_task_routing`
- `settings_provider_test`
- `settings_privacy_note`

---

### Phase 6: Learn Page (Priority: MEDIUM)
**Files to modify:**
| File | Tooltips to Add | Status |
|------|-----------------|--------|
| `src/app/learn/[nodeId]/page.tsx` | Video content, article link, quiz ready, AI tutor | Pending |
| `src/components/ai-tutor.tsx` | AI tutor interface elements | Pending |

**Tooltip IDs to use:**
- `learn_video_content`
- `learn_article_link`
- `learn_quiz_ready`
- `learn_ai_tutor`

---

### Phase 7: Quiz Component (Priority: HIGH)
**Files to modify:**
| File | Tooltips to Add | Status |
|------|-----------------|--------|
| `src/components/quiz.tsx` | Upgrade basic tooltips to EducationalTooltip | Pending |

**Current state:** Has basic tooltips, needs upgrade

**Tooltip IDs to use:**
- `quiz_progress_bar`
- `quiz_question_display`
- `quiz_answer_options`
- `quiz_submit_button`
- `quiz_results_display`
- `quiz_explanation`
- `quiz_retry_option`
- `formative_feedback`

---

### Phase 8: Socratic Chat (Priority: HIGH)
**Files to modify:**
| File | Tooltips to Add | Status |
|------|-----------------|--------|
| `src/components/socratic-chat.tsx` | Upgrade basic tooltips to EducationalTooltip | Pending |

**Current state:** Has basic tooltips, needs upgrade

**Tooltip IDs to use:**
- `socratic_ai_guide`
- `socratic_mode_questioning`, `socratic_mode_hinting`, `socratic_mode_explaining`, `socratic_mode_challenging`
- `socratic_suggested_concept`
- `socratic_input_field`
- `socratic_send_button`
- `socratic_questioning`
- `hint_progression`
- `tutor_mode_indicator`

---

### Phase 9: Investigation Page (Priority: MEDIUM)
**Files to modify:**
| File | Tooltips to Add | Status |
|------|-----------------|--------|
| `src/app/investigate/[problemId]/page.tsx` | Investigation phases, stakeholder perspectives | Pending |
| `src/components/investigate/mastery-gate.tsx` | Mastery requirements, progression | Pending |

**New tooltip definitions needed:**
- `investigation_phase`
- `stakeholder_perspective`
- `mastery_gate`
- `investigation_progress`

---

### Phase 10: Explainability Sidebar (Priority: HIGH)
**Files to modify:**
| File | Tooltips to Add | Status |
|------|-----------------|--------|
| `src/components/explainability-sidebar.tsx` | AI decision explanations, confidence levels | Pending |

**Tooltip IDs to use:**
- `explainability_panel`
- `confidence_badge`
- `tutor_mode_indicator`

---

### Phase 11: Reflection Page (Priority: LOW)
**Files to modify:**
| File | Tooltips to Add | Status |
|------|-----------------|--------|
| `src/app/reflect/[problemId]/page.tsx` | Reflection prompts, submission | Pending |

**New tooltip definitions needed:**
- `reflection_prompt`
- `reflection_submission`
- `reflection_feedback`

---

### Phase 12: Results/Diagnostic Pages (Priority: LOW)
**Files to modify:**
| File | Tooltips to Add | Status |
|------|-----------------|--------|
| `src/app/results/page.tsx` | Results display | Pending |
| `src/app/diagnostic/page.tsx` | Diagnostic assessment | Pending |
| `src/app/post-test/page.tsx` | Post-test assessment | Pending |

---

## Implementation Pattern

### Step 1: Import Dependencies
```tsx
import { EducationalTooltip } from "@/components/ui/educational-tooltip";
import { ethicalTooltipDefinitions } from "@/lib/ethical-design-tooltips";
```

### Step 2: Replace Basic Tooltips
```tsx
// BEFORE (basic tooltip)
<Tooltip>
  <TooltipTrigger asChild>
    <Button>Action</Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>Simple explanation</p>
  </TooltipContent>
</Tooltip>

// AFTER (educational tooltip)
<EducationalTooltip
  definition={ethicalTooltipDefinitions.tooltip_id}
  side="top"
>
  <Button>Action</Button>
</EducationalTooltip>
```

### Step 3: Wrap New Elements
```tsx
<EducationalTooltip
  definition={ethicalTooltipDefinitions.metric_active_today}
  side="bottom"
>
  <MetricCard
    title="Active Today"
    value={activeStudents}
    icon={Users}
  />
</EducationalTooltip>
```

---

## Testing Checklist

For each component:
- [ ] All tooltip layers display correctly (User, Educator, Designer, Developer)
- [ ] Academic mode shows proper citations
- [ ] Tooltips don't interfere with click/interaction events
- [ ] Dark mode styling works correctly
- [ ] Mobile/touch interactions work properly
- [ ] TooltipLayerToggle correctly filters layers

---

## Priority Order

| Priority | Phase | Components | Est. Changes |
|----------|-------|------------|--------------|
| 1 | Phase 1 | Teacher Dashboard | 7 files, ~50 tooltips |
| 2 | Phase 7 | Quiz Component | 1 file, ~10 tooltips |
| 3 | Phase 8 | Socratic Chat | 1 file, ~12 tooltips |
| 4 | Phase 10 | Explainability Sidebar | 1 file, ~5 tooltips |
| 5 | Phase 2 | Problems Page | 1 file, ~8 tooltips |
| 6 | Phase 3 | Graph Page | 2 files, ~10 tooltips |
| 7 | Phase 4 | Journey Summary | 1 file, ~7 tooltips |
| 8 | Phase 5 | Settings Page | 1 file, ~5 tooltips |
| 9 | Phase 6 | Learn Page | 2 files, ~5 tooltips |
| 10 | Phase 9 | Investigation Page | 2 files, ~5 tooltips |
| 11 | Phase 11 | Reflection Page | 1 file, ~4 tooltips |
| 12 | Phase 12 | Results/Diagnostic | 3 files, ~6 tooltips |

---

## New Tooltip Definitions Needed

The following tooltip definitions should be added to `ethical-design-tooltips.ts`:

```typescript
// Investigation Page
investigation_phase: { ... }
stakeholder_perspective: { ... }
mastery_gate: { ... }
investigation_progress: { ... }
evidence_collection: { ... }

// Reflection Page
reflection_prompt: { ... }
reflection_submission: { ... }
reflection_feedback: { ... }

// Diagnostic/Assessment
diagnostic_purpose: { ... }
pre_test_explanation: { ... }
post_test_explanation: { ... }
knowledge_assessment: { ... }

// Additional Teacher Dashboard
class_insights: { ... }
intervention_recommendation: { ... }
student_support_action: { ... }
```

---

## Accessibility Considerations

1. **Keyboard Navigation**: Ensure tooltips are accessible via Tab + Enter
2. **Screen Readers**: Use appropriate ARIA labels
3. **Focus Management**: Tooltip shouldn't trap focus
4. **Color Contrast**: All tooltip text meets WCAG AA standards
5. **Timing**: Appropriate delay before showing (300ms default)

---

## Success Metrics

- [ ] 100% of interactive elements have EducationalTooltip
- [ ] All 4 layers populated for each tooltip
- [ ] Academic references provided for design decisions
- [ ] Zero accessibility violations
- [ ] Consistent styling across light/dark modes
