import { NextRequest, NextResponse } from 'next/server'
import si from 'systeminformation'

export async function GET(request: NextRequest) {
  // Gather all metrics in parallel
  const [cpuLoad, mem, fs, networkStats, temp, uptime, users] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.fsSize(),
    si.networkStats(),
    si.cpuTemperature(),
    si.time(),
    si.users()
  ])

  // CPU usage (percentage)
  const cpu = cpuLoad.currentLoad || 0

  // Memory usage (percentage)
  const memory = mem.total > 0 ? ((mem.total - mem.available) / mem.total) * 100 : 0

  // Disk usage (percentage, use first disk)
  const disk = fs.length > 0 && fs[0].size > 0 ? (fs[0].use || 0) : 0

  // Network (total rx + tx per second in MB/s)
  const network = networkStats.length > 0 ? ((networkStats[0].rx_sec + networkStats[0].tx_sec) / (1024 * 1024)) : 0

  // Requests per minute (approximate, use rx_packets + tx_packets per minute)
  const requestsPerMinute = networkStats.length > 0 ? ((networkStats[0].rx_packets + networkStats[0].tx_packets) / (uptime.uptime / 60)) : 0

  // Temperature (main CPU temp)
  const temperature = temp.main || 0

  // Uptime (ms)
  const uptimeMs = uptime.uptime * 1000

  // Active connections (number of users logged in)
  const activeConnections = users.length

  return NextResponse.json({
    cpu,
    memory,
    disk,
    network,
    temperature,
    uptime: uptimeMs,
    activeConnections,
    requestsPerMinute,
  })
} 