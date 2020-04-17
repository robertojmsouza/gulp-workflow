const   gulp        = require( 'gulp' ),
        browsersync = require( 'browser-sync' ),
        del         = require( 'del' ),
        concat      = require( 'gulp-concat' ),
        cssnano     = require( 'gulp-cssnano' ),
        filesize    = require( 'gulp-filesize' ),
        htmlmin     = require( 'gulp-htmlmin' ),
        imagemin    = require( 'gulp-imagemin' ),
        jshint      = require( 'gulp-jshint' ),
        stylus      = require( 'gulp-stylus' ),
        svgmin      = require( 'gulp-svgmin'),
        uglify      = require( 'gulp-uglify' );

const server = browsersync.create();

function reload(done) {
    server.reload();
    done();
}
  
function serve(done) {
    server.init({
        server: {
            baseDir: './assets/dist'
        },
        files: [
            paths.src.css,
            paths.src.html,
            paths.src.img,
            paths.src.js,
            paths.src.svg,
            paths.src.video
        ]
    });
    done();
}

var paths = {
    src: {
        css:    'assets/src/styl/**/*.styl',
        fonts:  'assets/src/fonts/**/*',
        html:   'assets/src/html/*.html',
        img:    'assets/src/img/**/*',
        js:     'assets/src/js/**/*.js',
        styl:   'assets/src/styl/style.styl',
        svg:    'assets/src/svg/**/*',
        video:  'assets/src/video/*',
        vendorcss: [
                'node_modules/bootstrap/dist/css/bootstrap.min.css',
                'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
                'node_modules/slick-carousel/slick/slick.css',
                'node_modules/slick-carousel/slick/slick-theme.css'
        ],
        vendorjs: [
                'node_modules/jquery/dist/jquery.min.js',
                'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
                'node_modules/@fortawesome/fontawesome-free/js/all.min.js',
                'node_modules/slick-carousel/slick/slick.min.js',
                'node_modules/instafeed.js/instafeed.min.js'
        ]
    },
    dist: {
        css:    'assets/dist/css',
        dist:   'assets/dist/**/*',
        fonts:  'assets/dist/fonts',
        html:   'assets/dist',
        img:    'assets/dist/img',
        js:     'assets/dist/js',
        video:  'assets/dist/video',
        svg:    'assets/dist/svg',
    }
};

function clean() {
    return del(paths.dist.dist);
};

function css() {
    return gulp.src(paths.src.styl)
        .pipe(stylus())
        .pipe(cssnano())
        .pipe(concat('main.css'))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(browsersync.stream())
        .pipe(filesize());
};

function fonts() {
    return (
        gulp.src('node_modules/@fortawesome/fontawesome-free/webfonts/*').pipe(gulp.dest('assets/dist/webfonts/')),
        gulp.src('node_modules/slick-carousel/slick/fonts/*').pipe(gulp.dest('assets/dist/css/fonts/')),
        gulp.src('node_modules/slick-carousel/slick/ajax-loader.gif').pipe(gulp.dest('assets/dist/css/')),
        gulp.src(paths.src.fonts).pipe(gulp.dest(paths.dist.fonts))
    );
};

function html() {
    return gulp.src(paths.src.html)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(paths.dist.html))
        .pipe(browsersync.stream())
        .pipe(filesize());
};

function img() {
    return gulp.src(paths.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist.img))
        .pipe(browsersync.stream())
        .pipe(filesize());
};

function js() {
    return gulp.src(paths.src.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js' ))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.js))
        .pipe(browsersync.stream())
        .pipe(filesize());
};

function svg() {
    return gulp.src(paths.src.svg)
        .pipe(svgmin())
        .pipe(gulp.dest(paths.dist.svg))
        .pipe(browsersync.stream())
        .pipe(filesize());
};

function video() {
    return gulp.src(paths.src.video)
        .pipe(gulp.dest(paths.dist.video))
        .pipe(browsersync.stream())
        .pipe(filesize());
};

function vendorscss() {
    return gulp.src(paths.src.vendorcss)
        .pipe(concat('vendors.css'))
        .pipe(cssnano())
        .pipe(gulp.dest(paths.dist.css))
        .pipe(filesize());
};

function vendorsjs() {
    return gulp.src(paths.src.vendorjs)
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(browsersync.stream())
        .pipe(filesize());
};

const watch = () =>  {
    gulp.watch(paths.src.css,   gulp.series(css, reload));
    gulp.watch(paths.src.html,  gulp.series(html, reload));
    gulp.watch(paths.src.img,   gulp.series(img, reload));
    gulp.watch(paths.src.js,    gulp.series(js, reload));
    gulp.watch(paths.src.svg,   gulp.series(svg, reload));
    gulp.watch(paths.src.video, gulp.series(video, reload));

};

const build = gulp.series(clean, css, fonts, html, img, js, svg, video, vendorscss, vendorsjs, serve, watch);

gulp.task('default', build);