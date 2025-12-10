/**
 * Comprehensive Adaptive Assessment Question Bank
 *
 * Covers all AI Ethics domains with questions at multiple:
 * - Difficulty levels (IRT calibrated 0-100)
 * - Bloom's taxonomy levels (Remember → Create)
 * - Question types (MC, scenario-based, true/false)
 * - Stakes levels (low, medium, high)
 */

import {
  AdaptiveQuestion,
  AssessmentDomain,
  BloomLevel,
  AssessmentStakes,
  QuestionType,
} from './types';

// ============================================
// PRIVACY DOMAIN QUESTIONS
// ============================================

const privacyQuestions: AdaptiveQuestion[] = [
  // Easy - Remember
  {
    id: 'priv_001',
    question: 'What is personal data?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'Only your name and address', isCorrect: false, misconception: 'Personal data is broader than just contact info' },
      { id: 'b', text: 'Any information that can identify you directly or indirectly', isCorrect: true },
      { id: 'c', text: 'Only data you share on social media', isCorrect: false, misconception: 'Personal data exists in many forms beyond social media' },
      { id: 'd', text: 'Data that is stored in government databases', isCorrect: false, misconception: 'Personal data is not limited to government records' },
    ],
    domain: AssessmentDomain.PRIVACY,
    bloomLevel: BloomLevel.REMEMBER,
    difficulty: 20,
    discrimination: 0.7,
    relatedConcepts: ['privacy'],
    explanation: 'Personal data includes any information that can identify you, such as your name, email, phone number, location, browsing history, and even patterns of behavior that could be linked back to you.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 30,
  },
  {
    id: 'priv_002',
    question: 'What is a "digital footprint"?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'The physical space your computer takes up', isCorrect: false },
      { id: 'b', text: 'The trail of data you leave behind when using the internet', isCorrect: true },
      { id: 'c', text: 'A type of computer virus', isCorrect: false },
      { id: 'd', text: 'The carbon footprint of data centers', isCorrect: false },
    ],
    domain: AssessmentDomain.PRIVACY,
    bloomLevel: BloomLevel.REMEMBER,
    difficulty: 25,
    discrimination: 0.75,
    relatedConcepts: ['privacy', 'data_collection'],
    explanation: 'Your digital footprint is the record of all your online activity - websites visited, posts made, purchases, searches, and more. This data can persist long after you create it.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 30,
  },
  // Medium - Understand
  {
    id: 'priv_003',
    question: 'Why might someone care about privacy even if they have "nothing to hide"?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'Privacy protects autonomy and prevents manipulation', isCorrect: true },
      { id: 'b', text: 'They probably do have something to hide', isCorrect: false, misconception: 'The "nothing to hide" argument misunderstands privacy' },
      { id: 'c', text: 'Privacy is only important for criminals', isCorrect: false, misconception: 'Privacy is a fundamental right for everyone' },
      { id: 'd', text: 'There is no good reason', isCorrect: false },
    ],
    domain: AssessmentDomain.PRIVACY,
    bloomLevel: BloomLevel.UNDERSTAND,
    difficulty: 45,
    discrimination: 0.8,
    relatedConcepts: ['privacy', 'consent'],
    explanation: 'Privacy is about autonomy and control, not secrecy. Even lawful activities deserve privacy. Personal data can be used to manipulate, discriminate, or exercise power over individuals.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 45,
  },
  // Harder - Apply
  {
    id: 'priv_004',
    question: 'A fitness app asks for access to your location, contacts, and photos. You only want to track your runs. What should you do?',
    questionType: QuestionType.SCENARIO_BASED,
    scenarioContext: 'You downloaded a running app to track your exercise. During setup, it requests permissions for location (needed for tracking), your contact list (to find friends), and your photo library (to add profile pictures).',
    options: [
      { id: 'a', text: 'Grant all permissions - the app needs them to work', isCorrect: false, misconception: 'Apps often request more permissions than they need' },
      { id: 'b', text: 'Only grant location access since that is what you need for tracking runs', isCorrect: true },
      { id: 'c', text: 'Deny all permissions and use the app without them', isCorrect: false, feedback: 'Location is actually needed for run tracking' },
      { id: 'd', text: 'Uninstall the app immediately', isCorrect: false, feedback: 'You can still use the app with limited permissions' },
    ],
    domain: AssessmentDomain.PRIVACY,
    bloomLevel: BloomLevel.APPLY,
    difficulty: 55,
    discrimination: 0.85,
    relatedConcepts: ['privacy', 'data_collection', 'consent'],
    explanation: 'The principle of data minimization suggests you should only share what\'s necessary. Location is needed for run tracking, but contacts and photos are not required for the core functionality.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 60,
  },
  // Advanced - Analyze
  {
    id: 'priv_005',
    question: 'A "free" social media app makes $50 per user per year from advertising. What does this reveal about the privacy trade-off?',
    questionType: QuestionType.SCENARIO_BASED,
    scenarioContext: 'You use a popular social media app that is free to download and use. The company reports earning approximately $50 per user per year through targeted advertising.',
    options: [
      { id: 'a', text: 'Your data and attention are the product being sold to advertisers', isCorrect: true },
      { id: 'b', text: 'The company is losing money by offering the service for free', isCorrect: false },
      { id: 'c', text: '$50 is too small an amount to matter', isCorrect: false, misconception: 'Aggregated across billions of users, this is significant' },
      { id: 'd', text: 'This has nothing to do with privacy', isCorrect: false, misconception: 'The business model is directly tied to data collection' },
    ],
    domain: AssessmentDomain.PRIVACY,
    bloomLevel: BloomLevel.ANALYZE,
    difficulty: 65,
    discrimination: 0.85,
    relatedConcepts: ['privacy', 'data_collection'],
    explanation: 'When a service is "free," you are often paying with your data and attention. The $50/user revenue comes from advertisers who pay to target you based on your personal information and behavior.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 75,
  },
];

