module.exports = function(RED) {
    let Nuimo = require('nuimojs'),
    nuimo = new Nuimo();

    function NuimoNode(config) {
        RED.nodes.createNode(this, config);

        var node = this;
        var localName = config.localName;
        //if (localName === "") {
        //    node.error("Please specify a local name");
        //}

        this.on('input', function(msg) {
            node.warn(msg);
        });

        nuimo.on("discover", (device) => {

            node.warn(`Discovered Nuimo (${device.uuid})`);

            device.on("connect", () => {
                node.warn("Nuimo connected");
            });

            device.on("press", () => {
                device.setLEDMatrix([
                    0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 1, 0, 0, 1, 1, 0,
                    0, 0, 0, 1, 0, 1, 0, 0, 0,
                    0, 0, 0, 1, 0, 0, 1, 0, 0,
                    0, 1, 0, 1, 0, 0, 0, 1, 0,
                    0, 0, 1, 0, 0, 1, 1, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0, 0, 0, 0
                ], 255, 2000);
            });
                 
            device.on("rotate", (amount) => {
                //node.warn(`Rotated by ${amount}`);
                      var msg = { topic:"rotate", payload:amount }
                this.send(msg);
            });

            device.connect();

        });

        nuimo.scan();


    }

    RED.nodes.registerType("nuimo", NuimoNode);
}
