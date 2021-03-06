import { useQuery } from '@apollo/client'
import styles from '../styles/Home.module.css'
import { PrQuery, getPr, PullRequest, PullRequestNode, PullRequestResponse } from '../infra/pr'
import { Box, Grid, Paper } from '@mui/material'
import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'

const classes = {
  card: {
    border: '#040404 1px solid',
    py: 2,
    pl: 1,
    borderRadius: '12px',
    textAlign: 'center'
  },
  average: {
    border: '#040404 1px solid',
    mb: 5,
    p: 1,
    borderRadius: '12px'
  }
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function getLt(pr: PullRequest): number {
  const merged = new Date(pr.mergedAt)
  const created = new Date(pr.createdAt)
  const diff = merged.getTime() - created.getTime()

  return diff
}

function TimeElement({ time }: { time: number }) {
  const hours = Math.floor(time / 1000 / 60 / 60) % 24
  const days = Math.floor(time / 1000 / 60 / 60 / 24)

  if (days === 0) {
    return <span>{hours}hours</span>
  }

  return (
    <span>
      {days}days {hours}hours
    </span>
  )
}

function Calced({ time }: { time: number }) {
  return (
    <Grid item xs={6}>
      <Paper sx={classes.card}>
        <TimeElement time={time} />
      </Paper>
    </Grid>
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
    <Paper sx={classes.average}>
      期間内の平均:
      <TimeElement time={average} />
    </Paper>
  )
}

export default function PRs() {
  const { data, loading, error } = useQuery(PrQuery, { variables: { number: 30 } })
  // const { data, loading, error } = getPr()
  console.log(data)

  if (loading) {
    return <h2>Loading...</h2>
  }

  if (error) {
    return null
  }

  const edges = data.repository.pullRequests.edges
  console.log(edges)

  const copyedEdges: PullRequestResponse[] = Array.from(edges) as PullRequestResponse[]

  const sortedEdges: PullRequestResponse[] = copyedEdges.sort(function (a, b) {
    const aDate = new Date(a.node.mergedAt)
    const bDate = new Date(b.node.mergedAt)
    return aDate.getTime() > bDate.getTime() ? 1 : -1
  })

  const prLtTimes: number[] = sortedEdges.map((edge: PullRequestNode) => {
    const pr = edge.node
    return getLt(pr)
  })

  const elapsedTimes: number[] = sortedEdges.map((edge: PullRequestNode) => {
    const pr = edge.node
    return Math.floor(getLt(pr) / 3600000)
  })

  const mergedTimes: string[] = sortedEdges.map((edge: PullRequestNode) => {
    return edge.node.mergedAt
  })

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day'
        }
      }
    }
  }

  const graphData = {
    labels: mergedTimes,
    datasets: [
      {
        label: 'リードタイム',
        data: elapsedTimes,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }

  return (
    <Box>
      <Average prLtTimes={prLtTimes} />
      <Line options={options} data={graphData} />

      <Grid container spacing={1}>
        {prLtTimes.map((time: number) => (
          <Calced key={time} time={time} />
        ))}
      </Grid>
    </Box>
  )
}
