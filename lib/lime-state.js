var lime_log = require('./utils/log');

module.exports = {

    project_path: null,
    target: null,
    system: null,
    is_consumer:false,

    flags: {
        debug: false,
        verbose: false,
        build_only: false,
        launch_only: false
    },

    init:function(state) {

        this.system = this.get_system();
        this.set(state);

        lime_log.debug('state:' + JSON.stringify(this));

    },

    set_project:function(path) {
        this.project_path = path;
        if(this.project_path) this.valid = true;
        lime_log.debug('set: lime file / ' + this.project_path);
    },

    set:function(state) {

        this.set_project(state.project_path);
        this.target = state.target || atom.config.get('lime.lime_default_target');
        this.is_consumer = state.is_consumer;

        if(state.flags) {
            this.flags.debug = state.flags.debug;
            this.flags.verbose = state.flags.verbose;
            this.flags.build_only = state.flags.build_only;
            this.flags.launch_only = state.flags.launch_only;
            this.flags.use_simulator = state.flags.use_simulator;
        }

    }, //set

    unset:function() {
        this.valid = false;
        this.project_path = null;
        this.target = this.system;
        this.is_consumer = false;
            //not sure these should be unset
        // this.flags.debug = false;
        // this.flags.verbose = false;
        // this.flags.build_only = false;
        // this.flags.launch_only = false;
    },

    as_args: function(plus_args) {

        var args = [];

            args.push(this.project_path);

            args.push(this.target);

            if(this.flags.debug) {
                args.push('-debug');
            }

            if(this.flags.verbose) {
                args.push('-verbose');
            }

            if(this.flags.use_simulator && ['ios', 'blackberry', 'tizen', 'webos'].indexOf(this.target) != -1) {
                args.push('-simulator');
            }

            if(this.flags.use_simulator && this.target == 'android') {
                args.push('-emulator');
            }

            if(plus_args) {
                args = args.concat(plus_args);
            }

        return args;
    },

    get_system:function() {
        var s = process.platform;
        switch(s) {
            case 'darwin': return 'mac';
            case 'linux': return 'linux';
            case 'win32': return 'windows';
        }
        return 'unknown';
    },

    get_state:function() {
        return {
             project_path: this.project_path,
            target: this.target,
            system: this.system,
            is_consumer:this.is_consumer,
            flags: this.flags
        };
    }


}; //module.exports
