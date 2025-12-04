import type {
  ConceptResource,
  ConceptLink,
  ProblemScenario,
  KnowledgeNode,
  AssessmentQuestion,
} from './types';

// ============================================
// CONCEPT RESOURCES
// Transformed from linear modules to explorable resources
// ============================================

export const conceptResources: ConceptResource[] = [
  {
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
      'Different types of data have different sensitivity levels',
    ],
    relatedConcepts: ['data_collection', 'consent', 'algorithmic_bias'],
    guidingQuestions: [
      'What information about yourself would you feel comfortable sharing publicly?',
      'How might your personal data be used in ways you did not expect?',
      'Who should have access to your personal information?',
    ],
    category: 'Foundations',
  },
  {
    id: 'data_collection',
    title: 'Data Collection Practices',
    description: 'How apps, websites, and AI systems gather information about you.',
    videoUrl: 'https://www.youtube.com/embed/S0zt_b1dK94',
    videoTitle: 'How Apps Collect Data',
    videoDuration: 240,
    articleUrl: 'https://www.consumer.ftc.gov/articles/how-companies-get-your-data-what-they-do-it',
    articleTitle: 'Data Collection Explained',
    keyInsights: [
      'Apps collect data through tracking, cookies, and permissions',
      'Data is valuable - companies use it for ads and product improvement',
      'You often agree to data collection without realizing it',
      'Settings and permissions can limit what data is collected',
    ],
    relatedConcepts: ['privacy', 'consent', 'algorithmic_bias', 'ai_decisions'],
    guidingQuestions: [
      'What data might a social media app collect about you?',
      'Why would a company want to know your location?',
      'How can you find out what data an app collects?',
    ],
    category: 'Foundations',
  },
  {
    id: 'consent',
    title: 'Informed Consent',
    description: 'Understanding when and how you agree to share your data.',
    videoUrl: 'https://www.youtube.com/embed/hIXhnWUmMvw',
    videoTitle: 'Understanding Digital Consent',
    videoDuration: 200,
    articleUrl: 'https://www.commonsense.org/education/digital-citizenship/lesson/your-digital-footprint',
    articleTitle: 'Making Informed Choices Online',
    keyInsights: [
      'Consent means giving permission with full understanding',
      'Terms of service are often long and hard to understand',
      'You can withdraw consent in many cases',
      'Age affects what consent is required (COPPA for kids under 13)',
    ],
    relatedConcepts: ['privacy', 'data_collection', 'human_oversight'],
    guidingQuestions: [
      'Have you ever agreed to terms without reading them?',
      'What would truly informed consent look like?',
      'Should consent rules be different for young people?',
    ],
    category: 'Foundations',
  },
  {
    id: 'algorithmic_bias',
    title: 'Algorithmic Bias',
    description: 'How AI systems can make unfair or discriminatory decisions.',
    videoUrl: 'https://www.youtube.com/embed/59bMh59JQDo',
    videoTitle: 'What is Algorithmic Bias?',
    videoDuration: 300,
    articleUrl: 'https://www.weforum.org/agenda/2020/10/what-is-algorithmic-bias/',
    articleTitle: 'Algorithmic Bias Explained',
    keyInsights: [
      'AI learns patterns from training data - biased data creates biased AI',
      'Bias can be unintentional but still harmful',
      'Historical inequalities can be encoded into AI systems',
      'Testing for bias requires checking outcomes across different groups',
    ],
    relatedConcepts: ['data_collection', 'ai_decisions', 'fairness', 'human_oversight'],
    guidingQuestions: [
      'If an AI is trained mostly on photos of white faces, what might happen?',
      'How could a hiring AI discriminate without being programmed to?',
      'Who is responsible when an AI makes a biased decision?',
    ],
    category: 'AI & Society',
  },
  {
    id: 'ai_decisions',
    title: 'AI Decision-Making',
    description: 'How AI systems process information and make predictions.',
    videoUrl: 'https://www.youtube.com/embed/R9OHn5ZF4Uo',
    videoTitle: 'How AI Makes Decisions',
    videoDuration: 280,
    articleUrl: 'https://www.explainable.ai/intuitive-guide-to-ai-decision-making',
    articleTitle: 'An Intuitive Guide to AI Decision Making',
    keyInsights: [
      'AI models find patterns in data to make predictions',
      'The "black box" problem: complex AI decisions are hard to explain',
      'AI does not understand context the way humans do',
      'Confidence scores show how sure the AI is, not how correct',
    ],
    relatedConcepts: ['algorithmic_bias', 'fairness', 'transparency', 'human_oversight'],
    guidingQuestions: [
      'Should you trust an AI that cannot explain its reasoning?',
      'What decisions should AI be allowed to make on its own?',
      'How is AI decision-making different from human decision-making?',
    ],
    category: 'AI & Society',
  },
  {
    id: 'fairness',
    title: 'Fairness in AI',
    description: 'What it means for AI to treat all people equitably.',
    videoUrl: 'https://www.youtube.com/embed/d-a_jA8H_aQ',
    videoTitle: 'What is Fairness in AI?',
    videoDuration: 220,
    articleUrl: 'https://www.microsoft.com/en-us/research/project/fairness-in-ai/',
    articleTitle: 'Fairness in AI',
    keyInsights: [
      'Fairness can mean different things in different contexts',
      'High accuracy does not guarantee fairness',
      'Equal treatment vs. equitable outcomes is a key tension',
      'Multiple stakeholders may have different fairness goals',
    ],
    relatedConcepts: ['algorithmic_bias', 'ai_decisions', 'human_oversight', 'transparency'],
    guidingQuestions: [
      'Is it fair to treat everyone the same, even if they start from different places?',
      'Who decides what "fair" means for an AI system?',
      'Can an AI be fair to everyone at the same time?',
    ],
    category: 'AI & Society',
  },
  {
    id: 'transparency',
    title: 'AI Transparency & Explainability',
    description: 'The importance of understanding how AI systems work.',
    videoUrl: 'https://www.youtube.com/embed/R9OHn5ZF4Uo',
    videoTitle: 'Explainable AI',
    videoDuration: 250,
    articleUrl: 'https://www.ibm.com/topics/explainable-ai',
    articleTitle: 'What is Explainable AI?',
    keyInsights: [
      'Transparency means being open about how AI works',
      'Explainability helps people understand AI decisions',
      'Some AI is inherently harder to explain than others',
      'Transparency builds trust and enables accountability',
    ],
    relatedConcepts: ['ai_decisions', 'human_oversight', 'fairness'],
    guidingQuestions: [
      'Would you accept a medical diagnosis from an AI that could not explain itself?',
      'How much do people need to understand about AI to use it safely?',
      'What should companies be required to disclose about their AI?',
    ],
    category: 'Advanced Topics',
  },
  {
    id: 'misinformation',
    title: 'AI & Misinformation',
    description: 'How AI can create and spread false information.',
    videoUrl: 'https://www.youtube.com/embed/g6kE0im3xx4',
    videoTitle: 'AI and Misinformation',
    videoDuration: 320,
    articleUrl: 'https://www.brookings.edu/articles/ai-and-the-future-of-misinformation/',
    articleTitle: 'AI and the Future of Misinformation',
    keyInsights: [
      'Deepfakes use AI to create realistic but fake videos',
      'AI can generate convincing fake text, images, and audio',
      'Misinformation spreads faster than corrections',
      'Critical thinking is essential in an AI-powered world',
    ],
    relatedConcepts: ['ai_decisions', 'human_oversight', 'transparency'],
    guidingQuestions: [
      'How can you tell if a video or image is AI-generated?',
      'What responsibilities do AI creators have for misuse?',
      'How might AI be used to fight misinformation?',
    ],
    category: 'Advanced Topics',
  },
  {
    id: 'human_oversight',
    title: 'Human-in-the-Loop',
    description: 'Why human oversight is crucial for AI systems.',
    videoUrl: 'https://www.youtube.com/embed/1-N-k6f8q1E',
    videoTitle: 'Human-in-the-Loop Machine Learning',
    videoDuration: 290,
    articleUrl: 'https://aws.amazon.com/what-is/human-in-the-loop/',
    articleTitle: 'What is Human-in-the-Loop?',
    keyInsights: [
      'Humans can catch errors that AI misses',
      'Some decisions are too important to leave to AI alone',
      'Human oversight adds accountability to AI systems',
      'The right balance depends on the stakes involved',
    ],
    relatedConcepts: ['ai_decisions', 'fairness', 'transparency', 'algorithmic_bias'],
    guidingQuestions: [
      'What decisions should always have a human involved?',
      'How do we prevent humans from just rubber-stamping AI decisions?',
      'When might human oversight slow down important processes?',
    ],
    category: 'Advanced Topics',
  },
];

