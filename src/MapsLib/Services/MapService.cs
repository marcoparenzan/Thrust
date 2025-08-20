using MapsLib;
using System.Text.Json;

namespace MapsLib.Services;

public class MapService
{
    int gridWidth;
    int gridHeight;
    MapTile[] values;

    public MapTile[] Values() => values;

    public void Set(int x, int y, byte type) => values[y * gridWidth + x] = type;

    public MapTile Get(int x, int y) => values[y * gridWidth + x];

    public int Width => gridWidth;  
    public int Height => gridHeight;

    public async Task EmptyAsync(int width, int height, Action<Action<int, int, byte>> init = null)
    {
        this.gridWidth = width;
        this.gridHeight = height;
        this.values = new MapTile[width*height];
        if (init != null)
        {
            init(Set);
        }
    }


    public async Task LoadAsync(Stream stream)
    {
        var levelConfig = JsonSerializer.Deserialize<LevelConfig>(stream);
        gridWidth = levelConfig.GridWidth;
        gridHeight = levelConfig.GridHeight;
        values = FromByteArray(levelConfig.Grid.Select(xx => (byte) xx).ToArray());
    }

    public async Task SaveAsync(Stream stream)
    {
        var entity = new
        {
            Width = gridWidth,
            Height = gridHeight,
            Map = ToStringArray(values)
        };
        var json = JsonSerializer.Serialize(entity);
        var bytes = System.Text.Encoding.UTF8.GetBytes(json);
        stream.Write(bytes, 0, bytes.Length);
    }

    private string[] ToStringArray(MapTile[] xx)
    {
        var ff = xx.Select(yy => $"{(int)yy.Type:X2}").ToArray();
        var lines = new List<string>();
        var i = 0;
        while (true)
        {
            if (i == values.Length) break;
            lines.Add(string.Join(string.Empty, new ReadOnlySpan<string>(ff, i, gridWidth)));
            i += gridWidth;
        }

        return lines.ToArray();
    }

    private MapTile[] FromStringArray(string[] xx)
    {
        return xx.SelectMany(yy =>
        {
            var zz = new List<MapTile>();
            for (var i = 0; i < yy.Length; i += 2)
            {
                zz.Add(byte.Parse(yy.Substring(i, 2), System.Globalization.NumberStyles.HexNumber));
            }
            return zz.ToArray();
        }).ToArray();
    }


    private MapTile[] FromByteArray(byte[] xx)
    {
        return xx.Select(yy => (MapTile)yy).ToArray();
    }
}
