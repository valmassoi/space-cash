const cluster = require('cluster')

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`)

  // Count the machine's CPUs
  let cpuCount = require('os').cpus().length

  // Create a worker for each CPU
  for (let i = 0; i < cpuCount; i++) {
    cluster.fork()
  }

  // Listen for dying workers
  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`)
    cluster.fork()
  })
} else {
  console.log(`Worker ${process.pid} started`)
  require('./server')
}
