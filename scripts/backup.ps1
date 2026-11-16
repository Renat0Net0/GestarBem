[CmdletBinding()]
param(
    [string]$PostgresBin = 'C:\Program Files\PostgreSQL\18\bin',
    [string]$DbHost = 'localhost',
    [ValidateRange(1,65535)][int]$DbPort = 5432,
    [string]$DbUser = 'postgres',
    [string]$DbName = 'gestarbem',
    [string]$OutputDirectory = ''
)
$ErrorActionPreference = 'Stop'
$dumpTool = Join-Path $PostgresBin 'pg_dump.exe'
$restoreTool = Join-Path $PostgresBin 'pg_restore.exe'
if (-not (Test-Path -LiteralPath $dumpTool -PathType Leaf)) { throw "pg_dump.exe não encontrado em $PostgresBin." }
if (-not (Test-Path -LiteralPath $restoreTool -PathType Leaf)) { throw "pg_restore.exe não encontrado em $PostgresBin." }
if ([string]::IsNullOrWhiteSpace($OutputDirectory)) {
    $documentsDirectory = [Environment]::GetFolderPath('MyDocuments')
    if ([string]::IsNullOrWhiteSpace($documentsDirectory)) { throw 'Informe OutputDirectory para guardar o backup.' }
    $OutputDirectory = Join-Path $documentsDirectory 'GestarBemBackups'
}
New-Item -ItemType Directory -Path $OutputDirectory -Force | Out-Null
$backupDirectory = (Resolve-Path -LiteralPath $OutputDirectory).Path
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$suffix = [Guid]::NewGuid().ToString('N').Substring(0,8)
$backupPath = Join-Path $backupDirectory ("gestarbem-{0}-{1}.dump" -f $stamp,$suffix)
$partialPath = "$backupPath.partial"
$completed = $false
try {
    Write-Host 'Digite a senha do PostgreSQL quando for solicitada. Ela não será gravada no script.'
    & $dumpTool --host $DbHost --port $DbPort --username $DbUser --dbname $DbName --password --format custom --no-owner --no-privileges --file $partialPath
    if ($LASTEXITCODE -ne 0) { throw 'O PostgreSQL não concluiu o backup.' }
    if ((Get-Item -LiteralPath $partialPath).Length -le 0) { throw 'O arquivo de backup está vazio.' }
    & $restoreTool --list $partialPath | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'O arquivo não passou na verificação do catálogo.' }
    Move-Item -LiteralPath $partialPath -Destination $backupPath
    $completed = $true
    Write-Host "Backup criado: $backupPath"
    Write-Host 'A leitura do catálogo foi conferida. A restauração completa deve ser validada em um banco separado.'
} finally {
    if (-not $completed -and (Test-Path -LiteralPath $partialPath)) {
        Remove-Item -LiteralPath $partialPath
    }
}
