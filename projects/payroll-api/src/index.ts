import { app } from './app.js'
import { prisma } from './db.js'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Payroll API running on http://localhost:${PORT}`)
})

process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
