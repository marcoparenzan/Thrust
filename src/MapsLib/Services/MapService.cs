using System.Text.Json;

namespace MapsLib.Services;

public class MapService
{
    public async Task<LevelConfig> LoadAsync(Stream stream)
    {
        var levelConfig = JsonSerializer.Deserialize<LevelConfig>(stream);
        return levelConfig;
    }

    public async Task SaveAsync(Stream stream, LevelConfig levelConfig)
    {
        var json = JsonSerializer.Serialize(levelConfig);
        var bytes = System.Text.Encoding.UTF8.GetBytes(json);
        stream.Write(bytes, 0, bytes.Length);
    }
}