// ============================================
// DATA COLLECTION DOMAIN QUESTIONS
// ============================================

const dataCollectionQuestions: AdaptiveQuestion[] = [
  {
    id: 'data_001',
    question: 'Which of the following is an example of passive data collection?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'Filling out a survey', isCorrect: false, feedback: 'This is active data collection' },
      { id: 'b', text: 'A website tracking which pages you visit and how long you stay', isCorrect: true },
      { id: 'c', text: 'Uploading a profile photo', isCorrect: false, feedback: 'This is active data collection' },
      { id: 'd', text: 'Signing up for a newsletter', isCorrect: false, feedback: 'This is active data collection' },
    ],
    domain: AssessmentDomain.DATA_COLLECTION,
    bloomLevel: BloomLevel.UNDERSTAND,
    difficulty: 30,
    discrimination: 0.75,
    relatedConcepts: ['data_collection', 'privacy'],
    explanation: 'Passive data collection happens automatically without you actively providing information. This includes tracking your browsing behavior, location history, and usage patterns.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 40,
  },
  {
    id: 'data_002',
    question: 'What does "data minimization" mean?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'Collecting as much data as possible to improve AI', isCorrect: false, misconception: 'This is the opposite of data minimization' },
      { id: 'b', text: 'Only collecting data that is necessary for a specific purpose', isCorrect: true },
      { id: 'c', text: 'Deleting all data after 24 hours', isCorrect: false },
      { id: 'd', text: 'Making data files smaller through compression', isCorrect: false },
    ],
    domain: AssessmentDomain.DATA_COLLECTION,
    bloomLevel: BloomLevel.REMEMBER,
    difficulty: 35,
    discrimination: 0.8,
    relatedConcepts: ['data_collection', 'privacy', 'consent'],
    explanation: 'Data minimization is a privacy principle that says organizations should only collect the minimum amount of personal data needed for their stated purpose, and keep it only as long as necessary.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 35,
  },
  {
    id: 'data_003',
    question: 'A school wants to use AI to predict which students might struggle. Which data would be MOST concerning to collect?',
    questionType: QuestionType.SCENARIO_BASED,
    scenarioContext: 'A middle school is implementing an AI system to identify students who might need extra support. They are deciding what data to feed into the system.',
    options: [
      { id: 'a', text: 'Test scores and assignment completion rates', isCorrect: false, feedback: 'Academic data is directly relevant' },
      { id: 'b', text: 'Facial expressions captured by classroom cameras throughout the day', isCorrect: true },
      { id: 'c', text: 'Attendance records', isCorrect: false, feedback: 'Attendance is a standard academic metric' },
      { id: 'd', text: 'Reading level assessments', isCorrect: false, feedback: 'This is directly relevant academic data' },
    ],
    domain: AssessmentDomain.DATA_COLLECTION,
    bloomLevel: BloomLevel.EVALUATE,
    difficulty: 60,
    discrimination: 0.85,
    relatedConcepts: ['data_collection', 'privacy', 'consent', 'human_oversight'],
    explanation: 'Continuous facial monitoring is highly invasive surveillance that captures emotional states and behavior in ways students cannot control. It goes far beyond what is needed for academic support and raises serious privacy and consent concerns.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 60,
  },
  {
    id: 'data_004',
    question: 'Why might collecting zip codes be problematic for an AI system?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'Zip codes can serve as proxy variables for race and income', isCorrect: true },
      { id: 'b', text: 'Zip codes take up too much storage space', isCorrect: false },
      { id: 'c', text: 'Zip codes are always inaccurate', isCorrect: false },
      { id: 'd', text: 'There is nothing problematic about collecting zip codes', isCorrect: false, misconception: 'Zip codes can encode protected characteristics' },
    ],
    domain: AssessmentDomain.DATA_COLLECTION,
    bloomLevel: BloomLevel.ANALYZE,
    difficulty: 55,
    discrimination: 0.8,
    relatedConcepts: ['data_collection', 'algorithmic_bias', 'fairness'],
    explanation: 'Due to historical housing segregation and economic inequality, zip codes often correlate strongly with race and income. An AI using zip codes might discriminate without explicitly using protected characteristics.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 50,
  },
];

