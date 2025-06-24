# Centralized Privacy Policy Setup

This setup allows you to maintain your privacy policy in one place and have it automatically update on both your website and Swift app.

## How It Works

1. **Single Source of Truth**: The privacy policy is stored in `public/privacy-policy.json`
2. **Website**: React component fetches and displays the policy from the JSON file
3. **API Endpoint**: Express server serves the policy as JSON via `/api/privacy-policy`
4. **Swift App**: Fetches the policy from the API endpoint

## File Structure

```
├── public/
│   └── privacy-policy.json          # Single source of truth
├── src/
│   └── components/
│       └── PrivacyPolicy.tsx        # React component
├── server.js                        # Express API server
├── SwiftPrivacyPolicyExample.swift  # Swift implementation example
└── package.json                     # Updated with server dependencies
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Development

To run both the React app and API server in development:

```bash
npm run dev
```

This will start:
- React app on `http://localhost:3000`
- API server on `http://localhost:3001`

### 3. Production Deployment

1. Build the React app:
   ```bash
   npm run build
   ```

2. Deploy the entire project (including `server.js`, `build/` folder, and `public/privacy-policy.json`)

3. The server will serve both the React app and the API endpoint

## Updating the Privacy Policy

To update your privacy policy:

1. Edit `public/privacy-policy.json`
2. Update the `lastUpdated` field
3. Deploy the changes
4. Both your website and Swift app will automatically show the updated policy

## Swift App Integration

### 1. Replace the API URL

In `SwiftPrivacyPolicyExample.swift`, update the URL:

```swift
guard let url = URL(string: "https://your-website.com/api/privacy-policy") else {
```

### 2. Use the PrivacyPolicyView

```swift
NavigationLink(destination: PrivacyPolicyView()) {
    Text("Privacy Policy")
}
```

### 3. Customize Styling

The Swift example uses custom fonts. Make sure you have the Poppins font family in your app, or replace with system fonts:

```swift
.font(.custom("Poppins-Bold", size: 24))
// Replace with:
.font(.title)
```

## API Endpoint

The privacy policy is available at:
- **Development**: `http://localhost:3001/api/privacy-policy`
- **Production**: `https://your-website.com/api/privacy-policy`

### Response Format

```json
{
  "lastUpdated": "May 2025",
  "sections": [
    {
      "id": "introduction",
      "title": "1. Introduction",
      "content": "BravoBall (the \"App\") is committed to protecting your privacy..."
    }
  ]
}
```

## Benefits

1. **Single Source of Truth**: Update once, updates everywhere
2. **Version Control**: Track changes in Git
3. **Consistency**: Same content across all platforms
4. **Easy Maintenance**: No need to update multiple codebases
5. **API-First**: Can be consumed by any platform (web, mobile, etc.)

## Troubleshooting

### Website Not Loading Privacy Policy

1. Check that `public/privacy-policy.json` exists
2. Verify the React component is fetching from the correct path
3. Check browser console for errors

### Swift App Not Loading Privacy Policy

1. Verify the API URL is correct
2. Check network connectivity
3. Ensure the server is running and accessible
4. Check for CORS issues (the server includes CORS headers)

### Server Issues

1. Make sure all dependencies are installed
2. Check that port 3001 is available
3. Verify the file paths in `server.js`

## Security Considerations

1. The privacy policy is public information, so serving it via API is appropriate
2. Consider adding rate limiting to the API endpoint
3. Use HTTPS in production
4. Consider caching the JSON file in production for better performance

## Future Enhancements

1. **Caching**: Add Redis or in-memory caching for better performance
2. **Versioning**: Add version numbers to track policy changes
3. **Notifications**: Send push notifications when policy updates
4. **Analytics**: Track when users view the privacy policy
5. **Localization**: Support multiple languages 