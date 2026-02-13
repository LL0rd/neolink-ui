import { spawn, type ChildProcess } from 'node:child_process'

const MAX_LOG_LINES = 500

interface ProcessState {
  process: ChildProcess | null
  running: boolean
  pid?: number
  startedAt?: Date
  mode: string
  logs: string[]
}

const state: ProcessState = {
  process: null,
  running: false,
  mode: 'rtsp',
  logs: [],
}

function pushLog(line: string) {
  state.logs.push(line)
  if (state.logs.length > MAX_LOG_LINES) {
    state.logs.splice(0, state.logs.length - MAX_LOG_LINES)
  }
}

export function getProcessStatus() {
  return {
    running: state.running,
    pid: state.pid,
    uptime: state.startedAt ? Date.now() - state.startedAt.getTime() : undefined,
    mode: state.mode,
    startedAt: state.startedAt?.toISOString(),
  }
}

export function getProcessLogs(): string[] {
  return [...state.logs]
}

export function getProcessMode(): string {
  return state.mode
}

export function setProcessMode(mode: string): void {
  state.mode = mode
}

export async function startProcess(): Promise<void> {
  if (state.running) {
    throw createError({ statusCode: 409, message: 'Process is already running' })
  }

  const config = useRuntimeConfig()
  const binaryPath = config.neolinkBinaryPath
  const configPath = config.neolinkConfigPath

  const args = [state.mode, '--config', configPath]

  pushLog(`[UI] Starting neolink: ${binaryPath} ${args.join(' ')}`)

  const child = spawn(binaryPath, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  state.process = child
  state.running = true
  state.pid = child.pid
  state.startedAt = new Date()

  child.stdout?.on('data', (data: Buffer) => {
    const lines = data.toString().split('\n').filter(Boolean)
    lines.forEach(line => pushLog(line))
  })

  child.stderr?.on('data', (data: Buffer) => {
    const lines = data.toString().split('\n').filter(Boolean)
    lines.forEach(line => pushLog(`[STDERR] ${line}`))
  })

  child.on('error', (err) => {
    pushLog(`[UI] Process error: ${err.message}`)
    state.running = false
    state.process = null
    state.pid = undefined
  })

  child.on('exit', (code, signal) => {
    pushLog(`[UI] Process exited with code=${code} signal=${signal}`)
    state.running = false
    state.process = null
    state.pid = undefined
  })
}

export async function stopProcess(): Promise<void> {
  if (!state.running || !state.process) {
    throw createError({ statusCode: 409, message: 'Process is not running' })
  }

  pushLog('[UI] Stopping neolink...')

  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      pushLog('[UI] Process did not exit in time, sending SIGKILL')
      state.process?.kill('SIGKILL')
    }, 10000)

    state.process!.once('exit', () => {
      clearTimeout(timeout)
      state.running = false
      state.process = null
      state.pid = undefined
      resolve()
    })

    state.process!.kill('SIGTERM')
  })
}

export async function restartProcess(): Promise<void> {
  if (state.running) {
    await stopProcess()
  }
  await startProcess()
}

/** Force cleanup on shutdown */
export function killProcess(): void {
  if (state.process) {
    state.process.kill('SIGTERM')
    state.process = null
    state.running = false
  }
}
