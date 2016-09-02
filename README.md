# McME – Minecraft Model Editor for Blockbuster's Actors

McME is a simple web based application which allow creating and editing JSON 
models for Blockbuster mod (1.3+). This web app is based on my 
[prototype](https://gist.github.com/mchorse/b567a0fbd0f9b8f80ed480c36cfea22b). 

## Building the App

To build this application you need:

* Node JS and NPM
* `bower`, `minify` and `browserify` NPM packages (they should be installed globally)

Then you navigate to the root of the application, and run:

```sh
make build
```

File `js/app.js` is going to be built, and then you can open `index.html` file with 
your favorite browser to run the app. 

Chrome users will get a security error if `index.html` was run from `file://`. 
Consider using a web server (like `node-static`) or another browser.

<!-- 
    It would be cool if Mojang would integrate my implementation of JSON entity 
    models into Minecraft *giggles* 

    Lots of people may start hating me :D
-->