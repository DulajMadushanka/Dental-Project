const config = {
  Auth: {
    identityPoolId: 'ap-southeast-1:a3e75e53-3840-44a0-8b2b-9dcdffbb84ab',
    region: 'ap-southeast-1',
    identityPoolRegion: 'ap-southeast-1',
    userPoolId: 'ap-southeast-1_q914xjEBX',
    userPoolWebClientId: '26imrgs013g7iueopb2aibail6',
    mandatorySignIn: false,
    authenticationFlowType: 'USER_PASSWORD_AUTH',
  },
  "aws_appsync_graphqlEndpoint": "https://ywa2lstwrvetph33wlc23pfc2a.appsync-api.ap-southeast-1.amazonaws.com/graphql",
  "aws_appsync_region": "ap-southeast-1",
  "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
  API: {
    region: 'ap-southeast-1',
    endpoints: [
      {
        id: 'b0k0uc2nvj',
        name: 'dev-patient-lambda-api',
        description: '',
        endpoint: 'https://b0k0uc2nvj.execute-api.ap-southeast-1.amazonaws.com/dev',
        region: 'ap-southeast-1',
        paths: [],
      },
      {
        id: 'uvpx3iy89e',
        name: 'dev-shop-lambda-api',
        description: '',
        endpoint: 'https://uvpx3iy89e.execute-api.ap-southeast-1.amazonaws.com/dev',
        region: 'ap-southeast-1',
        paths: [],
      },
      {
        id: 'ihmri3ep61',
        name: 'dev-basket-buddy-lambda-api',
        description: '',
        endpoint: 'https://ihmri3ep61.execute-api.ap-southeast-1.amazonaws.com/dev',
        region: 'ap-southeast-1',
        paths: [],
      },
    ],
  },
  Storage: {
    AWSS3: {
      bucket: 'basketbuddy-s3-bucket',
      region: 'ap-southeast-1',
    }
  },
};

export default config;

