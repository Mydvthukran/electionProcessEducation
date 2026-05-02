/**
 * CONTRIBUTING.md - Guidelines for Election Assistant Contributors
 */

# Contributing to Election Guide Assistant

## Code Quality Standards

### Structure
- Organize code into logical modules (components, services, hooks, utils)
- Keep files focused and under 300 lines where possible
- Use clear, descriptive names for functions and variables

### Accessibility (WCAG 2.1 AA)
- Use semantic HTML (`<article>`, `<section>`, `<button>`, etc.)
- Include ARIA labels for screen readers
- Ensure all interactive elements are keyboard navigable
- Maintain minimum 4.5:1 color contrast ratio for text

### Security
- Never commit API keys or secrets
- Use environment variables for sensitive config
- Validate all user input
- Sanitize HTML output to prevent XSS

### Testing
- Run validation tests: `npm test`
- Test topic inference with various prompts
- Verify all content fields are populated
- Check accessibility compliance

## Adding New Topics

1. Add to `src/data/electionContent.js`:
```javascript
newTopic: {
  summary: 'Brief explanation',
  steps: ['Step 1', 'Step 2', 'Step 3'],
  next: 'Follow-up suggestion'
}
```

2. Update topic detection in `src/services/electionAdvisor.js`

3. Add test cases to `validationService.js`

## Git Workflow

- Work on a feature branch
- Commit frequently with clear messages
- Push to origin before creating PR
- Include validation report in PR description
