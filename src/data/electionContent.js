/**
 * @fileoverview Election Process Education – Static Content Data
 *
 * Exports all structured content used across the application:
 * - `timelineSteps`   – Four ordered phases of the election process
 * - `assistantFacts`  – Topic-keyed rule-based Q&A data
 * - `featureCards`    – Three informational before/during/after cards
 * - `quickFacts`      – Sidebar fact cards
 * - `demoScenarios`   – Preset guided-demo questions
 * - `quizQuestions`   – 8 multiple-choice knowledge-check questions
 * - `processSteps`    – 6 interactive voter-journey steps
 * - `voterChecklist`  – Pre-election checklist items
 *
 * @module electionContent
 */

/** @typedef {{ title: string, copy: string }} TimelineStep */
/** @typedef {{ summary: string, steps: string[], next: string }} TopicFact */
/** @typedef {{ title: string, copy: string }} FeatureCard */
/** @typedef {{ title: string, copy: string }} QuickFact */
/** @typedef {{ title: string, prompt: string, copy: string }} DemoScenario */

/**
 * @typedef {Object} QuizQuestion
 * @property {string}   id           - Unique identifier
 * @property {string}   question     - Question text
 * @property {string[]} options      - Four answer choices
 * @property {number}   correctIndex - Zero-based index of the correct option
 * @property {string}   explanation  - Explanation shown after answering
 * @property {string}   topic        - Related assistant topic key
 */

/**
 * @typedef {Object} ProcessStep
 * @property {string}   id           - Unique identifier
 * @property {number}   number       - Display step number
 * @property {string}   title        - Short step name
 * @property {string}   description  - One-sentence description
 * @property {string}   icon         - Emoji icon
 * @property {string[]} details      - 2-4 bullet-point action items
 * @property {string}   tip          - Helpful tip for this step
 */

/**
 * @typedef {Object} ChecklistItem
 * @property {string} id          - Unique identifier
 * @property {string} label       - Short checklist label
 * @property {string} description - Expanded description
 * @property {string} topic       - Related assistant topic key
 */

/**
 * Ordered four-step overview of the U.S. election process.
 * @type {TimelineStep[]}
 */
export const timelineSteps = [
  {
    title: '1. Prepare early',
    copy: 'Check whether you are registered, review important deadlines, and confirm the type of election you are voting in.',
  },
  {
    title: '2. Choose how to vote',
    copy: 'Use early in-person, mail-in, absentee, or Election Day voting depending on what your local rules allow.',
  },
  {
    title: '3. Cast the ballot',
    copy: 'Fill out the ballot carefully, follow every instruction, and keep any receipt or tracking information your area provides.',
  },
  {
    title: '4. Wait for counting',
    copy: 'Officials verify ballots, count them, resolve challenges if needed, and then certify the final results.',
  },
];

/**
 * Topic-keyed fact objects used by the rule-based assistant fallback.
 * @type {Record<'registration'|'timeline'|'ballot'|'counting'|'general', TopicFact>}
 */
export const assistantFacts = {
  registration: {
    summary: 'Registration usually happens before Election Day and may close days or weeks earlier depending on where you live.',
    steps: [
      'Check your status using your local election office or voter portal.',
      'Update your address or name if anything has changed.',
      'Save the deadline so you do not miss your chance to vote.',
    ],
    next: 'If you tell me your state or country, I can help you think about the right deadline to verify.',
  },
  timeline: {
    summary: 'A good election timeline starts with preparation, moves into voting, and ends with post-election counting and certification.',
    steps: [
      '30 to 60 days before: check rules, IDs, and registration.',
      '1 to 3 weeks before: decide whether to vote early or by mail.',
      'Election Day: submit your ballot before polls close.',
    ],
    next: 'The exact dates change by place, so official election calendars are the best source.',
  },
  ballot: {
    summary: 'Ballots can be paper or electronic, and the instructions matter as much as the choices themselves.',
    steps: [
      'Read the ballot instructions before marking anything.',
      'Use the correct pen, mark choices fully, and review before submitting.',
      'If you make a mistake, ask for a replacement ballot from election staff.',
    ],
    next: 'If you want, I can explain early voting, mail voting, or polling-place voting next.',
  },
  counting: {
    summary: 'Counting happens after ballots are submitted and can include verification steps before results are finalized.',
    steps: [
      'Election workers verify eligibility and ballot integrity.',
      'Ballots are tabulated, sometimes in multiple stages.',
      'Final official results may appear later than unofficial election-night totals.',
    ],
    next: 'Results are often updated in batches, so the first number you see may not be the final one.',
  },
  general: {
    summary: 'The election process usually follows the same broad path: register, prepare, vote, count, and certify results.',
    steps: [
      'Start by checking your registration and deadlines.',
      'Choose the voting method your area allows.',
      'Follow ballot instructions and confirm your vote was accepted.',
    ],
    next: 'Ask about registration, voting options, the timeline, or how counting works for a deeper explanation.',
  },
};

/**
 * Feature cards displayed in the bottom grid section.
 * @type {FeatureCard[]}
 */
