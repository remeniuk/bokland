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

`gulp server` - run simple http server with root on the 'dist' folder

`gulp test` - run source code tests (TODO)

`gulp build` - build code

`gulp` - watch files and rebuild code when a file changes
