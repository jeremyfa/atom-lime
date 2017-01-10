
var state = require('./lime-state');
var lime_run = require('./lime-call');
var lime_log = require('./utils/log');

module.exports = {

    run: function() {

        atom.notifications.addInfo('lime / running build...');
        lime_log.info('Running build...', true, true);

        var lime = null;

            if(state.flags.build_only) {
                lime = lime_run.build(null, this._logi, this._loge);
            } else if(state.flags.launch_only) {
                lime = lime_run.launch(null, this._logi, this._loge);
            } else {
                lime = lime_run.run(null, this._logi, this._loge);
            }

        lime.then(function(res) {
            if(res.code) {
                atom.notifications.addWarning('lime / build failed. check log.');
                lime_log.error('build failed', false, true);
            } else {
                // atom.notifications.addSuccess('lime / build succeeded');
                lime_log.success('Finished', false, true);
            }
        });

    }, //run


        //from haxe trigger,
        //passes some info we could use
        //but since lime is self contained
        //it will just defer
    onrunbuild: function(e) {
        if(!state.valid) {
            atom.notifications.addWarning('lime / no lime file active');
        } else {
            this.run();
        }
    },


    _logi: function(s) {
        lime_log.msg(s, false, true);
    }, //

    _loge: function(s) {
        lime_log.error(s, false, true);
    }, //

}; //module.exports