export const featureCards = [
  {
    title: 'Before voting',
    copy: 'Check your registration, confirm your polling place, and understand whether you are voting early, by mail, or in person.',
  },
  {
    title: 'During voting',
    copy: 'Follow the ballot instructions carefully, ask poll workers for help if needed, and make sure your vote is submitted successfully.',
  },
  {
    title: 'After voting',
    copy: 'Results may take time. Counties count ballots, resolve eligibility checks, and certify official results after the election.',
  },
];

/**
 * Quick-fact sidebar cards shown in the hero section.
 * @type {QuickFact[]}
 */
export const quickFacts = [
  {
    title: 'What you need most often',
    copy: 'Registration status, a valid ID if your area requires one, your ballot plan, and your polling location.',
  },
  {
    title: 'What changes by location',
    copy: 'Registration deadlines, mail ballot rules, early voting windows, and the way votes are counted.',
  },
  {
    title: 'What this assistant does',
    copy: 'It answers common questions, breaks the process into steps, and points users to the right next action.',
  },
];

/**
 * Pre-built demo scenarios for the hero sidebar.
 * @type {DemoScenario[]}
 */
export const demoScenarios = [
  {
    title: 'First-time voter',
    prompt: 'I am voting for the first time. What should I do first?',
    copy: 'A fast path through registration, ID checks, and the basics of casting a ballot.',
  },
  {
    title: 'Mail ballot',
    prompt: 'What should I know about voting by mail?',
    copy: 'A guided flow for requesting, filling out, returning, and tracking a ballot.',
  },
  {
    title: 'Deadline check',
    prompt: 'How do I check my registration deadline?',
    copy: 'A practical answer for users who need to verify dates before Election Day.',
  },
];

/**
 * Eight multiple-choice questions for the interactive knowledge quiz.
 * Each question maps to one of the assistant's core topics.
 *
 * @type {QuizQuestion[]}
 */
export const quizQuestions = [
  {
    id: 'q1',
    question: 'How far in advance must most voters register before Election Day?',
    options: [
      'On Election Day itself',
      '15 to 30 days before (varies by state)',
      '6 months before',
      '1 year before',
    ],
    correctIndex: 1,
    explanation:
      'Most U.S. states require registration 15–30 days before Election Day. Some states allow same-day registration at the polls.',
    topic: 'registration',
  },
  {
    id: 'q2',
    question: 'What is an absentee or mail-in ballot?',
    options: [
      'A ballot used only by military personnel overseas',
      'A provisional ballot given when registration is in question',
      'A ballot you complete at home and return by mail or drop box',
      'A backup ballot if your first ballot is spoiled',
    ],
    correctIndex: 2,
    explanation:
      'Absentee/mail-in ballots let eligible voters cast their vote from home by returning the ballot via mail or an official drop box.',
    topic: 'ballot',
  },
  {
    id: 'q3',
    question: 'What should you do if you make a mistake on a paper ballot?',
    options: [
      'Submit it — election workers will correct it',
      'Cross out the mistake and write the correct choice next to it',
      'Ask a poll worker for a replacement (your original is marked "spoiled")',
      'Leave the section blank and submit the rest',
    ],
    correctIndex: 2,
    explanation:
      'Do not try to correct a paper ballot yourself. Ask a poll worker for a replacement. The incorrect ballot is marked "spoiled" and not counted.',
    topic: 'ballot',
  },
  {
    id: 'q4',
    question: 'What is the purpose of early voting?',
    options: [
      'To determine a winner before Election Day',
      'To let eligible voters cast ballots before the official Election Day',
      'Available only for mail-in voters',
      'A trial run before the real election',
    ],
    correctIndex: 1,
    explanation:
      'Early voting lets eligible voters cast ballots at designated polling places before Election Day, reducing lines and adding flexibility.',
    topic: 'ballot',
  },
  {
    id: 'q5',
    question: 'After polls close on Election Day, what happens next?',
    options: [
      'Results are officially final within 1 hour',
      'Ballots are destroyed and only digital records are kept',
      'Votes are counted, reported, and later officially certified',
      'The winner is chosen by Congress the next day',
    ],
    correctIndex: 2,
    explanation:
      'After polls close, ballots are counted and preliminary results reported. Official certification follows days or weeks later after all votes are verified.',
    topic: 'counting',
  },
  {
    id: 'q6',
    question: 'What is a provisional ballot?',
    options: [
      'A ballot cast only by first-time voters',
      'A ballot cast when a voter\'s eligibility cannot be immediately confirmed',
      'A digital ballot used by electronic voting machines',
      'A ballot used only in primary elections',
    ],
    correctIndex: 1,
    explanation:
      'A provisional ballot is given when a voter\'s eligibility cannot be confirmed at the polls (e.g., name not on the rolls). It is counted after officials verify eligibility.',
    topic: 'ballot',
  },
  {
    id: 'q7',
    question: 'What does "certifying" election results mean?',
    options: [
      'Printing official ballot papers for the election',
      'The formal process officials use to verify and confirm final vote totals',
      'Announcing preliminary results on election night',
      'Handing winners their certificates of victory',
    ],
    correctIndex: 1,
    explanation:
      'Certification is the formal process by which officials verify all ballots are counted correctly and declare the official, legally binding results.',
    topic: 'counting',
  },
  {
    id: 'q8',
    question: 'Which of the following is a right you have at the polling place?',
    options: [
      'The right to vote for as many candidates as you want per race',
      'The right to assistance if you have a disability or language barrier',
      'The right to see how other voters voted',
      'The right to return multiple times on Election Day',
    ],
    correctIndex: 1,
    explanation:
      'Voters have the legal right to request assistance at polling places due to disability or language barriers. Poll workers must provide reasonable accommodations.',
    topic: 'general',
  },
];

