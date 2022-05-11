import { useQuery } from '@apollo/client'
import styles from '../styles/Home.module.css'
import prs from '../mockData/prs.json'
import { PrQuery, PullRequest, PullRequestNode } from '../infra/pr'

function getLt(pr: PullRequest): number {
  const merged = new Date(pr.mergedAt)
  const created = new Date(pr.createdAt)
  const diff = merged.getTime() - created.getTime()

  return diff
}

function TimeElement({ time }: { time: number }) {
  const hours = Math.floor(time / 1000 / 60 / 60) % 24
  const days = Math.floor(time / 1000 / 60 / 60 / 24)

  return (
    <h3>
      {days}days {hours}hours
    </h3>
  )
}

function Calced({ time }: { time: number }) {
  return (
    <div className={styles.card}>
      <TimeElement time={time} />
    </div>
  )
}

function Average({ prLtTimes }: { prLtTimes: number[] }) {
  const prLtTimesListLength = prLtTimes.length
  if (prLtTimesListLength === 0) {
    return (
      <div className={styles.card}>
        <h3>未計算です</h3>
      </div>
    )
  }

  const total = prLtTimes.reduce(function (sum: number, item: number) {
    return sum + item
  }, 0)
  const average = total / prLtTimesListLength

  return (
    <div className={styles.card}>
      平均
      <TimeElement time={average} />
    </div>
  )
}

export default function PRs() {
  const { data, loading, error } = useQuery(PrQuery, { variables: { number: 30 } })
  // const data: PrQueryResponse = prs

  if (loading) {
    return (
      <h2>
        <a href="#loading" aria-hidden="true" className="aal_anchor" id="loading">
          <svg
            aria-hidden="true"
            className="aal_svg"
            height="16"
            version="1.1"
            viewBox="0 0 16 16"
            width="16"
          >
            <path
              fillRule="evenodd"
              d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
            ></path>
          </svg>
        </a>
        Loading...
      </h2>
    )
  }

  if (error) {
    console.error(error)
    return null
  }

  const edges = data.repository.pullRequests.edges
  const prLtTimes: number[] = edges.map((edge: PullRequestNode) => {
    const pr = edge.node
    return getLt(pr)
  })

  return (
    <div>
      <div className={styles.grid}>
        <Average prLtTimes={prLtTimes} />
      </div>

      <div className={styles.grid}>
        {prLtTimes.map((time: number) => (
          <Calced key={time} time={time} />
        ))}
      </div>
    </div>
  )
}