// ============================================
// ALGORITHMIC BIAS DOMAIN QUESTIONS
// ============================================

const algorithmicBiasQuestions: AdaptiveQuestion[] = [
  {
    id: 'bias_001',
    question: 'What is algorithmic bias?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'When a computer program intentionally discriminates', isCorrect: false, misconception: 'Bias is usually unintentional' },
      { id: 'b', text: 'Systematic errors in AI that create unfair outcomes for certain groups', isCorrect: true },
      { id: 'c', text: 'A computer virus that attacks certain users', isCorrect: false },
      { id: 'd', text: 'When programmers have political opinions', isCorrect: false },
    ],
    domain: AssessmentDomain.ALGORITHMIC_BIAS,
    bloomLevel: BloomLevel.REMEMBER,
    difficulty: 25,
    discrimination: 0.75,
    relatedConcepts: ['algorithmic_bias', 'fairness'],
    explanation: 'Algorithmic bias refers to systematic and repeatable errors in AI systems that create unfair outcomes, such as favoring or disadvantaging particular groups of people.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 30,
  },
  {
    id: 'bias_002',
    question: 'If an AI is trained mostly on photos of light-skinned faces, what might happen when it tries to recognize darker-skinned faces?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'It will work equally well for everyone', isCorrect: false, misconception: 'Training data imbalance affects performance' },
      { id: 'b', text: 'It will likely have higher error rates for darker-skinned faces', isCorrect: true },
      { id: 'c', text: 'It will refuse to process any photos', isCorrect: false },
      { id: 'd', text: 'Nothing, AI does not see skin color', isCorrect: false, misconception: 'AI learns patterns from training data' },
    ],
    domain: AssessmentDomain.ALGORITHMIC_BIAS,
    bloomLevel: BloomLevel.UNDERSTAND,
    difficulty: 40,
    discrimination: 0.85,
    relatedConcepts: ['algorithmic_bias', 'data_collection', 'fairness'],
    explanation: 'AI systems perform best on data similar to what they were trained on. If training data underrepresents certain groups, the AI will likely make more errors for those groups. This has been documented in facial recognition systems.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 45,
  },
  {
    id: 'bias_003',
    question: 'A resume-screening AI consistently ranks candidates from elite universities higher. After investigation, you find the AI was trained on data from a company that historically favored such candidates. What is this an example of?',
    questionType: QuestionType.SCENARIO_BASED,
    scenarioContext: 'A company uses AI to screen job applications. Analysis shows candidates from prestigious universities get higher scores, even when their qualifications are similar to other candidates.',
    options: [
      { id: 'a', text: 'The AI correctly identifying better candidates', isCorrect: false, misconception: 'University prestige is not a reliable predictor of job performance' },
      { id: 'b', text: 'Historical bias being encoded and perpetuated by the AI', isCorrect: true },
      { id: 'c', text: 'A random coincidence', isCorrect: false },
      { id: 'd', text: 'A feature, not a bug', isCorrect: false, misconception: 'This perpetuates inequality' },
    ],
    domain: AssessmentDomain.ALGORITHMIC_BIAS,
    bloomLevel: BloomLevel.ANALYZE,
    difficulty: 55,
    discrimination: 0.85,
    relatedConcepts: ['algorithmic_bias', 'fairness', 'data_collection'],
    explanation: 'When AI is trained on historical decisions that reflect human bias, it learns and perpetuates those biases. The AI is not discovering truth; it is reflecting past discrimination.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 60,
  },
  {
    id: 'bias_004',
    question: 'Which approach would be LEAST effective at addressing bias in an AI system?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'Auditing the AI\'s decisions across different demographic groups', isCorrect: false, feedback: 'This helps identify bias' },
      { id: 'b', text: 'Ensuring the training data is representative of all user groups', isCorrect: false, feedback: 'This helps prevent bias' },
      { id: 'c', text: 'Simply removing demographic variables from the data', isCorrect: true },
      { id: 'd', text: 'Having diverse teams review and test the AI', isCorrect: false, feedback: 'This brings different perspectives' },
    ],
    domain: AssessmentDomain.ALGORITHMIC_BIAS,
    bloomLevel: BloomLevel.EVALUATE,
    difficulty: 70,
    discrimination: 0.9,
    relatedConcepts: ['algorithmic_bias', 'fairness', 'data_collection'],
    explanation: 'Simply removing demographic variables (like race or gender) often does not prevent bias because other variables can serve as proxies. For example, zip code, name, or club membership might correlate with demographics.',
    stakes: AssessmentStakes.HIGH,
    timeEstimateSeconds: 60,
  },
  {
    id: 'bias_005',
    question: 'A predictive policing AI recommends more patrols in historically over-policed neighborhoods. This leads to more arrests there, which then "confirms" the AI\'s prediction. What is this called?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'Confirmation bias', isCorrect: false, feedback: 'Related but more specific term exists' },
      { id: 'b', text: 'A feedback loop', isCorrect: true },
      { id: 'c', text: 'Statistical accuracy', isCorrect: false, misconception: 'This is not about accuracy' },
      { id: 'd', text: 'Random chance', isCorrect: false },
    ],
    domain: AssessmentDomain.ALGORITHMIC_BIAS,
    bloomLevel: BloomLevel.ANALYZE,
    difficulty: 65,
    discrimination: 0.85,
    relatedConcepts: ['algorithmic_bias', 'fairness', 'ai_decisions'],
    explanation: 'Feedback loops occur when an AI\'s predictions influence the real world in ways that make those predictions appear more accurate. This can amplify existing inequalities and create self-fulfilling prophecies.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 55,
  },
];

