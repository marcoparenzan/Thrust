export function setup(pageProxy, canvasId, base64String) {
    window.gridEditorLib = window.gridEditorLib || {};
    var that = window.gridEditorLib["11"] || {};
    that.pageProxy = pageProxy;
    that.canvas = document.getElementById(canvasId);
    that.tileType = 0; // set from parent
    that.gridColor = "red";

    that.canvas.addEventListener("mousedown", async (e) => {
        let rect = that.canvas.getBoundingClientRect();
        let xx = Math.floor((e.clientX - rect.left) / that.zoom);
        let yy = Math.floor((e.clientY - rect.top) / that.zoom);
        let tile = { "type": that.tileType };

        this.drawTile(xx, yy, tile);
        await that.pageProxy.invokeMethodAsync('SetXYAsync', xx, yy, tile.type);
    });

    var img = new Image();
    img.src = "data:image/png;base64," + base64String;
    that.tileset = img;

    window.gridEditorLib["11"] = that;
}

export function init(width, height, zoom, ts) {
    window.gridEditorLib = window.gridEditorLib || {};
    var that = window.gridEditorLib["11"] || {};

    that.width = width;
    that.height = height;
    that.zoom = zoom || 16;
    that.zoomWidth = that.width * that.zoom;
    that.zoomHeight = that.height * that.zoom;

    that.canvas.width = that.zoomWidth;
    that.canvas.height = that.zoomHeight;
    that.context = that.canvas.getContext("2d");

    that.context.fillStyle = "white";
    that.context.fillRect(0, 0, that.zoomWidth, that.zoomHeight);
    this.grid();

    window.gridEditorLib["11"] = that;
};

export function drawTile(xx, yy, tile) {
    window.gridEditorLib = window.gridEditorLib || {};
    var that = window.gridEditorLib["11"] || {};

    let x = xx * that.zoom;
    let y = yy * that.zoom;

    //var id = tile.type - 1;
    //that.context.drawImage(that.tileset, id * 8, 0, 8, 8, x, y, that.zoom, that.zoom);

    that.context.fillStyle = color(tile.type);
    that.context.fillRect(x, y, that.zoom, that.zoom);
};

function color(value) {
    switch (value) {
        case 0:
            return "#000000"; // Empty space
        case 1:
            return "#BBBBBB"; // Wall
        case 2:
            return "#FF0000"; // Landing pad
        default:
            return "#AAAAAA"; // Default color
    }
}

export function load(width, height, tiles, zoom) {
    window.gridEditorLib = window.gridEditorLib || {};
    var that = window.gridEditorLib["11"] || {};

    this.init(width, height, zoom);

    let i = 0;
    let y = 0;
    for (var yy = 0; yy < that.height; yy++) {
        let x = 0;
        for (var xx = 0; xx < that.width; xx++) {

            that.context.fillStyle = color(tiles[i].type);
            that.context.fillRect(x, y, that.zoom, that.zoom);

            i++;
            x += that.zoom;
        }
        y += that.zoom;
    }

    window.gridEditorLib["11"] = that;
};

export function setTileType(tileType) {
    window.gridEditorLib = window.gridEditorLib || {};
    var that = window.gridEditorLib["11"] || {};

    that.tileType = tileType;

    window.gridEditorLib["11"] = that;
};

export function grid () {
    window.gridEditorLib = window.gridEditorLib || {};
    var that = window.gridEditorLib["11"] || {};

    let xHeight = that.width * that.zoom;
    let yHeight = that.height * that.zoom;
    for (var xx = 0; xx <= that.width; xx += 1) {
        let x = xx * that.zoom;
        that.context.moveTo(x, 0);
        that.context.lineTo(x, yHeight);
    }

    for (var yy = 0; yy <= that.height; yy += 1) {
        let y = yy * that.zoom;
        that.context.moveTo(0, y);
        that.context.lineTo(xHeight, y);
    }
    that.context.strokeStyle = that.gridColor;
    that.context.stroke();

    window.gridEditorLib["11"] = that;
};