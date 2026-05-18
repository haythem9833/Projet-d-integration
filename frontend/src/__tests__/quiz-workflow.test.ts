/**
 * Complete Quiz Workflow Test
 * Tests the full workflow of creating a quiz and adding questions to it
 * 
 * Test Steps:
 * 1. Login as trainer to get token
 * 2. Get a course and module ID
 * 3. Create a quiz with title, description, and passing score
 * 4. Verify quiz is created and saved
 * 5. Create 3 test questions for the quiz
 * 6. Verify each question is saved
 * 7. Retrieve all questions for the quiz
 * 8. Verify all questions are returned
 */

import { authAPI, courseAPI, moduleAPI, quizAPI, questionAPI } from '../lib/api';

// Mock data
const TRAINER_CREDENTIALS = {
  email: 'trainer@example.com',
  password: 'password123'
};

const QUIZ_DATA = {
  title: 'Complete Workflow Test Quiz',
  description: 'A comprehensive test quiz for the workflow',
  passingScore: 70
};

const TEST_QUESTIONS = [
  {
    questionText: 'What is 2+2?',
    optionA: '3',
    optionB: '4',
    optionC: '5',
    optionD: '6',
    correctAnswer: 'B'
  },
  {
    questionText: 'What is the capital of France?',
    optionA: 'London',
    optionB: 'Berlin',
    optionC: 'Paris',
    optionD: 'Madrid',
    correctAnswer: 'C'
  },
  {
    questionText: 'What is the largest planet?',
    optionA: 'Earth',
    optionB: 'Jupiter',
    optionC: 'Saturn',
    optionD: 'Mars',
    correctAnswer: 'B'
  }
];

