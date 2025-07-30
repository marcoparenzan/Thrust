using MapsLib;
using System.Text.Json;

namespace MapsLib.Services;

public class MapService
{
    int width;
    int height;
    MapTile[] values;

    public MapTile[] Values() => values;

    public void Set(int x, int y, byte type) => values[y * width + x] = type;

    public MapTile Get(int x, int y) => values[y * width + x];

    public int Width => width;  
    public int Height => height;

    public async Task EmptyAsync(int width, int height, Action<Action<int, int, byte>> init = null)
    {
        this.width = width;
        this.height = height;
        this.values = new MapTile[width*height];
        if (init != null)
        {
            init(Set);
        }
    }


    public async Task LoadAsync(Stream stream)
    {
        var je = JsonSerializer.Deserialize<JsonElement>(stream);
        width = je.GetProperty("Width").GetInt32();
        height = je.GetProperty("Height").GetInt32();
        //var map = JsonSerializer.Deserialize<string[]>(je.GetProperty("Map"));
        //values = FromStringArray(map);
        var map = JsonSerializer.Deserialize<int[]>(je.GetProperty("Map"));
        values = FromByteArray(map.Select(xx => (byte) xx).ToArray());
    }

    public async Task SaveAsync(Stream stream)
    {
        var entity = new
        {
            Width = width,
            Height = height,
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
            lines.Add(string.Join(string.Empty, new ReadOnlySpan<string>(ff, i, width)));
            i += width;
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
