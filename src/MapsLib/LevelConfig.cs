using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace MapsLib;

public class LevelConfig
{
    [JsonPropertyName("cellSize")]
    public int CellSize { get; set; }

    [JsonPropertyName("gravity")]
    public decimal Gravity { get; set; }

    [JsonPropertyName("shipX")]
    public int ShipX { get; set; }

    [JsonPropertyName("shipY")]
    public int ShipY { get; set; }

    [JsonPropertyName("gridWidth")]
    public int GridWidth { get; set; }

    [JsonPropertyName("gridHeight")]
    public int GridHeight { get; set; }

    [JsonPropertyName("grid")]
    public int[] Grid { get; set; }

    public LevelConfig RotateLeft90()
    {
        var targetLevel = new LevelConfig
        {
            Gravity = this.Gravity,
            ShipX = this.ShipY,
            ShipY = this.ShipX,
            GridWidth = this.GridHeight,
            GridHeight = this.GridWidth,
            CellSize = this.CellSize,
            Grid = new int[this.Grid.Length]
        };

        for (var y = 0; y < this.GridHeight; y++)
        {
            for (var x = 0; x < this.GridWidth; x++)
            {
                targetLevel.Grid[x * targetLevel.GridWidth + y] = this.Grid[y * this.GridWidth + x];
            }
        }

        return targetLevel;
    }

    public LevelConfig RotateLeft180()
    {
        var targetLevel = new LevelConfig
        {
            Gravity = this.Gravity,
            ShipX = this.GridWidth * this.CellSize - this.ShipY,
            ShipY = this.GridHeight * this.CellSize - this.ShipY,
            GridWidth = this.GridWidth,
            GridHeight = this.GridHeight,
            CellSize = this.CellSize,
            Grid = new int[this.Grid.Length]
        };

        for (var y = 0; y < this.GridHeight; y++)
        {
            for (var x = 0; x < this.GridWidth; x++)
            {
                var yy = this.GridHeight - y - 1;
                var xx = this.GridWidth - x - 1;
                targetLevel.Grid[y * this.GridWidth + x] = this.Grid[yy * targetLevel.GridWidth + xx];
            }
        }

        return targetLevel;
    }
}
