module.exports = {
	options: {
		livereload: true
    },
    hbs: {
        files: [
            'src/hbs/**/*.hbs'
        ],
        tasks: [
            'assemble:build'
        ]
    },
    less: {
        files: [
            'src/less/**/*.less'
        ],
        tasks: [
            'less'
        ]
    },
    js: {
        files: 'src/js/**/*.js',
        tasks: [
            'concat:js'
        ]
    }
}