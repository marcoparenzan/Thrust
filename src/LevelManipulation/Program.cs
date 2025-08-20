var sourceLevelName = @"D:\MarcoSoft\Thrust\src\Game\assets\js\levels\06\Data.json";
var targetLevelName = @"D:\MarcoSoft\Thrust\src\Game\assets\js\levels\07\Data.json";

var sourceLevelJson = System.IO.File.ReadAllText(sourceLevelName);
var sourceLevel = System.Text.Json.JsonSerializer.Deserialize<LevelManipulation.LevelConfig>(sourceLevelJson);

var targetLevel = new LevelManipulation.LevelConfig
{
    Gravity = sourceLevel.Gravity,
    ShipX = sourceLevel.ShipY,
    ShipY = sourceLevel.ShipX,
    GridWidth = sourceLevel.GridHeight,
    GridHeight = sourceLevel.GridWidth,
    Grid = new int[sourceLevel.Grid.Length]
};

for (var y = 0; y < sourceLevel.GridHeight; y++)
{
    for (var x = 0; x < sourceLevel.GridWidth; x++)
    {
        targetLevel.Grid[x*targetLevel.GridWidth+y] = sourceLevel.Grid[y*sourceLevel.GridWidth+x];
    }
}

var targetLevelJson = System.Text.Json.JsonSerializer.Serialize(targetLevel);

File.WriteAllText(targetLevelName, targetLevelJson);