// ============================================
// AI DECISIONS DOMAIN QUESTIONS
// ============================================

const aiDecisionsQuestions: AdaptiveQuestion[] = [
  {
    id: 'ai_dec_001',
    question: 'What is the "black box" problem in AI?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'AI systems are kept in black boxes for security', isCorrect: false },
      { id: 'b', text: 'Some AI systems make decisions in ways that are difficult to understand or explain', isCorrect: true },
      { id: 'c', text: 'AI cannot see in the dark', isCorrect: false },
      { id: 'd', text: 'AI is stored in black data centers', isCorrect: false },
    ],
    domain: AssessmentDomain.AI_DECISIONS,
    bloomLevel: BloomLevel.REMEMBER,
    difficulty: 30,
    discrimination: 0.75,
    relatedConcepts: ['ai_decisions', 'transparency'],
    explanation: 'The "black box" problem refers to AI systems (especially deep neural networks) that make decisions through processes so complex that even their creators cannot fully explain why a specific decision was made.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 35,
  },
  {
    id: 'ai_dec_002',
    question: 'An AI says it is 90% confident that a medical image shows cancer. What does this confidence score actually tell you?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'The patient has a 90% chance of having cancer', isCorrect: false, misconception: 'Confidence is about the model, not reality' },
      { id: 'b', text: 'The AI\'s internal certainty about its prediction, not necessarily how accurate it is', isCorrect: true },
      { id: 'c', text: '90% of doctors agree with the diagnosis', isCorrect: false },
      { id: 'd', text: 'The test is 90% complete', isCorrect: false },
    ],
    domain: AssessmentDomain.AI_DECISIONS,
    bloomLevel: BloomLevel.UNDERSTAND,
    difficulty: 50,
    discrimination: 0.85,
    relatedConcepts: ['ai_decisions', 'transparency', 'human_oversight'],
    explanation: 'AI confidence scores reflect the model\'s internal certainty, which can be poorly calibrated. A model can be highly confident and still wrong. Confidence should not be confused with accuracy or real-world probability.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 50,
  },
  {
    id: 'ai_dec_003',
    question: 'Why might it be problematic for AI to make final decisions about loan approvals without human review?',
    questionType: QuestionType.SCENARIO_BASED,
    scenarioContext: 'A bank is considering fully automating its loan approval process using AI, with no human review of decisions.',
    options: [
      { id: 'a', text: 'AI cannot process numbers', isCorrect: false },
      { id: 'b', text: 'AI might miss context, perpetuate bias, and provide no avenue for appeal or explanation', isCorrect: true },
      { id: 'c', text: 'AI is too slow for financial decisions', isCorrect: false },
      { id: 'd', text: 'There is nothing problematic about this approach', isCorrect: false, misconception: 'Financial decisions have significant life impacts' },
    ],
    domain: AssessmentDomain.AI_DECISIONS,
    bloomLevel: BloomLevel.EVALUATE,
    difficulty: 60,
    discrimination: 0.85,
    relatedConcepts: ['ai_decisions', 'human_oversight', 'fairness', 'transparency'],
    explanation: 'Loan decisions significantly impact people\'s lives. AI may miss important context, perpetuate historical discrimination, and cannot explain its reasoning in ways applicants can challenge. Human oversight provides accountability and appeals.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 60,
  },
];

// ============================================
// FAIRNESS DOMAIN QUESTIONS
// ============================================

