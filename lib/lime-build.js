
var   state = require('./lime-state')
      run = require('./lime-call')
      log = require('./utils/log')

module.exports = {

    run: function() {

        atom.notifications.addInfo('lime / running build...');
        log.info('Running build...', true, true);

        var lime = null;

            if(state.flags.build_only) {
                lime = run.build(null, this._logi, this._loge);
            } else if(state.flags.launch_only) {
                lime = run.launch(null, this._logi, this._loge);
            } else {
                lime = run.run(null, this._logi, this._loge);
            }

        lime.then(function(res) {
            if(res.code) {
                atom.notifications.addWarning('lime / build failed. check log.');
                log.error('build failed', false, true);
            } else {
                // atom.notifications.addSuccess('lime / build succeeded');
                log.success('Finished', false, true);
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
        log.msg(s, false, true);
    }, //

    _loge: function(s) {
        log.error(s, false, true);
    }, //

} //module.exports
