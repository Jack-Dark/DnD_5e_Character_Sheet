module.exports = {
    options: {
        sourceMap:  false,
        compress:   false,
        strictMath: true,
        paths:      [
            'node_modules/@volusion/v1-style-editor-less/'
        ]
    },
    less: {
        files: {
            'build/css/template.css': ['src/less/template.less']
        }
    }
}