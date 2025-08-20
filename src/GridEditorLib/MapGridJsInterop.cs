using MapsLib;
using Microsoft.JSInterop;

namespace GridEditorLib;

public class MapGridJsInterop : IAsyncDisposable
{
    Lazy<Task<IJSObjectReference>> moduleTask;

    public MapGridJsInterop(IJSRuntime jsRuntime)
    {
        moduleTask = new(() => jsRuntime.InvokeAsync<IJSObjectReference>(
            "import", "./_content/GridEditorLib/mapGrid.js").AsTask());
    }

    public async Task SetupAsync(object objRef, string canvasId, byte[] tilesxxx)
    {
        var module = await moduleTask.Value; 
        await module.InvokeVoidAsync("setup", objRef, canvasId, Convert.ToBase64String(tilesxxx));
    }

    public async Task LoadAsync(LevelConfig levelConfig)
    {
        var module = await moduleTask.Value;
        var tiles = levelConfig.Grid.Select(xx => (MapTile)xx).ToArray();
        await module.InvokeVoidAsync("load", levelConfig.GridWidth, levelConfig.GridHeight, tiles);
    }

    public async ValueTask DisposeAsync()
    {
        if (moduleTask.IsValueCreated)
        {
            var module = await moduleTask.Value;
            //await module.DisposeAsync();
        }
    }

    public async Task SetTileTypeAsync(byte type)
    {
        var module = await moduleTask.Value;
        await module.InvokeVoidAsync("setTileType", type);
    }

    //private string[] ToStringArray(MapTile[] xx)
    //{
    //    var ff = xx.Select(yy => $"{(int)yy.Type:X2}").ToArray();
    //    var lines = new List<string>();
    //    var i = 0;
    //    while (true)
    //    {
    //        if (i == values.Length) break;
    //        lines.Add(string.Join(string.Empty, new ReadOnlySpan<string>(ff, i, gridWidth)));
    //        i += gridWidth;
    //    }

    //    return lines.ToArray();
    //}

    //private MapTile[] FromStringArray(string[] xx)
    //{
    //    return xx.SelectMany(yy =>
    //    {
    //        var zz = new List<MapTile>();
    //        for (var i = 0; i < yy.Length; i += 2)
    //        {
    //            zz.Add(byte.Parse(yy.Substring(i, 2), System.Globalization.NumberStyles.HexNumber));
    //        }
    //        return zz.ToArray();
    //    }).ToArray();
    //}

    //private MapTile[] FromByteArray(byte[] xx)
    //{
    //    return xx.Select(yy => (MapTile)yy).ToArray();
    //}
}
