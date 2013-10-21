# HOW TO BUILD THE CLIENT

You simply need to run `buildAll.js` in nodeJs. The build script automatically contains a set of normal and minified
files plus the cache manifest.

Every module of the program must be smaller or equal 25 kilobytes in size. If the size of a module
is greater than 25 kilobytes then the module is maybe not cache able by every supported device
( *example: iPhone 4* ).

**Build command pattern:**
    
    cd PATH/TO/YOUR/CWT/SOURCE/DIRECTORY

    // builds normal and minified client and the docs
    node jsBin/buildAll.js
    
    // creates only normal client and the docs 
    node jsBin/buildAll.js

### HTML 

The html stack will be builded by order. The files in the html folder are numbered. It is very important that the html
stack end will be the last file in the directory. The calculated css and js files will be injected before the end of 
the html file.

# HOW TO BUILD THE STYLE.CSS

You need to use the less library to convert style.less to style.css. You may 
convert it in the browser or via the less homepage. Furthermore ( this is 
the prefered way ) you can use Adobe Brackets with the LESS plugin which 
converts the style.less automatically to style.css if you edit it.
