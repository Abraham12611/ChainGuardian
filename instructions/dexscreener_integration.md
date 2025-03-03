# DexScreener Integration Plan

## Overview
Implement DexScreener API integration to fetch and display top gainers and losers in the crypto market through the chat interface.

## API Integration Details

### Endpoints to Use
- Main endpoint: `https://api.dexscreener.com/latest/dex/search`
- We'll use the search endpoint as it provides the most comprehensive token data including price changes

### Implementation Steps

1. **Backend Implementation**
   ```typescript
   // server/routes.ts
   - Create new function `fetchTopTokens(type: 'gainers' | 'losers', limit = 10)`
   - Implement rate limiting using a simple in-memory cache
   - Add error handling for API failures
   ```

2. **Data Processing**
   - Sort tokens by priceChange24h
   - Filter out low liquidity tokens (< $10,000)
   - Format numbers for display (e.g., $1.23M instead of 1234567)
   - Add risk indicators based on liquidity and volume

3. **Chat Interface Updates**
   - Add pattern matching for queries like:
     - "What are the top gainers..."
     - "Show me the biggest losers..."
     - "Best performing tokens..."
   - Create a new component for displaying token lists
   - Add sorting and filtering options

## Rate Limiting Strategy
- Cache results for 5 minutes
- Implement exponential backoff for failed requests
- Track API usage to stay within DexScreener's limits (300 requests/minute)

## Error Handling
- Handle API timeouts
- Handle malformed responses
- Provide user-friendly error messages
- Implement fallback behavior when API is unavailable

## UI/UX Considerations
- Show loading states during API calls
- Format numbers consistently
- Color code price changes (green/red)
- Include tooltips for metrics
- Support mobile responsive design

## Implementation Order

1. **Phase 1: Basic Integration**
   - Implement basic API calls
   - Create data processing functions
   - Add simple list display

2. **Phase 2: Enhanced Features**
   - Add caching layer
   - Implement rate limiting
   - Enhance error handling

3. **Phase 3: UI Polish**
   - Improve token list component
   - Add animations
   - Enhance mobile experience

## Testing Strategy
- Test API response handling
- Verify rate limiting
- Test error scenarios
- Validate data formatting
- Check mobile responsiveness

## Security Considerations
- Validate all API responses
- Sanitize displayed data
- Monitor for API abuse
- Implement request timeouts

## Dependencies Required
- None additional (using built-in fetch API)

## Estimated Timeline
- Phase 1: 2-3 hours
- Phase 2: 2-3 hours
- Phase 3: 2-3 hours
Total: 6-9 hours for complete implementation

## Success Criteria
- Users can query top gainers/losers
- Results display within 2 seconds
- Clean, readable formatting
- Proper error handling
- Mobile-friendly display
