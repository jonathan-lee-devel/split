export const getPropertiesServiceBaseUrlFromNodeEnv = (nodeEnv: string) => {
  if (nodeEnv === 'staging') {
    return 'https://staging.api.split.direct/properties';
  } else if (nodeEnv === 'production') {
    return 'https://api.split.direct/properties';
  } else {
    return 'http://localhost:3001';
  }
};
