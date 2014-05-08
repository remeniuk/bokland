bokland
=======

nvd3-based dashboard builder

Dashboard API: https://github.com/bokland/bokland/wiki/Dashboard-API

JSON Data Model: https://github.com/bokland/bokland/wiki/Data-Model

Model Diagram: https://www.draw.io/?#G0B-yVHC1bqVlVLWx5VWhqV1pSeW8

Mockups: https://github.com/bokland/bokland/wiki/Mockups


Installation
------------

    # install dependencies
    npm install
    bower install
    # vendors sym link
    mkdir dist
    cd dist
    ln -s bower_components vendors


Gulp tasks
----------

`gulp server` - run simple http server with root on the 'dist' folder: http://localhost:8888

`gulp test` - run source code tests

`gulp build` - build code

`gulp` - watch files and rebuild code when a file changes

Libs, missing in npm
---------

    npm install vinyl
    npm install dateformat
    npm install lodash.template
    npm install lodash._reinterpolate
    npm install minimist
    npm install through2
    npm install multipipe
    npm install through
    npm install ordered-read-streams
    npm install unique-stream
    npm install glob
    npm install minimatch
    npm install glob2base
    npm install clone-stats
    npm install gaze
    
