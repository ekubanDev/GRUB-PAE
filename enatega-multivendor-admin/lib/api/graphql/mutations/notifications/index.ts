import { gql } from '@apollo/client';

export const SEND_NOTIFICATION_USER = gql`
  mutation SendNotificationUser(
    $notificationTitle: String
    $notificationBody: String!
  ) {
    sendNotificationUser(
      notificationTitle: $notificationTitle
      notificationBody: $notificationBody
    )
  }
`;

export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($id: ID!) {
    markNotificationRead(id: $id) {
      _id
      body
      read
      createdAt
    }
  }
`;
