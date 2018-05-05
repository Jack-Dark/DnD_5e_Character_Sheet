module.exports = {
	options: {
		map: true, // inline sourcemaps
		processors: [
			// require('pixrem')(), // add fallbacks for rem units
			require('autoprefixer')({browsers: '> 1%, last 5 versions, Firefox > 20, Chrome > 9, Opera >= 12.1, ie >= 9, safari > 4'}), // add vendor prefixes
			// require('cssnano')() // minify the result
		]
	},
	css: {
		src: 'build/css/**/*.css'
	}
}