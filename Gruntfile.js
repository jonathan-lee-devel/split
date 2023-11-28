module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-prompt');

  grunt.initConfig({
    prompt: {
      commit: {
        options: [{
          config: 'gitmessage',
          type: 'input',
          message: 'Commit Message',
        }],
      },
    },
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
        commitMessage: 'Release v%VERSION% <%=grunt.config("gitmessage")%>',
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
        regExp: false,
      },
    },
  });

  grunt.registerTask('bumpmsg', ['prompt:commit', 'bump']);
};
