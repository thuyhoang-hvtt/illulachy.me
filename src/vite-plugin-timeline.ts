import type { Plugin } from 'vite'
import { spawn } from 'child_process'
import chokidar from 'chokidar'

export function timelinePlugin(): Plugin {
  return {
    name: 'timeline-generator',
    
    // Run generator on build start
    async buildStart() {
      console.log('[Timeline Plugin] Generating timeline.json...')
      await runGenerator()
    },
    
    // Watch content files during dev
    configureServer(server) {
      const watcher = chokidar.watch('content/**/*.md', {
        ignoreInitial: true,
        awaitWriteFinish: { stabilityThreshold: 100 }
      })
      
      const handleChange = async (path: string) => {
        console.log(`[Timeline Plugin] Content changed: ${path}`)
        try {
          await runGenerator()
          server.ws.send({ type: 'full-reload' })
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error))
          server.ws.send({
            type: 'error',
            err: {
              message: err.message,
              stack: err.stack || ''
            }
          })
        }
      }
      
      watcher.on('add', handleChange)
      watcher.on('change', handleChange)
      watcher.on('unlink', handleChange)
      
      return () => watcher.close()
    }
  }
}

function runGenerator(): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn('npm', ['run', 'generate-timeline'], {
      stdio: 'inherit',
      shell: true
    })
    proc.on('exit', (code) => {
      code === 0 ? resolve() : reject(new Error(`Generator failed with code ${code}`))
    })
    proc.on('error', reject)
  })
}