const fairnessQuestions: AdaptiveQuestion[] = [
  {
    id: 'fair_001',
    question: 'What is the difference between equality and equity?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'They mean the same thing', isCorrect: false, misconception: 'These are distinct concepts' },
      { id: 'b', text: 'Equality gives everyone the same thing; equity gives people what they need to have equal opportunity', isCorrect: true },
      { id: 'c', text: 'Equality is for schools; equity is for businesses', isCorrect: false },
      { id: 'd', text: 'Equity is only about money', isCorrect: false },
    ],
    domain: AssessmentDomain.FAIRNESS,
    bloomLevel: BloomLevel.UNDERSTAND,
    difficulty: 40,
    discrimination: 0.8,
    relatedConcepts: ['fairness', 'algorithmic_bias'],
    explanation: 'Equality means treating everyone the same regardless of circumstances. Equity means providing different resources or treatment based on individual needs to achieve fair outcomes. In AI, this distinction matters for how we define "fair" algorithms.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 45,
  },
  {
    id: 'fair_002',
    question: 'Can an AI system be both "fair" by treating all groups equally AND "fair" by ensuring equal outcomes across groups?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'Yes, these are the same thing', isCorrect: false, misconception: 'These are often mathematically incompatible' },
      { id: 'b', text: 'Sometimes yes, but often these definitions conflict', isCorrect: true },
      { id: 'c', text: 'No, fairness is impossible for AI', isCorrect: false },
      { id: 'd', text: 'Only humans can be fair', isCorrect: false },
    ],
    domain: AssessmentDomain.FAIRNESS,
    bloomLevel: BloomLevel.ANALYZE,
    difficulty: 70,
    discrimination: 0.9,
    relatedConcepts: ['fairness', 'algorithmic_bias', 'ai_decisions'],
    explanation: 'Research has shown that different mathematical definitions of fairness (like equal treatment vs. equal outcomes) can be impossible to satisfy simultaneously, especially when base rates differ between groups. This is a fundamental challenge in fair AI.',
    stakes: AssessmentStakes.HIGH,
    timeEstimateSeconds: 60,
  },
  {
    id: 'fair_003',
    question: 'A college admissions AI achieves 95% accuracy overall, but only 70% accuracy for students from rural areas. Is this system fair?',
    questionType: QuestionType.SCENARIO_BASED,
    scenarioContext: 'A university uses AI to screen applications. Testing shows high overall accuracy but significantly lower accuracy for certain subgroups.',
    options: [
      { id: 'a', text: 'Yes, 95% overall accuracy is excellent', isCorrect: false, misconception: 'Overall metrics can hide disparate impacts' },
      { id: 'b', text: 'No, the performance gap suggests unfair treatment of rural students', isCorrect: true },
      { id: 'c', text: 'It depends on whether the university is in a rural area', isCorrect: false },
      { id: 'd', text: 'Fairness cannot be measured', isCorrect: false },
    ],
    domain: AssessmentDomain.FAIRNESS,
    bloomLevel: BloomLevel.EVALUATE,
    difficulty: 60,
    discrimination: 0.85,
    relatedConcepts: ['fairness', 'algorithmic_bias'],
    explanation: 'High overall accuracy can mask significant performance gaps for subgroups. A 25-percentage-point accuracy gap means rural students face much higher chances of being wrongly rejected or accepted, which raises serious fairness concerns.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 55,
  },
];

// ============================================
// TRANSPARENCY DOMAIN QUESTIONS
// ============================================

const transparencyQuestions: AdaptiveQuestion[] = [
  {
    id: 'trans_001',
    question: 'Why is transparency important in AI systems?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'It is not important; AI should be kept secret', isCorrect: false },
      { id: 'b', text: 'It allows people to understand, trust, and hold AI systems accountable', isCorrect: true },
      { id: 'c', text: 'It makes AI run faster', isCorrect: false },
      { id: 'd', text: 'Only programmers need transparency', isCorrect: false, misconception: 'All stakeholders benefit from transparency' },
    ],
    domain: AssessmentDomain.TRANSPARENCY,
    bloomLevel: BloomLevel.UNDERSTAND,
    difficulty: 30,
    discrimination: 0.75,
    relatedConcepts: ['transparency', 'ai_decisions', 'human_oversight'],
    explanation: 'Transparency enables people to understand how AI affects them, identify problems, and hold creators accountable. It builds trust and allows for meaningful oversight and appeal of AI decisions.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 35,
  },
  {
    id: 'trans_002',
    question: 'A company says their AI hiring system is a "trade secret" and refuses to explain how it works. What right might job applicants have?',
    questionType: QuestionType.SCENARIO_BASED,
    scenarioContext: 'Job applicants are being screened by an AI system, but the company will not explain how decisions are made, citing proprietary technology.',
    options: [
      { id: 'a', text: 'No rights; companies can use any hiring method', isCorrect: false, misconception: 'Anti-discrimination laws still apply' },
      { id: 'b', text: 'The right to know they are being assessed by AI and to request human review', isCorrect: true },
      { id: 'c', text: 'The right to sue the company immediately', isCorrect: false },
      { id: 'd', text: 'Applicants should just use a different company', isCorrect: false },
    ],
    domain: AssessmentDomain.TRANSPARENCY,
    bloomLevel: BloomLevel.APPLY,
    difficulty: 55,
    discrimination: 0.85,
    relatedConcepts: ['transparency', 'ai_decisions', 'human_oversight', 'consent'],
    explanation: 'Many jurisdictions are establishing rights around AI transparency in high-stakes decisions like hiring. These include the right to know AI is being used, understand key factors, and request human review. Trade secret claims do not override discrimination laws.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 55,
  },
];

// ============================================
// HUMAN OVERSIGHT DOMAIN QUESTIONS
// ============================================

