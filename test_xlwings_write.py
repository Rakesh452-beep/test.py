import xlwings as xw, pandas as pd, os, sys
p='reports/AllTeams_Stats_latest.xlsx'
print('exists', os.path.exists(p))
app=None
try:
    app=xw.App(visible=False)
    b=app.books.open(p) if os.path.exists(p) else app.books.add();
    print('opened', b.name)
    df = pd.DataFrame({'A':[1,2,3], 'B':['x','y','z']})
    name='AllPlayers_test'
    if name in [s.name for s in b.sheets]:
        s=b.sheets[name]
    else:
        s=b.sheets.add(name)
    s.clear()
    s.range('A1').options(index=False).value = df
    b.save(p)
    b.close()
    app.quit()
    print('wrote ok')
except Exception as e:
    print('err', type(e), e)
    if app:
        try:
            app.quit()
        except Exception:
            pass
    sys.exit(1)
