# MCQ Solver Server

A Node.js server that processes HTML pages and provides answers to Multiple Choice Questions (MCQs) using the Groq API with LangChain.

## Features

- Receives HTML content via REST API
- Extracts MCQs from HTML content
- Uses Groq's LLM (Large Language Model) to solve MCQs
- Returns structured JSON responses with answers

## Prerequisites

- Node.js v14 or higher
- npm or yarn
- Groq API key (get it from [https://console.groq.com](https://console.groq.com))

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd legal_cat
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

1. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and add your Groq API key:
   ```
   GROQ_API_KEY=your_actual_groq_api_key_here
   ```

## Usage

1. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

2. The server will start on `http://localhost:3000` (or your configured PORT).

## API Endpoints

### GET /

Returns server status and available endpoints.

### POST /solve-mcqs

Processes HTML content and returns MCQ answers.

**Request Body:**
```json
{
  "htmlContent": "<html>...</html>"
}
```

**Response:**
```json
{
  "success": true,
  "answers": [
    {
      "question": "Full question text",
      "options": [
        {"label": "A", "text": "Option A text"},
        {"label": "B", "text": "Option B text"},
        {"label": "C", "text": "Option C text"},
        {"label": "D", "text": "Option D text"}
      ],
      "answer": "A"
    }
  ]
}
```

## Client Example

Open `client-example.html` in a web browser to test the server with sample HTML content.

## Integration with Chrome Extension

This server can be integrated with the AI Auto MCQ Marker Chrome extension to provide server-side processing capabilities.

## Deployment

### Render Deployment (Recommended)

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for detailed Render deployment instructions.

### Vercel Deployment

This project can also be deployed to Vercel, but with some limitations:

1. File system operations are not supported on Vercel
2. Only the `/solve-mcqs-base64` endpoint is available
3. The `/solve-mcqs` endpoint that requires file uploads will not work

To deploy to Vercel:

1. Create a new project on Vercel
2. Connect your Git repository
3. Set the environment variables in Vercel dashboard:
   - `GROQ_API_KEY` - Your Groq API key
4. Deploy!

The API will be available at:
- `POST /solve-mcqs-base64` - Process base64 encoded images

## License

MIT