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

    public async Task LoadAsync(int width, int height, MapTile[] tiles)
    {
        var module = await moduleTask.Value;
        await module.InvokeVoidAsync("load", width, height, tiles);
    }

    public async ValueTask DisposeAsync()
    {
        if (moduleTask.IsValueCreated)
        {
            var module = await moduleTask.Value;
            await module.DisposeAsync();
        }
    }

    public async Task SetTileTypeAsync(byte type)
    {
        var module = await moduleTask.Value;
        await module.InvokeVoidAsync("setTileType", type);
    }
}
