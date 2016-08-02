module.exports = {
	entry: './src/midieval.js',
	output: {
		filename: 'index.js',
		library: 'midieval'
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