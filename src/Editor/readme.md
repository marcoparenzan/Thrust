
Create in vanilla html and javascript with classes and tailwind css.

Review the existing code with this more defined description.
I want a canvas editor with toolbox.
You have two areas, side by side, and you can resize with mouse: canvas on the left (starting at 80%) and toolbox on the right (starting at 20%)
I can define the size of the canvas in tile count. You can define also tile size (in pixel) that is square. when you resize, the toolbox on the right maintain the size.
THe canvas on the left can scroll horizontally and vertically if not completly visible when editing, leaving the toolbox on the right always visible.
I have layers: i can add, edit, remove, rename layers, hide, show, reorder.
Each layer can be of two types.
First layer type is tilegrid, with a grid with tile size and toolbox to select a tile and drop to the layer. You have 16 tiles: use Commodore 64 colors to define them. Use (0) as a trasparent tile shown as white/gray striped. Also in the canvas, colour the cell with that striped fill. Please fill the new layer with the default transparent color. Please add the black as 1 color, 2 white, etc...and exclude the last colour (not useful). Add a functionality to fill the screen in a defined color.
The second layer type is freegrid, with sprites from a toolbox and some properties that can be added, edited, moved, removed. you can click back a sprite that is already placed, it can be moved, or deleted. You can select for each sprite it's id and type from a dropdown with a string type list. the id has a default name that is <itemtype>-<count> where count is the count of items already in the layer, +1.
Each layer can also be edited as raw json: you click and open a json editor (in with monaco editor). When I edit the json (and click Save) the layer changes accordingly.
The final editor can load save new file of the layers data in json format.
Please proceed applying all the changes.