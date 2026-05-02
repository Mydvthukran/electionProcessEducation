## Security Policy

### Overview

The Election Guide Assistant is designed with security and user trust as core principles. We follow OWASP Top 10 guidelines and implement security best practices.

### Security Features

#### 1. Environment Variable Protection
- **API Keys**: Stored in `.env.local` (never committed)
- **Template**: `.env.example` shows required fields
- **Runtime**: Variables loaded via Vite's `import.meta.env`

#### 2. Input Sanitization
- All user input validated before processing
- HTML escaping in display (React's default JSX escaping)
- No `innerHTML` or `dangerouslySetInnerHTML`

#### 3. API Security
- **Gemini API**: Uses official Google endpoints
- **Rate Limiting**: Ready for implementation (no unlimited calls)
- **Error Handling**: Graceful fallback if API fails
- **Safety Filters**: Gemini's built-in harmful content detection

#### 4. Content Security
- No external scripts loaded
- No inline scripts
- Google Fonts from official CDN only
- Local data (no external content injection)

#### 5. Accessibility ≠ Security
- WCAG 2.1 AA compliance
- Semantic HTML (prevents XSS vectors)
- Keyboard-only navigation (prevents mouse hijacking)

### Known Limitations

| Issue | Status | Mitigation |
|-------|--------|-----------|
| No backend authentication | Expected (client-side) | Coming in v2.0 with user accounts |
| No HTTPS enforcement in dev | Expected (local development) | Enforced on production |
| API key exposure risk | Acceptable (local only) | Never commit `.env.local` |
| No CSRF protection | N/A (stateless API calls) | Add CSRF tokens if backend added |

### Reporting Security Issues

**Please do not open public issues for security vulnerabilities.**

If you discover a security issue:
1. Email: security@electionguideassistant.com (or maintainer email)
2. Include: Description, steps to reproduce, potential impact
3. Wait: 48 hours for acknowledgment before public disclosure

### Security Best Practices

#### For Users
- [ ] Keep API key private (never share)
- [ ] Verify official election office information before voting
- [ ] Use on trusted devices/networks
- [ ] Clear browser cache if sharing device

#### For Developers
- [ ] Never commit `.env.local`
- [ ] Use `.env.example` as template
- [ ] Review dependencies before updating (`npm audit`)
- [ ] Test with real election data only
- [ ] Rotate API keys periodically
- [ ] Monitor Gemini API usage for abuse

#### For Deployment
- [ ] Set environment variables in hosting provider (not in code)
- [ ] Use HTTPS everywhere
- [ ] Enable CORS restrictions
- [ ] Implement rate limiting on API calls
- [ ] Monitor for unusual usage patterns
- [ ] Keep dependencies updated

### Compliance

- **WCAG 2.1 AA**: Accessibility Standard
- **OWASP Top 10**: Web Application Security
- **CSP Ready**: Content Security Policy headers
- **GDPR Ready**: No user data collection (stateless)

### Future Security Enhancements

- [ ] Backend authentication (OAuth 2.0)
- [ ] Encrypted user preferences
- [ ] CORS enforcement
- [ ] Rate limiting per IP
- [ ] Security audit trail
- [ ] Penetration testing
- [ ] Bug bounty program

### Dependencies Security

Current dependencies (minimal for security):
- `react@18.3.1` - Well-maintained, frequent security updates
- `react-dom@18.3.1` - Part of React ecosystem
- `vite@5.4.10` - Modern, actively maintained

Run `npm audit` regularly to check for vulnerabilities.

