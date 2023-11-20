module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-bump');
  grunt.initConfig({
    bump: {
      options: {
        files: [
          'package.json',
          'services/split-ui/package.json',
          'services/api/package.json',
          'services/split-micro-users/package.json',
        ],
        updateConfigs: [],
        commit: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'upstream',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        metadata: '',
        regExp: false
      }
    },
  });
};
