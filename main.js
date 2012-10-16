/**
 * The MIT License (MIT)
 * Copyright (c) 2012 Dennis Kehrig
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/*jslint vars: true, plusplus: true, devel: true, regexp: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */



define(function (require, exports, module) {
    'use strict';

    // Configuration
    var shortcut            = "Ctrl-Shift-R";
    var commandId           = "kehrig.ReloadInBrowser.reload";
    var commandName         = "Reload in browser";
    var colors              = ["#cccccc", "#e6861c"];

    // Load dependent modules
    var Commands            = brackets.getModule("command/Commands");
    var CommandManager      = brackets.getModule("command/CommandManager");
    var Inspector           = brackets.getModule("LiveDevelopment/Inspector/Inspector");
    var KeyBindingManager   = brackets.getModule("command/KeyBindingManager");

    // State
    var $reloadButton;

    /**
     * Reloads the page in the browser via the LiveDevelopment inspector
     */
    function reloadInBrowser() {
        var saveAllCommand = CommandManager.get(Commands.FILE_SAVE_ALL);
        saveAllCommand.execute().done(function () {
            Inspector.Page.enable();
            Inspector.Page.reload();
        });
    }

    function addReloadButton() {
        // Insert the reload button in the toolbar to the left of the first a element (life preview button)
        $reloadButton = $("<a>")
            .text("↺")
            .attr("title", "Reload page in browser")
            .addClass("reloadInBrowser")
            .click(reloadInBrowser)
            .css({
                "margin-right":     "10px",
                "font-weight":      "bold",
                "color":            colors[0]
            })
            .hover(function () {
                $(this).css({ "color": colors[1], "text-decoration": "none" });
            }, function () {
                $(this).css({ "color": colors[0] });
            })
            .insertBefore("#main-toolbar .buttons a:first");
    }

    function removeReloadButton() {
        $reloadButton.remove();
    }

    function load() {
        // Register the command. This allows us to create a key binding to it
        if (!CommandManager.get(commandId)) {
            CommandManager.register(commandName, commandId, reloadInBrowser);
        }
        KeyBindingManager.addBinding(commandId, shortcut);

        addReloadButton();
    }
    
    function unload() {
        KeyBindingManager.removeBinding(shortcut);
        // Not possible
        //CommandManager.unregister(commandId);

        removeReloadButton();
    }

    exports.load = load;
    exports.unload = unload;

    load();
});