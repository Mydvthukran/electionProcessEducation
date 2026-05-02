export const timelineSteps = [
  {
    title: '1. Prepare early',
    copy:
      'Check whether you are registered, review important deadlines, and confirm the type of election you are voting in.',
  },
  {
    title: '2. Choose how to vote',
    copy:
      'Use early in-person, mail-in, absentee, or Election Day voting depending on what your local rules allow.',
  },
  {
    title: '3. Cast the ballot',
    copy:
      'Fill out the ballot carefully, follow every instruction, and keep any receipt or tracking information your area provides.',
  },
  {
    title: '4. Wait for counting',
    copy:
      'Officials verify ballots, count them, resolve challenges if needed, and then certify the final results.',
  },
];

export const assistantFacts = {
  registration: {
    summary:
      'Registration usually happens before Election Day and may close days or weeks earlier depending on where you live.',
    steps: [
      'Check your status using your local election office or voter portal.',
      'Update your address or name if anything has changed.',
      'Save the deadline so you do not miss your chance to vote.',
    ],
    next: 'If you tell me your state or country, I can help you think about the right deadline to verify.',
  },
  timeline: {
    summary:
      'A good election timeline starts with preparation, moves into voting, and ends with post-election counting and certification.',
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
      'Use the correct pen, mark choices fully, and review the ballot before submitting it.',
      'If you make a mistake, ask for help from election staff right away.',
    ],
    next: 'If you want, I can explain early voting, mail voting, or polling-place voting next.',
  },
  counting: {
    summary:
      'Counting happens after ballots are submitted and can include verification steps before results are finalized.',
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

export const featureCards = [
  {
    title: 'Before voting',
    copy:
      'Check your registration, confirm your polling place, and understand whether you are voting early, by mail, or in person.',
  },
  {
    title: 'During voting',
    copy:
      'Follow the ballot instructions carefully, ask poll workers for help if needed, and make sure your vote is submitted successfully.',
  },
  {
    title: 'After voting',
    copy:
      'Results may take time. Counties count ballots, resolve eligibility checks, and certify official results after the election.',
  },
];

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
