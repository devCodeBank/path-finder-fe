import { Amplify } from "aws-amplify";

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
      signUpVerificationMethod: "code" as const,
      loginWith: {
        email: true,
        phone: false,
        username: false,
      },
    },
  },
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;
