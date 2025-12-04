import type { KnowledgeNode, AssessmentQuestion } from './types';

export const knowledgeGraphNodes: KnowledgeNode[] = [
  {
    id: "ethics_01",
    title: "Privacy Basics",
    description: "What is personal data and why does privacy matter?",
    order: 1,
    videoUrl: "https://www.youtube.com/embed/hIXhnWUmMvw",
    videoTitle: "What is Privacy?",
    videoDuration: 180,
    articleUrl: "https://www.commonsense.org/education/digital-citizenship/lesson/your-digital-footprint",
    articleTitle: "Your Digital Footprint",
    quiz: [
      {
        question: "What is personal data?",
        options: [
          "Information that identifies you",
          "Random numbers",
          "Public information only",
          "None of the above"
        ],
        correctAnswer: "Information that identifies you",
        explanation: "Personal data is any information that can identify you, like your name, email, or location."
      },
      {
        question: "Why does privacy matter online?",
        options: [
          "To hide illegal activities",
          "To protect your identity and safety",
          "It doesn't matter",
          "Only for famous people"
        ],
        correctAnswer: "To protect your identity and safety",
        explanation: "Privacy helps keep you safe by controlling who can access your personal information."
      },
      {
        question: "Which is an example of private information?",
        options: [
          "Your favorite color",
          "Your home address",
          "The weather today",
          "A public park's name"
        ],
        correctAnswer: "Your home address",
        explanation: "Your home address is private information that could be used to find you physically."
      }
    ],
    prerequisites: [],
    category: "Ethics Foundations"
  },
  {
    id: "ethics_02",
    title: "Data Collection",
    description: "How do apps and AI systems collect your information?",
    order: 2,
    videoUrl: "https://www.youtube.com/embed/S0zt_b1dK94",
    videoTitle: "How Apps Collect Data",
    videoDuration: 240,
    articleUrl: "https://www.consumer.ftc.gov/articles/how-companies-get-your-data-what-they-do-it",
    articleTitle: "Data Collection Explained",
    quiz: [
      {
        question: "What data do social media apps typically collect?",
        options: [
          "Only your username",
          "Your posts, likes, location, and contacts",
          "Nothing at all",
          "Only what you explicitly share"
        ],
        correctAnswer: "Your posts, likes, location, and contacts",
        explanation: "Social media apps collect extensive data about your behavior and connections."
      },
      {
        question: "Why do apps want your data?",
        options: [
          "To delete it immediately",
          "To improve services and show targeted ads",
          "They don't want it",
          "To give it away for free"
        ],
        correctAnswer: "To improve services and show targeted ads",
        explanation: "Companies use your data to personalize your experience and make money through advertising."
      },
      {
        question: "Can you control what data apps collect?",
        options: [
          "No, never",
          "Yes, through privacy settings and permissions",
          "Only on certain days",
          "Only if you're an adult"
        ],
        correctAnswer: "Yes, through privacy settings and permissions",
        explanation: "You can manage app permissions and privacy settings to limit data collection."
      }
    ],
    prerequisites: ["ethics_01"],
    category: "Ethics Foundations"
  },
  {
    id: "ethics_03",
    title: "Algorithmic Bias",
    description: "Discover how AI can sometimes make unfair decisions.",
    order: 3,
    videoUrl: "https://www.youtube.com/embed/59bMh59JQDo",
    videoTitle: "What is Algorithmic Bias?",
    videoDuration: 300,
    articleUrl: "https://www.weforum.org/agenda/2020/10/what-is-algorithmic-bias/",
    articleTitle: "Algorithmic Bias Explained",
    quiz: [
      {
        question: "What is algorithmic bias?",
        options: ["When a computer program is perfect", "When AI systems make unfair or prejudiced decisions", "When a computer has a favorite color", "When AI is too fast"],
        correctAnswer: "When AI systems make unfair or prejudiced decisions",
        explanation: "Bias occurs when an algorithm produces results that are systematically prejudiced due to incorrect assumptions in the machine learning process."
      },
      {
        question: "How can training data create bias?",
        options: ["If the data is too large", "If the data is not representative of all groups", "If the data is stored in the cloud", "Data never creates bias"],
        correctAnswer: "If the data is not representative of all groups",
        explanation: "If training data doesn't reflect the diversity of the real world, the AI model can learn to be biased against underrepresented groups."
      },
      {
        question: "An example of algorithmic bias is:",
        options: ["An AI recommending a movie you like", "A translation app working correctly", "A hiring AI that favors male over female candidates", "An AI that can play chess"],
        correctAnswer: "A hiring AI that favors male over female candidates",
        explanation: "This is a real-world example where AI, trained on historical data, showed bias in job recruitment."
      }
    ],
    prerequisites: ["ethics_01", "ethics_02"],
    category: "AI & Society"
  },
  {
    id: "ethics_04",
    title: "AI Decision Making",
    description: "Understand how AI models make predictions and decisions.",
    order: 4,
    videoUrl: "https://www.youtube.com/embed/R9OHn5ZF4Uo",
    videoTitle: "How AI Makes Decisions",
    videoDuration: 280,
    articleUrl: "https://www.explainable.ai/intuitive-guide-to-ai-decision-making",
    articleTitle: "An Intuitive Guide to AI Decision Making",
    quiz: [
      {
        question: "What does an AI 'model' do?",
        options: ["It poses for pictures", "It's a set of rules and patterns the AI learned from data", "It is the physical AI robot", "It is the AI's power cord"],
        correctAnswer: "It's a set of rules and patterns the AI learned from data",
        explanation: "A model is the 'brain' of the AI, containing the knowledge it uses to make predictions or decisions."
      },
      {
        question: "What is 'supervised learning' in AI?",
        options: ["When a human watches the AI constantly", "When the AI learns from data that has been labeled with correct answers", "When the AI has no supervision", "When the AI teaches itself"],
        correctAnswer: "When the AI learns from data that has been labeled with correct answers",
        explanation: "In supervised learning, the AI is trained on examples, like learning to identify cats from pictures labeled 'cat'."
      },
      {
        question: "Why is it sometimes hard to understand an AI's decision?",
        options: ["Because the AI speaks a different language", "Because complex models can be a 'black box'", "Because the AI is trying to be secretive", "It's always easy to understand"],
        correctAnswer: "Because complex models can be a 'black box'",
        explanation: "For some advanced AI, their decision-making process is so complex that even their creators can't fully explain it, this is called the 'black box' problem."
      }
    ],
    prerequisites: ["ethics_03"],
    category: "AI & Society"
  },
  {
    id: "ethics_05",
    title: "Fairness in AI",
    description: "Exploring what it means for AI to be fair to everyone.",
    order: 5,
    videoUrl: "https://www.youtube.com/embed/d-a_jA8H_aQ",
    videoTitle: "What is Fairness in AI?",
    videoDuration: 220,
    articleUrl: "https://www.microsoft.com/en-us/research/project/fairness-in-ai/",
    articleTitle: "Fairness in AI",
    quiz: [
      {
        question: "What does 'fairness' mean in AI?",
        options: ["The AI is always correct", "The AI's decisions are free from bias and treat all groups equitably", "The AI gives everyone the same outcome", "The AI is cheap to build"],
        correctAnswer: "The AI's decisions are free from bias and treat all groups equitably",
        explanation: "AI fairness aims to ensure that an AI system's decisions do not create or perpetuate unfair disadvantages for certain groups of people."
      },
      {
        question: "If an AI is 99% accurate, is it always fair?",
        options: ["Yes, 99% is almost perfect", "No, the 1% of errors could disproportionately affect a specific group", "Yes, because it's accurate", "Fairness is not related to accuracy"],
        correctAnswer: "No, the 1% of errors could disproportionately affect a specific group",
        explanation: "High accuracy doesn't guarantee fairness. An AI could be very accurate for one group but have a high error rate for a minority group."
      },
      {
        question: "Who is responsible for ensuring AI is fair?",
        options: ["Only the government", "Only the users of AI", "The developers, companies, and users of AI", "No one is responsible"],
        correctAnswer: "The developers, companies, and users of AI",
        explanation: "Ensuring AI fairness is a shared responsibility, from the people who build it to the people who use it."
      }
    ],
    prerequisites: ["ethics_03"],
    category: "AI & Society"
  }
];

