# CryptoGuardians Analytics Platform

**Twitter**: [@CryptoGuardians](https://twitter.com/cryptoguardians)   
**Website**: [https://cryptoguardians.ai](https://cryptoguardians.ai)

## Table of Contents

- [Overview](#overview)
- [Integrations](#integrations)
  - [DexScreener API](#dexscreener-api)
  - [AIxBlock Protocol](#aixblock-protocol)
  - [React Frontend](#react-frontend)
  - [Token Analytics](#token-analytics)
- [Features](#features)
- [Technical Stack](#technical-stack)
- [Run](#run)

## Overview

CryptoGuardians Analytics Platform is a sophisticated cryptocurrency analysis tool that combines real-time market data with AI-powered insights. Built with a focus on providing accurate, timely, and actionable information, the platform helps traders and investors make informed decisions through an intuitive chat interface.

<img src="platform-overview.png" alt="CryptoGuardians Platform Overview" width="600"/>

The platform seamlessly integrates multiple data sources and AI analysis capabilities to provide comprehensive token insights, market trends, and risk assessments in an easy-to-understand format.

## Integrations

### DexScreener API
The platform leverages DexScreener's robust API for real-time market data:

- **Implementation**: Located in `server/routes.ts`
- **Key Features**:
  - Top gainers/losers tracking
  - Token price and volume monitoring
  - Liquidity analysis
  - Market cap calculations

Example API integration:
```typescript
async function fetchTopTokens(type: "gainers" | "losers", limit = 10) {
  const res = await fetch("https://api.dexscreener.com/latest/dex/search?q=eth");
  // Process and return token data
}
```

### AIxBlock Protocol
Advanced AI analysis through AIxBlock's multi-agent system:

- **Integration**: Implemented in `server/routes.ts`
- **Capabilities**:
  - Risk assessment
  - Market trend analysis
  - Token security evaluation
  - Custom analysis responses

Example analysis workflow:
```typescript
async function analyzeTokenWithAIxBlock(token: DexScreenerToken) {
  // Generate comprehensive token analysis with risk factors
  return {
    text: analysis,
    tokenData: { /* token metrics */ },
    riskLevel: "medium" | "high",
    riskFactors: []
  };
}
```

### React Frontend
Modern, responsive user interface built with React:

- **Key Components**:
  - Chat interface (`client/src/components/chat/chat-interface.tsx`)
  - Token display (`client/src/components/token/token-list.tsx`)
  - Message rendering (`client/src/components/chat/message-bubble.tsx`)

### Token Analytics
Comprehensive token analysis system:

- **Features**:
  - Market overview
  - Price performance tracking
  - Liquidity analysis
  - Risk assessment
  - Custom data visualization

## Features

### Chat Interface
- **Interactive Queries**: Natural language processing for market-related questions
- **Real-time Updates**: Instant response to market queries
- **Rich Data Display**: Formatted presentation of token metrics and analysis

### Market Analysis
- **Top Performers**: Track best and worst performing tokens
- **Detailed Analysis**: Deep dive into specific token metrics
- **Risk Assessment**: AI-powered risk evaluation and recommendations

### Data Visualization
- **Token Lists**: Clean, organized display of token information
- **Price Trends**: Visual representation of price movements
- **Risk Indicators**: Clear presentation of risk factors

## Technical Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express
- **Data Sources**: DexScreener API
- **AI Integration**: AIxBlock Protocol
- **Styling**: Tailwind CSS with shadcn/ui components

## Run

To run CryptoGuardians Analytics Platform locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### Environment Variables Required:
```
AIXBLOCK_API_KEY=your_aixblock_api_key
```

### Development Guidelines:
- Follow the modern web application patterns in `development_guidelines`
- Use the existing component structure in `client/src/components`
- Maintain type safety with shared schemas in `shared/schema.ts`

## Contact Us

For more information about CryptoGuardians Analytics Platform:

- **Twitter**: [@CryptoGuardians](https://twitter.com/cryptoguardians)
- **Website**: [https://cryptoguardians.ai](https://cryptoguardians.ai)