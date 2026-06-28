Param(
    [string]$TaskName = "KSCA_DailyUpdate",
    [string]$ScriptPath = "$(Join-Path $PWD 'auto_update.py')",
    [string]$PythonExe = "python",
    [string]$TriggerTime = "21:25",
    [switch]$StatsOnly,
    [switch]$KeeperOnly,
    [switch]$Help
)

if ($Help) {
    Write-Host @"

KSCA Daily Update — Schedule Creator
======================================
Creates a Windows Scheduled Task to automate the full data pipeline.

Usage:
  .\schedule_daily.ps1                          Full pipeline (daily at 23:30)
  .\schedule_daily.ps1 -TriggerTime "06:00"     Run at 6 AM instead
  .\schedule_daily.ps1 -TaskName "KSCA_Stats"   Custom task name

Arguments:
  -TaskName       Scheduled task name (default: KSCA_DailyUpdate)
  -TriggerTime    Time in HH:mm format (default: 23:30)
  -PythonExe      Python executable path (default: python)
  -StatsOnly      Only schedule player stats (no keeper/upload)
  -KeeperOnly     Only schedule keeper extraction + upload

Examples:
  .\schedule_daily.ps1
  .\schedule_daily.ps1 -TriggerTime "06:00" -StatsOnly
  .\schedule_daily.ps1 -TaskName "KSCA_Keeper" -KeeperOnly -TriggerTime "12:00"

"@
    exit
}

$ProjectDir = $PWD
$LogDir = Join-Path $ProjectDir "reports"

# Determine script and arguments
if ($StatsOnly) {
    $ScriptArg = "python $ScriptPath --stats-only"
    $Desc = "KSCA Player Stats only"
} elseif ($KeeperOnly) {
    $ScriptArg = "python $ScriptPath --keeper-only"
    $Desc = "KSCA Keeper Stats only"
} else {
    $ScriptArg = "python $ScriptPath"
    $Desc = "KSCA Full Pipeline (stats + keeper + sheets)"
}

Write-Host "Creating scheduled task: $TaskName"
Write-Host "  Description : $Desc"
Write-Host "  Script      : $ScriptPath"
Write-Host "  Executable  : $PythonExe"
Write-Host "  Time        : $TriggerTime daily"
Write-Host "  Log dir     : $LogDir"

# Create log directory
if (-not (Test-Path -LiteralPath $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

$action = New-ScheduledTaskAction -Execute $PythonExe -Argument "`"$ScriptPath`""
$trigger = New-ScheduledTaskTrigger -Daily -At $TriggerTime
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERNAME" -LogonType Interactive
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Hours 2)

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force -Description $Desc

Write-Host ""
Write-Host "Task registered successfully!"
Write-Host "  Run now : Start-ScheduledTask -TaskName `"$TaskName`""
Write-Host "  View    : Get-ScheduledTask -TaskName `"$TaskName`""
Write-Host "  Delete  : Unregister-ScheduledTask -TaskName `"$TaskName`" -Confirm:`$false"