export const assessmentQuestions: AssessmentQuestion[] = [
  // Diagnostic questions (5)
  {
    id: "diag_01",
    question: "What is the main purpose of privacy in AI systems?",
    options: [
      "To make AI slower",
      "To protect user data from misuse",
      "To make AI more expensive",
      "To hide AI from users"
    ],
    correctAnswer: "To protect user data from misuse",
    nodeId: "ethics_01",
    difficulty: "beginner",
    type: "diagnostic"
  },
  {
    id: "diag_02",
    question: "How do free apps usually make money?",
    options: ["By asking for donations", "By showing ads based on your data", "They don't make money", "By slowing down your phone"],
    correctAnswer: "By showing ads based on your data",
    nodeId: "ethics_02",
    difficulty: "beginner",
    type: "diagnostic"
  },
  {
    id: "diag_03",
    question: "If an AI is trained only on pictures of doctors who are men, what might happen?",
    options: ["It will be very good at identifying all doctors", "It might think only men can be doctors", "It will crash", "It will stop working"],
    correctAnswer: "It might think only men can be doctors",
    nodeId: "ethics_03",
    difficulty: "beginner",
atype: "diagnostic"
  },
  {
    id: "diag_04",
    question: "When we say an AI is a 'black box', what do we mean?",
    options: ["The AI is physically black", "The AI is turned off", "We don't fully understand how it makes its decisions", "The AI is very simple"],
    correctAnswer: "We don't fully understand how it makes its decisions",
    nodeId: "ethics_04",
    difficulty: "intermediate",
    type: "diagnostic"
  },
  {
    id: "diag_05",
    question: "Fairness in AI is primarily about:",
    options: ["Making sure the AI is never wrong", "Treating all people and groups equitably", "Making the AI run fast", "Making sure the AI is popular"],
    correctAnswer: "Treating all people and groups equitably",
    nodeId: "ethics_05",
    difficulty: "beginner",
    type: "diagnostic"
  },
  // Post-test questions (5 different questions)
  {
    id: "post_01",
    question: "Which of the following is considered personal data?",
    options: [
      "The color of the sky",
      "Your birthday and full name",
      "A public holiday",
      "The time of day"
    ],
    correctAnswer: "Your birthday and full name",
    nodeId: "ethics_01",
    difficulty: "beginner",
    type: "post-test"
  },
  {
    id: "post_02",
    question: "What is a 'digital footprint'?",
    options: ["A shoe print on a tablet", "The trail of data you leave online", "A type of computer virus", "A password"],
    correctAnswer: "The trail of data you leave online",
    nodeId: "ethics_01",
    difficulty: "beginner",
    type: "post-test"
  },
  {
    id: "post_03",
    question: "Data collection by apps is...",
    options: ["Always a bad thing", "Always a good thing", "Something that can be helpful but needs to be managed", "Something that never happens"],
    correctAnswer: "Something that can be helpful but needs to be managed",
    nodeId: "ethics_02",
    difficulty: "beginner",
    type: "post-test"
  },
  {
    id: "post_04",
    question: "Algorithmic bias can lead to:",
    options: ["Fairer outcomes for everyone", "AI making better decisions than humans", "Unfair or discriminatory outcomes", "AI becoming self-aware"],
    correctAnswer: "Unfair or discriminatory outcomes",
    nodeId: "ethics_03",
    difficulty: "beginner",
    type: "post-test"
  },
  {
    id: "post_05",
    question: "Why is it important to have diverse teams building AI?",
    options: ["It's not important", "To make the project more expensive", "To help identify and reduce biases", "To make the AI more complex"],
    correctAnswer: "To help identify and reduce biases",
    nodeId: "ethics_05",
    difficulty: "intermediate",
    type: "post-test"
  }
];
