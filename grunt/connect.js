module.exports = {
    options: {
        port:       9000,
        livereload: 35729,
        hostname:   '0.0.0.0'
    },
    livereload: {
        options: {
            open: {
                target: 'http://localhost:9000/'
            },
            base: [
                'build'
            ]
        }
    }
}