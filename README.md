$path = "C:\Users\rraj8\scholr\frontend\src\pages\dashboard\ExamPrepDashboard.tsx"
$w1252 = [System.Text.Encoding]::GetEncoding(1252)
$u8 = New-Object System.Text.UTF8Encoding $false

$t = [System.IO.File]::ReadAllText($path)
$needsFix = $false
for ($i = 0; $i -lt [Math]::Min($t.Length, 100000); $i++) {
    $code = [int][char]$t[$i]
    if ($code -eq 240) { $needsFix = $true; break }
}


