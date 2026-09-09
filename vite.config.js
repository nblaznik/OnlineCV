import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execFile } from 'node:child_process'
import { access, mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const cvDataPath = fileURLToPath(new URL('./src/data/cv_data.json', import.meta.url))
const publicPdfPath = fileURLToPath(new URL('./public/nejc-blaznik-cv.pdf', import.meta.url))
const siteBase = globalThis.process?.env?.CF_PAGES ? '/' : '/OnlineCV/'
const runFile = promisify(execFile)

async function findChrome() {
  const candidates = [
    globalThis.process?.env?.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].filter(Boolean)

  for (const candidate of candidates) {
    try {
      await access(candidate)
      return candidate
    } catch {
      // Try the next common browser path.
    }
  }

  throw new Error('Chrome was not found. Set CHROME_PATH and try again.')
}

async function exportPdf(request) {
  const chrome = await findChrome()
  const origin = `http://${request.headers.host || '127.0.0.1:5173'}`
  const printUrl = `${origin}${siteBase}?view=print`
  await mkdir(fileURLToPath(new URL('./public', import.meta.url)), { recursive: true })
  await new Promise((resolve) => setTimeout(resolve, 250))
  await runFile(
    chrome,
    [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--print-to-pdf=${publicPdfPath}`,
      printUrl,
    ],
    { timeout: 30_000 },
  )
}

function cvEditorApi() {
  return {
    name: 'cv-editor-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url, 'http://localhost').pathname
        if (request.method !== 'POST') {
          next()
          return
        }

        const sendJson = (statusCode, data) => {
          response.statusCode = statusCode
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify(data))
        }

        if (pathname.endsWith('/__cv/export')) {
          try {
            await exportPdf(request)
            sendJson(200, { ok: true })
          } catch (error) {
            sendJson(500, { ok: false, error: error.message })
          }
          return
        }

        if (!pathname.endsWith('/__cv/save')) {
          next()
          return
        }

        try {
          let body = ''
          for await (const chunk of request) {
            body += chunk
            if (body.length > 1_000_000) {
              throw new Error('CV data is unexpectedly large.')
            }
          }

          const data = JSON.parse(body)
          if (
            typeof data?.name !== 'string' ||
            !Array.isArray(data?.experience) ||
            !Array.isArray(data?.education) ||
            !Array.isArray(data?.publications)
          ) {
            throw new Error('The CV data is missing required sections.')
          }

          await writeFile(cvDataPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
          let pdfUpdated = false
          let pdfError = null
          try {
            await exportPdf(request)
            pdfUpdated = true
          } catch (error) {
            pdfError = error.message
          }
          sendJson(200, { ok: true, pdfUpdated, pdfError })
        } catch (error) {
          sendJson(400, { ok: false, error: error.message })
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), cvEditorApi()],
  base: siteBase,
})
