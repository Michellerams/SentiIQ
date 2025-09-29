export const documentationHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>SentiIQ Documentation</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h1 style="color: #0284c7;">SentiIQ - Sentiment Analysis Dashboard Documentation</h1>
        
        <h2 style="color: #0e7490; border-bottom: 1px solid #ccc; padding-bottom: 5px;">1. API Selection Justification: Google Gemini</h2>
        <p>SentiIQ leverages the <strong>Google Gemini API</strong>, specifically the <code>gemini-2.5-flash</code> model, for its core analysis capabilities. This choice was driven by several key advantages:</p>
        <ul>
            <li><strong>Structured JSON Output:</strong> Gemini's ability to adhere to a specified <code>responseSchema</code> and return data in a guaranteed JSON format is the cornerstone of this application. It eliminates the need for fragile text parsing and ensures a reliable data pipeline from the AI to the UI components.</li>
            <li><strong>Multimodal Capabilities:</strong> The model seamlessly handles diverse inputs, including plain text, complex documents (like PDFs and DOCX), and images. This versatility allows SentiIQ to offer a comprehensive suite of analysis tools within a single, unified interface.</li>
            <li><strong>Performance and Quality:</strong> The <code>gemini-2.5-flash</code> model provides an exceptional balance of speed and accuracy. It delivers nuanced sentiment classifications, keyword extraction, and coherent explanations quickly, which is essential for a responsive and interactive user experience.</li>
            <li><strong>Advanced Contextual Understanding:</strong> Gemini excels at understanding the context provided in prompts, allowing for sophisticated analysis of images based on user queries or detailed sentiment extraction from long-form documents.</li>
        </ul>

        <h2 style="color: #0e7490; border-bottom: 1px solid #ccc; padding-bottom: 5px;">2. Implementation Challenges</h2>
        <p>Developing SentiIQ involved overcoming several technical challenges:</p>
        <ul>
            <li><strong>Ensuring API Reliability:</strong> The primary challenge was guaranteeing that the data received from the AI was always structured and valid. This was solved by rigorously implementing Gemini's <code>responseMimeType: 'application/json'</code> and <code>responseSchema</code> features. This declarative approach offloaded the burden of data validation to the model itself.</li>
            <li><strong>Managing Asynchronous State:</strong> The application's workflow is inherently asynchronous. Managing the application's state (e.g., loading, error, results) while waiting for API calls required careful implementation using React's state management hooks (<code>useState</code>, <code>useEffect</code>). UI elements are dynamically updated to provide clear feedback to the user throughout the analysis process.</li>
            <li><strong>Handling Diverse Inputs:</strong> Creating a unified system to process different input types (text batches, single images with prompts, and various document formats) required a flexible handler function. This involved using client-side file reading (<code>FileReader</code>) to convert all inputs into a base64 format suitable for the Gemini API.</li>
            <li><strong>Designing an Intuitive UI/UX:</strong> The goal was to present complex data in a simple and digestible way. This led to the creation of distinct views: a summary list, a detailed single-item view, and a side-by-side comparison view. Significant effort was also invested in micro-interactions, animations, and a custom cursor to create a polished and engaging user experience without compromising performance.</li>
        </ul>

        <h2 style="color: #0e7490; border-bottom: 1px solid #ccc; padding-bottom: 5px;">3. User Guide</h2>
        <p>SentiIQ is designed for ease of use. Follow these steps to analyze sentiment from various sources.</p>
        
        <h3>3.1 Analyzing Text Input</h3>
        <p>This mode is ideal for quick analysis of snippets, comments, or messages.</p>
        <ol>
            <li>Navigate to the <strong>Direct Input</strong> tab.</li>
            <li>Type or paste your text into the text area. Each new line is treated as a separate entry for batch analysis.</li>
            <li>Click the <strong>Analyze Sentiment</strong> button.</li>
        </ol>
        <p><strong>Example:</strong></p>
        <div style="background-color: #f1f5f9; border: 1px solid #e2e8f0; padding: 10px; border-radius: 5px; font-family: 'Courier New', Courier, monospace;">
            The new user interface is incredibly intuitive and beautiful.<br>
            However, the app crashes frequently on my device.<br>
            The customer support was neither helpful nor rude.
        </div>

        <h3>3.2 Analyzing a Document</h3>
        <p>Analyze the sentiment of entire documents like reports, articles, or feedback forms.</p>
        <ol>
            <li>Navigate to the <strong>File Upload</strong> tab.</li>
            <li>Click the upload area to select a file from your device. Supported formats include PDF, DOCX, TXT, CSV, and more.</li>
            <li>Once the file is selected and appears in the upload area, click <strong>Analyze Sentiment</strong>. The AI will break down the document and analyze it section by section.</li>
        </ol>
        
        <h3>3.3 Analyzing an Image</h3>
        <p>Uncover the mood and emotional tone of photographs, illustrations, or marketing materials.</p>
        <ol>
            <li>Navigate to the <strong>Image</strong> tab.</li>
            <li>Click the upload area to select an image (JPG, PNG, WEBP).</li>
            <li>(Optional) Add a prompt in the text box below the image to guide the analysis. This helps the AI focus on specific aspects of the image.</li>
            <li>Click <strong>Analyze Sentiment</strong>.</li>
        </ol>
        <p><strong>Example Prompt:</strong> "What is the overall mood of this scene? Does it feel celebratory or somber?"</p>

        <h3>3.4 Interpreting the Results</h3>
        <ul>
            <li><strong>Results List:</strong> After analysis, a list of all items appears on the left. Each item shows the source text and the determined sentiment.</li>
            <li><strong>Detailed View:</strong> Click on a single item in the list to see a detailed breakdown, including a confidence score, key sentiment drivers (keywords), and an AI-generated explanation.</li>
            <li><strong>Comparison View:</strong> Select two items from the list to see a side-by-side comparison, making it easy to contrast the sentiment of different texts.</li>
            <li><strong>Overall Distribution Chart:</strong> The pie chart provides a high-level overview of the sentiment distribution across all analyzed items.</li>
        </ul>
    </div>
</body>
</html>
`;
