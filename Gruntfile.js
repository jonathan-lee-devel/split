module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-bump');
  grunt.initConfig({
    bump: {
      options: {
        files: [
          'lerna.json',
          'package.json',
          'services/split-ui/package.json',
          'services/api/package.json',
          'services/split-micro-users/package.json',
        ],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        metadata: '',
        regExp: false
      }
    },
  });
};
