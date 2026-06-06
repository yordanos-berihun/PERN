# Contributing to the LMS Project

Thanks for your interest in contributing! This project welcomes issues and pull requests.

## How to contribute

### Bug reports
- Search existing issues before opening a new one.
- Include a clear description of the problem.
- Provide steps to reproduce the issue.
- Share relevant error messages, screenshots, or logs.

### Feature requests
- Describe the feature and the problem it solves.
- Explain how the feature should behave.
- Include any relevant UI or API details.

### Pull requests
- Fork the repository and create a feature branch.
- Keep changes small and focused.
- Add tests or documentation updates when appropriate.
- Ensure the project still builds successfully.

## Development setup

1. Clone the repository.
2. Install dependencies for each app:
   - `cd lms-backend && npm install`
   - `cd lms-frontend && npm install`
3. Copy the backend environment file:
   - `cd lms-backend && cp .env.example .env`
4. Start the backend and frontend in separate terminals.

## Testing

- Run backend tests: `cd lms-backend && npm test`
- Run frontend build: `cd lms-frontend && npm run build`

## Code style

- Use descriptive commit messages.
- Prefer small, easy-to-review pull requests.
- Document changes in the README if they affect setup or usage.
