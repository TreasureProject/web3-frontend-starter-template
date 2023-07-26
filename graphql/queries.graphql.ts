import gql from "graphql-tag";

export const getItems = gql`
  query getItems {
    items {
      id
    }
  }
`;
