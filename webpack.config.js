module.exports = {
	entry: './src/midieval.js',
	output: {
		filename: 'midieval.js',
		library: 'midieval',
		path: './dist'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				query: {
					presets: ['es2015', 'stage-0']
				}
			}
		]
	},
	resolve: {
		extensions: ['', '.js']
	}
}