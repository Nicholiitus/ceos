<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# CEOS Development Guidelines

## Project Context

This is the Copilot Enterprise Orchestration System (CEOS), an enterprise-grade platform for managing GitHub Copilot deployments across large organizations.

## Coding Standards

- Use TypeScript for all new backend services
- Follow enterprise security best practices
- Implement comprehensive error handling and logging
- Write unit tests for all business logic
- Use dependency injection patterns
- Follow SOLID principles

## Architecture Patterns

- Microservices architecture with clear service boundaries
- Event-driven communication between services
- API-first design with OpenAPI specifications
- Database per service pattern
- Circuit breaker pattern for external dependencies

## Security Requirements

- All APIs must be authenticated and authorized
- Input validation on all endpoints
- Secure secret management
- Regular security scanning
- Audit logging for all operations

## Documentation

- Document all public APIs with OpenAPI specs
- Include inline code documentation
- Update README files when adding new features
- Maintain architecture decision records (ADRs)

## Enterprise Integration

- Support for enterprise SSO providers
- Integration with enterprise monitoring tools
- Compliance with organizational policies
- Scalable deployment patterns
