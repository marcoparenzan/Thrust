using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace LevelManipulation;

internal class LevelConfig
{
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
}