/**
 * Six-step interactive voter journey for the Process Tracker component.
 * Users can check off each step as they complete it.
 *
 * @type {ProcessStep[]}
 */
export const processSteps = [
  {
    id: 'step-eligibility',
    number: 1,
    title: 'Check Your Eligibility',
    description: 'Confirm you meet all legal requirements to vote in your jurisdiction.',
    icon: '🔍',
    details: [
      'Must be a U.S. citizen (for federal elections)',
      'Must be at least 18 years old on or before Election Day',
      'Must be a resident of the state where you register',
      'Not currently barred by a felony conviction (rules vary by state)',
    ],
    tip: 'Your state\'s Secretary of State website is the official source for eligibility rules.',
  },
  {
    id: 'step-register',
    number: 2,
    title: 'Register to Vote',
    description: 'Complete your voter registration before your state\'s deadline.',
    icon: '📋',
    details: [
      'Register online, by mail, or in person at a government office',
      'Note your state\'s registration deadline (typically 15–30 days before Election Day)',
      'Update your registration if you\'ve moved or changed your name',
      'Save or screenshot your registration confirmation',
    ],
    tip: 'Visit vote.gov to find your state\'s official registration portal and deadline.',
  },
  {
    id: 'step-plan',
    number: 3,
    title: 'Plan How You\'ll Vote',
    description: 'Decide between in-person, early, or mail-in voting before Election Day.',
    icon: '🗓️',
    details: [
      'Request a mail-in or absentee ballot early if voting by mail',
      'Find your polling place and check its hours for in-person voting',
      'Look up whether your state offers early voting and when it starts',
      'Confirm what ID or documents you need to bring',
    ],
    tip: 'If voting by mail, request your ballot as early as possible to allow mailing time.',
  },
  {
    id: 'step-ballot',
    number: 4,
    title: 'Review Your Ballot',
    description: 'Research candidates and measures before you vote.',
    icon: '📄',
    details: [
      'Look up your official sample ballot (usually available on your county\'s election website)',
      'Research candidates for all offices on your ballot',
      'Understand any ballot measures, propositions, or amendments',
      'Write down your choices to bring with you to the polls',
    ],
    tip: 'Ballotpedia.org is a non-partisan resource for researching candidates and measures.',
  },
  {
    id: 'step-vote',
    number: 5,
    title: 'Cast Your Ballot',
    description: 'Follow instructions carefully when marking and submitting your ballot.',
    icon: '🗳️',
    details: [
      'Arrive before polls close (lines at closing time must still be served)',
      'Read all ballot instructions before making any marks',
      'Ask a poll worker for help if anything is unclear — you have that right',
      'Get a receipt or "I Voted" sticker as confirmation',
    ],
    tip: 'If you made an error on your ballot, ask for a replacement before submitting.',
  },
  {
    id: 'step-confirm',
    number: 6,
    title: 'Confirm & Track Results',
    description: 'Verify your vote was counted and follow the certification process.',
    icon: '✅',
    details: [
      'If you voted by mail, track your ballot on your state\'s election website',
      'Watch for official preliminary results after polls close',
      'Understand that final certification may take days or weeks',
      'Contact your local election office if you have questions about your ballot',
    ],
    tip: 'Results on election night are unofficial. Official certified results come later.',
  },
];

/**
 * Pre-election checklist items users can track before casting their vote.
 * @type {ChecklistItem[]}
 */
export const voterChecklist = [
  {
    id: 'cl-registration',
    label: 'Confirm voter registration is active',
    description: 'Check your state\'s voter portal or vote.gov to verify your status.',
    topic: 'registration',
  },
  {
    id: 'cl-id',
    label: 'Check what ID is required at your polling place',
    description: 'ID requirements vary by state — some require a photo ID, others do not.',
    topic: 'general',
  },
  {
    id: 'cl-polling',
    label: 'Find your polling place and hours',
    description: 'Use your local election office website to find where and when to vote.',
    topic: 'ballot',
  },
  {
    id: 'cl-ballot',
    label: 'Review your sample ballot',
    description: 'Look up your official sample ballot to research all races in advance.',
    topic: 'ballot',
  },
  {
    id: 'cl-plan',
    label: 'Decide on your voting method',
    description: 'Choose in-person, early, or mail-in voting and take the required steps.',
    topic: 'ballot',
  },
  {
    id: 'cl-deadline',
    label: 'Note key deadlines (registration, mail ballot request)',
    description: 'Mark all critical dates on your calendar so you don\'t miss them.',
    topic: 'timeline',
  },
];
