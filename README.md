
# Muhoro GPT - AI Chat Assistant

Muhoro GPT is an intelligent AI-powered chat assistance application built with React, Vite, TypeScript, and Tailwind CSS. It provides a responsive and intuitive interface for users to interact with Google's Gemini AI.

## Features

- **Secure Authentication**: User authentication powered by Clerk with JWT tokens
- **AI Chat Interface**: Responsive chat UI with typing indicators and message history
- **Dark/Light Mode**: Toggle between light and dark themes for comfortable viewing
- **Chat History Management**: Create, view, and delete previous conversations
- **User Settings**: Customize appearance and API keys
- **Message Suggestions**: Quick-start prompts to help begin conversations
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Clerk account for authentication - [Sign up here](https://clerk.dev/)
- Google Gemini API key - [Get it here](https://ai.google.dev/)

### API Key Notes

- This application uses Gemini 1.5 Flash model which is available in the free tier
- Make sure your Gemini API key has access to the Gemini 1.5 Flash model

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Copy the example environment file
cp .env.example .env.local

# Edit the .env.local file with your API keys
# Then start the development server
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
- Use the suggested prompts to quickly start conversations
- Create new conversations with the + button in the sidebar
- View your chat history in the sidebar
- Delete conversations you no longer need
- Toggle between dark and light mode for comfortable viewing

### Example Chat Prompts

Try asking about:
- "Tell me about artificial intelligence"
- "What's the weather like today?"
- "How does blockchain technology work?"
- "Write a short poem about nature"
- "Explain quantum computing in simple terms"

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