const humanOversightQuestions: AdaptiveQuestion[] = [
  {
    id: 'oversight_001',
    question: 'What does "human-in-the-loop" mean in AI systems?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'A human physically operates the computer', isCorrect: false },
      { id: 'b', text: 'Humans review and can override AI decisions at key points', isCorrect: true },
      { id: 'c', text: 'The AI is designed to look like a human', isCorrect: false },
      { id: 'd', text: 'Humans are trapped in the AI system', isCorrect: false },
    ],
    domain: AssessmentDomain.HUMAN_OVERSIGHT,
    bloomLevel: BloomLevel.REMEMBER,
    difficulty: 25,
    discrimination: 0.75,
    relatedConcepts: ['human_oversight', 'ai_decisions'],
    explanation: 'Human-in-the-loop means incorporating human judgment and decision-making at critical points in an AI system, ensuring humans can review, modify, or override automated decisions.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 30,
  },
  {
    id: 'oversight_002',
    question: 'What is "automation bias"?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'When robots prefer other robots', isCorrect: false },
      { id: 'b', text: 'The tendency for humans to over-trust automated systems and ignore contradictory information', isCorrect: true },
      { id: 'c', text: 'When AI systems are biased against automation', isCorrect: false },
      { id: 'd', text: 'A preference for manual processes', isCorrect: false },
    ],
    domain: AssessmentDomain.HUMAN_OVERSIGHT,
    bloomLevel: BloomLevel.UNDERSTAND,
    difficulty: 45,
    discrimination: 0.8,
    relatedConcepts: ['human_oversight', 'ai_decisions'],
    explanation: 'Automation bias is the tendency to favor suggestions from automated systems over contradictory information from non-automated sources, even when the automated system is wrong. This makes meaningful human oversight challenging.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 45,
  },
  {
    id: 'oversight_003',
    question: 'A teacher is told by an AI that a student is "at risk of failing." The teacher knows this student has been improving and has personal challenges the AI does not know about. What should the teacher do?',
    questionType: QuestionType.SCENARIO_BASED,
    scenarioContext: 'An AI early warning system flags a student as at-risk, but the teacher has context that contradicts this prediction.',
    options: [
      { id: 'a', text: 'Always trust the AI - it has more data', isCorrect: false, misconception: 'AI lacks contextual understanding' },
      { id: 'b', text: 'Use their professional judgment to consider both the AI\'s prediction and their personal knowledge', isCorrect: true },
      { id: 'c', text: 'Ignore the AI completely - it is never helpful', isCorrect: false, feedback: 'AI can provide useful signals' },
      { id: 'd', text: 'Report the AI as broken', isCorrect: false },
    ],
    domain: AssessmentDomain.HUMAN_OVERSIGHT,
    bloomLevel: BloomLevel.APPLY,
    difficulty: 50,
    discrimination: 0.85,
    relatedConcepts: ['human_oversight', 'ai_decisions', 'transparency'],
    explanation: 'Human oversight means using AI as one input among many, not blindly following it. Teachers bring contextual knowledge, relationship understanding, and professional judgment that AI cannot replicate. The best approach combines AI signals with human expertise.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 55,
  },
];

// ============================================
// CONSENT DOMAIN QUESTIONS
// ============================================

const consentQuestions: AdaptiveQuestion[] = [
  {
    id: 'consent_001',
    question: 'What makes consent "informed"?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'Clicking "I agree" as fast as possible', isCorrect: false, misconception: 'Speed is not relevant to informed consent' },
      { id: 'b', text: 'Understanding what you are agreeing to before making a decision', isCorrect: true },
      { id: 'c', text: 'Having a lawyer read the terms for you', isCorrect: false },
      { id: 'd', text: 'Consent is the same whether informed or not', isCorrect: false },
    ],
    domain: AssessmentDomain.CONSENT,
    bloomLevel: BloomLevel.UNDERSTAND,
    difficulty: 30,
    discrimination: 0.75,
    relatedConcepts: ['consent', 'privacy', 'transparency'],
    explanation: 'Informed consent means you understand what data will be collected, how it will be used, who will have access, and what risks exist before you agree. Clicking "agree" without understanding is not truly informed consent.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 35,
  },
  {
    id: 'consent_002',
    question: 'A terms of service document is 50 pages long and written in complex legal language. Is clicking "I agree" truly informed consent?',
    questionType: QuestionType.TRUE_FALSE,
    options: [
      { id: 'true', text: 'True - clicking agree means you consent', isCorrect: false },
      { id: 'false', text: 'False - consent is not meaningful if understanding is impractical', isCorrect: true },
    ],
    domain: AssessmentDomain.CONSENT,
    bloomLevel: BloomLevel.EVALUATE,
    difficulty: 50,
    discrimination: 0.8,
    relatedConcepts: ['consent', 'privacy', 'transparency'],
    explanation: 'True informed consent requires reasonable ability to understand what you are agreeing to. When terms are deliberately complex or impossibly long, the "consent" is often more legal fiction than meaningful agreement. This is why privacy advocates push for clear, concise disclosures.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 45,
  },
];

// ============================================
// MISINFORMATION DOMAIN QUESTIONS
// ============================================

