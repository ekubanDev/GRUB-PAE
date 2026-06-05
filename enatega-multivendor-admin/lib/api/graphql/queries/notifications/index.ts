import { gql } from '@apollo/client';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications {
    notifications {
      _id
      body
      title
      createdAt
    }
  }
`;

export const GET_WEB_NOTIFICATIONS = gql`
  query GetWebNotifications {
    notifications {
      notifications {
        _id
        body
        read
        createdAt
      }
    }
  }
`;
