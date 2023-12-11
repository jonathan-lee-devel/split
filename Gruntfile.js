YAML = require('js-yaml');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-prompt');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    productionChart: grunt.file.readYAML('./deployment/values/production-values.yaml'),
    prompt: {
      patch: {
        options: {
          questions: [{
            config: 'gitmessage',
            type: 'input',
            message: 'Commit message for PATCH version bump:',
          }],
        },
      },
      minor: {
        options: {
          questions: [{
            config: 'gitmessage',
            type: 'input',
            message: 'Commit message for MINOR version bump:',
          }],
        },
      },
      major: {
        options: {
          questions: [{
            config: 'gitmessage',
            type: 'input',
            message: 'Commit message for MAJOR version bump:',
          }],
        },
      },
    },
    bump: {
      options: {
        files: [
          'lerna.json',
          'package.json',
          'packages/split-env/package.json',
          'packages/split-constants/package.json',
          'packages/split-auth/package.json',
          'packages/split-observability/package.json',
          'packages/split-service-config/package.json',
          'packages/split-http/package.json',
          'packages/split-mail/package.json',
          'services/split-micro-users/package.json',
          'services/split-micro-properties/package.json',
          'ui/split-ui/package.json',
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
    clean: {
      dist: {
        src: [
          'packages/split-env/dist',
          'packages/split-constants/dist',
          'packages/split-auth/dist',
          'packages/split-observability/dist',
          'packages/split-service-config/dist',
          'packages/split-http/dist',
          'packages/split-mail/dist',
          'services/split-micro-users/dist',
          'ui/split-ui/dist',
        ],
      },
    },
  });

  function getVersion() {
    const packageJson = grunt.file.readJSON('package.json');
    return packageJson['version'];
  }

  function bumpVersionPatch(version) {
    const versionSplit = version.split('.');
    const currentPatchVersion = versionSplit[2];
    const nextPatchVersion = String(Number(currentPatchVersion) + 1);
    return `${versionSplit[0]}.${versionSplit[1]}.${nextPatchVersion}`;
  }

  function bumpVersionMinor(version) {
    const versionSplit = version.split('.');
    const currentMinorVersion = versionSplit[1];
    const nextMinorVersion = String(Number(currentMinorVersion) + 1);
    return `${versionSplit[0]}.${nextMinorVersion}.${versionSplit[2]}`;
  }

  function bumpVersionMajor(version) {
    const versionSplit = version.split('.');
    const currentMajorVersion = versionSplit[0];
    const nextMajorVersion = String(Number(currentMajorVersion) + 1);
    return `${nextMajorVersion}.${versionSplit[1]}.${versionSplit[2]}`;
  }

  function updateChartValues(chartPath, version, isStage) {
    const chart = grunt.file.readYAML(chartPath);

    chart['ui']['image']['tag'] = (isStage) ? `stage-${version}`: `${version}`;
    chart['microUsers']['image']['tag'] = `${version}`;
    chart['microProperties']['image']['tag'] = `${version}`;

    grunt.file.write(chartPath, YAML.dump(chart));
  }

  grunt.registerTask('update-staging-values:patch', 'Updates staging image version', function() {
    updateChartValues('./deployment/values/staging-values.yaml', bumpVersionPatch(getVersion()), true);
  });

  grunt.registerTask('update-staging-values:minor', 'Updates staging image version', function() {
    updateChartValues('./deployment/values/staging-values.yaml', bumpVersionMinor(getVersion()), true);
  });

  grunt.registerTask('update-staging-values:major', 'Updates staging image version', function() {
    updateChartValues('./deployment/values/staging-values.yaml', bumpVersionMajor(getVersion()), true);
  });

  grunt.registerTask('update-production-values:patch', 'Updates staging image version', function() {
    updateChartValues('./deployment/values/production-values.yaml', bumpVersionPatch(getVersion()), false);
  });

  grunt.registerTask('update-production-values:minor', 'Updates staging image version', function() {
    updateChartValues('./deployment/values/production-values.yaml', bumpVersionMinor(getVersion()), false);
  });

  grunt.registerTask('update-production-values:major', 'Updates staging image version', function() {
    updateChartValues('./deployment/values/production-values.yaml', bumpVersionMajor(getVersion()), false);
  });

  grunt.registerTask('bump-patch', ['prompt:patch', 'update-staging-values:patch', 'update-production-values:patch', 'bump:patch']);
  grunt.registerTask('bump-minor', ['prompt:minor', 'update-staging-values:minor', 'update-production-values:minor', 'bump:minor']);
  grunt.registerTask('bump-major', ['prompt:major', 'update-staging-values:major', 'update-production-values:major', 'bump:major']);
};