const misinformationQuestions: AdaptiveQuestion[] = [
  {
    id: 'misinfo_001',
    question: 'What is a "deepfake"?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'A very convincing magic trick', isCorrect: false },
      { id: 'b', text: 'AI-generated fake video or audio that realistically depicts someone saying or doing things they never did', isCorrect: true },
      { id: 'c', text: 'A deep-sea photograph', isCorrect: false },
      { id: 'd', text: 'A type of computer virus', isCorrect: false },
    ],
    domain: AssessmentDomain.MISINFORMATION,
    bloomLevel: BloomLevel.REMEMBER,
    difficulty: 25,
    discrimination: 0.75,
    relatedConcepts: ['misinformation', 'ai_decisions'],
    explanation: 'Deepfakes use AI to create synthetic media that can make people appear to say or do things they never did. The technology has become sophisticated enough to fool many viewers.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 30,
  },
  {
    id: 'misinfo_002',
    question: 'Why might social media algorithms spread misinformation faster than accurate information?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'Algorithms are programmed to spread lies', isCorrect: false, misconception: 'The effect is usually unintentional' },
      { id: 'b', text: 'Misinformation is often more sensational, generating more engagement that algorithms reward', isCorrect: true },
      { id: 'c', text: 'Accurate information is too boring for AI to process', isCorrect: false },
      { id: 'd', text: 'Algorithms prefer longer content', isCorrect: false },
    ],
    domain: AssessmentDomain.MISINFORMATION,
    bloomLevel: BloomLevel.ANALYZE,
    difficulty: 55,
    discrimination: 0.85,
    relatedConcepts: ['misinformation', 'ai_decisions', 'algorithmic_bias'],
    explanation: 'Social media algorithms typically optimize for engagement. Misinformation often triggers strong emotional reactions (outrage, fear, surprise) that drive more clicks, shares, and comments. The algorithm does not evaluate truth; it amplifies engagement.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 50,
  },
];

// ============================================
// AI FUNDAMENTALS DOMAIN QUESTIONS
// ============================================

const aiFundamentalsQuestions: AdaptiveQuestion[] = [
  {
    id: 'ai_fund_001',
    question: 'What is the difference between AI and traditional computer programs?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'Traditional programs follow explicit instructions; AI can learn patterns from data', isCorrect: true },
      { id: 'b', text: 'AI is faster', isCorrect: false },
      { id: 'c', text: 'Traditional programs are older', isCorrect: false },
      { id: 'd', text: 'There is no difference', isCorrect: false },
    ],
    domain: AssessmentDomain.AI_FUNDAMENTALS,
    bloomLevel: BloomLevel.UNDERSTAND,
    difficulty: 30,
    discrimination: 0.75,
    relatedConcepts: ['ai_intro_001', 'ml_basics_001'],
    explanation: 'Traditional programs follow explicit step-by-step instructions written by programmers. AI systems, particularly machine learning, learn patterns from data and can make predictions or decisions the programmer did not explicitly code.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 40,
  },
  {
    id: 'ai_fund_002',
    question: 'Does current AI actually "understand" language the way humans do?',
    questionType: QuestionType.TRUE_FALSE,
    options: [
      { id: 'true', text: 'True - AI understands meaning like humans', isCorrect: false },
      { id: 'false', text: 'False - AI processes patterns without human-like understanding', isCorrect: true },
    ],
    domain: AssessmentDomain.AI_FUNDAMENTALS,
    bloomLevel: BloomLevel.UNDERSTAND,
    difficulty: 50,
    discrimination: 0.8,
    relatedConcepts: ['ai_intro_001', 'ai_decisions'],
    explanation: 'Current AI (including large language models) processes statistical patterns in text without genuine understanding. It can produce human-like responses without comprehending meaning, context, or truth the way humans do.',
    stakes: AssessmentStakes.MEDIUM,
    timeEstimateSeconds: 40,
  },
];

// ============================================
// ML BASICS DOMAIN QUESTIONS
// ============================================

const mlBasicsQuestions: AdaptiveQuestion[] = [
  {
    id: 'ml_001',
    question: 'What is "training data" in machine learning?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'Data used to teach the AI patterns so it can make predictions', isCorrect: true },
      { id: 'b', text: 'Data stored in a gym', isCorrect: false },
      { id: 'c', text: 'The AI\'s final output', isCorrect: false },
      { id: 'd', text: 'Random numbers the AI generates', isCorrect: false },
    ],
    domain: AssessmentDomain.ML_BASICS,
    bloomLevel: BloomLevel.REMEMBER,
    difficulty: 20,
    discrimination: 0.7,
    relatedConcepts: ['ml_basics_001', 'data_basics_001'],
    explanation: 'Training data is the dataset used to teach a machine learning model. The AI analyzes this data to find patterns it can use to make predictions on new, unseen data.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 30,
  },
  {
    id: 'ml_002',
    question: 'Why is the phrase "garbage in, garbage out" relevant to AI?',
    questionType: QuestionType.MULTIPLE_CHOICE,
    options: [
      { id: 'a', text: 'AI systems need regular cleaning', isCorrect: false },
      { id: 'b', text: 'If the training data is flawed or biased, the AI\'s outputs will be too', isCorrect: true },
      { id: 'c', text: 'AI produces physical garbage', isCorrect: false },
      { id: 'd', text: 'This phrase is not relevant to AI', isCorrect: false },
    ],
    domain: AssessmentDomain.ML_BASICS,
    bloomLevel: BloomLevel.UNDERSTAND,
    difficulty: 35,
    discrimination: 0.8,
    relatedConcepts: ['ml_basics_001', 'data_basics_001', 'algorithmic_bias'],
    explanation: 'AI learns from data, so the quality of that data directly affects the quality of the AI\'s decisions. Biased, incomplete, or incorrect training data leads to biased, incomplete, or incorrect AI outputs.',
    stakes: AssessmentStakes.LOW,
    timeEstimateSeconds: 40,
  },
];

