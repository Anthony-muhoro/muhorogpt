
# Muhoro GPT - AI Chat Assistant

Muhoro GPT is an intelligent AI-powered chat assistance application built with React, Vite, TypeScript, and Tailwind CSS. It provides a responsive and intuitive interface for users to interact with Google's Gemini AI.

## Features

- **Secure Authentication**: User authentication powered by Clerk with JWT tokens
- **AI Chat Interface**: Responsive chat UI with typing indicators and message history
- **Dark Mode Support**: Toggle between light and dark themes
- **Chat History Management**: Create, view, and delete previous conversations
- **User Settings**: Customize appearance, notifications, and API keys
- **Admin Panel**: Manage application settings and preferences

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Clerk account for authentication - [Sign up here](https://clerk.dev/)
- Google Gemini API key - [Get it here](https://ai.google.dev/)

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Configuration

When you first run the application, you'll be prompted to enter:

1. Your Clerk publishable key (starts with `pk_`)
2. Your Google Gemini API key

These keys are stored securely in your browser's local storage and are only used on your device.

## Usage

### Authentication

The app uses Clerk for authentication. You can sign up with email, or use social providers if configured.

### Chat Interface

- Type messages in the input field at the bottom of the chat window
- Create new conversations with the + button in the sidebar
- View your chat history in the sidebar
- Delete conversations you no longer need

### Settings

Access the Settings panel to:
- Toggle between dark and light mode
- Configure notification preferences
- Update your API keys

## Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
  - `/pages` - Application pages (Chat, Dashboard, Admin, etc.)
  - `/lib` - Utility functions and API integrations
  - `/hooks` - Custom React hooks

## Technologies Used

- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Build tool and development server
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Clerk](https://clerk.dev/) - Authentication and user management
- [Google Gemini AI](https://ai.google.dev/) - AI model for chat
- [Shadcn UI](https://ui.shadcn.com/) - UI component library

## License

This project is licensed under the MIT License.

## Acknowledgements

- Built with [Lovable](https://lovable.dev/) - an AI editor for creating web applications
