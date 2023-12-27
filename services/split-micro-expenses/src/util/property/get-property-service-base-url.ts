export const getPropertiesServiceBaseUrlFromNodeEnv = (nodeEnv: string) => {
  if (nodeEnv === 'staging') {
    return 'https://api.staging.split.direct/properties';
  } else if (nodeEnv === 'production') {
    return 'https://api.split.direct/properties';
  } else {
    return 'http://localhost:3001';
  }
};
