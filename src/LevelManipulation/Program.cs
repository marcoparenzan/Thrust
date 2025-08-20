var sourceLevelName = @"D:\MarcoSoft\Thrust\src\Game\assets\js\levels\08\Data.json";
var targetLevelName = @"D:\MarcoSoft\Thrust\src\Game\assets\js\levels\09\Data.json";

var sourceLevelJson = System.IO.File.ReadAllText(sourceLevelName);
var sourceLevel = System.Text.Json.JsonSerializer.Deserialize<LevelManipulation.LevelConfig>(sourceLevelJson);

LevelManipulation.LevelConfig targetLevel = RotateLeft(sourceLevel);

var targetLevelJson = System.Text.Json.JsonSerializer.Serialize(targetLevel);

Directory.CreateDirectory(Path.GetDirectoryName(targetLevelName));
File.WriteAllText(targetLevelName, targetLevelJson);

LevelManipulation.LevelConfig RotateLeft(LevelManipulation.LevelConfig? sourceLevel)
{
    var targetLevel = new LevelManipulation.LevelConfig
    {
        Gravity = sourceLevel.Gravity,
        ShipX = sourceLevel.ShipY,
        ShipY = sourceLevel.ShipX,
        GridWidth = sourceLevel.GridHeight,
        GridHeight = sourceLevel.GridWidth,
        CellSize = sourceLevel.CellSize,
        Grid = new int[sourceLevel.Grid.Length]
    };

    for (var y = 0; y < sourceLevel.GridHeight; y++)
    {
        for (var x = 0; x < sourceLevel.GridWidth; x++)
        {
            targetLevel.Grid[x * targetLevel.GridWidth + y] = sourceLevel.Grid[y * sourceLevel.GridWidth + x];
        }
    }

    return targetLevel;
}


LevelManipulation.LevelConfig RotateLeftLeft(LevelManipulation.LevelConfig? sourceLevel)
{
    var targetLevel = new LevelManipulation.LevelConfig
    {
        Gravity = sourceLevel.Gravity,
        ShipX = sourceLevel.GridWidth * sourceLevel.CellSize - sourceLevel.ShipY,
        ShipY = sourceLevel.GridHeight * sourceLevel.CellSize - sourceLevel.ShipY,
        GridWidth = sourceLevel.GridWidth,
        GridHeight = sourceLevel.GridHeight,
        CellSize = sourceLevel.CellSize,
        Grid = new int[sourceLevel.Grid.Length]
    };

    for (var y = 0; y < sourceLevel.GridHeight; y++)
    {
        for (var x = 0; x < sourceLevel.GridWidth; x++)
        {
            var yy = sourceLevel.GridHeight - y - 1;
            var xx = sourceLevel.GridWidth - x - 1;
            targetLevel.Grid[y * sourceLevel.GridWidth + x] = sourceLevel.Grid[yy * targetLevel.GridWidth + xx];
        }
    }

    return targetLevel;
}