// ============================================
// CONCEPT LINKS
// Dynamic relationships between concepts
// ============================================

export const conceptLinks: ConceptLink[] = [
  // Privacy connections
  {
    fromConcept: 'privacy',
    toConcept: 'data_collection',
    relationship: 'builds_on',
    description: 'Understanding privacy helps you evaluate data collection practices',
  },
  {
    fromConcept: 'privacy',
    toConcept: 'consent',
    relationship: 'builds_on',
    description: 'Privacy rights are exercised through informed consent',
  },
  // Data collection connections
  {
    fromConcept: 'data_collection',
    toConcept: 'algorithmic_bias',
    relationship: 'builds_on',
    description: 'Collected data becomes training data that can introduce bias',
  },
  {
    fromConcept: 'data_collection',
    toConcept: 'ai_decisions',
    relationship: 'builds_on',
    description: 'Data collection fuels AI decision-making systems',
  },
  // Bias connections
  {
    fromConcept: 'algorithmic_bias',
    toConcept: 'fairness',
    relationship: 'contrasts_with',
    description: 'Bias is the opposite of fairness in AI systems',
  },
  {
    fromConcept: 'algorithmic_bias',
    toConcept: 'human_oversight',
    relationship: 'applies_to',
    description: 'Human oversight can help catch and correct algorithmic bias',
  },
  // AI decisions connections
  {
    fromConcept: 'ai_decisions',
    toConcept: 'transparency',
    relationship: 'builds_on',
    description: 'Understanding AI decisions requires transparency',
  },
  {
    fromConcept: 'ai_decisions',
    toConcept: 'human_oversight',
    relationship: 'applies_to',
    description: 'Important AI decisions often need human review',
  },
  // Fairness connections
  {
    fromConcept: 'fairness',
    toConcept: 'human_oversight',
    relationship: 'builds_on',
    description: 'Ensuring fairness requires ongoing human evaluation',
  },
  // Transparency connections
  {
    fromConcept: 'transparency',
    toConcept: 'misinformation',
    relationship: 'contrasts_with',
    description: 'Transparency helps combat AI-generated misinformation',
  },
  // Misinformation connections
  {
    fromConcept: 'misinformation',
    toConcept: 'human_oversight',
    relationship: 'applies_to',
    description: 'Human fact-checking is crucial against AI misinformation',
  },
];

