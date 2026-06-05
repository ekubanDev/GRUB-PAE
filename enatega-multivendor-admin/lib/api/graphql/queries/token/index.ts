import { gql } from '@apollo/client';

export const UPLOAD_TOKEN = gql`
  mutation UploadToken($token: String!) {
    pushToken(token: $token) {
      _id
      notificationToken
    }
  }
`;
