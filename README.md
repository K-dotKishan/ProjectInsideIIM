# AI Investment Research Agent

**Live Demo:** [https://project-inside-j9enu33uw-kishan-s-projects-5bd3e619.vercel.app/](https://project-inside-j9enu33uw-kishan-s-projects-5bd3e619.vercel.app/)

**Backend API:** [https://projectinsideiim.onrender.com](https://projectinsideiim.onrender.com)

> Enter any publicly traded company name, and the agent researches it end-to-end — pulling live financial data and recent news — then delivers a structured BUY / HOLD / PASS recommendation with full reasoning.

---

## Overview

The AI Investment Research Agent is a full-stack application that automates equity research. A user types a company name (e.g. "Nvidia", "Nokia", "Apple"), and the agent:

1. Resolves the company to its stock ticker using a live web search
2. Fetches real-time financial metrics from Yahoo Finance (price, market cap, P/E, EPS, dividend yield)
3. Fetches the 5 most recent relevant news articles from NewsAPI
4. Feeds all gathered data into a structured prompt for a Gemini LLM
5. Returns a JSON analysis with a recommendation (BUY / HOLD / PASS), confidence score, reasoning, strengths, risks, and key financials

The frontend renders this into a clean dashboard with colour-coded recommendation badges and organised cards.

---

## How to Run

### Prerequisites
- Node.js v18+
- API keys for: [Google Gemini](https://aistudio.google.com/apikey), [Tavily](https://app.tavily.com), [NewsAPI](https://newsapi.org)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key
TAVILY_API_KEY=your_tavily_api_key
NEWS_API_KEY=your_newsapi_key
PORT=3001
```

```bash
npm start
# Server runs on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3001
```

```bash
npm run dev
# App runs on http://localhost:5173
```

---

## How It Works — Architecture

```
User Input (company name)
        │
        ▼
┌─────────────────────────────────────────────┐
│              LangGraph Agent                │
│                                             │
│  ┌─────────────┐                            │
│  │ find_ticker │  Tavily Web Search         │
│  │    node     │  → extracts stock ticker   │
│  └──────┬──────┘                            │
│         │                                   │
│  ┌──────▼──────────────┐                    │
│  │ gather_information  │  Parallel calls:   │
│  │       node          │  → Yahoo Finance   │
│  │                     │  → NewsAPI         │
│  └──────┬──────────────┘                    │
│         │                                   │
│  ┌──────▼──────┐                            │
│  │ run_analysis│  Gemini 2.5 Flash LLM      │
│  │    node     │  → structured JSON output  │
│  └─────────────┘                            │
└─────────────────────────────────────────────┘
        │
        ▼
  React Frontend
  (Dashboard with recommendation, reasoning,
   financials, strengths, risks)
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| AI Orchestration | LangGraph.js, LangChain.js |
| LLM | Google Gemini 2.5 Flash |
| Web Search | Tavily Search API (`@langchain/tavily`) |
| Financial Data | yahoo-finance2 v3 |
| News | NewsAPI |
| Deployment | Vercel (frontend) + Render (backend) |

### Directory Structure

```
project/
├── backend/
│   ├── controllers/      # HTTP request handling & validation
│   ├── graph/            # LangGraph workflow definition
│   ├── prompts/          # Gemini prompt template
│   ├── routes/           # Express route definitions
│   ├── services/         # Shared service layer
│   ├── tools/            # LangChain tools (search, finance, news)
│   └── utils/            # API client initialisation (Gemini, Tavily, NewsAPI)
└── frontend/
    ├── components/       # Reusable UI components
    └── src/
        ├── pages/        # Page-level components (HomePage)
        └── services/     # API calls to backend
```

---

## Key Decisions & Trade-offs

### LangGraph over a simple LLM call
A single prompt-stuffing approach would work for a prototype, but LangGraph makes the pipeline explicit, each node is independently testable, and the state object gives full visibility into what data was gathered before the LLM runs. Adding a new research step (e.g. SEC filings) is as simple as adding a new node.

### Three dedicated tools vs. one general agent
Rather than giving the LLM free-form tool use, the workflow is deterministic: find ticker → gather data → analyse. This removes hallucination risk in the data-gathering phase. The LLM is only used where it genuinely adds value — synthesis and reasoning — not for data retrieval.

### Structured JSON output from the LLM
The prompt enforces a strict JSON schema. This makes the frontend completely decoupled from the LLM's natural language style and ensures consistent rendering regardless of which company is analysed. The trade-off is that an unexpected LLM response format will throw an error rather than degrade gracefully.

### Yahoo Finance + NewsAPI vs. a paid financial data provider
Yahoo Finance (via `yahoo-finance2`) gives real-time quotes for free with no API key. NewsAPI is free for development use. This keeps the project zero-cost while still providing live data. The trade-off is that Yahoo Finance is an unofficial scraper and can break; a production system would use Bloomberg or Polygon.io.

### Parallel data gathering
`gather_information` calls Yahoo Finance and NewsAPI with `Promise.all`. This cuts the data-gathering time roughly in half (from ~2s sequential to ~1s parallel), which matters given the overall latency of the LLM call.

### What was left out
- **Caching** — the same company queried twice hits all APIs again. Redis caching with a short TTL would be a quick win.
- **Streaming** — the analysis result appears all at once after ~10s. Streaming the LLM response token-by-token would dramatically improve perceived performance.
- **Historical price charts** — yahoo-finance2 supports historical OHLCV data; adding a price chart would enrich the UI.
- **Rate limiting** — the API endpoint has no rate limiting, making it vulnerable to abuse in production.
- **Better ticker extraction** — the current regex heuristic works well but can misidentify tickers for ambiguous queries. An LLM extraction step would be more robust.

---

## Example Runs

### NVIDIA
```json
{
  "companyName": "NVIDIA Corporation",
  "ticker": "NVDA",
  "recommendation": "HOLD",
  "confidenceScore": 65,
  "summary": "NVIDIA remains a dominant force in AI and GPU technology. However, growing market skepticism regarding a potential AI bubble and recent sector-wide tech sell-offs present significant near-term valuation challenges.",
  "strengths": [
    "Unrivalled GPU dominance in AI training and inference workloads",
    "Expanding ecosystem with CUDA, software, and enterprise partnerships",
    "Strong revenue and earnings growth driven by data centre demand"
  ],
  "risks": [
    "Extremely high P/E ratio leaves little margin for error",
    "Geopolitical risk from US chip export restrictions to China",
    "Increasing competition from AMD, Intel, and custom silicon (AWS, Google, Apple)"
  ]
}
```

### Nokia
```json
{
  "companyName": "Nokia Corporation",
  "ticker": "NOK",
  "recommendation": "PASS",
  "confidenceScore": 72,
  "summary": "Nokia faces sustained pressure in its core network equipment business as Ericsson and Huawei compete aggressively on price. The 5G infrastructure cycle is maturing without a clear next catalyst.",
  "strengths": [
    "Large patent licensing portfolio provides recurring royalty revenue",
    "Strong relationships with Tier 1 telcos globally",
    "Cost restructuring has improved operating margins"
  ],
  "risks": [
    "Revenue decline in core mobile networks segment",
    "Slow enterprise network adoption limiting growth runway",
    "Currency headwinds from euro-denominated costs vs. global revenue"
  ]
}
```

---

## What I Would Improve With More Time

1. **Streaming responses** — pipe the Gemini response as a stream to the frontend so users see the analysis build in real time rather than waiting 10+ seconds for a result.
2. **Redis caching** — cache analysis results by ticker for 15 minutes to avoid redundant API calls and reduce latency for repeat queries.
3. **Richer financial data** — add income statement trends, analyst consensus targets, and insider ownership data from yahoo-finance2's additional modules.
4. **Competitor comparison** — automatically fetch and compare the top 2 competitors, giving the recommendation more context.
5. **PDF export** — let users download the analysis as a formatted PDF for sharing.
6. **Better error UX** — show partial results if one data source fails (e.g. news unavailable) rather than a hard 500 error.
7. **Auth + history** — let users log in and view their past analyses.

---

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `GEMINI_API_KEY` | Google Gemini LLM access | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `TAVILY_API_KEY` | Web search for ticker resolution | [app.tavily.com](https://app.tavily.com) |
| `NEWS_API_KEY` | Recent news articles | [newsapi.org](https://newsapi.org) |
| `PORT` | Server port (default: 3001) | — |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend base URL (e.g. `http://localhost:3001`) |
