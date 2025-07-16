// LiveKit Configuration
export const getLiveKitServerUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://latestapp-l1t6hzts.livekit.cloud';
  console.log('LiveKit Server URL:', url);
  return url;
};

export const getLiveKitApiUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_LIVEKIT_API_URL || 'https://latestapp-l1t6hzts.livekit.cloud';
  console.log('LiveKit API URL:', url);
  return url;
};

// LiveKit configuration object
export const livekitConfig = {
  serverUrl: getLiveKitServerUrl(),
  apiUrl: getLiveKitApiUrl(),
  // Add other LiveKit-related configuration here
}; 