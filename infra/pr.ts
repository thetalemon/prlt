import { gql } from '@apollo/client'
import prs from '../mockData/prs.json'

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
  query ($number: Int) {
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
`

export function getPr() {
  return {
    data: prs as PrQueryResponse,
    loading: false,
    error: undefined
  }
}
