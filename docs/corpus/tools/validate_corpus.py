from pathlib import Path
import re, json, sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]
inv=(ROOT/'analysis/13_SURFACE_INVENTORY.md').read_text()
rows=re.findall(r'^\| (SURF-\d{3}) \|',inv,re.M)
if len(rows)!=168 or len(set(rows))!=168: errors.append(f'inventory IDs {len(rows)}/{len(set(rows))}, expected 168')
# ownership columns
owned=[]; dead=[]
for line in inv.splitlines():
    if line.startswith('| SURF-'):
        c=[x.strip() for x in line.strip('|').split('|')]
        sid=c[0]; d=c[-2]; feat=c[-1]
        if d=='yes': dead.append(sid)
        elif feat.startswith('FEAT-'): owned.append((sid,feat))
        else: errors.append(f'unowned live surface {sid}')
if dead!=['SURF-027']: errors.append(f'dead surfaces {dead}')
if len(owned)!=167: errors.append(f'owned live surfaces {len(owned)}')
# specs and headings
specdirs=sorted((ROOT/'specs').glob('[0-9][0-9][0-9]-*'))
if len(specdirs)!=18: errors.append(f'spec dirs {len(specdirs)}')
required=[f'## {i}.' for i in range(1,13)]
frs=set(); tests=set(); contract_owners={}
for d in specdirs:
    s=(d/'spec.md').read_text()
    for h in required:
        if h not in s: errors.append(f'{d.name} missing {h}')
    frs.update(re.findall(r'\bFR-\d{3}\b',s))
    tests.update(re.findall(r'\bTEST-\d{3}\b',s))
    cp=d/'contracts/contracts.json'
    if not cp.exists(): errors.append(f'{d.name} missing contracts.json'); continue
    obj=json.loads(cp.read_text())
    for x in obj.get('api_contracts',[]): contract_owners.setdefault(x['id'],[]).append(obj['feature'])
    if not (d/'tasks.md').exists(): errors.append(f'{d.name} missing tasks.md')
if len(frs)!=167: errors.append(f'unique FRs {len(frs)}, expected 167')
if len(tests)!=167: errors.append(f'unique TESTs {len(tests)}, expected 167')
for i in range(101,126):
    cid=f'CTR-{i:03d}'; owners=contract_owners.get(cid,[])
    if len(owners)!=1: errors.append(f'{cid} owners={owners}')
# trace matrix
tr=(ROOT/'00_TRACEABILITY.md').read_text()
for sid,_ in owned:
    if sid not in tr: errors.append(f'{sid} missing trace')
for f in range(1,19):
    fid=f'FEAT-{f:03d}'
    if fid not in tr: errors.append(f'{fid} missing trace')
# parity rows
par=(ROOT/'32_PARITY_SUITE.md').read_text()
par_tests=set(re.findall(r'\bTEST-\d{3}\b',par))
if len(par_tests)!=167: errors.append(f'parity tests {len(par_tests)}, expected 167')
result={'status':'PASS' if not errors else 'FAIL','errors':errors,'counts':{'surfaces':168,'live_surfaces':167,'dead_surfaces':1,'features':18,'requirements':len(frs),'parity_tests':len(par_tests),'api_contracts_101_125':25}}
print(json.dumps(result,indent=2))
sys.exit(0 if not errors else 1)
