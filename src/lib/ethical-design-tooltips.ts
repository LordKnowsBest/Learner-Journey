import type { EthicalCategory } from "@/components/ui/educational-tooltip";

export interface EthicalTooltipDefinition {
  id: string;
  component: string;
  content: string;
  ethicalDesign: {
    principle: string;
    rationale: string;
    category: EthicalCategory;
    references?: string[];
  };
  pedagogy?: string;
  technical?: string;
}

export const ethicalTooltipDefinitions: Record<string, EthicalTooltipDefinition> = {
  // ============================================
  // TEACHER DASHBOARD TOOLTIPS
  // ============================================

  // Dashboard Overview
  teacher_dashboard_overview: {
    id: "teacher_dashboard_overview",
    component: "TeacherDashboard",
    content: "Monitor class progress, identify struggling students, and track curriculum pacing.",
    ethicalDesign: {
      principle: "Teacher Empowerment",
      rationale: "Dashboards should inform pedagogical decisions, not replace teacher judgment. Data serves the teacher's professional expertise.",
      category: "autonomy",
      references: ["Selwyn 2019 - What's the Problem with Learning Analytics"],
    },
    pedagogy: "Aggregate views help identify patterns while individual views support targeted intervention.",
    technical: "Real-time data aggregation with configurable refresh intervals.",
  },

  // Metric Cards
  metric_active_today: {
    id: "metric_active_today",
    component: "MetricCard",
    content: "Number of students who have logged in and engaged with content today.",
    ethicalDesign: {
      principle: "Meaningful Metrics",
      rationale: "Attendance tracking focuses on engagement, not surveillance. Login counts are proxies for opportunity, not performance.",
      category: "privacy",
      references: ["FERPA", "Student Privacy Compass"],
    },
    pedagogy: "Daily active counts help gauge class momentum without individual judgment.",
    technical: "Calculated from session start events, anonymized until aggregated.",
  },

  metric_time_on_task: {
    id: "metric_time_on_task",
    component: "MetricCard",
    content: "Average active learning time per engaged student session.",
    ethicalDesign: {
      principle: "Time as Opportunity",
      rationale: "Time metrics inform resource allocation, not student evaluation. Speed is not an indicator of mastery.",
      category: "fairness",
      references: ["Dweck Growth Mindset", "UDL Guidelines"],
    },
    pedagogy: "Time-on-task correlates with engagement, but mastery requires depth over duration.",
    technical: "Active time excludes idle periods > 2 minutes.",
  },

  metric_concepts_mastered: {
    id: "metric_concepts_mastered",
    component: "MetricCard",
    content: "Average number of concepts mastered per student out of total curriculum.",
    ethicalDesign: {
      principle: "Progress Over Performance",
      rationale: "Mastery counts show growth trajectory. Every student starts at zero - what matters is the journey.",
      category: "fairness",
      references: ["Bloom's Mastery Learning"],
    },
    pedagogy: "Competency-based progression allows students to advance at their own pace.",
    technical: "Mastery threshold: 70% on concept quiz, confirmed by application.",
  },

  metric_avg_mastery: {
    id: "metric_avg_mastery",
    component: "MetricCard",
    content: "Aggregate mastery score based on assessments and investigation depth.",
    ethicalDesign: {
      principle: "Holistic Assessment",
      rationale: "Single scores obscure individual stories. Averages inform curriculum, not student worth.",
      category: "fairness",
      references: ["AERA Standards for Educational Testing"],
    },
    pedagogy: "Class averages identify curriculum gaps, not student deficiencies.",
    technical: "Weighted average: 60% quiz scores, 40% investigation depth.",
  },

  // Alert System
  intervention_alert: {
    id: "intervention_alert",
    component: "AlertBanner",
    content: "A student may need support based on engagement patterns.",
    ethicalDesign: {
      principle: "Supportive Flagging",
      rationale: "Alerts prompt teacher outreach, not automated consequences. The teacher decides appropriate response.",
      category: "autonomy",
      references: ["Biesta 2010 - Good Education in an Age of Measurement"],
    },
    pedagogy: "Early intervention prevents frustration. Alerts are opportunities, not accusations.",
    technical: "Tiered alerts: Monitor (3 days), Warning (5 days), Critical (7 days of struggle).",
  },

  alert_critical: {
    id: "alert_critical",
    component: "AlertBanner",
    content: "Critical alert: Student has shown significant disengagement or struggle.",
    ethicalDesign: {
      principle: "Escalation with Care",
      rationale: "Critical alerts warrant personal outreach. The system flags; the teacher connects.",
      category: "fairness",
      references: ["RTI Framework - Response to Intervention"],
    },
    pedagogy: "Disengagement often signals external factors. Alerts prompt inquiry, not punishment.",
    technical: "Triggered by: 7+ days inactive, repeated failure, or sentiment indicators.",
  },

  alert_warning: {
    id: "alert_warning",
    component: "AlertBanner",
    content: "Warning: Student showing early signs of struggle or reduced engagement.",
    ethicalDesign: {
      principle: "Proactive Support",
      rationale: "Early warnings enable preventive support before frustration compounds.",
      category: "fairness",
      references: ["MTSS Multi-Tiered System of Supports"],
    },
    pedagogy: "Catching struggle early preserves student confidence and motivation.",
    technical: "Triggered by: 3-5 days below 50% engagement or repeated incorrect attempts.",
  },

  // Student Roster
  student_roster: {
    id: "student_roster",
    component: "TeacherDashboard",
    content: "Real-time progress monitoring for all students in the class.",
    ethicalDesign: {
      principle: "Respectful Monitoring",
      rationale: "Student data supports teaching, not ranking. Names appear for teacher context, not public display.",
      category: "privacy",
      references: ["FERPA", "Student Data Privacy Consortium"],
    },
    pedagogy: "Individual tracking enables differentiated instruction and personalized support.",
    technical: "Data visible only to assigned teacher, encrypted at rest.",
  },

  learning_signal_score: {
    id: "learning_signal_score",
    component: "StudentPill",
    content: "Composite engagement score based on multiple learning signals.",
    ethicalDesign: {
      principle: "Multi-Signal Assessment",
      rationale: "Single metrics are reductive. Learning signals combine engagement, progress, and depth.",
      category: "transparency",
      references: ["Learning Analytics Ethics Guidelines"],
    },
    pedagogy: "Composite signals provide richer picture than any single measure.",
    technical: "Weights: Engagement (30%), Progress (40%), Depth (30%).",
  },

  student_status_pill: {
    id: "student_status_pill",
    component: "StudentPill",
    content: "Current learning status: On Track, Needs Help, or At Risk.",
    ethicalDesign: {
      principle: "Status as Snapshot",
      rationale: "Status labels are temporary states, not permanent categories. Students can always improve.",
      category: "fairness",
      references: ["Growth Mindset Research"],
    },
    pedagogy: "Status categories prompt action, not judgment. Every status can change.",
    technical: "Status recalculated daily based on trailing 7-day patterns.",
  },

  // Dashboard Tabs
  tab_class_overview: {
    id: "tab_class_overview",
    component: "TeacherDashboard",
    content: "Aggregate view of class performance and engagement.",
    ethicalDesign: {
      principle: "Big Picture First",
      rationale: "Class-level views inform curriculum decisions before drilling into individuals.",
      category: "privacy",
      references: ["Privacy by Design Principles"],
    },
    pedagogy: "Aggregate patterns reveal curriculum issues before individual struggles.",
    technical: "Aggregated data refreshes every 5 minutes.",
  },

  tab_individual_progress: {
    id: "tab_individual_progress",
    component: "IndividualProgressTab",
    content: "Detailed progress tracking for each student.",
    ethicalDesign: {
      principle: "Individual Context",
      rationale: "Individual views provide context for personalized support, not comparison or ranking.",
      category: "fairness",
      references: ["UDL Guidelines 2.0"],
    },
    pedagogy: "Each student's journey is unique. Individual views support differentiated instruction.",
    technical: "Searchable and filterable by name, status, or progress.",
  },

  tab_learning_paths: {
    id: "tab_learning_paths",
    component: "LearningPathsTab",
    content: "Curriculum velocity and pacing analysis.",
    ethicalDesign: {
      principle: "Curriculum Transparency",
      rationale: "Making curriculum structure visible helps teachers and students understand the learning journey.",
      category: "transparency",
      references: ["Backwards Design - Wiggins & McTighe"],
    },
    pedagogy: "Visible learning paths support metacognition and self-regulation.",
    technical: "Module completion tracked with mastery gates.",
  },

  tab_reports: {
    id: "tab_reports",
    component: "ReportsTab",
    content: "Generate and export class performance reports.",
    ethicalDesign: {
      principle: "Data Portability",
      rationale: "Teachers own their class data. Export enables external analysis and archiving.",
      category: "autonomy",
      references: ["GDPR Article 20 - Data Portability"],
    },
    pedagogy: "Reports support parent conferences, IEP meetings, and professional reflection.",
    technical: "Export formats: CSV, PDF. Data anonymization available.",
  },

  // Reports Section
  report_standards_alignment: {
    id: "report_standards_alignment",
    component: "ReportsTab",
    content: "Curriculum coverage mapped to CSTA and AI4K12 standards.",
    ethicalDesign: {
      principle: "Standards Transparency",
      rationale: "Making standards alignment visible ensures curriculum meets required competencies.",
      category: "transparency",
      references: ["CSTA K-12 CS Standards", "AI4K12 Five Big Ideas"],
    },
    pedagogy: "Standards mapping ensures comprehensive coverage and identifies gaps.",
    technical: "Standards tagged to individual modules and activities.",
  },

  report_export_csv: {
    id: "report_export_csv",
    component: "ReportsTab",
    content: "Download class data in CSV format for external analysis.",
    ethicalDesign: {
      principle: "Teacher Data Ownership",
      rationale: "Teachers should be able to export and analyze their class data using preferred tools.",
      category: "autonomy",
      references: ["FERPA - Teacher Access Rights"],
    },
    pedagogy: "External analysis tools may reveal patterns not visible in platform.",
    technical: "CSV includes: student ID, progress, timestamps. PII excluded by default.",
  },

  // Pacing Alerts
  pacing_alert: {
    id: "pacing_alert",
    component: "LearningPathsTab",
    content: "Students behind schedule on curriculum pacing.",
    ethicalDesign: {
      principle: "Pacing as Guide",
      rationale: "Pacing alerts help teachers adjust, not pressure students. Timelines are flexible.",
      category: "fairness",
      references: ["Mastery-Based Progression Research"],
    },
    pedagogy: "When many students lag, consider curriculum adjustment over acceleration.",
    technical: "Pacing calculated against planned curriculum timeline.",
  },

  content_insights: {
    id: "content_insights",
    component: "LearningPathsTab",
    content: "Analytics on which content resonates or causes friction.",
    ethicalDesign: {
      principle: "Content Quality Feedback",
      rationale: "Content insights improve curriculum, not student grades. Friction indicates design issues.",
      category: "transparency",
      references: ["Learning Engineering Research"],
    },
    pedagogy: "High-friction content may need redesign, not more student effort.",
    technical: "Friction score: time-to-complete + hint requests + retry rate.",
  },

  // ============================================
  // PROBLEMS PAGE TOOLTIPS
  // ============================================

  problem_difficulty_beginner: {
    id: "problem_difficulty_beginner",
    component: "ProblemsPage",
    content: "A great starting point with fundamental AI ethics concepts and guided support.",
    ethicalDesign: {
      principle: "Scaffolded Difficulty",
      rationale: "Clear difficulty levels help learners self-select appropriate challenges.",
      category: "autonomy",
      references: ["Vygotsky ZPD", "Scaffolding Theory"],
    },
    pedagogy: "Beginner problems introduce core concepts with more guidance and simpler scenarios.",
    technical: "Difficulty calculated from concept count, question complexity, and prerequisite depth.",
  },

  problem_difficulty_intermediate: {
    id: "problem_difficulty_intermediate",
    component: "ProblemsPage",
    content: "Builds on basic concepts with deeper critical thinking required.",
    ethicalDesign: {
      principle: "Progressive Challenge",
      rationale: "Intermediate problems bridge foundational and advanced understanding.",
      category: "autonomy",
      references: ["Zone of Proximal Development"],
    },
    pedagogy: "Intermediate scenarios involve multiple stakeholders and competing values.",
    technical: "Requires 2+ prerequisite concepts mastered.",
  },

  problem_difficulty_advanced: {
    id: "problem_difficulty_advanced",
    component: "ProblemsPage",
    content: "Complex ethical dilemmas with multiple perspectives. Best after completing easier problems.",
    ethicalDesign: {
      principle: "Appropriate Challenge",
      rationale: "Advanced problems reward prior learning without gatekeeping exploration.",
      category: "fairness",
      references: ["Flow Theory - Csikszentmihalyi"],
    },
    pedagogy: "Advanced scenarios feature nuanced tradeoffs with no clear 'right' answer.",
    technical: "Requires 4+ prerequisite concepts or strong performance on intermediate.",
  },

  problem_estimated_time: {
    id: "problem_estimated_time",
    component: "ProblemsPage",
    content: "Approximate time to complete the investigation.",
    ethicalDesign: {
      principle: "Time Transparency",
      rationale: "Time estimates help learners plan without creating pressure. Actual pace varies.",
      category: "autonomy",
      references: ["Self-Regulated Learning"],
    },
    pedagogy: "Time estimates support planning. Faster or slower is equally valid.",
    technical: "Estimates based on median completion time from pilot data.",
  },

  problem_stakeholders: {
    id: "problem_stakeholders",
    component: "ProblemsPage",
    content: "Different people affected by this situation. You'll consider each perspective.",
    ethicalDesign: {
      principle: "Perspective-Taking",
      rationale: "Ethics requires understanding multiple viewpoints. Stakeholders make impacts concrete.",
      category: "fairness",
      references: ["Moral Imagination - Johnson"],
    },
    pedagogy: "Considering stakeholders develops empathy and ethical reasoning.",
    technical: "Each stakeholder has defined role, concerns, and preferred outcomes.",
  },

  problem_tags: {
    id: "problem_tags",
    component: "ProblemsPage",
    content: "Key themes and concepts covered in this problem.",
    ethicalDesign: {
      principle: "Content Preview",
      rationale: "Tags help learners choose problems aligned with their interests or needs.",
      category: "autonomy",
      references: ["Interest-Driven Learning"],
    },
    pedagogy: "Tags support self-directed exploration and curriculum navigation.",
    technical: "Tags linked to concept map for progress tracking.",
  },

  problem_start_investigation: {
    id: "problem_start_investigation",
    component: "ProblemsPage",
    content: "Begin exploring this ethical dilemma through guided investigation.",
    ethicalDesign: {
      principle: "Voluntary Engagement",
      rationale: "Choosing to investigate supports intrinsic motivation.",
      category: "autonomy",
      references: ["Self-Determination Theory"],
    },
    pedagogy: "Investigation mode encourages active inquiry over passive consumption.",
    technical: "Creates session, initializes progress tracking.",
  },

  concepts_discovered_count: {
    id: "concepts_discovered_count",
    component: "ProblemsPage",
    content: "Total AI ethics concepts you've learned across all problems.",
    ethicalDesign: {
      principle: "Progress Celebration",
      rationale: "Visible progress reinforces learning without creating competition.",
      category: "engagement",
      references: ["Progress Principle - Amabile"],
    },
    pedagogy: "Counting discoveries motivates continued exploration.",
    technical: "Aggregated from all problem session discoveries.",
  },

  // ============================================
  // CONCEPT MAP / GRAPH PAGE TOOLTIPS
  // ============================================

  concept_map_overview: {
    id: "concept_map_overview",
    component: "ConceptMapPage",
    content: "Visualize how AI ethics concepts connect and build on each other.",
    ethicalDesign: {
      principle: "Knowledge Visibility",
      rationale: "Making concept relationships visible supports deeper understanding.",
      category: "transparency",
      references: ["Concept Mapping - Novak"],
    },
    pedagogy: "Concept maps externalize knowledge structure, supporting metacognition.",
    technical: "Graph rendered with force-directed layout. Discovered concepts highlighted.",
  },

  concept_discovered: {
    id: "concept_discovered",
    component: "ConceptCard",
    content: "You've explored this concept through investigation.",
    ethicalDesign: {
      principle: "Achievement Recognition",
      rationale: "Discovered concepts represent genuine learning accomplishments.",
      category: "engagement",
      references: ["Competency-Based Education"],
    },
    pedagogy: "Discovery through investigation creates deeper understanding than passive reading.",
    technical: "Marked discovered when concept appears in investigation and quiz passed.",
  },

  concept_locked: {
    id: "concept_locked",
    component: "ConceptCard",
    content: "Discover this concept by investigating related problems.",
    ethicalDesign: {
      principle: "Intrinsic Discovery",
      rationale: "Locked concepts create curiosity without frustration. Discovery is always possible.",
      category: "engagement",
      references: ["Curiosity Gap Theory"],
    },
    pedagogy: "Hiding content until discovery maintains investigation authenticity.",
    technical: "Preview hidden with blur filter. Unlocks on first discovery event.",
  },

  concept_mastery_progress: {
    id: "concept_mastery_progress",
    component: "ConceptCard",
    content: "Your understanding level based on demonstrated knowledge.",
    ethicalDesign: {
      principle: "Growth Visualization",
      rationale: "Progress bars show growth trajectory, not fixed ability.",
      category: "fairness",
      references: ["Growth Mindset - Dweck"],
    },
    pedagogy: "Mastery increases through practice and application, not time.",
    technical: "Mastery score: quiz (50%) + investigation depth (30%) + application (20%).",
  },

  concept_connections: {
    id: "concept_connections",
    component: "ConceptMapPage",
    content: "See how concepts you've discovered relate to each other.",
    ethicalDesign: {
      principle: "Relationship Visibility",
      rationale: "Showing connections helps learners build integrated understanding.",
      category: "transparency",
      references: ["Knowledge Integration - Linn"],
    },
    pedagogy: "Concept connections reveal the structure of the domain.",
    technical: "Connections appear when both endpoints are discovered.",
  },

  concept_relationship_builds_on: {
    id: "concept_relationship_builds_on",
    component: "ConceptMapPage",
    content: "This concept builds on foundational understanding from another.",
    ethicalDesign: {
      principle: "Prerequisite Transparency",
      rationale: "Making prerequisites visible helps learners plan their journey.",
      category: "transparency",
    },
    pedagogy: "Understanding prerequisites supports effective sequencing.",
    technical: "Directed edge indicating dependency relationship.",
  },

  concept_relationship_contrasts: {
    id: "concept_relationship_contrasts",
    component: "ConceptMapPage",
    content: "These concepts present contrasting or competing perspectives.",
    ethicalDesign: {
      principle: "Nuance Recognition",
      rationale: "Showing contrasts prevents oversimplification of complex topics.",
      category: "fairness",
    },
    pedagogy: "Contrasting concepts develop critical thinking.",
    technical: "Bidirectional edge indicating tension relationship.",
  },

  // ============================================
  // JOURNEY SUMMARY / PROGRESS PAGE TOOLTIPS
  // ============================================

  journey_overview: {
    id: "journey_overview",
    component: "JourneySummaryPage",
    content: "Celebrate your learning accomplishments and see what's next.",
    ethicalDesign: {
      principle: "Progress Celebration",
      rationale: "Summarizing progress reinforces learning without comparison to others.",
      category: "engagement",
      references: ["Self-Efficacy Theory - Bandura"],
    },
    pedagogy: "Reflection on progress builds confidence and motivation.",
    technical: "Aggregates all session data into summary metrics.",
  },

  stat_problems_solved: {
    id: "stat_problems_solved",
    component: "JourneySummaryPage",
    content: "Number of ethical dilemmas you've fully investigated.",
    ethicalDesign: {
      principle: "Completion Recognition",
      rationale: "Problem completion represents genuine engagement with complex scenarios.",
      category: "engagement",
    },
    pedagogy: "Completing problems shows commitment to understanding complexity.",
    technical: "Counted when all phases complete and reflection submitted.",
  },

  stat_concepts_discovered: {
    id: "stat_concepts_discovered",
    component: "JourneySummaryPage",
    content: "AI ethics concepts you've explored and understood.",
    ethicalDesign: {
      principle: "Knowledge Growth",
      rationale: "Discovery counts represent expanding understanding.",
      category: "engagement",
    },
    pedagogy: "Each discovery represents new understanding of AI ethics.",
    technical: "Unique concept IDs from all completed investigations.",
  },

  stat_average_mastery: {
    id: "stat_average_mastery",
    component: "JourneySummaryPage",
    content: "Your overall understanding level across all discovered concepts.",
    ethicalDesign: {
      principle: "Holistic Progress",
      rationale: "Average mastery shows overall growth without penalizing exploration.",
      category: "fairness",
    },
    pedagogy: "Averaging across concepts encourages breadth with depth.",
    technical: "Mean of all concept mastery scores, minimum 0.",
  },

  stat_connections_made: {
    id: "stat_connections_made",
    component: "JourneySummaryPage",
    content: "Relationships between concepts you've discovered.",
    ethicalDesign: {
      principle: "Integration Recognition",
      rationale: "Connections represent deeper understanding than isolated concepts.",
      category: "engagement",
    },
    pedagogy: "Making connections builds transferable understanding.",
    technical: "Count of edges where both endpoints discovered.",
  },

  whats_next_section: {
    id: "whats_next_section",
    component: "JourneySummaryPage",
    content: "Concepts and problems waiting for your exploration.",
    ethicalDesign: {
      principle: "Growth Orientation",
      rationale: "Showing what's next maintains momentum without pressure.",
      category: "autonomy",
    },
    pedagogy: "Future opportunities inspire continued learning.",
    technical: "Filters undiscovered concepts and incomplete problems.",
  },

  start_fresh_button: {
    id: "start_fresh_button",
    component: "JourneySummaryPage",
    content: "Reset your progress and begin a new learning journey.",
    ethicalDesign: {
      principle: "Right to Start Over",
      rationale: "Learners should always have the option to begin again.",
      category: "autonomy",
      references: ["GDPR Right to Erasure"],
    },
    pedagogy: "Fresh starts can reignite motivation without shame.",
    technical: "Clears session storage. Optional data deletion.",
  },

  // ============================================
  // SETTINGS PAGE TOOLTIPS
  // ============================================

  settings_llm_router: {
    id: "settings_llm_router",
    component: "SettingsPage",
    content: "Configure AI providers and optimize performance for different tasks.",
    ethicalDesign: {
      principle: "AI Transparency",
      rationale: "Users should understand and control which AI systems they interact with.",
      category: "transparency",
      references: ["EU AI Act - Transparency Requirements"],
    },
    pedagogy: "Understanding AI configuration develops AI literacy.",
    technical: "Multi-provider routing with fallback support.",
  },

  settings_api_providers: {
    id: "settings_api_providers",
    component: "SettingsPage",
    content: "Connect different AI providers to power the learning assistant.",
    ethicalDesign: {
      principle: "Provider Choice",
      rationale: "Users should choose AI providers aligned with their values and needs.",
      category: "autonomy",
    },
    pedagogy: "Provider selection teaches about AI ecosystem diversity.",
    technical: "Supports OpenAI, Anthropic, Google, Groq with hot-swapping.",
  },

  settings_task_routing: {
    id: "settings_task_routing",
    component: "SettingsPage",
    content: "Assign AI providers to specific task types for optimal performance.",
    ethicalDesign: {
      principle: "Purposeful AI Use",
      rationale: "Different AI models excel at different tasks. Routing optimizes quality.",
      category: "transparency",
    },
    pedagogy: "Task routing demonstrates that AI systems have different strengths.",
    technical: "Routes by task type: questioning, inference, explanation, feedback.",
  },

  settings_provider_test: {
    id: "settings_provider_test",
    component: "SettingsPage",
    content: "Verify that your AI provider connection is working correctly.",
    ethicalDesign: {
      principle: "Verifiable Function",
      rationale: "Users should be able to confirm their configuration works.",
      category: "transparency",
    },
    pedagogy: "Testing connections develops debugging and verification skills.",
    technical: "Sends test prompt and measures latency.",
  },

  settings_privacy_note: {
    id: "settings_privacy_note",
    component: "SettingsPage",
    content: "Your API keys are stored locally and never sent to our servers.",
    ethicalDesign: {
      principle: "Local-First Privacy",
      rationale: "Sensitive credentials should remain under user control.",
      category: "privacy",
      references: ["Privacy by Design - Cavoukian"],
    },
    pedagogy: "Understanding key storage teaches about credential security.",
    technical: "Keys stored in localStorage, never transmitted to backend.",
  },

  // ============================================
  // LEARN PAGE TOOLTIPS
  // ============================================

  learn_video_content: {
    id: "learn_video_content",
    component: "LearnPage",
    content: "Watch this video to build understanding before the quiz.",
    ethicalDesign: {
      principle: "Multimodal Learning",
      rationale: "Video content supports diverse learning preferences and accessibility.",
      category: "accessibility",
      references: ["UDL Principle - Multiple Means of Representation"],
    },
    pedagogy: "Video provides context and examples that text alone may not convey.",
    technical: "Embedded YouTube player with privacy-enhanced mode.",
  },

  learn_article_link: {
    id: "learn_article_link",
    component: "LearnPage",
    content: "Read this article for deeper understanding of the concept.",
    ethicalDesign: {
      principle: "Resource Availability",
      rationale: "External resources extend learning beyond platform boundaries.",
      category: "autonomy",
    },
    pedagogy: "Articles provide depth and permanence that videos may lack.",
    technical: "External link opens in new tab with noopener.",
  },

  learn_quiz_ready: {
    id: "learn_quiz_ready",
    component: "LearnPage",
    content: "Take the quiz when you feel confident about the material.",
    ethicalDesign: {
      principle: "Self-Paced Assessment",
      rationale: "Learners choose when they're ready. No time pressure.",
      category: "autonomy",
      references: ["Mastery Learning - Bloom"],
    },
    pedagogy: "Self-determined readiness reduces test anxiety.",
    technical: "Quiz attempt tracked. Retry available after review.",
  },

  learn_ai_tutor: {
    id: "learn_ai_tutor",
    component: "LearnPage",
    content: "Ask the AI tutor questions about this concept.",
    ethicalDesign: {
      principle: "On-Demand Support",
      rationale: "AI tutoring provides help when needed without judgment.",
      category: "autonomy",
    },
    pedagogy: "Just-in-time support prevents frustration without providing answers.",
    technical: "Context-aware tutor scoped to current concept.",
  },

  // ============================================
  // QUIZ COMPONENT TOOLTIPS
  // ============================================

  quiz_progress_bar: {
    id: "quiz_progress_bar",
    component: "Quiz",
    content: "Shows how far you are through the quiz.",
    ethicalDesign: {
      principle: "Progress Awareness",
      rationale: "Visible progress reduces uncertainty and anxiety.",
      category: "transparency",
    },
    pedagogy: "Progress indicators support self-regulation during assessment.",
    technical: "Calculated as (current + 1) / total questions.",
  },

  quiz_question_display: {
    id: "quiz_question_display",
    component: "Quiz",
    content: "Read carefully and select the best answer.",
    ethicalDesign: {
      principle: "Clear Assessment",
      rationale: "Questions should be unambiguous and focused on understanding.",
      category: "fairness",
      references: ["AERA Assessment Standards"],
    },
    pedagogy: "Well-designed questions assess understanding, not trick knowledge.",
    technical: "Multiple choice with single correct answer.",
  },

  quiz_answer_options: {
    id: "quiz_answer_options",
    component: "Quiz",
    content: "Click to select your answer. You can change before submitting.",
    ethicalDesign: {
      principle: "Changeable Responses",
      rationale: "Allowing changes reduces pressure and supports reflection.",
      category: "autonomy",
    },
    pedagogy: "Revision opportunity encourages careful consideration.",
    technical: "Radio group with controlled state.",
  },

  quiz_submit_button: {
    id: "quiz_submit_button",
    component: "Quiz",
    content: "Submit your quiz to see results and explanations.",
    ethicalDesign: {
      principle: "Clear Submission",
      rationale: "Submission should be explicit and provide immediate feedback.",
      category: "transparency",
    },
    pedagogy: "Immediate feedback supports learning from assessment.",
    technical: "Triggers score calculation and result display.",
  },

  quiz_results_display: {
    id: "quiz_results_display",
    component: "Quiz",
    content: "Your score with explanations for each question.",
    ethicalDesign: {
      principle: "Formative Feedback",
      rationale: "Results should teach, not just judge. Explanations extend learning.",
      category: "fairness",
      references: ["Black & Wiliam 1998 - Formative Assessment"],
    },
    pedagogy: "Explanations turn assessment into learning opportunity.",
    technical: "Shows correct/incorrect per question with stored explanations.",
  },

  quiz_explanation: {
    id: "quiz_explanation",
    component: "Quiz",
    content: "Why this answer is correct and how it relates to the concept.",
    ethicalDesign: {
      principle: "Learning from Errors",
      rationale: "Explanations make incorrect answers valuable learning moments.",
      category: "fairness",
    },
    pedagogy: "Understanding 'why' builds transferable knowledge.",
    technical: "Pre-written explanations keyed to each question.",
  },

  quiz_retry_option: {
    id: "quiz_retry_option",
    component: "Quiz",
    content: "Review the material and try the quiz again.",
    ethicalDesign: {
      principle: "Multiple Attempts",
      rationale: "Learning takes time. Retry without penalty supports mastery.",
      category: "fairness",
      references: ["Mastery Learning"],
    },
    pedagogy: "Retry opportunity converts failure into growth.",
    technical: "No attempt limit. Previous attempts logged for analysis.",
  },

  // ============================================
  // SOCRATIC CHAT TOOLTIPS
  // ============================================

  socratic_ai_guide: {
    id: "socratic_ai_guide",
    component: "SocraticChat",
    content: "Your AI learning companion guides discovery through questions.",
    ethicalDesign: {
      principle: "Guided Discovery",
      rationale: "Socratic method develops thinking skills, not just content knowledge.",
      category: "autonomy",
      references: ["Socratic Method - Collins & Stevens"],
    },
    pedagogy: "Questions prompt deeper thinking than provided answers.",
    technical: "LLM prompted with Socratic pedagogy guidelines.",
  },

  socratic_mode_questioning: {
    id: "socratic_mode_questioning",
    component: "SocraticChat",
    content: "The AI asks questions to guide your thinking.",
    ethicalDesign: {
      principle: "Scaffolded Independence",
      rationale: "Questions develop learner agency over answer dependency.",
      category: "autonomy",
    },
    pedagogy: "Questioning mode promotes active reasoning.",
    technical: "Tutor mode: socratic. Prompt emphasizes open questions.",
  },

  socratic_mode_hinting: {
    id: "socratic_mode_hinting",
    component: "SocraticChat",
    content: "The AI provides subtle clues without giving away answers.",
    ethicalDesign: {
      principle: "Graduated Assistance",
      rationale: "Hints maintain productive struggle while preventing frustration.",
      category: "autonomy",
      references: ["Kapur - Productive Failure"],
    },
    pedagogy: "Hints preserve discovery while reducing unproductive struggle.",
    technical: "Tutor mode: hint. Triggered after stuck indicators.",
  },

  socratic_mode_explaining: {
    id: "socratic_mode_explaining",
    component: "SocraticChat",
    content: "The AI provides direct explanations when needed.",
    ethicalDesign: {
      principle: "Appropriate Scaffolding",
      rationale: "Sometimes direct explanation is most helpful. Mode adapts to need.",
      category: "fairness",
    },
    pedagogy: "Explanation mode used after discovery or when stuck too long.",
    technical: "Tutor mode: explain. Activated after 3+ stuck indicators.",
  },

  socratic_mode_challenging: {
    id: "socratic_mode_challenging",
    component: "SocraticChat",
    content: "The AI pushes you to think deeper and consider complexity.",
    ethicalDesign: {
      principle: "Appropriate Challenge",
      rationale: "Advanced learners benefit from increased complexity.",
      category: "fairness",
      references: ["Flow Theory"],
    },
    pedagogy: "Challenge mode extends thinking for quick learners.",
    technical: "Tutor mode: challenge. Activated for high performers.",
  },

  socratic_suggested_concept: {
    id: "socratic_suggested_concept",
    component: "SocraticChat",
    content: "The AI noticed this concept is relevant. Click to mark discovered.",
    ethicalDesign: {
      principle: "AI-Assisted Discovery",
      rationale: "AI helps surface relevant concepts without replacing learner agency.",
      category: "transparency",
    },
    pedagogy: "Concept suggestions connect conversation to curriculum.",
    technical: "Extracted from LLM response metadata.",
  },

  socratic_input_field: {
    id: "socratic_input_field",
    component: "SocraticChat",
    content: "Share your thoughts, ask questions, or respond to the guide.",
    ethicalDesign: {
      principle: "Open Expression",
      rationale: "Learners should feel safe sharing confusion and partial understanding.",
      category: "privacy",
    },
    pedagogy: "Expressing thinking externalizes reasoning for reflection.",
    technical: "Free-text input. No character limit.",
  },

  socratic_send_button: {
    id: "socratic_send_button",
    component: "SocraticChat",
    content: "Send your message to the AI guide.",
    ethicalDesign: {
      principle: "Controlled Submission",
      rationale: "Explicit send action gives learners control over timing.",
      category: "autonomy",
    },
    pedagogy: "Pause before sending encourages reflection.",
    technical: "Debounced. Keyboard shortcut: Enter.",
  },
  // TRANSPARENCY
  explainability_panel: {
    id: "explainability_panel",
    component: "ExplainabilitySidebar",
    content: "View how the AI makes decisions to support your learning.",
    ethicalDesign: {
      principle: "Right to Algorithmic Explanation",
      rationale: "Users should understand how AI systems affect them. This implements glass-box AI design.",
      category: "transparency",
      references: ["GDPR Art. 22", "ACM FAT* 2020"],
    },
    pedagogy: "Metacognitive awareness of AI tutoring develops critical evaluation skills.",
  },

  confidence_badge: {
    id: "confidence_badge",
    component: "ExplainabilityEntryCard",
    content: "Shows how certain the AI is about this decision.",
    ethicalDesign: {
      principle: "Uncertainty Communication",
      rationale: "Presenting confidence levels prevents over-reliance on AI.",
      category: "transparency",
      references: ["Bhatt et al. 2021"],
    },
    pedagogy: "Understanding AI uncertainty develops information literacy.",
  },

  tutor_mode_indicator: {
    id: "tutor_mode_indicator",
    component: "SocraticChat",
    content: "The current teaching approach the AI is using.",
    ethicalDesign: {
      principle: "Behavioral Transparency",
      rationale: "Learners should know when AI changes its approach.",
      category: "transparency",
      references: ["Dignum 2019"],
    },
    pedagogy: "Mode awareness helps learners recognize scaffolding.",
  },

  // AUTONOMY
  problem_selection: {
    id: "problem_selection",
    component: "ProblemCard",
    content: "Choose a scenario that interests you.",
    ethicalDesign: {
      principle: "Self-Directed Learning",
      rationale: "Interest-driven learning increases intrinsic motivation.",
      category: "autonomy",
      references: ["Deci & Ryan SDT"],
    },
    pedagogy: "Choice activates intrinsic motivation in PBL.",
  },

  socratic_questioning: {
    id: "socratic_questioning",
    component: "SocraticChat",
    content: "The AI asks questions to help you discover answers yourself.",
    ethicalDesign: {
      principle: "Scaffolded Independence",
      rationale: "Giving direct answers creates dependency.",
      category: "autonomy",
      references: ["Vygotsky ZPD", "Bruner Scaffolding"],
    },
    pedagogy: "Questioning promotes deeper processing than direct instruction.",
  },

  hint_progression: {
    id: "hint_progression",
    component: "SocraticChat",
    content: "Hints become more specific if you're stuck.",
    ethicalDesign: {
      principle: "Graduated Assistance",
      rationale: "Immediate full help undermines learning.",
      category: "autonomy",
      references: ["Kapur Productive Failure"],
    },
    pedagogy: "Appropriate challenge is essential for learning.",
  },

  // PRIVACY
  session_data: {
    id: "session_data",
    component: "SessionContext",
    content: "Your progress is saved locally.",
    ethicalDesign: {
      principle: "Data Minimization",
      rationale: "We collect only what is necessary for learning.",
      category: "privacy",
      references: ["GDPR Art. 5", "Privacy by Design"],
    },
    pedagogy: "Safe environments reduce anxiety that impairs learning.",
  },

  gamification_data: {
    id: "gamification_data",
    component: "GamificationContext",
    content: "XP and badges track achievements, not behavior.",
    ethicalDesign: {
      principle: "Reward Without Surveillance",
      rationale: "No time-on-site metrics or engagement manipulation.",
      category: "privacy",
      references: ["Bogost 2011"],
    },
    pedagogy: "Focus on mastery events, not continuous monitoring.",
  },

  teacher_view: {
    id: "teacher_view",
    component: "TeacherDashboard",
    content: "Teachers see aggregated progress to support instruction.",
    ethicalDesign: {
      principle: "Purpose Limitation",
      rationale: "Data supports pedagogical decisions only.",
      category: "privacy",
      references: ["FERPA"],
    },
    pedagogy: "Focus on learning outcomes, not surveillance.",
  },

  // FAIRNESS
  mastery_levels: {
    id: "mastery_levels",
    component: "ConceptCard",
    content: "Your understanding level based on demonstrated knowledge.",
    ethicalDesign: {
      principle: "Growth Mindset Design",
      rationale: "Labels emphasize growth rather than fixed ability.",
      category: "fairness",
      references: ["Dweck 2006"],
    },
    pedagogy: "Mastery framing reduces anxiety and supports persistence.",
  },

  formative_feedback: {
    id: "formative_feedback",
    component: "Quiz",
    content: "Feedback helps you learn, not just judge performance.",
    ethicalDesign: {
      principle: "Formative Over Summative",
      rationale: "Assessment should support learning, not just measure it.",
      category: "fairness",
      references: ["Black & Wiliam 1998"],
    },
    pedagogy: "Formative feedback has larger learning effects than grades.",
  },

  multiple_pathways: {
    id: "multiple_pathways",
    component: "KnowledgeGraph",
    content: "Many routes to understanding - choose what works.",
    ethicalDesign: {
      principle: "Diverse Learning Needs",
      rationale: "Multiple valid routes ensure equitable access.",
      category: "fairness",
      references: ["UDL Guidelines"],
    },
    pedagogy: "Flexibility accommodates varied prior knowledge.",
  },

  // ENGAGEMENT
  xp_system: {
    id: "xp_system",
    component: "XpHud",
    content: "Earn XP for discovering concepts and demonstrating understanding.",
    ethicalDesign: {
      principle: "Intrinsic Motivation Support",
      rationale: "XP rewards learning achievements, not time spent.",
      category: "engagement",
      references: ["Ryan & Deci 2000"],
    },
    pedagogy: "Points tied to learning events support mastery goals.",
  },

  streak_system: {
    id: "streak_system",
    component: "XpHud",
    content: "Your learning streak shows consistent engagement.",
    ethicalDesign: {
      principle: "Optional Engagement",
      rationale: "Streaks are informational, not pressuring.",
      category: "engagement",
      references: ["Humane Tech Principles"],
    },
    pedagogy: "Light recognition without loss aversion manipulation.",
  },

  badge_achievement: {
    id: "badge_achievement",
    component: "BadgeNotification",
    content: "Badges recognize meaningful accomplishments.",
    ethicalDesign: {
      principle: "Meaningful Recognition",
      rationale: "Badges represent genuine achievements.",
      category: "engagement",
      references: ["Mozilla Open Badges"],
    },
    pedagogy: "Achievement recognition supports self-efficacy.",
  },

  level_progression: {
    id: "level_progression",
    component: "XpHud",
    content: "Your level reflects growing expertise in AI ethics.",
    ethicalDesign: {
      principle: "Competency Representation",
      rationale: "Levels represent real skill growth, not arbitrary thresholds.",
      category: "engagement",
      references: ["Competency-Based Progression"],
    },
    pedagogy: "Level systems reflecting actual learning support mastery orientation.",
  },

  // ACCESSIBILITY
  screen_reader_support: {
    id: "screen_reader_support",
    component: "All Components",
    content: "Works with screen readers and keyboard navigation.",
    ethicalDesign: {
      principle: "Universal Design",
      rationale: "Accessibility is a right, not a feature.",
      category: "accessibility",
      references: ["WCAG 2.1 AA"],
    },
    pedagogy: "Accessible design benefits all learners.",
  },

  theme_options: {
    id: "theme_options",
    component: "ModeToggle",
    content: "Switch between light and dark modes.",
    ethicalDesign: {
      principle: "User Preference Respect",
      rationale: "Visual preferences vary by individual and context.",
      category: "accessibility",
      references: ["WCAG 2.1 Guideline 1.4.11"],
    },
    pedagogy: "Dark mode reduces eye strain during long sessions.",
  },

  // NAVIGATION
  nav_problems: {
    id: "nav_problems",
    component: "Header",
    content: "Browse AI ethics scenarios to investigate.",
    ethicalDesign: {
      principle: "Clear Information Architecture",
      rationale: "Navigation should be intuitive and predictable.",
      category: "autonomy",
    },
    pedagogy: "Easy access supports self-directed learning.",
  },

  nav_concepts: {
    id: "nav_concepts",
    component: "Header",
    content: "Explore the knowledge graph of AI ethics concepts.",
    ethicalDesign: {
      principle: "Knowledge Visibility",
      rationale: "Making curriculum structure visible empowers learners.",
      category: "transparency",
    },
    pedagogy: "Visible concept maps support metacognition.",
  },

  nav_progress: {
    id: "nav_progress",
    component: "Header",
    content: "View your learning journey and accomplishments.",
    ethicalDesign: {
      principle: "Self-Monitoring Support",
      rationale: "Learners should access their progress data easily.",
      category: "autonomy",
    },
    pedagogy: "Progress visibility supports self-regulated learning.",
  },

  nav_settings: {
    id: "nav_settings",
    component: "Header",
    content: "Configure preferences and privacy settings.",
    ethicalDesign: {
      principle: "User Control",
      rationale: "Settings should be accessible, not buried.",
      category: "privacy",
    },
    pedagogy: "Personalization supports diverse learning preferences.",
  },

  start_investigation: {
    id: "start_investigation",
    component: "WelcomePage",
    content: "Begin exploring real-world AI ethics dilemmas.",
    ethicalDesign: {
      principle: "Voluntary Engagement",
      rationale: "Learning should be inviting, not coercive.",
      category: "autonomy",
    },
    pedagogy: "Positive framing supports intrinsic motivation.",
  },

  // ============================================
  // EXPLAINABILITY SIDEBAR TOOLTIPS
  // ============================================

  // Activity & Path Tabs
  explainability_activity_log: {
    id: "explainability_activity_log",
    component: "ExplainabilitySidebar",
    content: "View a chronological record of all AI decisions and actions during your learning session.",
    ethicalDesign: {
      principle: "Audit Trail Transparency",
      rationale: "Users deserve access to a complete history of AI actions affecting their experience.",
      category: "transparency",
      references: ["GDPR Art. 22", "IEEE P7000", "ACM FAT* 2020"],
    },
    pedagogy: "Reviewing AI decisions develops critical evaluation skills and metacognitive awareness.",
    technical: "Entries are timestamped and include decision reasoning, confidence levels, and contextual factors.",
  },

  explainability_learning_path: {
    id: "explainability_learning_path",
    component: "ExplainabilitySidebar",
    content: "See how the AI is personalizing your learning journey based on your progress.",
    ethicalDesign: {
      principle: "Adaptive Transparency",
      rationale: "Learners should understand how their path differs from others and why.",
      category: "transparency",
      references: ["Personalized Learning Research", "UDL Guidelines"],
    },
    pedagogy: "Understanding personalization helps learners take ownership of their learning journey.",
    technical: "Path data includes student profile, adaptations made, and predicted outcomes.",
  },

  explainability_viewer_role: {
    id: "explainability_viewer_role",
    component: "ExplainabilitySidebar",
    content: "Switch between different perspectives to see information relevant to students, parents, teachers, or administrators.",
    ethicalDesign: {
      principle: "Role-Based Transparency",
      rationale: "Different stakeholders need different levels of detail and context.",
      category: "transparency",
      references: ["Privacy by Design", "FERPA Guidelines"],
    },
    pedagogy: "Multiple views support collaboration between learners, parents, and educators.",
    technical: "Views filter and present data appropriate to each role's needs and permissions.",
  },

  // Event Type Tooltips
  explainability_event_tutor_response: {
    id: "explainability_event_tutor_response",
    component: "ExplainabilityEntryCard",
    content: "The AI generated a response to guide your learning. Click to see why it chose this approach.",
    ethicalDesign: {
      principle: "Response Justification",
      rationale: "Every AI response should be explainable and pedagogically grounded.",
      category: "transparency",
      references: ["Explainable AI Guidelines", "Pedagogical Agent Research"],
    },
    pedagogy: "Understanding why the AI responded helps learners evaluate and trust guidance.",
    technical: "Response metadata includes mode, confidence, factors considered, and pedagogical intent.",
  },

  explainability_event_mode_change: {
    id: "explainability_event_mode_change",
    component: "ExplainabilityEntryCard",
    content: "The AI adjusted its teaching style based on your progress and needs.",
    ethicalDesign: {
      principle: "Behavioral Transparency",
      rationale: "Learners should know when AI changes its approach and understand why.",
      category: "transparency",
      references: ["Dignum 2019", "Adaptive Learning Research"],
    },
    pedagogy: "Mode changes signal that the AI is responsive to learner needs.",
    technical: "Mode transitions are triggered by engagement patterns, performance, and explicit signals.",
  },

  explainability_event_concept_revealed: {
    id: "explainability_event_concept_revealed",
    component: "ExplainabilityEntryCard",
    content: "You discovered a new AI ethics concept through your investigation.",
    ethicalDesign: {
      principle: "Discovery Recognition",
      rationale: "Celebrating discoveries reinforces the value of exploration.",
      category: "engagement",
      references: ["Discovery Learning Theory", "Bruner"],
    },
    pedagogy: "Concept revelation marks meaningful progress in understanding.",
    technical: "Concepts are revealed when mastery threshold is reached through investigation.",
  },

  explainability_event_phase_transition: {
    id: "explainability_event_phase_transition",
    component: "ExplainabilityEntryCard",
    content: "You completed a learning phase and moved to the next stage.",
    ethicalDesign: {
      principle: "Progress Transparency",
      rationale: "Clear phase transitions help learners understand their journey.",
      category: "transparency",
      references: ["Mastery Learning", "Competency-Based Education"],
    },
    pedagogy: "Phase transitions provide clear milestones and sense of accomplishment.",
    technical: "Transitions require meeting phase-specific mastery criteria.",
  },

  explainability_event_mastery_update: {
    id: "explainability_event_mastery_update",
    component: "ExplainabilityEntryCard",
    content: "Your understanding of a concept has improved based on your responses.",
    ethicalDesign: {
      principle: "Growth Recognition",
      rationale: "Mastery updates should reflect genuine learning, not just activity.",
      category: "fairness",
      references: ["Dweck Growth Mindset", "Knowledge Tracing Research"],
    },
    pedagogy: "Visible mastery growth supports motivation and self-efficacy.",
    technical: "Mastery is calculated using Bayesian knowledge tracing models.",
  },

  explainability_event_path_adaptation: {
    id: "explainability_event_path_adaptation",
    component: "ExplainabilityEntryCard",
    content: "The AI personalized your learning path based on your performance.",
    ethicalDesign: {
      principle: "Personalization Transparency",
      rationale: "Learners should understand how and why their path differs.",
      category: "transparency",
      references: ["Adaptive Learning Ethics", "Personalization Research"],
    },
    pedagogy: "Understanding adaptations helps learners engage with personalized content.",
    technical: "Adaptations consider learning pace, preferences, and performance patterns.",
  },

  explainability_event_hint_triggered: {
    id: "explainability_event_hint_triggered",
    component: "ExplainabilityEntryCard",
    content: "The AI provided a hint to help you progress when you seemed stuck.",
    ethicalDesign: {
      principle: "Supportive Intervention",
      rationale: "Hints should help without undermining learner autonomy.",
      category: "autonomy",
      references: ["Scaffolding Theory", "Productive Failure Research"],
    },
    pedagogy: "Well-timed hints prevent frustration while preserving learning opportunities.",
    technical: "Hint triggers based on time-on-task, repeated errors, and explicit requests.",
  },

  explainability_event_reflection_feedback: {
    id: "explainability_event_reflection_feedback",
    component: "ExplainabilityEntryCard",
    content: "The AI provided feedback on your reflection or solution.",
    ethicalDesign: {
      principle: "Constructive Feedback",
      rationale: "Feedback should guide improvement, not just judge performance.",
      category: "fairness",
      references: ["Formative Assessment", "Feedback Research"],
    },
    pedagogy: "Reflection feedback deepens understanding and develops metacognition.",
    technical: "Feedback is generated based on rubric alignment and concept coverage.",
  },

  // Entry Card Details
  explainability_what_happened: {
    id: "explainability_what_happened",
    component: "ExplainabilityEntryCard",
    content: "A simple description of the action the AI took.",
    ethicalDesign: {
      principle: "Plain Language Explanation",
      rationale: "AI actions should be described in accessible, non-technical terms.",
      category: "transparency",
      references: ["Plain Language Guidelines", "Explainable AI"],
    },
    pedagogy: "Clear explanations help learners understand AI as a tool, not magic.",
    technical: "Generated from event type and contextual data.",
  },

  explainability_reasoning: {
    id: "explainability_reasoning",
    component: "ExplainabilityEntryCard",
    content: "The AI's explanation for why it made this particular decision.",
    ethicalDesign: {
      principle: "Decision Justification",
      rationale: "Algorithmic decisions affecting users should include rationale.",
      category: "transparency",
      references: ["GDPR Art. 22", "Right to Explanation"],
    },
    pedagogy: "Understanding AI reasoning develops critical evaluation skills.",
    technical: "Reasoning is generated from decision factors and pedagogical rules.",
  },

  explainability_factors: {
    id: "explainability_factors",
    component: "ExplainabilityEntryCard",
    content: "These are the inputs the AI used to make its decision.",
    ethicalDesign: {
      principle: "Input Transparency",
      rationale: "Users should know what data influenced AI decisions about them.",
      category: "transparency",
      references: ["Algorithmic Accountability", "GDPR Art. 15"],
    },
    pedagogy: "Seeing factors helps learners understand how their actions affect AI responses.",
    technical: "Factors include engagement metrics, performance data, and session context.",
  },

  explainability_factor_impact: {
    id: "explainability_factor_impact",
    component: "ExplainabilityEntryCard",
    content: "How this factor influenced the AI's decision: positive (+) encouraged, negative (-) discouraged, or neutral (○) no effect.",
    ethicalDesign: {
      principle: "Impact Attribution",
      rationale: "Users should understand how different factors weighted the decision.",
      category: "transparency",
      references: ["Feature Attribution Research", "SHAP Values"],
    },
    pedagogy: "Impact indicators help learners understand cause-and-effect relationships.",
    technical: "Impact is calculated from decision model feature weights.",
  },

  explainability_mode_badge: {
    id: "explainability_mode_badge",
    component: "ExplainabilityEntryCard",
    content: "The teaching mode the AI used: Questioning (asks you to think), Hinting (gives clues), Explaining (teaches directly), or Challenging (pushes deeper).",
    ethicalDesign: {
      principle: "Mode Visibility",
      rationale: "Learners benefit from understanding the pedagogical approach being used.",
      category: "transparency",
      references: ["Pedagogical Agent Research", "Scaffolding Theory"],
    },
    pedagogy: "Mode awareness helps learners recognize different types of support.",
    technical: "Mode is selected based on learner state and pedagogical goals.",
  },

  explainability_related_concepts: {
    id: "explainability_related_concepts",
    component: "ExplainabilityEntryCard",
    content: "AI ethics concepts that are connected to this learning moment.",
    ethicalDesign: {
      principle: "Knowledge Connection",
      rationale: "Showing concept relationships helps build integrated understanding.",
      category: "transparency",
      references: ["Knowledge Graph Learning", "Concept Mapping Research"],
    },
    pedagogy: "Related concepts help learners see the bigger picture of AI ethics.",
    technical: "Concepts are extracted from knowledge graph relationships.",
  },

  // Learning Path Section
  explainability_current_path: {
    id: "explainability_current_path",
    component: "LearningPathSection",
    content: "This explains why the AI has organized your learning in this particular way.",
    ethicalDesign: {
      principle: "Curriculum Transparency",
      rationale: "Learners should understand the logic behind their personalized path.",
      category: "transparency",
      references: ["Adaptive Learning Research", "Curriculum Design"],
    },
    pedagogy: "Understanding path logic helps learners engage purposefully with content.",
    technical: "Path explanation generated from curriculum model and learner profile.",
  },

  explainability_student_profile: {
    id: "explainability_student_profile",
    component: "LearningPathSection",
    content: "A summary of your learning preferences and patterns that the AI has observed.",
    ethicalDesign: {
      principle: "Profile Transparency",
      rationale: "Users should see and understand their learner model.",
      category: "privacy",
      references: ["Open Learner Models", "GDPR Art. 15"],
    },
    pedagogy: "Profile awareness supports metacognition and self-regulated learning.",
    technical: "Profile is continuously updated based on interaction patterns.",
  },

  explainability_learning_pace: {
    id: "explainability_learning_pace",
    component: "LearningPathSection",
    content: "How quickly you tend to move through concepts. The AI adjusts content complexity accordingly.",
    ethicalDesign: {
      principle: "Pace Respect",
      rationale: "Learning pace is individual; faster is not better.",
      category: "fairness",
      references: ["Mastery Learning", "Self-Paced Learning Research"],
    },
    pedagogy: "Pace-aware adaptation ensures appropriate challenge for each learner.",
    technical: "Pace calculated from time-on-concept and mastery achievement rates.",
  },

  explainability_preferred_mode: {
    id: "explainability_preferred_mode",
    component: "LearningPathSection",
    content: "Your preferred way of learning: questioning (discovery), hints (guided), explain (direct), or challenge (advanced).",
    ethicalDesign: {
      principle: "Learning Style Respect",
      rationale: "Preferences should inform, not constrain, AI behavior.",
      category: "autonomy",
      references: ["Learning Preferences Research", "UDL Guidelines"],
    },
    pedagogy: "Honoring preferences increases engagement while stretching learners appropriately.",
    technical: "Preferred mode inferred from interaction patterns and explicit feedback.",
  },

  explainability_strengths: {
    id: "explainability_strengths",
    component: "LearningPathSection",
    content: "Areas where you've shown strong understanding. The AI may build on these when introducing new concepts.",
    ethicalDesign: {
      principle: "Strength-Based Learning",
      rationale: "Building on strengths supports confidence and transfer.",
      category: "fairness",
      references: ["Positive Psychology in Education", "Strength-Based Approaches"],
    },
    pedagogy: "Leveraging strengths creates bridges to new learning.",
    technical: "Strengths identified from consistently high mastery in concept clusters.",
  },

  explainability_areas_for_growth: {
    id: "explainability_areas_for_growth",
    component: "LearningPathSection",
    content: "Topics where additional practice would help. The AI will provide extra support in these areas.",
    ethicalDesign: {
      principle: "Growth Framing",
      rationale: "Areas for growth are opportunities, not deficits.",
      category: "fairness",
      references: ["Growth Mindset", "Formative Assessment"],
    },
    pedagogy: "Growth areas indicate where focused practice will yield the most benefit.",
    technical: "Identified from concepts with persistent below-threshold mastery.",
  },

  explainability_path_adaptations: {
    id: "explainability_path_adaptations",
    component: "LearningPathSection",
    content: "Changes the AI has made to your learning journey to better suit your needs.",
    ethicalDesign: {
      principle: "Adaptation Transparency",
      rationale: "Users should know when and why their path has been modified.",
      category: "transparency",
      references: ["Adaptive Learning Ethics", "Algorithmic Transparency"],
    },
    pedagogy: "Understanding adaptations helps learners appreciate personalization.",
    technical: "Adaptations logged with trigger conditions and expected benefits.",
  },

  // Footer & General
  explainability_footer_info: {
    id: "explainability_footer_info",
    component: "ExplainabilitySidebar",
    content: "Role-specific guidance on what this transparency panel offers.",
    ethicalDesign: {
      principle: "Contextual Help",
      rationale: "Different users need different guidance for the same information.",
      category: "accessibility",
      references: ["User-Centered Design", "Contextual Help Research"],
    },
    pedagogy: "Role-appropriate framing helps users engage with transparency features.",
    technical: "Footer text dynamically selected based on viewer role.",
  },

  explainability_toggle_button: {
    id: "explainability_toggle_button",
    component: "ExplainabilityToggle",
    content: "View how the AI makes decisions to personalize your learning.",
    ethicalDesign: {
      principle: "Accessible Transparency",
      rationale: "Transparency features should be easy to access but not intrusive.",
      category: "transparency",
      references: ["Privacy by Design", "Proactive Transparency"],
    },
    pedagogy: "Optional transparency empowers curious learners without overwhelming others.",
    technical: "Toggle persists preference in session storage.",
  },
};

export function getEthicalTooltip(id: string): EthicalTooltipDefinition | undefined {
  return ethicalTooltipDefinitions[id];
}

export function getTooltipsByCategory(category: EthicalCategory): EthicalTooltipDefinition[] {
  return Object.values(ethicalTooltipDefinitions).filter(
    (def) => def.ethicalDesign.category === category
  );
}

export function getCategoryStats(): Record<EthicalCategory, number> {
  const stats: Record<EthicalCategory, number> = {
    transparency: 0, autonomy: 0, privacy: 0, fairness: 0, engagement: 0, accessibility: 0,
  };
  Object.values(ethicalTooltipDefinitions).forEach((def) => {
    stats[def.ethicalDesign.category]++;
  });
  return stats;
}
