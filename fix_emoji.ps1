$content = Get-Content src/App.tsx -Raw -Encoding UTF8
$content = $content -replace 'ًں""', '🔑'
$content = $content -replace 'ًں""‌', '📝'
$content | Set-Content src/App.tsx -Encoding UTF8

