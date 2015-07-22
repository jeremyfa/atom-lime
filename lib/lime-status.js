
        //dep code
var   views = require('atom-space-pen-views')
    , SelectListView = views.SelectListView
        //lib code
    , extend = require('./utils/extend')
    , state = require('./lime-state')


function LimeStatus(_lime) {

    LimeStatus.__super__.constructor.apply(this, arguments);

    this.lime = _lime;
    this.status_items = [
        { tag:'lime',
            text:'lime file',
            desc:'none set'
        },
        { tag:'target',
            text:'lime target',
            desc:state.target },
        { tag:'debug',
            text:'Toggle debug build',
            desc:'currently: '+ state.flags.debug
        },
        { tag:'verbose',
            text:'Toggle verbose build',
            desc:'currently: '+ state.flags.verbose
        },
        { tag:'build-only',
            text:'Toggle build only',
            desc:'currently: '+ state.flags.build_only
        },
        { tag:'launch-only',
            text:'Toggle launch only',
            desc:'currently: '+ state.flags.launch_only
        },
        { tag:'use-simulator',
            text:'Toggle use simulator',
            desc:'currently: '+ state.flags.use_simulator
        }
    ];


    this.all_targets = {
        "mac": { target:'mac', text:'Mac', desc:'desktop, native mac app' },
        "linux": { target:'linux', text:'Linux', desc:'desktop, native linux app' },
        "windows": { target:'windows', text:'Windows', desc:'desktop, native windows app' },
        "neko": { target:'neko', text:'Neko', desc:'desktop, neko app' },
        "android": { target:'android', text:'Android', desc:'mobile, native android app' },
        "ios": { target:'ios', text:'iOS', desc:'mobile, native ios project' },
        "html5": { target:'html5', text:'HTML5', desc:'web, html5 based app' },
        "flash": { target:'flash', text:'Flash', desc:'flash app' },
        "blackberry": { target:'blackberry', text:'BlackBerry', desc:'mobile, blackberry app' },
        "tizen": { target:'tizen', text:'Tizen', desc:'tizen app' },
        "emscripten": { target:'emscripten', text:'Emscripten', desc:'emscripten app' },
        "webos": { target:'webos', text:'WebOS', desc:'webos app' }
    }

    this.unavailable_targets = {
        'windows':'mac, ios, linux',
        'linux':'mac, ios, windows',
        'mac':'windows, linux'
    }

    this.available_targets = {
        'windows': ['windows','html5','android', 'flash', 'neko', 'blackberry', 'tizen', 'emscripten', 'webos'],
        'mac': ['mac','html5','android','ios', 'flash', 'neko', 'blackberry', 'tizen', 'emscripten', 'webos'],
        'linux': ['linux','html5','android','ios', 'flash', 'neko', 'blackberry', 'tizen', 'emscripten', 'webos'],
    }

    this.targets = [
        { target:'unavailable', text:'unavailable from ' + state.system, desc:this.unavailable_targets[state.system] }
    ];

    var list = this.available_targets[state.system];
    for(var i = 0; i < list.length; ++i) {
        var t = list[i];
        this.targets.push( this.all_targets[t] );
    }

    this.menu_map = {};
    this.target_map = {};
    for(var i = 0; i < this.status_items.length; ++i) {
        this.menu_map[this.status_items[i].tag] = i;
    }

    for(var i = 0; i < this.targets.length; ++i) {
        this.target_map[this.targets[i].text.toLowerCase()] = i;
    }

}


extend(LimeStatus, SelectListView);


LimeStatus.prototype.update_flag = function(tag, state) {
    var index = this.menu_map[tag];
    var flag = this.status_items[index];
    flag.desc = 'currently: ' + state;
}

LimeStatus.prototype.update_lime_file = function(filename) {
    var index = this.menu_map['lime'];
    var item = this.status_items[index];
    item.desc = filename;
}

LimeStatus.prototype.update_target = function(targetname) {
    var index = this.menu_map['target'];
    var item = this.status_items[index];
    item.desc = targetname;
}

LimeStatus.prototype.show = function(show_targets) {

    this.panel = atom.workspace.addModalPanel({item: this});
    this.panel.show();
    this.storeFocusedElement();

    if(!state.valid) {
        atom.notifications.addWarning('lime / no lime file active');
    } else {
        if(show_targets) {
            this.showing_targets = true;
            this.setItems(this.targets);
        } else {
            this.showing_targets = false;
            this.setItems(this.status_items);
        }
    }


    this.focusFilterEditor();

}

LimeStatus.prototype.cancelled = function() {
    this.hide();
}

LimeStatus.prototype.hide = function() {
    this.panel.hide();
}

LimeStatus.prototype.viewForItem = function(item) {

     var res = '<li class="two-lines">';
         res += '<div class="primary-line">'+item.text+'</div>';
         res += '<div class="secondary-line">'+item.desc+'</div>';
         res += '</li>';

     return res;
}

LimeStatus.prototype.confirmed = function(item) {

    this.cancel();

    if(this.showing_targets) {

        if(item.target != 'unavailable') {
            this.lime.set_target( item.target );
        }

    } else {

        switch(item.tag) {
            case 'lime':
                atom.open({pathsToOpen:[ item.desc ]});
            break;
            case 'target':
                this.show(true);
            break;
            case 'debug':
                state.flags.debug = !state.flags.debug;
                this.update_flag(item.tag, state.flags.debug);
            break;
            case 'verbose':
                state.flags.verbose = !state.flags.verbose;
                this.update_flag(item.tag, state.flags.verbose);
            break;
            case 'build-only':
                state.flags.build_only = !state.flags.build_only;
                if(state.flags.build_only) state.flags.launch_only = false;
                this.update_flag(item.tag, state.flags.build_only);
            break;
            case 'launch-only':
                state.flags.launch_only = !state.flags.launch_only;
                if(state.flags.launch_only) state.flags.build_only = false;
                this.update_flag(item.tag, state.flags.launch_only);
            break;
            case 'use-simulator':
                state.flags.use_simulator = !state.flags.use_simulator;
                this.update_flag(item.tag, state.flags.use_simulator);
            break;
        }
    }

}


module.exports = LimeStatus;
