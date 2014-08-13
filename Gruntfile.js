'use strict';

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
        destgamefile: "./build/<%= config.version %>/main.js",
        dest: "./build/<%= config.version %>/"
      },

      uglify: {
        options: {
          banner: '/*! <%= config.name %> game file, builded at <%= grunt.template.today("yyyy-mm-dd")%>, copyright by Alexander Radom, Crecen Carr 2009-2014 */\n'
        },
        build: {
          src: "<%= config.destgamefile %>",
          dest: "<%= config.destgamefile %>"
        }
      },

      // copying some of the static files like html and fonts
      copy: {
        html: {
          files: [
            {expand: true, flatten: true, src: ["<%= config.html %>"], dest: "<%= config.dest %>" }
          ]
        }
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

  // load plugins
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-docco2');
  grunt.loadNpmTasks('grunt-todo');
  grunt.loadNpmTasks('grunt-text-replace');

  // register all command line tasks
  grunt.registerTask("docs", ["clean:docs", "docco"]);
  grunt.registerTask("report", ["clean:todo", "todo"]);

  grunt.registerTask("live", ["docs", "clean:dest", "replace:live", "browserify:live", "uglify", "copy:html"]);
  grunt.registerTask("dev", ["clean:dest", "replace:dev", "browserify:dev", "copy:html"]);

  grunt.registerTask("default", ["report", "dev"]);

};
