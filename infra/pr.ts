import { gql } from "@apollo/client";

export type PullRequest = {
  mergedAt: string
  createdAt: string  
}

export type PullRequestNode = {
  node: PullRequest
}

export type PrQueryResponse = {
  repository: {
    pullRequests: {
      edges: PullRequestNode[]
    }
  }
}

export const PrQuery = gql`
  query ($number: Int){
    repository(owner: "nodejs", name: "node") {
      pullRequests(last: $number, states: MERGED) {
        edges {
          node {
            mergedAt
            createdAt
          }
        }
      }
    }
  }
`;
