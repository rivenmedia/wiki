# Contributing to Documentation

Thank you for considering contributing to Riven Media! We welcome contributions from the community to help improve and expand the project. This guide will help you get started with the process of contributing.

## Table of Contents
1. [How to Contribute](#how-to-contribute)
2. [Setting Up Your Development Environment](#setting-up-your-development-environment)
3. [Submitting Changes](#submitting-changes)
4. [Community](#community)

---

## How to Contribute

### Reporting Bugs

If you find a bug, please report it by creating an issue on our [GitHub repository](https://github.com/rivenmedia/wiki/issues). Provide as much detail as possible, including steps to reproduce the issue and any relevant logs or screenshots.

### Suggesting Features

We welcome feature suggestions! To suggest a new feature, please create an issue on our [GitHub repository](https://github.com/rivenmedia/wiki/issues) and describe your idea in detail. Include any potential use cases and benefits of the feature.

### Contributing Code

1. Fork the repository on GitHub.
2. Create a new branch for your feature or bugfix.
3. Write clear and concise commit messages.
4. Ensure your code follows the project's coding standards and passes all tests.
5. Submit a pull request to the `main` branch.

## Setting Up Your Development Environment

To set up your development environment, follow these steps:

1. Clone the repository:
    ```md
    git clone https://github.com/rivenmedia/wiki riven-wiki && cd riven-wiki
    ```

2. Install the required dependencies:
    ```md
    poetry install
    ```

3. Start the development server:
    ```md
    mkdocs serve -a 0.0.0.0:8282
    ```

!!! note "Alternatively.."
    You can also use `make install` to install the dependencies, followed by `make serve` to start the development server.

## Submitting Changes

When submitting changes, please ensure the following:

1. Your commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
2. Your pull request includes a clear description of the changes and the related issue (if applicable).

---

## Community

Join our community on [Discord](https://discord.gg/rivenmedia) to discuss the project, ask questions, and collaborate with other contributors.

Thank you for your contributions!
