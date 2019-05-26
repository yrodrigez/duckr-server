import configureServer from './configureServer'
import { connectDB } from './dal'
import { spawn } from 'child_process'


const runWebpackWatch = () => {
	const watcher = spawn(
		'webpack',
		['--watch', '--mode=development'],
	)
	watcher.stdout.on('data', data => console.log('webpack watch ', data))
	watcher.stderr.on('data', data => console.error('webpack watch ', data))
	watcher.on('close', code => console.log('webpack watch exited with code', code))
}

connectDB().then(async () => {
	const {server, apolloServer, PORT} = configureServer()
	server.listen(PORT, () => {
		console.log(`App listening to ${PORT}....`)
		console.log(`🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`)
		console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`)
		process.env.NODE_ENV === 'development' && runWebpackWatch()
		console.log('Press Ctrl+C to quit.')
	})
})