// ============================================
// PROBLEM SCENARIOS
// Real-world ethical dilemmas for PBL
// ============================================

export const problemScenarios: ProblemScenario[] = [
  {
    id: 'school_ai_tutor',
    title: 'The AI Tutoring System',
    hook: 'Your school wants to use AI to help students learn. But is it fair to everyone?',
    scenario: `Lincoln Middle School is considering adopting "SmartLearn AI," an artificial intelligence tutoring system. The AI would:

- Track each student's learning patterns and quiz scores
- Predict which students might fail their classes
- Recommend students for advanced programs or extra help
- Personalize lessons based on how fast students learn

The principal is excited because the AI company says it improves grades by 20%. But some parents and teachers have concerns:

- Mrs. Rodriguez (Parent): "I don't want a computer deciding my daughter's future. What if it's wrong?"
- Mr. Chen (Math Teacher): "The AI was trained on data from wealthy suburban schools. Will it work for our diverse student body?"
- Aisha (8th Grader): "I heard the AI tracks everything we do. That feels creepy."
- The Principal: "We need to make a decision by next month. Other schools are already using it."

Your task: Investigate whether Lincoln Middle School should adopt SmartLearn AI, and under what conditions.`,
    stakeholders: [
      {
        name: 'Mrs. Rodriguez',
        role: 'Parent',
        perspective: 'Concerned about AI making important decisions about her child without human judgment',
      },
      {
        name: 'Mr. Chen',
        role: 'Math Teacher',
        perspective: 'Worried the AI might not work fairly for all student populations',
      },
      {
        name: 'Aisha',
        role: '8th Grade Student',
        perspective: 'Uncomfortable with constant monitoring and data collection',
      },
      {
        name: 'Principal Davis',
        role: 'School Administrator',
        perspective: 'Wants to improve student outcomes but needs to make a responsible choice',
      },
    ],
    phases: [
      {
        id: 'phase_1_understand',
        title: 'Understanding the Problem',
        description: 'What exactly is being proposed and why does it matter?',
        prompt: 'Before you can evaluate SmartLearn AI, you need to understand what it does and what concerns have been raised. What questions do you have about this situation?',
        revealsConcepts: ['privacy', 'data_collection'],
        questionsToConsider: [
          'What data would the AI collect about students?',
          'Who would have access to this data?',
          'How would the AI make its predictions?',
        ],
        hints: [
          'Think about what "tracking learning patterns" actually means',
          'Consider what information the AI would need to make predictions',
        ],
      },
      {
        id: 'phase_2_privacy',
        title: 'The Privacy Question',
        description: 'Investigating concerns about student data and privacy.',
        prompt: 'Aisha feels uncomfortable with the AI tracking everything. Is this a valid concern? What privacy issues might exist with this system?',
        revealsConcepts: ['privacy', 'data_collection', 'consent'],
        questionsToConsider: [
          'What personal information would students be sharing?',
          'Do students have a choice about participating?',
          'What could happen if this data was misused or leaked?',
        ],
        hints: [
          'Think about your own digital footprint',
          'Consider who might want access to student performance data',
        ],
      },
      {
        id: 'phase_3_fairness',
        title: 'The Fairness Question',
        description: 'Investigating whether the AI would treat all students fairly.',
        prompt: 'Mr. Chen is worried the AI was trained on data from different schools. Could this cause problems? How might bias affect students?',
        revealsConcepts: ['algorithmic_bias', 'fairness', 'ai_decisions'],
        questionsToConsider: [
          'What if students at Lincoln learn differently than students in the training data?',
          'Could the AI unfairly label some students as "at risk"?',
          'How would you test if the AI is fair to all groups?',
        ],
        hints: [
          'Think about how AI learns patterns from examples',
          'Consider what happens when training data does not match real users',
        ],
      },
      {
        id: 'phase_4_oversight',
        title: 'The Human Factor',
        description: 'Exploring the role of teachers and parents in AI decisions.',
        prompt: 'Mrs. Rodriguez does not want a computer deciding her daughter\'s future. What role should humans play when AI makes recommendations about students?',
        revealsConcepts: ['human_oversight', 'transparency', 'ai_decisions'],
        questionsToConsider: [
          'Should teachers be able to override AI recommendations?',
          'How can parents understand and challenge AI decisions?',
          'What decisions should never be made by AI alone?',
        ],
        hints: [
          'Think about high-stakes decisions in education',
          'Consider how to balance AI efficiency with human judgment',
        ],
      },
    ],
    coreConcepts: ['privacy', 'data_collection', 'algorithmic_bias', 'fairness', 'human_oversight'],
    reflectionPrompts: [
      {
        id: 'reflect_1',
        question: 'Based on your investigation, should Lincoln Middle School adopt SmartLearn AI? Explain your reasoning, considering the perspectives of all stakeholders.',
        rubricCriteria: [
          {
            criterion: 'Stakeholder Consideration',
            description: 'Addresses concerns of multiple stakeholders (students, parents, teachers, administrators)',
            weight: 25,
          },
          {
            criterion: 'Privacy Analysis',
            description: 'Demonstrates understanding of data collection and privacy implications',
            weight: 25,
          },
          {
            criterion: 'Fairness Evaluation',
            description: 'Considers potential bias and fairness issues',
            weight: 25,
          },
          {
            criterion: 'Practical Recommendations',
            description: 'Provides specific conditions or safeguards for implementation',
            weight: 25,
          },
        ],
        assessesConcepts: ['privacy', 'data_collection', 'algorithmic_bias', 'fairness', 'human_oversight'],
      },
      {
        id: 'reflect_2',
        question: 'If the school does adopt SmartLearn AI, what three safeguards would you require to protect students? Explain why each is important.',
        rubricCriteria: [
          {
            criterion: 'Safeguard Quality',
            description: 'Proposes meaningful, specific protections',
            weight: 40,
          },
          {
            criterion: 'Justification',
            description: 'Clearly explains why each safeguard matters',
            weight: 30,
          },
          {
            criterion: 'Concept Integration',
            description: 'Connects safeguards to AI ethics concepts learned',
            weight: 30,
          },
        ],
        assessesConcepts: ['human_oversight', 'consent', 'transparency'],
      },
    ],
    difficulty: 'beginner',
    estimatedTime: 25,
    tags: ['education', 'privacy', 'fairness', 'decision-making'],
  },
  {
    id: 'social_media_algorithm',
    title: 'The Viral Algorithm',
    hook: 'A social media app is making some posts go viral. But who decides what you see?',
    scenario: `TrendVibe is the hottest new social media app among middle schoolers. Its AI algorithm decides which posts appear in your feed and which ones go viral. Recently, some concerning things have happened:

- A fake video of a celebrity saying something they never said got 10 million views before anyone realized it was AI-generated
- Students noticed they keep seeing posts that make them angry or upset - the algorithm seems to push emotional content
- A student's embarrassing moment went viral because the AI predicted people would engage with it
- Some students feel addicted - the AI learns exactly what keeps them scrolling

TrendVibe's CEO says: "Our AI just shows people what they want to see. We're not responsible for what users post."

Meanwhile, Congress is considering new laws about social media AI. They want to hear from young people about their experiences.

Your task: Investigate how TrendVibe's algorithm works and develop recommendations for how social media AI should be regulated.`,
    stakeholders: [
      {
        name: 'Maya',
        role: 'Student User',
        perspective: 'Loves the app but feels like she cannot stop scrolling, even when she wants to',
      },
      {
        name: 'Jordan',
        role: 'Student Creator',
        perspective: 'Videos go viral for random reasons; unfair that the AI decides who gets famous',
      },
      {
        name: 'TrendVibe CEO',
        role: 'Company Executive',
        perspective: 'AI just optimizes for engagement; users make their own choices',
      },
      {
        name: 'Senator Williams',
        role: 'Lawmaker',
        perspective: 'Wants to protect young people but does not fully understand the technology',
      },
    ],
    phases: [
      {
        id: 'phase_1_algorithm',
        title: 'How the Algorithm Works',
        description: 'Understanding what the AI is actually doing.',
        prompt: 'The TrendVibe algorithm decides what millions of people see every day. How does an AI decide what content to show you?',
        revealsConcepts: ['ai_decisions', 'data_collection'],
        questionsToConsider: [
          'What data would the AI need to personalize your feed?',
          'What does "optimizing for engagement" actually mean?',
          'Why might the AI show content that makes you emotional?',
        ],
        hints: [
          'Think about what actions the app can track',
          'Consider what "engagement" looks like (likes, comments, time spent)',
        ],
      },
      {
        id: 'phase_2_misinformation',
        title: 'The Deepfake Problem',
        description: 'Investigating AI-generated fake content.',
        prompt: 'A fake AI-generated video fooled 10 million people. How can AI create misinformation, and what makes it dangerous?',
        revealsConcepts: ['misinformation', 'ai_decisions', 'transparency'],
        questionsToConsider: [
          'How can you tell if content is AI-generated?',
          'Why did the algorithm spread the fake video so widely?',
          'Who is responsible when AI spreads misinformation?',
        ],
        hints: [
          'Think about why emotional or shocking content spreads faster',
          'Consider whether the AI can tell fake from real',
        ],
      },
      {
        id: 'phase_3_privacy_data',
        title: 'Your Data, Their Profit',
        description: 'Examining how your data powers the algorithm.',
        prompt: 'TrendVibe\'s AI knows exactly how to keep you scrolling. What has it learned about you, and is that okay?',
        revealsConcepts: ['privacy', 'data_collection', 'consent'],
        questionsToConsider: [
          'What information does TrendVibe collect about you?',
          'Did you meaningfully consent to this data collection?',
          'How is your data being used to influence your behavior?',
        ],
        hints: [
          'Think about what the app knows about your habits',
          'Consider whether you read the terms of service',
        ],
      },
      {
        id: 'phase_4_responsibility',
        title: 'Who Is Responsible?',
        description: 'Determining accountability for AI harms.',
        prompt: 'The CEO says "We\'re not responsible for what users post." But the AI decides what goes viral. Who should be accountable?',
        revealsConcepts: ['human_oversight', 'transparency', 'fairness'],
        questionsToConsider: [
          'Is TrendVibe responsible for content their AI amplifies?',
          'What role should human moderators play?',
          'How transparent should companies be about their algorithms?',
        ],
        hints: [
          'Think about the difference between posting and amplifying',
          'Consider who has the power to change how the AI works',
        ],
      },
    ],
    coreConcepts: ['ai_decisions', 'misinformation', 'privacy', 'data_collection', 'human_oversight', 'transparency'],
    reflectionPrompts: [
      {
        id: 'reflect_1',
        question: 'You have been asked to testify before Congress about social media AI. Write a 2-3 paragraph statement explaining the key problems with how apps like TrendVibe use AI, and what you think should change.',
        rubricCriteria: [
          {
            criterion: 'Problem Identification',
            description: 'Clearly identifies key issues with social media AI',
            weight: 30,
          },
          {
            criterion: 'Evidence Use',
            description: 'Uses specific examples from the scenario',
            weight: 25,
          },
          {
            criterion: 'Recommendations',
            description: 'Proposes concrete, actionable changes',
            weight: 25,
          },
          {
            criterion: 'Audience Awareness',
            description: 'Explains technical concepts clearly for non-experts',
            weight: 20,
          },
        ],
        assessesConcepts: ['ai_decisions', 'misinformation', 'human_oversight', 'transparency'],
      },
      {
        id: 'reflect_2',
        question: 'Design an "Ethical AI Label" that social media apps would have to display. What information should users be able to see about how the AI algorithm works?',
        rubricCriteria: [
          {
            criterion: 'Transparency Features',
            description: 'Identifies meaningful information users should see',
            weight: 35,
          },
          {
            criterion: 'Practicality',
            description: 'Proposal is realistic and understandable',
            weight: 35,
          },
          {
            criterion: 'User Empowerment',
            description: 'Helps users make informed choices',
            weight: 30,
          },
        ],
        assessesConcepts: ['transparency', 'consent', 'data_collection'],
      },
    ],
    difficulty: 'intermediate',
    estimatedTime: 30,
    tags: ['social media', 'misinformation', 'privacy', 'regulation'],
  },
  {
    id: 'hiring_ai',
    title: 'The Job Application AI',
    hook: 'An AI is deciding who gets job interviews. Is it making fair choices?',
    scenario: `FastHire Inc. has developed an AI system that screens job applications for companies. Instead of humans reading every resume, the AI:

- Scans resumes in seconds and ranks candidates
- Analyzes video interviews for "confidence" and "communication skills"
- Predicts which candidates will be "successful" employees
- Has been adopted by 500+ companies, including many teens' first employers

Recently, journalists discovered some troubling patterns:

- Candidates with names that "sound foreign" were ranked lower, even with identical qualifications
- The AI gave lower "confidence scores" to women and people who spoke with accents
- Candidates from wealthy zip codes were ranked higher
- The company refused to explain how the AI makes its decisions, calling it a "trade secret"

A class action lawsuit has been filed. You've been asked to join a student ethics committee reviewing AI hiring practices.

Your task: Investigate FastHire's AI system and develop guidelines for fair AI use in hiring.`,
    stakeholders: [
      {
        name: 'Destiny',
        role: 'Job Applicant',
        perspective: 'Applied to 50 jobs, got no interviews; worried the AI filtered her out unfairly',
      },
      {
        name: 'FastHire CEO',
        role: 'Company Leader',
        perspective: 'AI is more efficient and objective than human bias',
      },
      {
        name: 'HR Manager',
        role: 'Hiring Professional',
        perspective: 'The AI saves time, but concerned about candidates being wrongly rejected',
      },
      {
        name: 'Civil Rights Lawyer',
        role: 'Legal Advocate',
        perspective: 'This AI is discriminating against protected groups',
      },
    ],
    phases: [
      {
        id: 'phase_1_discrimination',
        title: 'Uncovering Bias',
        description: 'Understanding how AI can discriminate.',
        prompt: 'The AI is ranking candidates with "foreign-sounding" names lower. How does an AI learn to discriminate, even if no one programmed it to?',
        revealsConcepts: ['algorithmic_bias', 'data_collection', 'ai_decisions'],
        questionsToConsider: [
          'What data was the AI trained on?',
          'If past hiring was biased, what would the AI learn?',
          'Can an AI be racist without anyone intending it to be?',
        ],
        hints: [
          'Think about patterns in historical hiring data',
          'Consider what "successful employee" meant in the training data',
        ],
      },
      {
        id: 'phase_2_fairness',
        title: 'Defining Fairness',
        description: 'Exploring what fair AI hiring would look like.',
        prompt: 'The CEO says AI is "more objective than humans." Is removing humans from hiring automatically more fair?',
        revealsConcepts: ['fairness', 'algorithmic_bias', 'human_oversight'],
        questionsToConsider: [
          'What does "fair" hiring mean to different people?',
          'Can AI be objective if it was trained on biased data?',
          'Are there advantages to human judgment in hiring?',
        ],
        hints: [
          'Think about different definitions of fairness',
          'Consider what humans can evaluate that AI might miss',
        ],
      },
      {
        id: 'phase_3_transparency',
        title: 'The Black Box Problem',
        description: 'Investigating why the AI\'s decisions are secret.',
        prompt: 'FastHire calls their algorithm a "trade secret" and refuses to explain it. Should job applicants have a right to know why they were rejected?',
        revealsConcepts: ['transparency', 'ai_decisions', 'human_oversight'],
        questionsToConsider: [
          'Why might a company want to keep their AI secret?',
          'What are the harms of not knowing why you were rejected?',
          'How much transparency is reasonable to require?',
        ],
        hints: [
          'Think about how you would feel being rejected without explanation',
          'Consider the balance between business interests and applicant rights',
        ],
      },
      {
        id: 'phase_4_solutions',
        title: 'Fixing the System',
        description: 'Developing solutions for fair AI hiring.',
        prompt: 'You\'re on the ethics committee. What rules or safeguards would make AI hiring fair?',
        revealsConcepts: ['human_oversight', 'fairness', 'transparency', 'algorithmic_bias'],
        questionsToConsider: [
          'Should AI hiring be banned, regulated, or allowed freely?',
          'What testing should be required before AI is used in hiring?',
          'What rights should job applicants have?',
        ],
        hints: [
          'Think about existing discrimination laws',
          'Consider who should enforce AI hiring rules',
        ],
      },
    ],
    coreConcepts: ['algorithmic_bias', 'fairness', 'transparency', 'ai_decisions', 'human_oversight'],
    reflectionPrompts: [
      {
        id: 'reflect_1',
        question: 'As a member of the student ethics committee, write a one-page recommendation for how AI should (or should not) be used in hiring. Include at least three specific rules or requirements.',
        rubricCriteria: [
          {
            criterion: 'Clear Position',
            description: 'Takes a clear stance on AI in hiring',
            weight: 20,
          },
          {
            criterion: 'Specific Rules',
            description: 'Proposes concrete, enforceable requirements',
            weight: 30,
          },
          {
            criterion: 'Bias Consideration',
            description: 'Addresses algorithmic bias and fairness concerns',
            weight: 25,
          },
          {
            criterion: 'Stakeholder Balance',
            description: 'Considers needs of applicants and employers',
            weight: 25,
          },
        ],
        assessesConcepts: ['algorithmic_bias', 'fairness', 'transparency', 'human_oversight'],
      },
      {
        id: 'reflect_2',
        question: 'Destiny is worried she was unfairly filtered out by the AI. Write her a letter explaining what might have happened and what actions she could take.',
        rubricCriteria: [
          {
            criterion: 'Empathy & Clarity',
            description: 'Explains the situation clearly and compassionately',
            weight: 30,
          },
          {
            criterion: 'Technical Accuracy',
            description: 'Correctly explains how AI bias works',
            weight: 35,
          },
          {
            criterion: 'Actionable Advice',
            description: 'Provides realistic steps Destiny can take',
            weight: 35,
          },
        ],
        assessesConcepts: ['algorithmic_bias', 'transparency', 'human_oversight'],
      },
    ],
    difficulty: 'intermediate',
    estimatedTime: 30,
    tags: ['employment', 'discrimination', 'fairness', 'transparency'],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getConceptById(id: string): ConceptResource | undefined {
  return conceptResources.find(c => c.id === id);
}

export function getProblemById(id: string): ProblemScenario | undefined {
  return problemScenarios.find(p => p.id === id);
}

export function getRelatedConcepts(conceptId: string): ConceptResource[] {
  const concept = getConceptById(conceptId);
  if (!concept) return [];
  return concept.relatedConcepts
    .map(id => getConceptById(id))
    .filter((c): c is ConceptResource => c !== undefined);
}

export function getConceptLinks(conceptId: string): ConceptLink[] {
  return conceptLinks.filter(
    link => link.fromConcept === conceptId || link.toConcept === conceptId
  );
}

export function getPhaseById(problemId: string, phaseId: string) {
  const problem = getProblemById(problemId);
  return problem?.phases.find(p => p.id === phaseId);
}

// ============================================
// LEGACY DATA (for backward compatibility)
// ============================================

export const knowledgeGraphNodes: KnowledgeNode[] = [
  {
    id: 'ethics_01',
    title: 'Privacy Basics',
    description: 'What is personal data and why does privacy matter?',
    order: 1,
    videoUrl: 'https://www.youtube.com/embed/hIXhnWUmMvw',
    videoTitle: 'What is Privacy?',
    videoDuration: 180,
    articleUrl: 'https://www.commonsense.org/education/digital-citizenship/lesson/your-digital-footprint',
    articleTitle: 'Your Digital Footprint',
    quiz: [
      {
        question: 'What is personal data?',
        options: ['Information that identifies you', 'Random numbers', 'Public information only', 'None of the above'],
        correctAnswer: 'Information that identifies you',
        explanation: 'Personal data is any information that can identify you, like your name, email, or location.',
      },
    ],
    prerequisites: [],
    category: 'Ethics Foundations',
  },
];

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'diag_01',
    question: 'What is the main purpose of privacy in AI systems?',
    options: ['To make AI slower', 'To protect user data from misuse', 'To make AI more expensive', 'To hide AI from users'],
    correctAnswer: 'To protect user data from misuse',
    nodeId: 'ethics_01',
    difficulty: 'beginner',
    type: 'diagnostic',
  },
];