// ============================================
// COMBINE ALL QUESTIONS
// ============================================

export const allAssessmentQuestions: AdaptiveQuestion[] = [
  ...privacyQuestions,
  ...dataCollectionQuestions,
  ...algorithmicBiasQuestions,
  ...aiDecisionsQuestions,
  ...fairnessQuestions,
  ...transparencyQuestions,
  ...humanOversightQuestions,
  ...consentQuestions,
  ...misinformationQuestions,
  ...aiFundamentalsQuestions,
  ...mlBasicsQuestions,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getQuestionsByDomain(domain: AssessmentDomain): AdaptiveQuestion[] {
  return allAssessmentQuestions.filter(q => q.domain === domain);
}

export function getQuestionsByDifficulty(minDiff: number, maxDiff: number): AdaptiveQuestion[] {
  return allAssessmentQuestions.filter(q => q.difficulty >= minDiff && q.difficulty <= maxDiff);
}

export function getQuestionsByBloomLevel(level: BloomLevel): AdaptiveQuestion[] {
  return allAssessmentQuestions.filter(q => q.bloomLevel === level);
}

export function getQuestionsByStakes(stakes: AssessmentStakes): AdaptiveQuestion[] {
  return allAssessmentQuestions.filter(q => q.stakes === stakes);
}

export function getQuestionById(id: string): AdaptiveQuestion | undefined {
  return allAssessmentQuestions.find(q => q.id === id);
}

// Get questions for initial diagnostic (covers all domains, easy-medium difficulty)
export function getDiagnosticQuestionPool(): AdaptiveQuestion[] {
  return allAssessmentQuestions.filter(
    q => q.difficulty <= 50 && (q.bloomLevel === BloomLevel.REMEMBER || q.bloomLevel === BloomLevel.UNDERSTAND)
  );
}

// Get questions for knowledge checks (domain-specific, low stakes)
export function getKnowledgeCheckQuestions(domain: AssessmentDomain): AdaptiveQuestion[] {
  return allAssessmentQuestions.filter(
    q => q.domain === domain && q.stakes === AssessmentStakes.LOW
  );
}

// Get questions for checkpoint assessments (higher difficulty, high stakes)
export function getCheckpointQuestions(domains: AssessmentDomain[]): AdaptiveQuestion[] {
  return allAssessmentQuestions.filter(
    q => domains.includes(q.domain) && q.difficulty >= 50
  );
}

// Domain metadata for UI display
export const domainMetadata: Record<AssessmentDomain, { name: string; description: string; icon: string }> = {
  [AssessmentDomain.PRIVACY]: {
    name: 'Privacy',
    description: 'Understanding personal data and privacy rights',
    icon: '🔒',
  },
  [AssessmentDomain.DATA_COLLECTION]: {
    name: 'Data Collection',
    description: 'How apps and AI systems gather information',
    icon: '📊',
  },
  [AssessmentDomain.CONSENT]: {
    name: 'Consent',
    description: 'Giving meaningful permission for data use',
    icon: '✋',
  },
  [AssessmentDomain.ALGORITHMIC_BIAS]: {
    name: 'Algorithmic Bias',
    description: 'How AI can make unfair decisions',
    icon: '⚖️',
  },
  [AssessmentDomain.AI_DECISIONS]: {
    name: 'AI Decision-Making',
    description: 'How AI systems process and decide',
    icon: '🤖',
  },
  [AssessmentDomain.FAIRNESS]: {
    name: 'Fairness',
    description: 'What fair AI means and looks like',
    icon: '🎯',
  },
  [AssessmentDomain.TRANSPARENCY]: {
    name: 'Transparency',
    description: 'Understanding how AI works',
    icon: '👁️',
  },
  [AssessmentDomain.MISINFORMATION]: {
    name: 'Misinformation',
    description: 'AI-generated fake content and spread',
    icon: '📰',
  },
  [AssessmentDomain.HUMAN_OVERSIGHT]: {
    name: 'Human Oversight',
    description: 'Keeping humans in control of AI',
    icon: '👤',
  },
  [AssessmentDomain.AI_FUNDAMENTALS]: {
    name: 'AI Fundamentals',
    description: 'Basic understanding of what AI is',
    icon: '🧠',
  },
  [AssessmentDomain.ML_BASICS]: {
    name: 'Machine Learning',
    description: 'How AI learns from data',
    icon: '📈',
  },
};
