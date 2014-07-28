define(
    function (require) {
        var main = require('../src/blend');
        var methods = [
            "version",
            "inRuntime",
            "config",
            "getConfig",
            "getControl",
            "register",
            "create"
        ]
        var version = "alpha";
        var inRuntime = false;


        it('模块存在', function () {
            expect(main).toBeDefined();
        });



        describe('方法名存在', function () {
            for (var i = 0; i < methods.length; i++) {
                (function (i) {
                    it(methods[i], function () {
                        expect(main[methods[i]]).toBeDefined();
                    });
                }(i));
            }
        });

        describe('基础方法', function () {

            it("version", function () {
                expect(main.version).toBe(version);
            });
            it("inRuntime", function () {
                expect(main.inRuntime()).toBe(inRuntime);
            });
            it("config", function () {
                expect(main.getConfig("DOMPrefix")).toBeDefined();
                expect(main.getConfig("classPrefix")).toBeDefined();

                main.config({"DOMPrefix": "test"});
                expect(main.getConfig("DOMPrefix")).toBe("test");

                main.config({"classPrefix": { "ui" : "testui"}});
                expect(main.getConfig("classPrefix").ui).toBe("testui");

                main.config({"classPrefix": { "skin" : "testskin"}});
                expect(main.getConfig("classPrefix").skin).toBe("testskin");

                main.config({"classPrefix": { "state" : "teststate"}});
                expect(main.getConfig("classPrefix").state).toBe("teststate");
            });

        });

    }
);