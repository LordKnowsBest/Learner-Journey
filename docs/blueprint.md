# **App Name**: KAITE Demo

## Core Features:

- Anonymous Authentication: Implement Firebase Anonymous Authentication for demo mode, allowing users to start the learning journey without creating an account.
- Diagnostic Test: Present a 5-question diagnostic test to assess the student's initial knowledge of AI ethics. The questions will be fetched from the Firestore 'assessmentQuestions' collection.
- Knowledge Graph Display: Visualize 5 key AI ethics concepts (nodes) fetched from Firestore as an interactive graph or grid, showing progress status (not started, in progress, completed).
- Concept Learning Module: Deliver learning content for each concept via video (YouTube embed) and an article link, followed by a 3-question quiz to test understanding.
- AI Tutor Assistance: Integrate Anthropic's Claude API to provide AI-powered tutoring support, answering student questions and offering guidance on AI ethics concepts. Prompt the AI tutor tool with the context for the question and set of constraints to allow more effective responses.
- Progress Tracking and Improvement Calculation: Track student progress, calculate improvement from diagnostic to post-test scores, and store session data in Firestore.
- Results Visualization: Display pre-test and post-test scores, along with the improvement percentage, in a clear and motivating results screen upon completion of a concept.

## Style Guidelines:

- Primary color: A vibrant purple (#9370DB) to reflect intelligence, creativity, and digital learning, associating the application with wisdom and forward-thinking.
- Background color: A light lavender (#E6E6FA), almost white, to ensure readability and to give a sense of calm and focus.
- Accent color: A warm reddish-pink (#BC8F8F) for highlighting interactive elements, aiming for engagement without being distracting.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern look, is ideal for readability in educational content.  
- Code font: 'Source Code Pro' for displaying code snippets, making it easier to read.
- Employ clean, minimalist icons sourced from a consistent set, with themes focused on education, AI, and ethics to ensure quick comprehension and ease of navigation.
- Design a straightforward, single-column layout to reduce visual clutter, directing students’ attention naturally from the diagnostic test to the knowledge graph, concept learning, and finally to the results.
- Implement subtle animations and transitions (e.g., fade-ins, progress bar updates) to provide feedback and create a sense of progress without overwhelming the user. 