
<img width="1600" height="723" alt="SentiIQ" src="https://github.com/user-attachments/assets/18abf8a0-4555-42c7-8193-f21ac4b5b0b5" />

# 🧠 SentiIQ: Client-Side Sentiment Analysis Prototype

**SentiIQ** is a multimodal sentiment analysis prototype designed to demonstrate direct, structured integration with the **Google Gemini API**.  
It provides **real-time sentiment analysis** for text, uploaded files, and images via a simple **React interface**.

---

## 🚀 System Architecture & Data Flow

SentiIQ is intentionally built as a **client-side prototype** for demonstration purposes.  
This means the browser-based React application directly interfaces with the AI model.

### 🔄 Architecture Overview

The flow follows a clear, unidirectional structure:

1. **User Interaction (Input)**  
   The user enters text, or uploads a file or image using the React UI.

2. **Client-Side Processing**  
   The app uses the standard browser **FileReader API** to convert uploaded files/images into **Base64-encoded strings**.  
   This input is packaged into a request payload by the core `geminiService.ts` module.

3. **Direct API Request**  
   An HTTPS request is sent directly from the client (browser) to the **Google Gemini API endpoint**, including:
   - Multimodal input (text and/or Base64 data)  
   - API key (sourced from the environment)  
   - A critical `responseSchema` to enforce structured JSON output

4. **Gemini API Processing**  
   Google’s servers process the request, perform sentiment analysis, and generate a response that strictly adheres to the defined JSON schema.

5. **Response Handling & UI**  
   The client receives structured JSON, which is parsed and rendered dynamically to display analysis results, charts, and detailed sentiment breakdowns.

---

## 🔒 API Authentication & Security Considerations

### Authentication
The prototype authenticates with the Gemini API using:

This key is embedded into the client-side code during the build process.

### ⚠️ Security Warning (Prototype vs. Production)

> **IMPORTANT:** Exposing an API key on the client-side is a **significant security risk** and is only acceptable for a private prototype or internal demo.

#### ✅ Recommended Production Approach

1. **Backend Proxy**  
   Use a serverless function (e.g., Google Cloud Function) or Node.js server as an intermediary.

2. **Secure Key Management**  
   The client sends requests to this backend proxy, which securely appends the API key before forwarding to the Gemini API.  
   This ensures the key is **never exposed in browser code**.

---

## 📈 Rate Limiting and Scaling Challenges

### Current Limitations
SentiIQ currently relies on Google’s **default rate limits** (e.g., 60 RPM).  
Exceeding this limit results in a **429 Too Many Requests** error.

### Scaling Challenges
| Challenge | Description |
|------------|-------------|
| **API Key Exposure** | Unsafe for production and limits scaling |
| **Rate Limiting** | A shared key is easily exhausted by multiple users |
| **Lack of Caching** | Repeated requests increase cost and latency |
| **Browser Constraints** | Large files may slow or crash the browser |

### Proposed Production Solutions

| Challenge | Proposed Solution | Rationale |
|------------|------------------|------------|
| API Key Exposure | Backend Proxy | Securely manages credentials |
| Rate Limiting | Authentication & Authorization | Assign per-user rate limits (e.g., via Firebase Auth) |
| Long-Running Jobs | Job Queue (e.g., Pub/Sub) | Asynchronous processing for large inputs |
| Redundant Calls | Caching Layer (e.g., Redis) | Avoids duplicate processing and reduces cost |

---

## 🔬 API Trade-off Analysis

SentiIQ uses **Google Gemini 2.5 Flash** based on performance, cost, and reliability trade-offs.

| Factor | Google Gemini (Flash) | OpenAI GPT-4o | Anthropic Claude 3 Sonnet |
|--------|------------------------|----------------|-----------------------------|
| **Performance (Latency)** | 🚀 Excellent | ⚡ Very Good | ⚙️ Good |
| **Accuracy / Nuance** | Very Good | 🏆 Excellent | Excellent |
| **Cost** | 💰 Highly Cost-Effective | Moderate | Moderate |
| **Structured Output (JSON)** | ✅ Excellent (via `responseSchema`) | Good (function calling) | Good (prompting) |
| **Multimodality** | 🖼️ Excellent | Excellent | Excellent |

**Justification:**  
Gemini Flash’s **native structured JSON output** via `responseSchema` ensures consistent, machine-readable data—ideal for data visualization dashboards like SentiIQ.  
Combined with its speed and affordability, it’s the perfect engine for this prototype.

---
