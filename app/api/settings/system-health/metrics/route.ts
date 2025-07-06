import { NextRequest, NextResponse } from 'next/server'
import si from 'systeminformation'

export async function GET(request: NextRequest) {
  try {
    // Gather metrics that are safe to run in parallel
    const [cpuLoad, mem, fs, networkStats, uptime, users] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkStats(),
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

    // Requests per minute (simplified calculation)
    const requestsPerMinute = networkStats.length > 0 ? Math.round((networkStats[0].rx_sec + networkStats[0].tx_sec) * 10) : 0

    // Uptime (ms)
    const uptimeMs = uptime.uptime * 1000

    // Active connections (number of users logged in)
    const activeConnections = users.length

    // Try to get temperature, but handle gracefully if not available
    let temperature = 0
    try {
      const temp = await si.cpuTemperature()
      temperature = temp.main || 0
    } catch (tempError) {
      console.log('Temperature sensor not available:', tempError)
      // Temperature will remain 0 if not available
    }

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
  } catch (error) {
    console.error('Error gathering system metrics:', error)
    
    // Return basic metrics even if some fail
    return NextResponse.json({
      cpu: 0,
      memory: 0,
      disk: 0,
      network: 0,
      temperature: 0,
      uptime: 0,
      activeConnections: 0,
      requestsPerMinute: 0,
      error: 'Some metrics unavailable'
    })
  }
} 