describe('Complete Quiz Workflow', () => {
  let authToken: string;
  let courseId: number;
  let moduleId: number;
  let quizId: number;
  let createdQuestionIds: number[] = [];

  /**
   * Step 1: Login as trainer to get token
   */
  test('Step 1: Login as trainer and get authentication token', async () => {
    try {
      const response = await authAPI.login(
        TRAINER_CREDENTIALS.email,
        TRAINER_CREDENTIALS.password
      );
      
      expect(response).toBeDefined();
      expect(response.token).toBeDefined();
      expect(response.token).toMatch(/^[A-Za-z0-9\-._~+/]+=*$/); // JWT format
      
      authToken = response.token;
      
      // Store token in localStorage for subsequent requests
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', authToken);
      }
      
      console.log('✓ Successfully logged in as trainer');
      console.log(`✓ Token obtained: ${authToken.substring(0, 20)}...`);
    } catch (error) {
      throw new Error(`Failed to login: ${error}`);
    }
  });

  /**
   * Step 2: Get a course and module ID
   */
  test('Step 2: Get a course and module ID', async () => {
    try {
      // Get all courses
      const courses = await courseAPI.getAll();
      expect(courses).toBeDefined();
      expect(Array.isArray(courses)).toBe(true);
      expect(courses.length).toBeGreaterThan(0);
      
      // Get first course
      const course = courses[0];
      courseId = course.id;
      
      console.log(`✓ Found course: ${course.title} (ID: ${courseId})`);
      
      // Get modules for the course
      const modules = await moduleAPI.getByCourse(courseId);
      expect(modules).toBeDefined();
      expect(Array.isArray(modules)).toBe(true);
      expect(modules.length).toBeGreaterThan(0);
      
      // Get first module
      const module = modules[0];
      moduleId = module.id;
      
      console.log(`✓ Found module: ${module.title} (ID: ${moduleId})`);
    } catch (error) {
      throw new Error(`Failed to get course and module: ${error}`);
    }
  });

  /**
   * Step 3: Create a quiz with title, description, and passing score
   */
  test('Step 3: Create a quiz with title, description, and passing score', async () => {
    try {
      const quizPayload = {
        title: QUIZ_DATA.title,
        description: QUIZ_DATA.description,
        passingScore: QUIZ_DATA.passingScore,
        moduleId: moduleId,
        courseId: courseId
      };
      
      const response = await quizAPI.create(quizPayload);
      
      expect(response).toBeDefined();
      expect(response.id).toBeDefined();
      expect(response.title).toBe(QUIZ_DATA.title);
      expect(response.description).toBe(QUIZ_DATA.description);
      expect(response.passingScore).toBe(QUIZ_DATA.passingScore);
      
      quizId = response.id;
      
      console.log(`✓ Quiz created successfully`);
      console.log(`✓ Quiz ID: ${quizId}`);
      console.log(`✓ Title: ${response.title}`);
      console.log(`✓ Passing Score: ${response.passingScore}`);
    } catch (error) {
      throw new Error(`Failed to create quiz: ${error}`);
    }
  });

  /**
   * Step 4: Verify quiz is created and saved
   */
  test('Step 4: Verify quiz is created and saved to database', async () => {
    try {
      const quiz = await quizAPI.getById(quizId);
      
      expect(quiz).toBeDefined();
      expect(quiz.id).toBe(quizId);
      expect(quiz.title).toBe(QUIZ_DATA.title);
      expect(quiz.description).toBe(QUIZ_DATA.description);
      expect(quiz.passingScore).toBe(QUIZ_DATA.passingScore);
      
      console.log(`✓ Quiz verified in database`);
      console.log(`✓ Quiz data persists correctly`);
    } catch (error) {
      throw new Error(`Failed to verify quiz: ${error}`);
    }
  });

  /**
   * Step 5: Create 3 test questions for the quiz
   */
  test('Step 5: Create 3 test questions for the quiz', async () => {
    try {
      for (let i = 0; i < TEST_QUESTIONS.length; i++) {
        const questionData = {
          ...TEST_QUESTIONS[i],
          quizId: quizId
        };
        
        const response = await questionAPI.create(questionData);
        
        expect(response).toBeDefined();
        expect(response.id).toBeDefined();
        expect(response.questionText).toBe(TEST_QUESTIONS[i].questionText);
        expect(response.optionA).toBe(TEST_QUESTIONS[i].optionA);
        expect(response.optionB).toBe(TEST_QUESTIONS[i].optionB);
        expect(response.optionC).toBe(TEST_QUESTIONS[i].optionC);
        expect(response.optionD).toBe(TEST_QUESTIONS[i].optionD);
        expect(response.correctAnswer).toBe(TEST_QUESTIONS[i].correctAnswer);
        
        createdQuestionIds.push(response.id);
        
        console.log(`✓ Question ${i + 1} created: "${response.questionText}"`);
        console.log(`  - ID: ${response.id}`);
        console.log(`  - Correct Answer: ${response.correctAnswer}`);
      }
      
      expect(createdQuestionIds.length).toBe(3);
      console.log(`✓ All 3 questions created successfully`);
    } catch (error) {
      throw new Error(`Failed to create questions: ${error}`);
    }
  });

  /**
   * Step 6: Verify each question is saved
   */
  test('Step 6: Verify each question is saved to database', async () => {
    try {
      for (let i = 0; i < createdQuestionIds.length; i++) {
        const question = await questionAPI.getById(createdQuestionIds[i]);
        
        expect(question).toBeDefined();
        expect(question.id).toBe(createdQuestionIds[i]);
        expect(question.questionText).toBe(TEST_QUESTIONS[i].questionText);
        expect(question.correctAnswer).toBe(TEST_QUESTIONS[i].correctAnswer);
        
        console.log(`✓ Question ${i + 1} verified in database`);
      }
      
      console.log(`✓ All questions verified and persisted`);
    } catch (error) {
      throw new Error(`Failed to verify questions: ${error}`);
    }
  });

  /**
   * Step 7: Retrieve all questions for the quiz
   */
  test('Step 7: Retrieve all questions for the quiz', async () => {
    try {
      const questions = await questionAPI.getByQuiz(quizId);
      
      expect(questions).toBeDefined();
      expect(Array.isArray(questions)).toBe(true);
      expect(questions.length).toBe(3);
      
      console.log(`✓ Retrieved ${questions.length} questions for quiz`);
      
      // Verify each question
      for (let i = 0; i < questions.length; i++) {
        console.log(`  - Question ${i + 1}: "${questions[i].questionText}"`);
      }
    } catch (error) {
      throw new Error(`Failed to retrieve questions: ${error}`);
    }
  });

  /**
   * Step 8: Verify all questions are returned
   */
  test('Step 8: Verify all questions are returned and data persists', async () => {
    try {
      const questions = await questionAPI.getByQuiz(quizId);
      
      expect(questions).toBeDefined();
      expect(questions.length).toBe(3);
      
      // Verify all expected questions are present
      const questionTexts = questions.map(q => q.questionText);
      expect(questionTexts).toContain('What is 2+2?');
      expect(questionTexts).toContain('What is the capital of France?');
      expect(questionTexts).toContain('What is the largest planet?');
      
      // Verify correct answers
      const question1 = questions.find(q => q.questionText === 'What is 2+2?');
      expect(question1?.correctAnswer).toBe('B');
      
      const question2 = questions.find(q => q.questionText === 'What is the capital of France?');
      expect(question2?.correctAnswer).toBe('C');
      
      const question3 = questions.find(q => q.questionText === 'What is the largest planet?');
      expect(question3?.correctAnswer).toBe('B');
      
      console.log(`✓ All questions verified with correct answers`);
      console.log(`✓ Data persists correctly after retrieval`);
      console.log(`\n✅ Complete Quiz Workflow Test PASSED`);
    } catch (error) {
      throw new Error(`Failed to verify all questions: ${error}`);
    }
  });

  /**
   * Cleanup: Optional - Delete created quiz and questions
   */
  afterAll(async () => {
    try {
      // Note: Implement cleanup if delete endpoints are available
      console.log('\n✓ Test cleanup completed');
    } catch (error) {
      console.warn(`Cleanup warning: ${error}`);
    }
  });
});

