# Contributing to CEOS

Thank you for your interest in contributing to the Copilot Enterprise Orchestration System (CEOS)! This guide will help you get started with contributing to our project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- Node.js 18+ or Python 3.9+
- Git
- Docker and Docker Compose
- A GitHub account

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/ceos.git
   cd ceos
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your development environment:
   ```bash
   cp .env.example .env
   docker-compose up -d
   ```
5. Run tests to ensure everything is working:
   ```bash
   npm test
   ```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - Feature development branches
- `hotfix/*` - Critical bug fixes
- `release/*` - Release preparation branches

### Making Changes

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards

3. Write or update tests for your changes

4. Run the test suite:
   ```bash
   npm test
   npm run lint
   ```

5. Commit your changes:
   ```bash
   git commit -m "feat: add new feature description"
   ```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Update the CHANGELOG.md if applicable
5. Create a pull request with:
   - Clear title and description
   - Link to any related issues
   - Screenshots for UI changes

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write JSDoc comments for public APIs
- Prefer functional programming patterns
- Use async/await over promises

### Testing

- Write unit tests for all business logic
- Use integration tests for API endpoints
- Maintain test coverage above 80%
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Documentation

- Update README.md for significant changes
- Document all public APIs
- Include code examples where helpful
- Keep inline comments concise and relevant

## Security

- Never commit secrets or API keys
- Use environment variables for configuration
- Follow OWASP security guidelines
- Report security vulnerabilities privately

## Questions?

- Create an issue for bugs or feature requests
- Join our discussion forum for general questions
- Contact maintainers for urgent matters

## Recognition

Contributors will be recognized in our README and release notes. Thank you for helping make CEOS better!
