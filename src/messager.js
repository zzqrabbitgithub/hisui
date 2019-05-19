(function ($) {
    function show(el, type, _279, _27a) {
        var win = $(el).window("window");
        if (!win) {
            return;
        }
        switch (type) {
            case null:
                win.show();
                break;
            case "slide":
                win.slideDown(_279);
                break;
            case "fade":
                win.fadeIn(_279);
                break;
            case "show":
                win.show(_279);
                break;
        }
        var _27b = null;
        if (_27a > 0) {
            _27b = setTimeout(function () {
                hide(el, type, _279);
            }, _27a);
        }
        win.hover(function () {
            if (_27b) {
                clearTimeout(_27b);
            }
        }, function () {
            if (_27a > 0) {
                _27b = setTimeout(function () {
                    hide(el, type, _279);
                }, _27a);
            }
        });
    };
    function hide(el, type, _27c) {
        if (el.locked == true) {
            return;
        }
        el.locked = true;
        var win = $(el).window("window");
        if (!win) {
            return;
        }
        switch (type) {
            case null:
                win.hide();
                break;
            case "slide":
                win.slideUp(_27c);
                break;
            case "fade":
                win.fadeOut(_27c);
                break;
            case "show":
                win.hide(_27c);
                break;
        }
        setTimeout(function () {
            $(el).window("destroy");
        }, _27c);
    };
    function _27d(_27e) {
        var opts = $.extend({}, $.fn.window.defaults, {
            collapsible: false, minimizable: false, maximizable: false, shadow: false, draggable: false, resizable: false, closed: true, style: { left: "", top: "", right: 0, zIndex: $.fn.window.defaults.zIndex++, bottom: -document.body.scrollTop - document.documentElement.scrollTop }, onBeforeOpen: function () {
                show(this, opts.showType, opts.showSpeed, opts.timeout);
                return false;
            }, onBeforeClose: function () {
                hide(this, opts.showType, opts.showSpeed);
                return false;
            }
        }, { title: "", width: 250, height: 100, showType: "slide", showSpeed: 600, msg: "", timeout: 4000 }, _27e);
        opts.style.zIndex = $.fn.window.defaults.zIndex++;
        var win = $("<div class=\"messager-body\"></div>").html(opts.msg).appendTo("body");
        win.window(opts);
        win.window("window").css(opts.style);
        win.window("open");
        return win;
    };
    function _27f(_280, _281, _282) {
        var win = $("<div class=\"messager-body\"></div>").appendTo("body");
        win.append(_281);
        if (_282) {
            var tb = $("<div class=\"messager-button\"></div>").appendTo(win);
            for (var _283 in _282) {
                $("<a></a>").attr("href", "javascript:void(0)").text(_283).css("margin-left", 10).bind("click", eval(_282[_283])).appendTo(tb).linkbutton();
            }
            //add space and esc key event handler add by wanghc  2018-10-09
            win.on('keydown',function(e){
                if (tb.children().length>1){ //多个按钮可用 <- 与 -> 左右按钮切换
                    if (e.which==37){ //left
                        e.stopPropagation();
                        tb.children().removeClass('active').eq(0).addClass('active');
                    }
                    if (e.which==39){ //right
                        tb.children().removeClass('active').eq(1).addClass('active');
                    }
                }
                if(e.which==32 || e.which==13){
                    e.stopPropagation();
                    if (tb.children(".active").length>0){
                        tb.children(".active").trigger('click');
                    }else{
                        _282[$.messager.defaults.ok]();
                    }
                    return false;
                }
                if(_282[$.messager.defaults.cancel]){ 
                    if(e.which==27){ //Esc
                        e.stopPropagation();
                        _282[$.messager.defaults.cancel]();
                        return false;
                    }
                }
            });
            //end 2018-10-09
        }
        win.window({
            isTopZindex:true, //wanghc
            closable:false, //neer---不显示关闭按钮--事件监听问题
            title: _280, noheader: (_280 ? false : true), width: 300, height: "auto", modal: true, collapsible: false, minimizable: false, maximizable: false, resizable: false, onClose: function () {
                setTimeout(function () {
                    win.window("destroy");
                }, 100);
            }
        });
        win.window("window").addClass("messager-window");
        win.children("div.messager-button").children("a:first").focus();
        return win;
    };
    $.messager = {
        show: function (_284) {
            return _27d(_284);
        }, alert: function (_285, msg, icon, fn) {
            /* 对象文字 add margin-left:42px;*/
            var _286 = "<div style=\"margin-left:42px;\">" + msg + "</div>";
            switch (icon) {
                case "error":
                    _286 = "<div class=\"messager-icon messager-error\"></div>" + _286;
                    break;
                case "info":
                    _286 = "<div class=\"messager-icon messager-info\"></div>" + _286;
                    break;
                case "question":
                    _286 = "<div class=\"messager-icon messager-question\"></div>" + _286;
                    break;
                case "warning":
                    _286 = "<div class=\"messager-icon messager-warning\"></div>" + _286;
                    break;
                case "success":
                    _286 = "<div class=\"messager-icon messager-success\"></div>" + _286;
                    break;
            }
            _286 += "<div style=\"clear:both;\"/>";
            var _287 = {};
            _287[$.messager.defaults.ok] = function () {
                win.window("close");
                if (fn) {
                    fn();
                    return false;
                }
            };
            var win = _27f(_285, _286, _287);
            return win;
        }, confirm: function (_288, msg, fn) {
            var _289 = "<div class=\"messager-icon messager-question\"></div>" + "<div style=\"margin-left:42px;\">" + msg + "</div>" + "<div style=\"clear:both;\"/>";
            var _28a = {};
            _28a[$.messager.defaults.ok] = function () {
                win.window("close");
                if (fn) {
                    fn(true);
                    return false;
                }
            };
            _28a[$.messager.defaults.cancel] = function () {
                win.window("close");
                if (fn) {
                    fn(false);
                    return false;
                }
            };
            var win = _27f(_288, _289, _28a);
            return win;
        }, prompt: function (_28b, msg, fn) {
            var _28c = "<div class=\"messager-icon messager-question\"></div>" + "<div style=\"margin-left:42px;\">" + msg + "</div>" + "<br/>" + "<div style=\"clear:both;\"/>" + "<div><input class=\"messager-input\" type=\"text\"/></div>";
            var _28d = {};
            _28d[$.messager.defaults.ok] = function () {
                win.window("close");
                if (fn) {
                    fn($(".messager-input", win).val());
                    return false;
                }
            };
            _28d[$.messager.defaults.cancel] = function () {
                win.window("close");
                if (fn) {
                    fn();
                    return false;
                }
            };
            var win = _27f(_28b, _28c, _28d);
            win.children("input.messager-input").focus();
            return win;
        }, progress: function (_28e) {
            var _28f = {
                bar: function () {
                    return $("body>div.messager-window").find("div.messager-p-bar");
                }, close: function () {
                    var win = $("body>div.messager-window>div.messager-body:has(div.messager-progress)");
                    if (win.length) {
                        win.window("close");
                    }
                }
            };
            if (typeof _28e == "string") {
                var _290 = _28f[_28e];
                return _290();
            }
            var opts = $.extend({ title: "", msg: "", text: undefined, interval: 300 }, _28e || {});
            var _291 = "<div class=\"messager-progress\"><div class=\"messager-p-msg\"></div><div class=\"messager-p-bar\"></div></div>";
            var win = _27f(opts.title, _291, null);
            win.find("div.messager-p-msg").html(opts.msg);
            var bar = win.find("div.messager-p-bar");
            bar.progressbar({ text: opts.text });
            win.window({
                closable: false, onClose: function () {
                    if (this.timer) {
                        clearInterval(this.timer);
                    }
                    $(this).window("destroy");
                }
            });
            if (opts.interval) {
                win[0].timer = setInterval(function () {
                    var v = bar.progressbar("getValue");
                    v += 10;
                    if (v > 100) {
                        v = 0;
                    }
                    bar.progressbar("setValue", v);
                }, opts.interval);
            }
            return win;
        },popover: function(opt){
            //default top center;
            // top:document.body.scrollTop+document.documentElement.scrollTop+10  modify by wanghc on 2018-10-18
            var defopt = {style:{top:'',left:''},
               msg:'',type:'error',timeout:3000,showSpeed:'fast',showType:'slide'};
            var o = $.extend({},defopt,opt);
            var html = '<div class="messager-popover '+o.type+'" style="display:none;">\
            <span class="messager-popover-icon '+o.type+'"/><span class="content">'+o.msg+'</span>\
            <span class="close"></span>\
            </div>';
            var t = $(html).appendTo("body");
            if (o.style.left==''){
                o.style.left = document.body.clientWidth/2-(t.width()/2)
            }
            if (o.style.top==''){
                o.style.top = document.body.clientHeight/2-(t.height()/2)
            }
            t.css(o.style);
            switch (o.showType) {
                case null:
                    t.show();
                    break;
                case "slide":
                    t.slideDown(o.showSpeed);
                    break;
                case "fade":
                    t.fadeIn(o.showSpeed);
                    break;
                case "show":
                    t.show(o.showSpeed);
                    break;
            }
            t.find('.close').click(function(){
                t.remove();
            });
            if (o.timeout>0){
                var timeoutHandle =  setTimeout(function(){
                    switch (o.showType) {
                        case null:
                            t.hide();
                            break;
                        case "slide":
                            t.slideUp(o.showSpeed);
                            break;
                        case "fade":
                            t.fadeOut(o.showSpeed);
                            break;
                        case "show":
                            t.hide(o.showSpeed);
                            break;
                    }
                    setTimeout(function(){t.remove()},o.timeout);
                },o.timeout);
            }
        }
    };
    $.messager.defaults = { ok: "Ok", cancel: "Cancel" };
})(jQuery);