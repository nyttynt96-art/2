$content = Get-Content -Path 'src/App.tsx' -Raw
$Utf8NoBom = New-Object System.Text.UTF8Encoding $False
[System.IO.File]::WriteAllText('src/App.tsx', $content, $Utf8NoBom)