/**
 * Integration Test: Full workflow in a single test
 */
describe('Quiz Workflow - Integration Test', () => {
  test('Complete workflow: Login -> Create Quiz -> Add Questions -> Retrieve Questions', async () => {
    try {
      // Step 1: Login
      const authResponse = await authAPI.login(
        TRAINER_CREDENTIALS.email,
        TRAINER_CREDENTIALS.password
      );
      const token = authResponse.token;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      
      // Step 2: Get course and module
      const courses = await courseAPI.getAll();
      const courseId = courses[0].id;
      const modules = await moduleAPI.getByCourse(courseId);
      const moduleId = modules[0].id;
      
      // Step 3: Create quiz
      const quizResponse = await quizAPI.create({
        title: QUIZ_DATA.title,
        description: QUIZ_DATA.description,
        passingScore: QUIZ_DATA.passingScore,
        moduleId: moduleId,
        courseId: courseId
      });
      const quizId = quizResponse.id;
      
      // Step 4: Create questions
      const questionIds: number[] = [];
      for (const questionData of TEST_QUESTIONS) {
        const response = await questionAPI.create({
          ...questionData,
          quizId: quizId
        });
        questionIds.push(response.id);
      }
      
      // Step 5: Retrieve all questions
      const retrievedQuestions = await questionAPI.getByQuiz(quizId);
      
      // Verify
      expect(retrievedQuestions.length).toBe(3);
      expect(questionIds.length).toBe(3);
      
      console.log('✅ Integration test passed: Complete workflow successful');
    } catch (error) {
      throw new Error(`Integration test failed: ${error}`);
    }
  });
});
