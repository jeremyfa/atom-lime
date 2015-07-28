
module.exports = {
    lime_default_target:{
        title: 'Default build target',
        description: 'Configure the default build target. Blank means the current user platform.',
        type: 'string',
        default: ''
    },

    lime_lint_target: {
        title: 'Target to use for linting',
        description: 'Linter errors are retrieved from automatic lime builds on a specific target. Prefer a target that is fast to build (flash, html5, neko).',
        type: 'string',
        default: 'flash'
    },

    debug_logging: {
        title:'Debug Logging',
        description: 'Enable to get more in depth logging for debugging problems with the package',
        type: 'boolean',
        default:'false'
    },

    build_selectors: {
        title:'Haxe Build: additional allowed file scopes',
        description: 'When running the build command, these file scopes will also be allowed to trigger a build.',
        type: 'string',
        default:'source.lime, source.json'
    },

}
