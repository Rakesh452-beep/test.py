Scheduling the AllTeams Google update

Run the PowerShell helper as Administrator (or a user with permission to register tasks):

```powershell
Set-Location -Path 'c:/Users/Lenovo/Desktop/test.py'
.\schedule_update.ps1 -TaskName AllTeams_Google_Update -TriggerTime "23:30"
```

This registers a daily task that runs:

```powershell
"C:\Program Files\Python311\python.exe" main.py google
```

Adjust `-TriggerTime` as needed. Alternatively, create a Windows Task Scheduler entry manually.
