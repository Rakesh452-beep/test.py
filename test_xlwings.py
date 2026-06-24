import xlwings as xw, os, sys
p='reports/AllTeams_Stats_latest.xlsx'
print('exists', os.path.exists(p))
app=None
try:
    app=xw.App(visible=False)
    print('app started')
    if os.path.exists(p):
        b=app.books.open(p)
        print('opened', b.name)
        b.close()
    else:
        b=app.books.add()
        print('created', b.name)
        b.save(p)
        b.close()
    app.quit()
    print('ok')
except Exception as e:
    print('err', type(e), e)
    if app:
        try:
            app.quit()
        except Exception:
            pass
    sys.exit(1)
