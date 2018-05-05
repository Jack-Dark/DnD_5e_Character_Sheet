module.exports = {
    options: {
        data: 'data.json',
        flatten: true,
        layout: 'src/hbs/layouts/template.hbs',
        partials: ['src/hbs/partials/**/*.hbs'],
        prettify: {
            indent: 4
        }
    },
    build: {
        files: {
            'build/': 'src/hbs/content/**/*.hbs'
        }
    }
};