Param(
    [string]$TaskName = "AllTeams_Google_Update",
    [string]$ScriptPath = "$(Join-Path $PWD 'main.py')",
    [string]$PythonExe = "C:\\Program Files\\Python311\\python.exe",
    [string]$TriggerTime = "23:30"
)

# Creates a daily scheduled task to run the update at the given time.
Write-Host "Creating scheduled task $TaskName to run $ScriptPath daily at $TriggerTime"

$action = New-ScheduledTaskAction -Execute $PythonExe -Argument "$ScriptPath google"
$trigger = New-ScheduledTaskTrigger -Daily -At $TriggerTime
$principal = New-ScheduledTaskPrincipal -UserId "$env:USERNAME" -LogonType Interactive

Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger -Principal $principal -Force
Write-Host "Task registered. Verify in Task Scheduler or run: Get-ScheduledTask -TaskName $TaskName"
