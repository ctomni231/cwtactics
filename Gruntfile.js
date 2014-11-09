'use strict';

// TODO:
//  - copy images, maps, music, mods
//  - set variables not via live/dev -> better is to set constants by deploy (server paths) or local
//  - add modes deploy, local and local_server
//  - minify json maps/mods during deployment
//  -

module.exports = function (grunt) {

  // configuration
  grunt.initConfig({

      // some constants
      config: {

        version: grunt.file.readJSON('package.json').version,
        name: grunt.file.readJSON('package.json').name,

        html: "./gameSrc/html/*",
        gamefiles: "./gameSrc/**/*.js",
        constants_template: "./gameConst/constants.js",
        constants: "./gameSrc/constants.js",
        deps: "./libJs/**/*.js",
        docs: "./docs",
        mainfile: "./gameSrc/main.js",
        destdepsfile: "<%= config.dest %>deps.js",
        destgamefile: "<%= config.dest %>main.js",
        dest: "./build/<%= config.version %>/",
        webdest: "../webPage/gamefiles/<%= config.version %>/"
      },

      uglify: {
        game: {
          options: {
            banner: '/*! <%= config.name %> game file, builded at <%= grunt.template.today("yyyy-mm-dd")%>, copyright by Alexander Radom, Crecen Carr 2009-2014 */\n'
          },
          src: "<%= config.destgamefile %>",
          dest: "<%= config.destgamefile %>"
        },
        deps: {
          options: {
            banner: '/*!<%= config.name %> dependencies file, builded at - <%= grunt.template.today("yyyy-mm-dd") %> */\n'
          },
          src: "<%= config.destdepsfile %>",
          dest: "<%= config.destdepsfile %>"
        }
      },

      // copying some of the static files like html and fonts
      copy: {
        html: {
          files: [
            {expand: true, flatten: true, src: ["<%= config.html %>"], dest: "<%= config.dest %>" }
          ]
        },
        // this task will deploy all game files (with version tag) in the web page folder
        deploy_game: {
          files: [
            {expand: true, flatten: true, src: ["<%= config.dest %>*.*"], dest: "<%= config.webdest %>" }
          ]
        },
        // this task will deploy all assets in the web page folder
        deploy_assets: {
          files: [
            {
              expand: true,
              flatten: true,
              src: ["<%= config.dest %>*.*"],
              dest: "<%= config.webdest %>"
            }
          ]
        }
      },

      concat: {
        options: {
          separator: ';',
          stripBanners: true
        },
        deps: {
          src: ["<%= config.deps %>"],
          dest: "<%= config.destdepsfile %>",
        },
      },

      todo: {
        options: {
          file: "<%= config.dest %>todos.md",
          githubBoxes: true,
          colophon: true,
          usePackage: true
        },
        src: ["<%= config.gamefiles %>"]
      },

      docco: {
        options: {
          dst: "<%= config.docs %>",
          layout: "parallel"
          //template:   null,
          //css:        null
        },
        docs: {
          files: [
            { expand: true, src: ["<%= config.gamefiles %>"]}
          ]
        }
      },

      jsdoc : {
        docs : {
            src: ["<%= config.gamefiles %>"],
            options: {
                destination: "<%= config.docs %>",
                template: "./node_modules/grunt-jsdoc/node_modules/ink-docstrap/template",
                configure: "./doc.config.json"
            }
        }
      },

      // here we have all of our constants that are different in every build mode
      replace: {
        dev: {
          src: ["<%= config.constants_template %>"],
          dest: ["<%= config.constants %>"],
          replacements: [
            {
              from: /exports.DEBUG\s*=\s*(null);/g ,
              to: "exports.DEBUG = true;"
            },
            {
              from: /exports.MOD_PATH\s*=\s*(null);/g ,
              to: "exports.MOD_PATH = \"http://localhost:8000/\";"
            },
            {
              from: /exports.DEFAULT_MOD_PATH\s*=\s*(null);/g ,
              to: "exports.DEFAULT_MOD_PATH = \"http://localhost:8000/modifications/cwt.json\";"
            }
          ]
        },
        devServer: {
          src: ["<%= config.constants_template %>"],
          dest: ["<%= config.constants %>"],
          replacements: [
            {
              from: /exports.DEBUG\s*=\s*(null);/g ,
              to: "exports.DEBUG = true;"
            },
            {
              from: /exports.MOD_PATH\s*=\s*(null);/g ,
              to: "exports.MOD_PATH = \"http://192.168.1.31:8000/\";"
            },
            {
              from: /exports.DEFAULT_MOD_PATH\s*=\s*(null);/g ,
              to: "exports.DEFAULT_MOD_PATH = \"http://192.168.1.31:8000/modifications/cwt.json\";"
            }
          ]
        },
        live: {
          src: ["<%= config.constants_template %>"],
          dest: ["<%= config.constants%>"],
          replacements: [
            {
              from: /exports.DEBUG\s*=\s*(null);/g ,
              to: "false"
            },
            {
              from: /exports.MOD_PATH\s*=\s*(null);/g ,
              to: "exports.MOD_PATH = \"http://ctomni231.github.io/cwtactics/\";"
            },
            {
              from: /exports.DEFAULT_MOD_PATH\s*=\s*(null);/g ,
              to: "exports.DEFAULT_MOD_PATH = \"http://ctomni231.github.io/cwtactics/modifications/cwt.json\";"
            }
          ]
        }
      },

      clean: {
        dest: ["<%= config.dest %>"],
        docs: ["<%= config.docs %>"],
        todo: ["<%= config.dest %>todos.md"]
      },

      browserify: {
        dev: {
          src: ["<%= config.mainfile %>"],
          dest: "<%= config.destgamefile %>",
          options: {
            bundleOptions: {
              debug: true
            }
          }
        },
        live: {
          src: ["<%= config.mainfile %>"],
          dest: "<%= config.destgamefile %>",
          options: {
            bundleOptions: {
              debug: false
            }
          }
        }
      }
    }
  );

  // loadGameConfig plugins
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-docco2');
  grunt.loadNpmTasks('grunt-todo');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jsdoc');

  // register all command line tasks

  // generates the documentation
  grunt.registerTask("docs", [
    "clean:docs", "jsdoc"
  ]);

  // creates a report of all TODO marks
  grunt.registerTask("report", [
    "clean:todo", "todo"
  ]);

  // builds a minified version of the game for live mode
  grunt.registerTask("live", [
    "clean:dest",
    "concat:deps", "uglify:deps",
    "replace:live", "browserify:live", "uglify:game",
    "copy:html"
  ]);

  // builds a development version with source maps etc.
  grunt.registerTask("dev", [
    "clean:dest",
    "concat:deps", "uglify:deps",
    "replace:dev", "browserify:dev",
    "copy:html"
  ]);

  // builds a development version with source maps etc.
  grunt.registerTask("devServer", [
    "clean:dest",
    "concat:deps", "uglify:deps",
    "replace:devServer", "browserify:dev",
    "copy:html"
  ]);

  // builds a live version and deploys it in the web-page folder (relative to the current folder ../webPage)
  grunt.registerTask("deployToPage", [
    "live",
    "copy:deploy_game",
    "copy:deploy_assets"
  ]);

  grunt.registerTask("default", ["dev"]);

};
