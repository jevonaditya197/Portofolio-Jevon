$listener = New-Object System.Net.HttpListener;
$listener.Prefixes.Add("http://localhost:8000/");
try {
    $listener.Start();
    Write-Host "Listening on http://localhost:8000/... Press Ctrl+C to stop."
    while ($listener.IsListening) {
        $response = $null;
        try {
            $context = $listener.GetContext();
            $request = $context.Request;
            $response = $context.Response;
            $rawPath = $request.Url.LocalPath;
            if ($rawPath -eq "/" -or $rawPath -eq "") { $rawPath = "/index.html" }
            
            $decodedPath = [System.Uri]::UnescapeDataString($rawPath);
            $cleanPath = $decodedPath.Replace("/", "\").TrimStart("\");
            $filePath = Join-Path (Get-Location) $cleanPath;
            
            if (Test-Path $filePath -PathType Leaf) {
                $bytes = [System.IO.File]::ReadAllBytes($filePath);
                $ext = [System.IO.Path]::GetExtension($filePath).ToLower();
                $contentType = switch ($ext) {
                    ".html" { "text/html; charset=utf-8" }
                    ".css" { "text/css; charset=utf-8" }
                    ".js" { "application/javascript; charset=utf-8" }
                    ".png" { "image/png" }
                    ".jpg" { "image/jpeg" }
                    ".jpeg" { "image/jpeg" }
                    ".svg" { "image/svg+xml; charset=utf-8" }
                    default { "application/octet-stream" }
                };
                $response.ContentType = $contentType;
                $response.ContentLength64 = $bytes.Length;
                $response.OutputStream.Write($bytes, 0, $bytes.Length);
            } else {
                $response.StatusCode = 404;
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found: $decodedPath");
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length);
            }
        } catch {
            Write-Host "Error serving request: $_"
        } finally {
            if ($null -ne $response) {
                $response.OutputStream.Close();
            }
        }
    }
} catch {
    Write-Host "Failed to start listener: $_"
} finally {
    $listener.Close();
}
